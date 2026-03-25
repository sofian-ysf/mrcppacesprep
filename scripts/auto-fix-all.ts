/**
 * Automatic Question Fixer - Runs until ALL questions are processed
 * Uses Claude Sonnet 4.6 (fast) with parallel processing
 *
 * Run with: npx tsx scripts/auto-fix-all.ts
 */

import 'dotenv/config'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const MODEL = 'claude-sonnet-4-6' // Faster than Opus, still excellent
const CONCURRENCY = 8 // Process 8 questions at once
const BATCH_SIZE = 50

if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing environment variables')
  process.exit(1)
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Progress tracking
let stats = {
  difficulty: { processed: 0, changed: 0, failed: 0 },
  explanations: { processed: 0, success: 0, failed: 0 },
  verification: { processed: 0, accurate: 0, issues: 0, failed: 0 }
}

// Parallel executor with concurrency limit
async function processInParallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = []
  const executing: Promise<void>[] = []

  for (const item of items) {
    const p = processor(item).then(result => {
      results.push(result)
    }).catch(err => {
      console.error('Error:', err.message)
    })

    executing.push(p)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
      executing.splice(0, executing.findIndex(e => e === p) + 1)
    }
  }

  await Promise.all(executing)
  return results
}

// ============= DIFFICULTY EVALUATION =============
async function evaluateDifficulty(q: any): Promise<void> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Evaluate this UK pharmacy exam question's difficulty. Be STRICT.

EASY: Single-step, direct recall, simple counting
MEDIUM: 2-3 steps, application of knowledge
HARD: 4+ steps with clinical reasoning

Type: ${q.question_type} | Current: ${q.difficulty}
Question: ${q.question_text}
Answer: ${q.correct_answer}

Return JSON only: {"difficulty": "Easy|Medium|Hard", "change": true/false, "reason": "brief"}`
      }]
    })

    const content = response.content[0]
    if (content.type !== 'text') return

    const match = content.text.match(/\{[\s\S]*\}/)
    if (!match) return

    const result = JSON.parse(match[0])
    stats.difficulty.processed++

    // Always mark as processed, update difficulty if needed
    const needsChange = result.change && result.difficulty !== q.difficulty
    await supabase.from('questions').update({
      difficulty: needsChange ? result.difficulty : q.difficulty,
      updated_at: new Date().toISOString(),
      metadata: {
        ...(q.metadata || {}),
        difficulty_auto_fixed: true,
        ...(needsChange ? { previous_difficulty: q.difficulty } : {})
      }
    }).eq('id', q.id)

    if (needsChange) stats.difficulty.changed++
  } catch (err) {
    stats.difficulty.failed++
  }
}

// ============= EXPLANATION GENERATION =============
async function generateExplanation(q: any): Promise<void> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Create structured explanation for this UK pharmacy exam question.

Question: ${q.question_text}
Options: ${q.options ? q.options.map((o: any) => `${o.letter}: ${o.text}`).join(', ') : 'N/A'}
Answer: ${q.correct_answer}
Current explanation: ${q.explanation}

Return JSON only:
{
  "summary": "1-2 sentence answer",
  "key_points": ["point1", "point2", "point3"],
  "clinical_pearl": "memorable insight",
  "why_wrong": {"A": "why wrong", "B": "why wrong"},
  "exam_tip": "helpful tip",
  "related_topics": ["topic-1", "topic-2"]
}`
      }]
    })

    const content = response.content[0]
    if (content.type !== 'text') return

    const match = content.text.match(/\{[\s\S]*\}/)
    if (!match) return

    const structured = JSON.parse(match[0])
    stats.explanations.processed++

    await supabase.from('questions').update({
      explanation_structured: structured,
      updated_at: new Date().toISOString()
    }).eq('id', q.id)

    stats.explanations.success++
  } catch (err) {
    stats.explanations.failed++
  }
}

// ============= UK VERIFICATION =============
async function verifyUK(q: any): Promise<void> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Verify this UK pharmacy exam question against BNF/NICE guidelines (2024-2025).

Question: ${q.question_text}
Options: ${q.options ? q.options.map((o: any) => `${o.letter}: ${o.text}`).join(', ') : 'N/A'}
Stated Answer: ${q.correct_answer}
Explanation: ${q.explanation?.substring(0, 500)}

Check: BNF doses, NICE guidelines, UK licensing, CD schedules.

Return JSON only:
{"accurate": true/false, "issues": ["issue1"] or [], "correction": "if needed" or null}`
      }]
    })

    const content = response.content[0]
    if (content.type !== 'text') return

    const match = content.text.match(/\{[\s\S]*\}/)
    if (!match) return

    const result = JSON.parse(match[0])
    stats.verification.processed++

    await supabase.from('questions').update({
      updated_at: new Date().toISOString(),
      metadata: {
        ...(q.metadata || {}),
        uk_guidelines_verified: result.accurate,
        uk_verification_date: new Date().toISOString(),
        uk_verification_issues: result.issues,
        uk_verification_corrections: result.correction
      }
    }).eq('id', q.id)

    if (result.accurate) stats.verification.accurate++
    else stats.verification.issues++
  } catch (err) {
    stats.verification.failed++
  }
}

// ============= MAIN LOOP =============
async function runTask(taskName: string, fetchQuery: () => Promise<any[]>, processor: (q: any) => Promise<void>) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`TASK: ${taskName}`)
  console.log('='.repeat(60))

  let totalProcessed = 0
  let hasMore = true

  while (hasMore) {
    const questions = await fetchQuery()

    if (questions.length === 0) {
      hasMore = false
      console.log(`✅ ${taskName} complete! No more questions.`)
      break
    }

    console.log(`\nProcessing batch of ${questions.length} questions...`)
    await processInParallel(questions, processor, CONCURRENCY)

    totalProcessed += questions.length
    console.log(`Progress: ${totalProcessed} total processed`)
    printStats()

    // Small delay between batches
    await new Promise(r => setTimeout(r, 2000))
  }
}

function printStats() {
  console.log(`
📊 Current Stats:
   Difficulty: ${stats.difficulty.processed} processed, ${stats.difficulty.changed} changed
   Explanations: ${stats.explanations.success} generated
   UK Verification: ${stats.verification.accurate} accurate, ${stats.verification.issues} issues found
`)
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  AUTOMATIC QUESTION FIXER - RUNS UNTIL COMPLETE              ║
║  Model: ${MODEL.padEnd(45)}║
║  Concurrency: ${CONCURRENCY} parallel requests                            ║
╚══════════════════════════════════════════════════════════════╝
`)

  const startTime = Date.now()

  // TASK 1: Fix difficulties (Medium/Hard that might be wrong)
  await runTask(
    'DIFFICULTY RE-EVALUATION',
    async () => {
      // Fetch all Medium/Hard, filter unprocessed in JS
      const { data } = await supabase
        .from('questions')
        .select('id, question_text, question_type, difficulty, correct_answer, metadata')
        .eq('status', 'approved')
        .in('difficulty', ['Medium', 'Hard'])
      // Filter unprocessed and take batch
      const unprocessed = (data || []).filter(q => !(q.metadata as any)?.difficulty_auto_fixed)
      return unprocessed.slice(0, BATCH_SIZE)
    },
    evaluateDifficulty
  )

  // TASK 2: Generate missing explanations
  await runTask(
    'STRUCTURED EXPLANATION GENERATION',
    async () => {
      const { data } = await supabase
        .from('questions')
        .select('id, question_text, question_type, options, correct_answer, explanation')
        .eq('status', 'approved')
        .is('explanation_structured', null)
        .limit(BATCH_SIZE)
      return data || []
    },
    generateExplanation
  )

  // TASK 3: UK Guidelines verification
  await runTask(
    'UK GUIDELINES VERIFICATION',
    async () => {
      // Fetch all, filter unverified in JS
      const { data } = await supabase
        .from('questions')
        .select('id, question_text, question_type, options, correct_answer, explanation, metadata')
        .eq('status', 'approved')
      // Filter unverified and take batch
      const unverified = (data || []).filter(q => (q.metadata as any)?.uk_guidelines_verified === undefined)
      return unverified.slice(0, BATCH_SIZE)
    },
    verifyUK
  )

  const elapsed = Math.round((Date.now() - startTime) / 1000 / 60)

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  ✅ ALL TASKS COMPLETE!                                       ║
╠══════════════════════════════════════════════════════════════╣
║  Total time: ${String(elapsed).padEnd(3)} minutes                                      ║
║  Difficulties changed: ${String(stats.difficulty.changed).padEnd(5)}                               ║
║  Explanations generated: ${String(stats.explanations.success).padEnd(5)}                             ║
║  UK Issues found: ${String(stats.verification.issues).padEnd(5)}                                    ║
╚══════════════════════════════════════════════════════════════╝
`)
}

main().catch(console.error)
