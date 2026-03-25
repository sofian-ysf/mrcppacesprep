import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { calculateQuestionSM2 } from '@/app/lib/questions/sm2'

// Categories that are clinical (allowed during trial)
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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { question_id, selected_answer, time_taken_seconds } = await request.json()

    if (!question_id || selected_answer === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check user's access type (subscription or trial)
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    const hasSubscription = subscription?.status === 'active'
    let isTrialUser = false
    let trialQuestionsRemaining = 0

    if (!hasSubscription) {
      // Check trial status
      const { data: trialData, error: trialError } = await supabase
        .rpc('check_and_update_trial_status', { p_user_id: user.id })

      if (trialError) {
        console.error('Trial check error:', trialError)
        return NextResponse.json(
          { error: 'Access denied', requiresUpgrade: true },
          { status: 403 }
        )
      }

      const trial = trialData && trialData[0]

      if (!trial || !trial.has_active_trial) {
        return NextResponse.json(
          {
            error: trial?.status === 'exhausted'
              ? 'You have used all 100 trial questions'
              : 'Your trial has expired',
            requiresUpgrade: true,
            trialStatus: trial?.status || 'none'
          },
          { status: 403 }
        )
      }

      if (trial.questions_remaining <= 0) {
        return NextResponse.json(
          { error: 'You have used all 100 trial questions', requiresUpgrade: true, trialStatus: 'exhausted' },
          { status: 403 }
        )
      }

      isTrialUser = true
      trialQuestionsRemaining = trial.questions_remaining
    }

    // Fetch the question to check the correct answer and category
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select(`
        correct_answer,
        explanation,
        explanation_structured,
        question_type,
        category_id,
        question_categories (slug, question_type)
      `)
      .eq('id', question_id)
      .single()

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // If trial user, verify the question is clinical (not calculation)
    if (isTrialUser) {
      // question_categories can be an object or null from the join
      const categoryData = question.question_categories as { slug: string; question_type: string } | { slug: string; question_type: string }[] | null
      const category = Array.isArray(categoryData) ? categoryData[0] : categoryData

      // Block calculation questions for trial users
      if (category?.question_type === 'calculation' || !CLINICAL_CATEGORY_SLUGS.includes(category?.slug || '')) {
        return NextResponse.json(
          {
            error: 'Calculation questions are only available with a subscription',
            requiresUpgrade: true,
            restrictedContent: true
          },
          { status: 403 }
        )
      }
    }

    // Determine if the answer is correct
    let is_correct = false

    if (question.question_type === 'emq') {
      // For EMQ, selected_answer is a JSON string of answers for each scenario
      // correct_answer is also a JSON string of scenarios with correct answers
      try {
        const selectedAnswers = JSON.parse(selected_answer)
        const correctAnswers = JSON.parse(question.correct_answer)

        // Check if all scenario answers match
        is_correct = correctAnswers.every((scenario: { stem: string; correct_answer: string }, index: number) => {
          return selectedAnswers[index] === scenario.correct_answer
        })
      } catch {
        is_correct = false
      }
    } else {
      // For SBA and calculation questions
      is_correct = selected_answer.toLowerCase() === question.correct_answer.toLowerCase()
    }

    // If trial user, increment trial usage BEFORE recording the answer
    let newTrialQuestionsRemaining = trialQuestionsRemaining
    if (isTrialUser) {
      const { data: usageData, error: usageError } = await supabase
        .rpc('increment_trial_usage', { p_user_id: user.id })

      if (usageError) {
        console.error('Failed to increment trial usage:', usageError)
        // Don't fail the request, but log the error
      } else if (usageData && usageData[0]) {
        newTrialQuestionsRemaining = usageData[0].questions_remaining
      }
    }

    // Save the answer to user_answers table
    const { error: insertError } = await supabase
      .from('user_answers')
      .insert({
        user_id: user.id,
        question_id,
        selected_answer,
        is_correct,
        time_taken_seconds: time_taken_seconds || 0
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      // Don't fail the request if insert fails (might be a duplicate)
    }

    // Update question progress (SM-2 spaced repetition)
    const { data: existingProgress, error: progressFetchError } = await supabase
      .from('user_question_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('question_id', question_id)
      .single()

    if (progressFetchError && progressFetchError.code !== 'PGRST116') {
      console.error('Error fetching question progress:', progressFetchError)
    }

    // Calculate new SM-2 values
    const currentProgress = existingProgress || {
      ease_factor: 2.5,
      interval_days: 0,
      repetitions: 0,
      times_correct: 0,
      times_incorrect: 0
    }

    const sm2Result = calculateQuestionSM2({
      isCorrect: is_correct,
      repetitions: currentProgress.repetitions,
      easeFactor: currentProgress.ease_factor,
      interval: currentProgress.interval_days
    })

    // Upsert question progress
    const progressData = {
      user_id: user.id,
      question_id,
      ease_factor: sm2Result.easeFactor,
      interval_days: sm2Result.interval,
      repetitions: sm2Result.repetitions,
      due_date: sm2Result.nextDueDate.toISOString(),
      times_correct: currentProgress.times_correct + (is_correct ? 1 : 0),
      times_incorrect: currentProgress.times_incorrect + (is_correct ? 0 : 1),
      last_reviewed_at: new Date().toISOString()
    }

    const { error: progressUpsertError } = await supabase
      .from('user_question_progress')
      .upsert(progressData, {
        onConflict: 'user_id,question_id'
      })

    if (progressUpsertError) {
      console.error('Error updating question progress:', progressUpsertError)
      // Don't fail - the answer was still recorded
    }

    // Update daily activity
    const today = new Date().toISOString().split('T')[0]
    const { data: existingActivity, error: activityFetchError } = await supabase
      .from('user_daily_activity')
      .select('*')
      .eq('user_id', user.id)
      .eq('activity_date', today)
      .single()

    if (activityFetchError && activityFetchError.code !== 'PGRST116') {
      console.error('Error fetching daily activity:', activityFetchError)
    }

    const activityData = {
      user_id: user.id,
      activity_date: today,
      questions_answered: (existingActivity?.questions_answered || 0) + 1,
      questions_correct: (existingActivity?.questions_correct || 0) + (is_correct ? 1 : 0),
      study_time_seconds: (existingActivity?.study_time_seconds || 0) + (time_taken_seconds || 0)
    }

    const { error: activityUpsertError } = await supabase
      .from('user_daily_activity')
      .upsert(activityData, {
        onConflict: 'user_id,activity_date'
      })

    if (activityUpsertError) {
      console.error('Error updating daily activity:', activityUpsertError)
    }

    // For calculation questions, try to fetch enhanced explanation from verifications
    let enhancedExplanation: string | null = null
    if (question.question_type === 'calculation') {
      const { data: verification } = await supabase
        .from('question_verifications')
        .select('ai_explanation')
        .eq('question_id', question_id)
        .single()

      if (verification?.ai_explanation) {
        enhancedExplanation = verification.ai_explanation
      }
    }

    // Record trial activity if trial user
    if (isTrialUser) {
      const categoryData = question.question_categories as { slug: string; question_type: string } | { slug: string; question_type: string }[] | null
      const category = Array.isArray(categoryData) ? categoryData[0] : categoryData
      const categorySlug = category?.slug || null

      // Use the RPC function to record trial activity
      const { error: trialActivityError } = await supabase
        .rpc('record_trial_activity', {
          p_user_id: user.id,
          p_questions_answered: 1,
          p_questions_correct: is_correct ? 1 : 0,
          p_category_slug: categorySlug,
          p_time_spent: time_taken_seconds || 0
        })

      if (trialActivityError) {
        console.error('Error recording trial activity:', trialActivityError)
      }
    }

    // Build response
    const response: {
      is_correct: boolean
      correct_answer: string
      explanation: string
      explanation_structured?: unknown
      enhanced_explanation?: string
      question_type: string
      nextReview: string
      trial?: {
        questionsRemaining: number
        isLast: boolean
      }
    } = {
      is_correct,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      question_type: question.question_type,
      nextReview: sm2Result.nextDueDate.toISOString()
    }

    // Include structured explanation if available
    if (question.explanation_structured) {
      response.explanation_structured = question.explanation_structured
    }

    // Include enhanced explanation for calculation questions
    if (enhancedExplanation) {
      response.enhanced_explanation = enhancedExplanation
    }

    // Include trial info if applicable
    if (isTrialUser) {
      response.trial = {
        questionsRemaining: newTrialQuestionsRemaining,
        isLast: newTrialQuestionsRemaining <= 0
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Answer submission error:', error)
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 })
  }
}
