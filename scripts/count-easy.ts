import 'dotenv/config'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const { data, error } = await supabase
    .from('questions')
    .select('id, question_type')
    .eq('status', 'approved')
    .eq('difficulty', 'Easy')

  if (error) {
    console.error('Error:', error)
    return
  }

  const byType: Record<string, number> = {}
  for (const q of data || []) {
    byType[q.question_type] = (byType[q.question_type] || 0) + 1
  }

  console.log('\nEasy Questions by Type:')
  console.log('========================')
  let total = 0
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`)
    total += count
  }
  console.log('------------------------')
  console.log(`  TOTAL: ${total}`)
}

main()
