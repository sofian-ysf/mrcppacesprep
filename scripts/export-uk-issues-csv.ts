/**
 * Export UK Guidelines Issues to CSV
 * Queries Supabase directly and exports to CSV for manual review
 */

import 'dotenv/config'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import * as fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const OUTPUT_FILE = '/Users/sofianyoussef/Desktop/uk-issues-to-fix.csv'

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

function escapeCSV(str: string | null | undefined): string {
  if (str == null) return ''
  const s = String(str)
  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

function formatOptions(options: any[] | null): string {
  if (!options) return ''
  return options.map((o: any) => `${o.letter}: ${o.text}`).join(' | ')
}

function formatIssues(issues: any): string {
  if (!issues) return ''
  if (Array.isArray(issues)) {
    return issues.join(' • ')
  }
  return String(issues)
}

async function main() {
  console.log('Fetching questions with UK issues from Supabase...')

  // Fetch all questions
  const { data: allQuestions, error } = await supabase
    .from('questions')
    .select('id, question_text, question_type, difficulty, options, correct_answer, explanation, metadata')
    .eq('status', 'approved')

  if (error) {
    console.error('Error fetching questions:', error)
    process.exit(1)
  }

  // Filter for questions with UK issues
  const questionsWithIssues = (allQuestions || []).filter(q => {
    const meta = q.metadata as any
    return meta?.uk_guidelines_verified === false
  })

  console.log(`Found ${questionsWithIssues.length} questions with UK issues`)

  // Create CSV header
  const headers = [
    'id',
    'question_type',
    'difficulty',
    'question_text',
    'options',
    'correct_answer',
    'explanation',
    'issues',
    'suggested_fix'
  ]

  const csvRows = [headers.join(',')]

  // Process each question
  for (const q of questionsWithIssues) {
    const meta = q.metadata as any
    const row = [
      escapeCSV(q.id),
      escapeCSV(q.question_type),
      escapeCSV(q.difficulty),
      escapeCSV(q.question_text),
      escapeCSV(formatOptions(q.options)),
      escapeCSV(q.correct_answer),
      escapeCSV(q.explanation),
      escapeCSV(formatIssues(meta?.uk_verification_issues)),
      escapeCSV(meta?.uk_verification_corrections)
    ]
    csvRows.push(row.join(','))
  }

  // Write CSV
  fs.writeFileSync(OUTPUT_FILE, csvRows.join('\n'), 'utf-8')
  console.log(`\n✅ CSV exported to: ${OUTPUT_FILE}`)
  console.log(`   ${questionsWithIssues.length} questions with UK issues`)

  // Summary by type
  const byType: Record<string, number> = {}
  for (const q of questionsWithIssues) {
    byType[q.question_type] = (byType[q.question_type] || 0) + 1
  }
  console.log('\nBreakdown by question type:')
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${type}: ${count}`)
  }
}

main().catch(console.error)
