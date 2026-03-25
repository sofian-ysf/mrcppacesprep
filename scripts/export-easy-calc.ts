/**
 * Export Easy Calculation Questions to CSV
 */

import 'dotenv/config'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import * as fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const OUTPUT_FILE = '/Users/sofianyoussef/Desktop/easy-calc-questions.csv'
const LIMIT = 500

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

function escapeCSV(str: string | null | undefined): string {
  if (str == null) return ''
  const s = String(str)
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

function formatOptions(options: any[] | null): string {
  if (!options) return ''
  return options.map((o: any) => `${o.letter}: ${o.text}`).join(' | ')
}

async function main() {
  console.log(`Fetching ${LIMIT} easy calculation questions...`)

  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, question_text, question_type, difficulty, options, correct_answer, explanation')
    .eq('status', 'approved')
    .eq('difficulty', 'Easy')
    .eq('question_type', 'calculation')
    .limit(LIMIT)

  if (error) {
    console.error('Error:', error)
    process.exit(1)
  }

  console.log(`Found ${questions?.length || 0} questions`)

  const headers = ['id', 'question_type', 'difficulty', 'question_text', 'options', 'correct_answer', 'explanation']
  const csvRows = [headers.join(',')]

  for (const q of questions || []) {
    const row = [
      escapeCSV(q.id),
      escapeCSV(q.question_type),
      escapeCSV(q.difficulty),
      escapeCSV(q.question_text),
      escapeCSV(formatOptions(q.options)),
      escapeCSV(q.correct_answer),
      escapeCSV(q.explanation)
    ]
    csvRows.push(row.join(','))
  }

  fs.writeFileSync(OUTPUT_FILE, csvRows.join('\n'), 'utf-8')
  console.log(`\n✅ Exported to: ${OUTPUT_FILE}`)
  console.log(`   ${questions?.length} easy calculation questions`)
}

main()
