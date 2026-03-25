/**
 * Batch Question Fix Script
 * Uses Claude Opus 4.6 for highest quality processing
 *
 * Run with: npx tsx scripts/batch-fix-questions.ts
 */

import 'dotenv/config'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

// Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const MODEL = 'claude-opus-4-6' // Latest and most capable model
const BATCH_SIZE = 10
const DELAY_BETWEEN_REQUESTS = 1000 // 1 second

if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables')
  console.error('Required: ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ============================================================================
// TASK 1: Re-evaluate Question Difficulties
// ============================================================================

interface DifficultyEvaluation {
  suggestedDifficulty: 'Easy' | 'Medium' | 'Hard'
  shouldChange: boolean
  reasoning: string
  confidenceScore: number
}

async function evaluateDifficulty(
  questionText: string,
  questionType: string,
  currentDifficulty: string,
  options: any[] | null,
  correctAnswer: string
): Promise<DifficultyEvaluation> {
  const optionsText = options
    ? options.map((o: any) => `${o.letter}: ${o.text}`).join('\n')
    : 'N/A'

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `You are an expert GPhC exam assessor. Evaluate this UK pharmacy pre-registration exam question's difficulty.

DIFFICULTY CRITERIA:

For CALCULATIONS:
- EASY: Single-step, no conversions (e.g., "200mg daily for 14 days = how many tablets?" Answer: 14)
- MEDIUM: 2-3 steps OR one unit conversion (e.g., dose per kg requiring multiplication then volume calculation)
- HARD: 4+ steps with conversions AND clinical reasoning (e.g., creatinine clearance affecting dosing)

For SBA:
- EASY: Direct recall of well-known facts
- MEDIUM: Application of knowledge to clinical scenarios
- HARD: Complex scenarios requiring synthesis of multiple concepts

For EMQ:
- EASY: Clear-cut scenarios with obvious answers
- MEDIUM: Requires differentiation between similar options
- HARD: Multiple options could seem correct

QUESTION TYPE: ${questionType}
CURRENT DIFFICULTY: ${currentDifficulty}

QUESTION:
${questionText}

${options ? `OPTIONS:\n${optionsText}\n` : ''}
CORRECT ANSWER: ${correctAnswer}

Be STRICT - many questions are over-rated. Simple multiplication/counting is EASY, not Medium.

Return JSON only:
{
  "suggestedDifficulty": "Easy|Medium|Hard",
  "shouldChange": true/false,
  "reasoning": "Brief explanation",
  "confidenceScore": 0.0-1.0
}`
    }]
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')

  return JSON.parse(jsonMatch[0])
}

async function runDifficultyEvaluation(limit: number = 100) {
  console.log('\n=== TASK 1: DIFFICULTY RE-EVALUATION ===')
  console.log(`Using model: ${MODEL}`)
  console.log(`Processing up to ${limit} questions...\n`)

  // Get questions that might need difficulty adjustment
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, question_text, question_type, difficulty, options, correct_answer')
    .eq('status', 'approved')
    .in('difficulty', ['Medium', 'Hard']) // Focus on potentially over-rated
    .limit(limit)

  if (error || !questions) {
    console.error('Failed to fetch questions:', error)
    return
  }

  console.log(`Found ${questions.length} questions to evaluate\n`)

  let changed = 0
  let unchanged = 0
  let failed = 0

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    console.log(`[${i + 1}/${questions.length}] Evaluating: ${q.question_text.substring(0, 60)}...`)

    try {
      const evaluation = await evaluateDifficulty(
        q.question_text,
        q.question_type,
        q.difficulty,
        q.options,
        q.correct_answer
      )

      if (evaluation.shouldChange && evaluation.confidenceScore >= 0.7) {
        // Update the question
        const { error: updateError } = await supabase
          .from('questions')
          .update({
            difficulty: evaluation.suggestedDifficulty,
            updated_at: new Date().toISOString(),
            metadata: {
              difficulty_reevaluated: true,
              difficulty_reevaluation_date: new Date().toISOString(),
              difficulty_reevaluation_reasoning: evaluation.reasoning,
              previous_difficulty: q.difficulty,
              reevaluation_model: MODEL
            }
          })
          .eq('id', q.id)

        if (updateError) {
          console.error(`  ❌ Update failed:`, updateError.message)
          failed++
        } else {
          console.log(`  ✅ Changed: ${q.difficulty} → ${evaluation.suggestedDifficulty} (${evaluation.reasoning})`)
          changed++
        }
      } else {
        console.log(`  ⏭️  No change needed (${q.difficulty} is appropriate)`)
        unchanged++
      }

      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS))
    } catch (err) {
      console.error(`  ❌ Error:`, err)
      failed++
    }
  }

  console.log(`\n--- Difficulty Evaluation Complete ---`)
  console.log(`Changed: ${changed}, Unchanged: ${unchanged}, Failed: ${failed}`)
}

// ============================================================================
// TASK 2: Generate Structured Explanations
// ============================================================================

interface StructuredExplanation {
  summary: string
  key_points: string[]
  clinical_pearl: string
  why_wrong: Record<string, string>
  exam_tip: string
  related_topics: string[]
}

async function generateStructuredExplanation(
  questionText: string,
  questionType: string,
  options: any[] | null,
  correctAnswer: string,
  explanation: string,
  categoryName: string
): Promise<StructuredExplanation> {
  const optionsText = options
    ? options.map((o: any) => `${o.letter}: ${o.text}`).join('\n')
    : 'N/A (calculation question)'

  const incorrectOptions = options
    ? options.filter((o: any) => o.letter !== correctAnswer).map((o: any) => o.letter).join(', ')
    : 'N/A'

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `You are an expert UK pharmacy educator creating detailed explanations for GPhC pre-registration exam questions.

CATEGORY: ${categoryName}
QUESTION TYPE: ${questionType}

QUESTION:
${questionText}

OPTIONS:
${optionsText}

CORRECT ANSWER: ${correctAnswer}

CURRENT EXPLANATION:
${explanation}

Create a comprehensive, educational explanation. Return JSON only:
{
  "summary": "1-2 sentence direct answer explanation - why the correct answer is correct",
  "key_points": ["3-4 critical learning points as bullet points"],
  "clinical_pearl": "One memorable clinical insight for real pharmacy practice",
  "why_wrong": {${options ? `"${incorrectOptions.split(', ').join('": "Why this is wrong", "')}": "Why this is wrong"` : ''}},
  "exam_tip": "Specific tip for remembering or approaching this type of question",
  "related_topics": ["2-3 related pharmacy topics in lowercase-with-hyphens format"]
}

Make it educational, memorable, and exam-focused. Reference BNF/NICE guidelines where relevant.`
    }]
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')

  return JSON.parse(jsonMatch[0])
}

async function runExplanationGeneration(limit: number = 100) {
  console.log('\n=== TASK 2: STRUCTURED EXPLANATION GENERATION ===')
  console.log(`Using model: ${MODEL}`)
  console.log(`Processing up to ${limit} questions...\n`)

  // Get questions without structured explanations
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      id, question_text, question_type, options, correct_answer, explanation,
      question_categories (name)
    `)
    .eq('status', 'approved')
    .is('explanation_structured', null)
    .limit(limit)

  if (error || !questions) {
    console.error('Failed to fetch questions:', error)
    return
  }

  console.log(`Found ${questions.length} questions needing explanations\n`)

  let success = 0
  let failed = 0

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i] as any
    const categoryName = Array.isArray(q.question_categories)
      ? q.question_categories[0]?.name
      : q.question_categories?.name || 'General Pharmacy'

    console.log(`[${i + 1}/${questions.length}] Generating for: ${q.question_text.substring(0, 50)}...`)

    try {
      const structured = await generateStructuredExplanation(
        q.question_text,
        q.question_type,
        q.options,
        q.correct_answer,
        q.explanation,
        categoryName
      )

      const { error: updateError } = await supabase
        .from('questions')
        .update({
          explanation_structured: structured,
          updated_at: new Date().toISOString()
        })
        .eq('id', q.id)

      if (updateError) {
        console.error(`  ❌ Update failed:`, updateError.message)
        failed++
      } else {
        console.log(`  ✅ Generated structured explanation`)
        success++
      }

      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS))
    } catch (err) {
      console.error(`  ❌ Error:`, err)
      failed++
    }
  }

  console.log(`\n--- Explanation Generation Complete ---`)
  console.log(`Success: ${success}, Failed: ${failed}`)
}

// ============================================================================
// TASK 3: UK Guidelines Verification
// ============================================================================

interface UKVerification {
  isAccurate: boolean
  confidenceScore: number
  issues: string[]
  suggestedCorrections: string | null
  guidelinesReferenced: string[]
}

async function verifyUKGuidelines(
  questionText: string,
  questionType: string,
  options: any[] | null,
  correctAnswer: string,
  explanation: string,
  categoryName: string
): Promise<UKVerification> {
  const optionsText = options
    ? options.map((o: any) => `${o.letter}: ${o.text}`).join('\n')
    : 'N/A'

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `You are a UK pharmacy expert verifying exam questions against current guidelines.

Your knowledge includes:
- British National Formulary (BNF) - current edition 2025-2026
- NICE guidelines and technology appraisals
- GPhC standards and requirements
- MHRA guidance
- UK-specific drug formulations and brand names
- Controlled Drugs schedules (UK)

CATEGORY: ${categoryName}
QUESTION TYPE: ${questionType}

QUESTION:
${questionText}

OPTIONS:
${optionsText}

STATED CORRECT ANSWER: ${correctAnswer}

EXPLANATION:
${explanation}

Verify accuracy against current UK guidelines. Be strict about:
1. Drug doses matching BNF
2. Correct CD schedule classifications
3. Current NICE-recommended treatments
4. UK-specific brand names
5. Legal/regulatory requirements

Return JSON only:
{
  "isAccurate": true/false,
  "confidenceScore": 0.0-1.0,
  "issues": ["List any accuracy issues found"],
  "suggestedCorrections": "If inaccurate, provide correct information. If accurate, null",
  "guidelinesReferenced": ["BNF", "NICE guideline X", "etc"]
}`
    }]
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')

  return JSON.parse(jsonMatch[0])
}

async function runUKVerification(limit: number = 50) {
  console.log('\n=== TASK 3: UK GUIDELINES VERIFICATION ===')
  console.log(`Using model: ${MODEL}`)
  console.log(`Processing up to ${limit} questions...\n`)

  // Get questions not yet verified
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      id, question_text, question_type, options, correct_answer, explanation, metadata,
      question_categories (name)
    `)
    .eq('status', 'approved')
    .limit(limit * 2) // Fetch extra to filter

  if (error || !questions) {
    console.error('Failed to fetch questions:', error)
    return
  }

  // Filter for unverified questions
  const unverified = questions.filter(q => {
    const meta = q.metadata as any
    return !meta?.uk_guidelines_verified
  }).slice(0, limit)

  console.log(`Found ${unverified.length} questions to verify\n`)

  let accurate = 0
  let needsReview = 0
  let failed = 0

  for (let i = 0; i < unverified.length; i++) {
    const q = unverified[i] as any
    const categoryName = Array.isArray(q.question_categories)
      ? q.question_categories[0]?.name
      : q.question_categories?.name || 'General Pharmacy'

    console.log(`[${i + 1}/${unverified.length}] Verifying: ${q.question_text.substring(0, 50)}...`)

    try {
      const verification = await verifyUKGuidelines(
        q.question_text,
        q.question_type,
        q.options,
        q.correct_answer,
        q.explanation,
        categoryName
      )

      const { error: updateError } = await supabase
        .from('questions')
        .update({
          updated_at: new Date().toISOString(),
          metadata: {
            ...(q.metadata || {}),
            uk_guidelines_verified: verification.isAccurate,
            uk_verification_date: new Date().toISOString(),
            uk_verification_issues: verification.issues,
            uk_verification_corrections: verification.suggestedCorrections,
            uk_guidelines_referenced: verification.guidelinesReferenced,
            uk_verification_confidence: verification.confidenceScore,
            uk_verification_model: MODEL
          }
        })
        .eq('id', q.id)

      if (updateError) {
        console.error(`  ❌ Update failed:`, updateError.message)
        failed++
      } else if (verification.isAccurate) {
        console.log(`  ✅ Accurate`)
        accurate++
      } else {
        console.log(`  ⚠️  Issues found: ${verification.issues.join('; ')}`)
        needsReview++
      }

      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS))
    } catch (err) {
      console.error(`  ❌ Error:`, err)
      failed++
    }
  }

  console.log(`\n--- UK Verification Complete ---`)
  console.log(`Accurate: ${accurate}, Needs Review: ${needsReview}, Failed: ${failed}`)
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2)
  const task = args[0] || 'all'
  const limit = parseInt(args[1]) || 50

  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║     PreRegExamPrep - Question Quality Improvement          ║')
  console.log('║     Using Claude Opus 4.6 (Most Capable Model)             ║')
  console.log('╚════════════════════════════════════════════════════════════╝')

  try {
    if (task === 'all' || task === 'difficulty') {
      await runDifficultyEvaluation(limit)
    }

    if (task === 'all' || task === 'explanations') {
      await runExplanationGeneration(limit)
    }

    if (task === 'all' || task === 'verify') {
      await runUKVerification(limit)
    }

    console.log('\n✨ All tasks completed!')
  } catch (err) {
    console.error('\n❌ Fatal error:', err)
    process.exit(1)
  }
}

main()
