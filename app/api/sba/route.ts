import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user's access type
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    const hasSubscription = subscription?.status === 'active'
    let isTrialUser = false

    if (!hasSubscription) {
      // Check trial status
      const { data: trialData } = await supabase
        .rpc('check_and_update_trial_status', { p_user_id: user.id })

      const trial = trialData && trialData[0]
      isTrialUser = trial?.has_active_trial && trial?.questions_remaining > 0
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const categories = searchParams.get('categories') // comma-separated category IDs
    const difficulties = searchParams.get('difficulties') // comma-separated: Easy,Medium,Hard
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const random = searchParams.get('random') === 'true'
    const questionIds = searchParams.get('question_ids') // comma-separated question IDs for bookmarked filtering

    // Build query for sba_questions table
    let query = supabase
      .from('sba_questions')
      .select(`
        id,
        category_id,
        question_text,
        options,
        correct_answer,
        explanation,
        key_points,
        clinical_pearl,
        exam_tip,
        difficulty,
        created_at,
        sba_categories (id, name, slug)
      `, { count: 'exact' })

    // Filter by specific question IDs (for bookmarked questions)
    if (questionIds) {
      const idList = questionIds.split(',').filter(Boolean)
      if (idList.length > 0) {
        query = query.in('id', idList)
      }
    }

    // Filter by categories
    if (categories) {
      const categoryList = categories.split(',').filter(Boolean)
      if (categoryList.length > 0) {
        query = query.in('category_id', categoryList)
      }
    }

    // Filter by difficulties
    if (difficulties) {
      const difficultyList = difficulties.split(',').filter(Boolean)
      if (difficultyList.length > 0) {
        query = query.in('difficulty', difficultyList)
      }
    }

    // Pagination
    const offset = (page - 1) * limit

    if (random) {
      // For random ordering, fetch all matching then shuffle
      const { data: allQuestions, count, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      // Shuffle the questions
      const shuffled = [...(allQuestions || [])].sort(() => Math.random() - 0.5)
      const paginated = shuffled.slice(offset, offset + limit)

      return NextResponse.json({
        questions: paginated,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
        isTrialUser
      })
    } else {
      query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

      const { data: questions, count, error } = await query

      if (error) {
        throw error
      }

      return NextResponse.json({
        questions,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
        isTrialUser
      })
    }
  } catch (error) {
    console.error('SBA questions error:', error)
    return NextResponse.json({ error: 'Failed to fetch SBA questions' }, { status: 500 })
  }
}
