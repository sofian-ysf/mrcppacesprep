import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { Differential } from '@/app/types/differentials'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('differentials')
      .select('*')
      .order('sign_name', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data: differentials, error } = await query

    if (error) {
      console.error('Error fetching differentials:', error)
      return NextResponse.json({ error: 'Failed to fetch differentials' }, { status: 500 })
    }

    // Get unique categories for filtering
    const { data: categoriesData } = await supabase
      .from('differentials')
      .select('category')
      .not('category', 'is', null)

    const categories = [...new Set(categoriesData?.map(c => c.category).filter(Boolean))]

    return NextResponse.json({
      differentials: differentials as Differential[],
      categories
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
