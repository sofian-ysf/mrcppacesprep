import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')

  let query = supabase
    .from('spot_diagnoses')
    .select('*')
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category_id', category)
  }
  if (difficulty) {
    query = query.eq('difficulty', difficulty)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ spotDiagnoses: data })
}
