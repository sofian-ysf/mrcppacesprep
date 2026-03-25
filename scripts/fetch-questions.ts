import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // First check how many are already trial-featured
  const { count: featuredCount } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('is_trial_featured', true)

  console.log(`Currently ${featuredCount || 0} questions are trial-featured`)

  // Get approved clinical questions that aren't yet trial-featured
  const { data: clinical, error: clinicalError } = await supabase
    .from('questions')
    .select('id, question_text, options, correct_answer, explanation, difficulty, question_categories(name, slug)')
    .eq('status', 'approved')
    .in('question_type', ['sba', 'emq'])
    .eq('is_trial_featured', false)
    .limit(20)

  if (clinicalError) {
    console.error('Error:', clinicalError)
    return
  }

  const count = clinical ? clinical.length : 0
  console.log(`Found ${count} clinical questions to enhance`)
  console.log(JSON.stringify(clinical, null, 2))
}

main()
