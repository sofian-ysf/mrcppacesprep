/**
 * Script to enhance trial-featured questions with structured explanations
 *
 * Usage: npx tsx scripts/enhance-trial-questions.ts [--all] [--limit N] [--dry-run]
 *
 * Options:
 *   --all      Process all approved questions (not just trial-featured)
 *   --limit N  Limit to N questions (default: 100)
 *   --dry-run  Don't save changes, just show what would be processed
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable')
  process.exit(1)
}

if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY environment variable')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

// Parse command line arguments
const args = process.argv.slice(2)
const processAll = args.includes('--all')
const dryRun = args.includes('--dry-run')
const limitIndex = args.indexOf('--limit')
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : 100

interface QuestionToProcess {
  id: string
  question_text: string
  options: { letter: string; text: string }[] | null
  correct_answer: string
  explanation: string
  question_categories: { name: string }[] | { name: string } | null
}

interface StructuredExplanation {
  summary: string
  key_points: string[]
  clinical_pearl: string
  why_wrong: Record<string, string>
  exam_tip: string
  related_topics: string[]
}

async function generateStructuredExplanation(
  question: QuestionToProcess
): Promise<StructuredExplanation> {
  const optionsText = question.options
    ? question.options.map(o => `${o.letter}: ${o.text}`).join('\n')
    : 'N/A (calculation question)'

  // Handle both array and object return from Supabase join
  const categoryData = question.question_categories
  const categoryName = Array.isArray(categoryData)
    ? categoryData[0]?.name
    : categoryData?.name || 'General Pharmacy'

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert pharmacy educator creating detailed, structured explanations for GPhC pre-registration exam questions.

Your explanations should be:
- Educational and memorable
- Include practical clinical insights that help with real pharmacy practice
- Focused on exam success with specific tips
- Clear about why each incorrect option is wrong

IMPORTANT: Always return valid JSON without any markdown code blocks.`
      },
      {
        role: 'user',
        content: `Given this pharmacy pre-registration exam question in the "${categoryName}" category:

Question: ${question.question_text}

Options:
${optionsText}

Correct Answer: ${question.correct_answer}

Current Explanation: ${question.explanation}

Generate a structured educational explanation with:
1. summary: 1-2 sentence direct answer explanation that clearly states why the correct answer is correct
2. key_points: 3-4 bullet points of critical learning concepts related to this question
3. clinical_pearl: One memorable clinical insight for real pharmacy practice (something they'll remember)
4. why_wrong: For each incorrect option (${question.options ? question.options.filter(o => o.letter !== question.correct_answer).map(o => o.letter).join(', ') : 'N/A'}), explain why it's wrong (2-3 sentences each). Use the option letters as keys.
5. exam_tip: A specific tip for remembering or approaching this type of question in the exam
6. related_topics: 2-3 related pharmacy topic slugs to study (use lowercase-with-hyphens format like "drug-interactions", "renal-impairment", etc.)

Return ONLY a valid JSON object in this exact format, no markdown:
{
  "summary": "Brief summary here...",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "clinical_pearl": "Clinical insight here...",
  "why_wrong": {"A": "Why A is wrong", "B": "Why B is wrong"...},
  "exam_tip": "Exam tip here...",
  "related_topics": ["topic-slug-1", "topic-slug-2"]
}`
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })

  const content = response.choices[0]?.message?.content || '{}'

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON object found in response')
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to parse response:', content)
    throw new Error('Failed to parse structured explanation response')
  }
}

async function main() {
  console.log('='.repeat(60))
  console.log('Trial Question Enhancement Script')
  console.log('='.repeat(60))
  console.log(`Mode: ${processAll ? 'All approved questions' : 'Trial-featured only'}`)
  console.log(`Limit: ${limit} questions`)
  console.log(`Dry run: ${dryRun}`)
  console.log('='.repeat(60))

  // Fetch questions that need enhancement
  console.log('\nFetching questions to process...')

  let query = supabase
    .from('questions')
    .select(`
      id,
      question_text,
      options,
      correct_answer,
      explanation,
      question_categories (name)
    `)
    .eq('status', 'approved')
    .is('explanation_structured', null)
    .limit(limit)

  if (!processAll) {
    query = query.eq('is_trial_featured', true)
  }

  const { data: questions, error: queryError } = await query

  if (queryError) {
    console.error('Error fetching questions:', queryError)
    process.exit(1)
  }

  if (!questions || questions.length === 0) {
    console.log('\nNo questions need enhancement!')
    return
  }

  console.log(`Found ${questions.length} questions to enhance\n`)

  // Process questions
  let processed = 0
  let failed = 0
  const startTime = Date.now()

  for (const question of questions as QuestionToProcess[]) {
    const questionNum = processed + failed + 1
    console.log(`[${questionNum}/${questions.length}] Processing question ${question.id}...`)

    try {
      const structured = await generateStructuredExplanation(question)

      if (dryRun) {
        console.log('  Generated (dry run - not saving):')
        console.log(`    Summary: ${structured.summary.substring(0, 50)}...`)
        console.log(`    Key Points: ${structured.key_points.length}`)
        console.log(`    Clinical Pearl: ${structured.clinical_pearl.substring(0, 50)}...`)
        console.log(`    Why Wrong: ${Object.keys(structured.why_wrong).join(', ')}`)
        console.log(`    Exam Tip: ${structured.exam_tip.substring(0, 50)}...`)
        console.log(`    Related Topics: ${structured.related_topics.join(', ')}`)
      } else {
        // Update the question with structured explanation
        const { error: updateError } = await supabase
          .from('questions')
          .update({
            explanation_structured: structured,
            updated_at: new Date().toISOString()
          })
          .eq('id', question.id)

        if (updateError) {
          console.error(`  Failed to update: ${updateError.message}`)
          failed++
          continue
        }

        console.log('  Successfully enhanced!')
      }

      processed++

      // Rate limiting - wait 1 second between API calls
      if (questionNum < questions.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`  Error: ${(error as Error).message}`)
      failed++

      // Wait a bit longer on errors in case of rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  // Summary
  const totalTime = Math.round((Date.now() - startTime) / 1000)
  console.log('\n' + '='.repeat(60))
  console.log('Summary')
  console.log('='.repeat(60))
  console.log(`Total processed: ${processed}`)
  console.log(`Failed: ${failed}`)
  console.log(`Time taken: ${totalTime} seconds`)
  console.log(`Average: ${(totalTime / (processed + failed)).toFixed(1)} seconds per question`)

  if (dryRun) {
    console.log('\n(This was a dry run - no changes were saved)')
  }
}

main().catch(console.error)
