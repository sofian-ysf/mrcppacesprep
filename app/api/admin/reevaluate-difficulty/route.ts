import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { evaluateQuestionDifficulty } from '@/app/lib/openai'

interface DifficultyChange {
  questionId: string
  questionText: string
  questionType: string
  oldDifficulty: string
  newDifficulty: string
  reasoning: string
  confidenceScore: number
}

// Background processing function
async function processDifficultyEvaluationBatch(
  questionIds: string[],
  requestId: string,
  autoApply: boolean
) {
  console.log(`[DifficultyEval ${requestId}] Starting batch of ${questionIds.length} questions (autoApply: ${autoApply})`)

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(`[DifficultyEval ${requestId}] Missing environment variables`)
    return
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  let processed = 0
  let changed = 0
  let failed = 0
  const changes: DifficultyChange[] = []

  for (const questionId of questionIds) {
    try {
      // Fetch the question
      const { data: question, error: fetchError } = await supabase
        .from('questions')
        .select('id, question_text, question_type, difficulty, options, correct_answer, explanation')
        .eq('id', questionId)
        .single()

      if (fetchError || !question) {
        console.error(`[DifficultyEval ${requestId}] Question ${questionId} not found`)
        failed++
        continue
      }

      // Evaluate difficulty
      console.log(`[DifficultyEval ${requestId}] Evaluating question ${questionId}...`)
      const evaluation = await evaluateQuestionDifficulty(
        question.question_text,
        question.question_type as 'sba' | 'emq' | 'calculation',
        question.difficulty as 'Easy' | 'Medium' | 'Hard',
        question.options,
        question.correct_answer,
        question.explanation
      )

      processed++

      if (evaluation.shouldChange && evaluation.confidenceScore >= 0.7) {
        changes.push({
          questionId: question.id,
          questionText: question.question_text.substring(0, 100) + '...',
          questionType: question.question_type,
          oldDifficulty: question.difficulty,
          newDifficulty: evaluation.suggestedDifficulty,
          reasoning: evaluation.reasoning,
          confidenceScore: evaluation.confidenceScore
        })

        if (autoApply) {
          // Update the question difficulty
          const { error: updateError } = await supabase
            .from('questions')
            .update({
              difficulty: evaluation.suggestedDifficulty,
              updated_at: new Date().toISOString(),
              metadata: {
                ...((question as { metadata?: Record<string, unknown> }).metadata || {}),
                difficulty_reevaluated: true,
                difficulty_reevaluation_date: new Date().toISOString(),
                difficulty_reevaluation_reasoning: evaluation.reasoning,
                previous_difficulty: question.difficulty
              }
            })
            .eq('id', questionId)

          if (updateError) {
            console.error(`[DifficultyEval ${requestId}] Failed to update question ${questionId}:`, updateError)
          } else {
            changed++
            console.log(`[DifficultyEval ${requestId}] Changed ${questionId}: ${question.difficulty} -> ${evaluation.suggestedDifficulty}`)
          }
        }
      }

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`[DifficultyEval ${requestId}] Error processing question ${questionId}:`, error)
      failed++
    }
  }

  console.log(`[DifficultyEval ${requestId}] Completed. Processed: ${processed}, Need Change: ${changes.length}, Applied: ${changed}, Failed: ${failed}`)

  // Store results for retrieval
  if (changes.length > 0) {
    await supabase
      .from('generation_jobs')
      .upsert({
        id: requestId,
        status: 'completed',
        metadata: {
          type: 'difficulty_reevaluation',
          processed,
          changesNeeded: changes.length,
          changesApplied: changed,
          failed,
          changes: changes.slice(0, 100) // Store first 100 changes
        }
      }, { onConflict: 'id' })
  }
}

// POST: Start difficulty re-evaluation
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
    const {
      questionIds,
      questionType,
      currentDifficulty,
      limit = 50,
      autoApply = false
    } = body

    let targetQuestionIds: string[] = []

    if (questionIds && Array.isArray(questionIds) && questionIds.length > 0) {
      // Evaluate specific questions
      targetQuestionIds = questionIds
    } else {
      // Build query to find questions to evaluate
      let query = supabase
        .from('questions')
        .select('id')
        .eq('status', 'approved')

      if (questionType) {
        query = query.eq('question_type', questionType)
      }

      if (currentDifficulty) {
        query = query.eq('difficulty', currentDifficulty)
      }

      query = query.limit(limit)

      const { data: questions, error: queryError } = await query

      if (queryError) {
        throw queryError
      }

      targetQuestionIds = questions?.map(q => q.id) || []
    }

    if (targetQuestionIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No questions to evaluate',
        questionsToProcess: 0
      })
    }

    const requestId = Date.now().toString(36)

    // Schedule background processing
    after(async () => {
      await processDifficultyEvaluationBatch(targetQuestionIds, requestId, autoApply)
    })

    return NextResponse.json({
      success: true,
      requestId,
      questionsToProcess: targetQuestionIds.length,
      autoApply,
      message: `Difficulty evaluation started for ${targetQuestionIds.length} questions`
    })
  } catch (error) {
    console.error('Difficulty evaluation error:', error)
    return NextResponse.json({
      error: (error as Error).message || 'Failed to start evaluation'
    }, { status: 500 })
  }
}

// GET: Get evaluation statistics
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

    // Get difficulty distribution by question type
    const { data: distribution } = await supabase
      .from('questions')
      .select('question_type, difficulty')
      .eq('status', 'approved')

    const stats = {
      sba: { Easy: 0, Medium: 0, Hard: 0 },
      emq: { Easy: 0, Medium: 0, Hard: 0 },
      calculation: { Easy: 0, Medium: 0, Hard: 0 }
    }

    distribution?.forEach(q => {
      const type = q.question_type as keyof typeof stats
      const diff = q.difficulty as 'Easy' | 'Medium' | 'Hard'
      if (stats[type] && stats[type][diff] !== undefined) {
        stats[type][diff]++
      }
    })

    // Get recent evaluation jobs
    const { data: recentJobs } = await supabase
      .from('generation_jobs')
      .select('id, status, metadata, created_at')
      .eq('metadata->>type', 'difficulty_reevaluation')
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      distribution: stats,
      total: distribution?.length || 0,
      recentJobs: recentJobs || []
    })
  } catch (error) {
    console.error('Get difficulty stats error:', error)
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}
