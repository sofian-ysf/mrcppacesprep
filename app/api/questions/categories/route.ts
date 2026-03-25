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

    // Debug: Log that we're using service role
    console.log('Using service role client for categories API')

    // Fetch categories
    const { data: categories, error } = await supabase
      .from('question_categories')
      .select(`
        id,
        slug,
        name,
        description,
        question_type,
        difficulty_default,
        icon,
        sort_order
      `)
      .order('sort_order', { ascending: true })

    if (error) {
      throw error
    }

    // Get all approved questions with their category and difficulty
    // Note: Supabase defaults to 1000 row limit, use range to get all
    const { data: questions, error: questionsError, count } = await supabase
      .from('questions')
      .select('category_id, difficulty, question_type', { count: 'exact' })
      .eq('status', 'approved')
      .range(0, 9999)

    if (questionsError) {
      console.error('Questions query error:', questionsError)
      throw questionsError
    }

    // Debug: Log total questions found
    console.log('Total approved questions found:', questions?.length)

    // Build counts per category with difficulty and type breakdowns
    const countMap: Record<string, {
      total: number
      byDifficulty: { Easy: number; Medium: number; Hard: number }
      byType: { sba: number; emq: number; calculation: number }
    }> = {}

    questions?.forEach((q) => {
      if (!countMap[q.category_id]) {
        countMap[q.category_id] = {
          total: 0,
          byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
          byType: { sba: 0, emq: 0, calculation: 0 }
        }
      }
      countMap[q.category_id].total++
      if (q.difficulty in countMap[q.category_id].byDifficulty) {
        countMap[q.category_id].byDifficulty[q.difficulty as 'Easy' | 'Medium' | 'Hard']++
      }
      if (q.question_type in countMap[q.category_id].byType) {
        countMap[q.category_id].byType[q.question_type as 'sba' | 'emq' | 'calculation']++
      }
    })

    // Merge counts into categories
    const categoriesWithCounts = categories?.map((cat) => ({
      ...cat,
      question_count: countMap[cat.id]?.total || 0,
      difficulty_counts: countMap[cat.id]?.byDifficulty || { Easy: 0, Medium: 0, Hard: 0 },
      type_counts: countMap[cat.id]?.byType || { sba: 0, emq: 0, calculation: 0 }
    }))

    // Calculate totals
    const totalQuestions = questions?.length || 0
    const totalClinical = questions?.filter(q => q.question_type !== 'calculation').length || 0
    const totalCalculation = questions?.filter(q => q.question_type === 'calculation').length || 0

    return NextResponse.json({
      categories: categoriesWithCounts,
      totals: {
        all: totalQuestions,
        clinical: totalClinical,
        calculation: totalCalculation
      },
      _debug: {
        questionsReturned: questions?.length || 0,
        totalCount: count,
        serviceRoleUsed: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    })
  } catch (error) {
    console.error('Categories error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
