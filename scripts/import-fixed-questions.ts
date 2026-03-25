/**
 * Import Fixed Questions from CSV
 * Updates questions in Supabase from the edited CSV file
 *
 * Usage: npx tsx scripts/import-fixed-questions.ts [path-to-csv]
 * Default: /Users/sofianyoussef/Desktop/uk-issues-to-fix.csv
 */

import 'dotenv/config'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import * as fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

function parseCSVRow(row: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < row.length; i++) {
    const char = row[i]

    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"'
        i++ // Skip the next quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current) // Don't forget the last field

  return result
}

function parseOptions(optionsStr: string): any[] | null {
  if (!optionsStr || optionsStr === '') return null

  // Format: "A: text | B: text | C: text"
  const parts = optionsStr.split(' | ')
  return parts.map(part => {
    const match = part.match(/^([A-Z]):\s*(.+)$/)
    if (match) {
      return { letter: match[1], text: match[2] }
    }
    return { letter: '?', text: part }
  })
}

async function main() {
  const csvPath = process.argv[2] || '/Users/sofianyoussef/Desktop/uk-questions-fixed.csv'

  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`)
    process.exit(1)
  }

  console.log(`Reading CSV from: ${csvPath}`)
  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n')

  // Parse header
  const header = parseCSVRow(lines[0])
  console.log('Columns:', header.join(', '))

  // Find column indices
  const idIdx = header.indexOf('id')
  const questionTextIdx = header.indexOf('question_text')
  const questionTypeIdx = header.indexOf('question_type')
  const difficultyIdx = header.indexOf('difficulty')
  const optionsIdx = header.indexOf('options')
  const correctAnswerIdx = header.indexOf('correct_answer')
  const explanationIdx = header.indexOf('explanation')

  if (idIdx === -1) {
    console.error('CSV must have an "id" column')
    process.exit(1)
  }

  let updated = 0
  let skipped = 0
  let failed = 0

  console.log(`\nProcessing ${lines.length - 1} rows...\n`)

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) {
      skipped++
      continue
    }

    const row = parseCSVRow(line)
    const id = row[idIdx]

    if (!id) {
      skipped++
      continue
    }

    // Build update object with only non-empty changed fields
    const updates: Record<string, any> = {}

    if (questionTextIdx !== -1 && row[questionTextIdx]) {
      updates.question_text = row[questionTextIdx]
    }
    if (questionTypeIdx !== -1 && row[questionTypeIdx]) {
      updates.question_type = row[questionTypeIdx]
    }
    if (difficultyIdx !== -1 && row[difficultyIdx]) {
      updates.difficulty = row[difficultyIdx]
    }
    if (optionsIdx !== -1 && row[optionsIdx]) {
      updates.options = parseOptions(row[optionsIdx])
    }
    if (correctAnswerIdx !== -1 && row[correctAnswerIdx]) {
      updates.correct_answer = row[correctAnswerIdx]
    }
    if (explanationIdx !== -1 && row[explanationIdx]) {
      updates.explanation = row[explanationIdx]
    }

    if (Object.keys(updates).length === 0) {
      skipped++
      continue
    }

    // Add metadata to mark as manually fixed
    updates.updated_at = new Date().toISOString()

    try {
      // First get current metadata
      const { data: current } = await supabase
        .from('questions')
        .select('metadata')
        .eq('id', id)
        .single()

      updates.metadata = {
        ...(current?.metadata || {}),
        uk_guidelines_verified: true, // Mark as verified after manual fix
        uk_manual_fix_date: new Date().toISOString(),
        uk_manual_fix: true
      }

      const { error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', id)

      if (error) {
        console.error(`❌ Failed to update ${id}: ${error.message}`)
        failed++
      } else {
        updated++
        if (updated % 50 === 0) {
          console.log(`Progress: ${updated} updated`)
        }
      }
    } catch (err) {
      console.error(`❌ Error updating ${id}:`, err)
      failed++
    }
  }

  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Import Complete                                           ║
╠════════════════════════════════════════════════════════════╣
║  Updated: ${String(updated).padEnd(5)}                                           ║
║  Skipped: ${String(skipped).padEnd(5)}                                           ║
║  Failed:  ${String(failed).padEnd(5)}                                           ║
╚════════════════════════════════════════════════════════════╝
`)
}

main().catch(console.error)
