import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

// Clinical category slugs allowed during trial
const CLINICAL_CATEGORY_SLUGS = [
  'clinical-pharmacy',
  'pharmacology',
  'law-ethics',
  'pharmaceutics',
  'public-health',
  'cardiovascular',
  'respiratory',
  'endocrine',
  'infection',
  'mental-health',
  'gastrointestinal',
  'pain-management'
]

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
    let clinicalCategoryIds: string[] = []

    if (!hasSubscription) {
      // Check trial status
      const { data: trialData } = await supabase
        .rpc('check_and_update_trial_status', { p_user_id: user.id })

      const trial = trialData && trialData[0]
      isTrialUser = trial?.has_active_trial && trial?.questions_remaining > 0

      // If trial user, get clinical category IDs to filter questions
      if (isTrialUser) {
        const { data: clinicalCategories } = await supabase
          .from('question_categories')
          .select('id')
          .in('slug', CLINICAL_CATEGORY_SLUGS)

        clinicalCategoryIds = clinicalCategories?.map(c => c.id) || []
      }
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const categories = searchParams.get('categories') // comma-separated category IDs
    const questionType = searchParams.get('type') // sba, emq, calculation, or all
    const difficulties = searchParams.get('difficulties') // comma-separated: Easy,Medium,Hard
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const random = searchParams.get('random') === 'true'
    const questionIds = searchParams.get('question_ids') // comma-separated question IDs for bookmarked filtering

    // Build query - only fetch approved questions
    let query = supabase
      .from('questions')
      .select(`
        id,
        category_id,
        question_type,
        difficulty,
        question_text,
        options,
        correct_answer,
        explanation,
        explanation_structured,
        is_trial_featured,
        trial_display_order,
        question_categories (name, slug, question_type)
      `, { count: 'exact' })
      .eq('status', 'approved')

    // Filter by specific question IDs (for bookmarked questions)
    if (questionIds) {
      const idList = questionIds.split(',').filter(Boolean)
      if (idList.length > 0) {
        query = query.in('id', idList)
      }
    }

    // Filter by categories
    if (categories) {
      let categoryList = categories.split(',').filter(Boolean)

      // For trial users, further filter to only clinical categories
      if (isTrialUser && clinicalCategoryIds.length > 0) {
        categoryList = categoryList.filter(catId => clinicalCategoryIds.includes(catId))
      }

      if (categoryList.length > 0) {
        query = query.in('category_id', categoryList)
      }
    } else if (isTrialUser && clinicalCategoryIds.length > 0) {
      // Trial user with no category filter - restrict to clinical categories only
      query = query.in('category_id', clinicalCategoryIds)
    }

    // Filter by question type
    // Trial users cannot access calculation questions
    if (isTrialUser && questionType === 'calculation') {
      // Return empty result for trial users requesting calculations
      return NextResponse.json({
        questions: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        isTrialRestricted: true,
        message: 'Calculation questions are only available with a subscription'
      })
    }

    if (questionType && questionType !== 'all') {
      query = query.eq('question_type', questionType)
    }

    // For trial users, exclude calculation questions entirely
    if (isTrialUser) {
      query = query.neq('question_type', 'calculation')
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

    // For trial users, prioritize trial-featured questions
    if (isTrialUser && !questionIds) {
      // First, try to get trial-featured questions
      const featuredQuery = supabase
        .from('questions')
        .select(`
          id,
          category_id,
          question_type,
          difficulty,
          question_text,
          options,
          correct_answer,
          explanation,
          explanation_structured,
          is_trial_featured,
          trial_display_order,
          question_categories (name, slug, question_type)
        `, { count: 'exact' })
        .eq('status', 'approved')
        .eq('is_trial_featured', true)
        .neq('question_type', 'calculation')

      // Apply category filter for trial users
      if (categories) {
        let categoryList = categories.split(',').filter(Boolean)
        if (clinicalCategoryIds.length > 0) {
          categoryList = categoryList.filter(catId => clinicalCategoryIds.includes(catId))
        }
        if (categoryList.length > 0) {
          featuredQuery.in('category_id', categoryList)
        }
      } else if (clinicalCategoryIds.length > 0) {
        featuredQuery.in('category_id', clinicalCategoryIds)
      }

      // Apply difficulty filter
      if (difficulties) {
        const difficultyList = difficulties.split(',').filter(Boolean)
        if (difficultyList.length > 0) {
          featuredQuery.in('difficulty', difficultyList)
        }
      }

      if (random) {
        const { data: featuredQuestions, count: featuredCount, error: featuredError } = await featuredQuery

        if (featuredError) {
          throw featuredError
        }

        // Shuffle trial-featured questions
        const shuffled = [...(featuredQuestions || [])].sort(() => Math.random() - 0.5)
        const paginated = shuffled.slice(offset, offset + limit)

        return NextResponse.json({
          questions: paginated,
          total: featuredCount || 0,
          page,
          limit,
          totalPages: Math.ceil((featuredCount || 0) / limit),
          isTrialUser,
          isTrialFeatured: true
        })
      } else {
        // Order by trial_display_order for structured progression
        featuredQuery.order('trial_display_order', { ascending: true, nullsFirst: false })
        featuredQuery.range(offset, offset + limit - 1)

        const { data: featuredQuestions, count: featuredCount, error: featuredError } = await featuredQuery

        if (featuredError) {
          throw featuredError
        }

        return NextResponse.json({
          questions: featuredQuestions,
          total: featuredCount || 0,
          page,
          limit,
          totalPages: Math.ceil((featuredCount || 0) / limit),
          isTrialUser,
          isTrialFeatured: true
        })
      }
    }

    if (random) {
      // For random ordering, we need to fetch all matching IDs first
      // then randomly select from them
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
    console.error('Questions error:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}
