import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { generateStructuredExplanation } from '@/app/lib/openai'

interface EnhancementJob {
  questionId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
}

// Background processing function
async function processEnhancementBatch(
  questionIds: string[],
  requestId: string
) {
  console.log(`[Enhancement ${requestId}] Starting batch of ${questionIds.length} questions`)

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(`[Enhancement ${requestId}] Missing environment variables`)
    return
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  let processed = 0
  let failed = 0

  for (const questionId of questionIds) {
    try {
      // Fetch the question with category info
      const { data: question, error: fetchError } = await supabase
        .from('questions')
        .select(`
          id,
          question_text,
          options,
          correct_answer,
          explanation,
          question_categories (name)
        `)
        .eq('id', questionId)
        .single()

      if (fetchError || !question) {
        console.error(`[Enhancement ${requestId}] Question ${questionId} not found`)
        failed++
        continue
      }

      // Handle both array and object return from Supabase join
      const categoryData = question.question_categories
      const categoryName = Array.isArray(categoryData)
        ? categoryData[0]?.name
        : (categoryData as { name: string } | null)?.name || 'General Pharmacy'

      // Generate structured explanation
      console.log(`[Enhancement ${requestId}] Processing question ${questionId}...`)
      const structured = await generateStructuredExplanation(
        question.question_text,
        question.options,
        question.correct_answer,
        question.explanation,
        categoryName
      )

      // Update the question with structured explanation
      const { error: updateError } = await supabase
        .from('questions')
        .update({
          explanation_structured: structured,
          updated_at: new Date().toISOString()
        })
        .eq('id', questionId)

      if (updateError) {
        console.error(`[Enhancement ${requestId}] Failed to update question ${questionId}:`, updateError)
        failed++
      } else {
        processed++
        console.log(`[Enhancement ${requestId}] Successfully enhanced question ${questionId} (${processed}/${questionIds.length})`)
      }

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`[Enhancement ${requestId}] Error processing question ${questionId}:`, error)
      failed++
    }
  }

  console.log(`[Enhancement ${requestId}] Completed. Processed: ${processed}, Failed: ${failed}`)
}

// POST: Enhance explanations for specific questions or batch
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const body = await request.json()
    const { questionIds, trialFeaturedOnly, limit } = body

    let targetQuestionIds: string[] = []

    if (questionIds && Array.isArray(questionIds) && questionIds.length > 0) {
      // Enhance specific questions
      targetQuestionIds = questionIds
    } else if (trialFeaturedOnly) {
      // Enhance all trial-featured questions that don't have structured explanations
      const { data: questions, error: queryError } = await supabase
        .from('questions')
        .select('id')
        .eq('is_trial_featured', true)
        .is('explanation_structured', null)
        .limit(limit || 100)

      if (queryError) {
        throw queryError
      }

      targetQuestionIds = questions?.map(q => q.id) || []
    } else {
      // Enhance questions without structured explanations
      const { data: questions, error: queryError } = await supabase
        .from('questions')
        .select('id')
        .eq('status', 'approved')
        .is('explanation_structured', null)
        .limit(limit || 50)

      if (queryError) {
        throw queryError
      }

      targetQuestionIds = questions?.map(q => q.id) || []
    }

    if (targetQuestionIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No questions need enhancement',
        questionsToProcess: 0
      })
    }

    const requestId = Date.now().toString(36)

    // Schedule background processing
    after(async () => {
      await processEnhancementBatch(targetQuestionIds, requestId)
    })

    return NextResponse.json({
      success: true,
      requestId,
      questionsToProcess: targetQuestionIds.length,
      message: `Enhancement started for ${targetQuestionIds.length} questions`
    })
  } catch (error) {
    console.error('Enhancement error:', error)
    return NextResponse.json({
      error: (error as Error).message || 'Failed to start enhancement'
    }, { status: 500 })
  }
}

// GET: Check enhancement status or get questions needing enhancement
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const trialFeaturedOnly = searchParams.get('trialFeaturedOnly') === 'true'

    // Get count of questions needing enhancement
    let query = supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
      .is('explanation_structured', null)

    if (trialFeaturedOnly) {
      query = query.eq('is_trial_featured', true)
    }

    const { count: needsEnhancement } = await query

    // Get count of enhanced questions
    let enhancedQuery = supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
      .not('explanation_structured', 'is', null)

    if (trialFeaturedOnly) {
      enhancedQuery = enhancedQuery.eq('is_trial_featured', true)
    }

    const { count: enhanced } = await enhancedQuery

    // Get trial featured count
    const { count: trialFeatured } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('is_trial_featured', true)

    return NextResponse.json({
      needsEnhancement: needsEnhancement || 0,
      enhanced: enhanced || 0,
      trialFeaturedCount: trialFeatured || 0
    })
  } catch (error) {
    console.error('Get enhancement status error:', error)
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 })
  }
}
