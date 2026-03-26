import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Use service role to bypass RLS for reading question counts
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }
  return createClient(url, key)
}

export async function GET() {
  try {
    const supabase = getServiceClient()

    // Fetch SBA categories
    const { data: categories, error } = await supabase
      .from('sba_categories')
      .select(`
        id,
        slug,
        name,
        description,
        difficulty_default,
        icon,
        sort_order
      `)
      .order('sort_order', { ascending: true })

    if (error) {
      throw error
    }

    // Get all SBA questions with their category and difficulty
    const { data: questions, error: questionsError, count } = await supabase
      .from('sba_questions')
      .select('category_id, difficulty', { count: 'exact' })
      .range(0, 9999)

    if (questionsError) {
      console.error('SBA questions query error:', questionsError)
      throw questionsError
    }

    // Build counts per category with difficulty breakdown
    const countMap: Record<string, {
      total: number
      byDifficulty: { Easy: number; Medium: number; Hard: number }
    }> = {}

    questions?.forEach((q) => {
      if (!countMap[q.category_id]) {
        countMap[q.category_id] = {
          total: 0,
          byDifficulty: { Easy: 0, Medium: 0, Hard: 0 }
        }
      }
      countMap[q.category_id].total++
      if (q.difficulty in countMap[q.category_id].byDifficulty) {
        countMap[q.category_id].byDifficulty[q.difficulty as 'Easy' | 'Medium' | 'Hard']++
      }
    })

    // Merge counts into categories
    const categoriesWithCounts = categories?.map((cat) => ({
      ...cat,
      question_count: countMap[cat.id]?.total || 0,
      difficulty_counts: countMap[cat.id]?.byDifficulty || { Easy: 0, Medium: 0, Hard: 0 }
    }))

    // Calculate total
    const totalQuestions = questions?.length || 0

    return NextResponse.json({
      categories: categoriesWithCounts,
      total: totalQuestions,
      _debug: {
        questionsReturned: questions?.length || 0,
        totalCount: count
      }
    })
  } catch (error) {
    console.error('SBA categories error:', error)
    return NextResponse.json({ error: 'Failed to fetch SBA categories' }, { status: 500 })
  }
}
