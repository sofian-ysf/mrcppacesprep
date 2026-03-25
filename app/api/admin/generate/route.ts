import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { buildGenerationContext } from '@/app/lib/rag'
import {
  generateSBABatch,
  generateCalculationBatch,
  generateEMQBatch,
  GeneratedSBAQuestion,
  GeneratedCalculationQuestion,
  GeneratedEMQQuestion
} from '@/app/lib/openai'

// Helper to convert generated question to DB format
function formatQuestionForDB(
  q: GeneratedSBAQuestion | GeneratedCalculationQuestion | GeneratedEMQQuestion,
  questionType: string,
  categoryId: string,
  difficulty: string,
  jobId: string
) {
  if (questionType === 'sba') {
    const sbaQ = q as GeneratedSBAQuestion
    return {
      category_id: categoryId,
      question_type: questionType,
      difficulty,
      question_text: sbaQ.question_text,
      options: sbaQ.options,
      correct_answer: sbaQ.correct_answer,
      explanation: sbaQ.explanation,
      source_references: sbaQ.references || [],
      status: 'draft',
      generation_job_id: jobId,
    }
  } else if (questionType === 'calculation') {
    const calcQ = q as GeneratedCalculationQuestion
    return {
      category_id: categoryId,
      question_type: questionType,
      difficulty,
      question_text: calcQ.question_text,
      options: null,
      correct_answer: calcQ.correct_answer,
      explanation: calcQ.explanation,
      source_references: calcQ.references || [],
      metadata: {
        formula: calcQ.formula,
        step_by_step: calcQ.step_by_step,
      },
      status: 'draft',
      generation_job_id: jobId,
    }
  } else {
    const emqQ = q as GeneratedEMQQuestion
    return {
      category_id: categoryId,
      question_type: questionType,
      difficulty,
      question_text: emqQ.title,
      options: emqQ.options,
      correct_answer: JSON.stringify(emqQ.scenarios),
      explanation: emqQ.explanation,
      source_references: emqQ.references || [],
      status: 'draft',
      generation_job_id: jobId,
    }
  }
}

// Background processing function with progress updates
async function processGenerationJob(
  jobId: string,
  categoryId: string,
  categoryName: string,
  questionType: 'sba' | 'emq' | 'calculation',
  difficulty: 'Easy' | 'Medium' | 'Hard',
  quantity: number
) {
  const startTime = Date.now()
  console.log(`[Job ${jobId}] ========== STARTING GENERATION ==========`)
  console.log(`[Job ${jobId}] Category: ${categoryName} (${categoryId})`)
  console.log(`[Job ${jobId}] Type: ${questionType}, Difficulty: ${difficulty}, Quantity: ${quantity}`)

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error(`[Job ${jobId}] ERROR: NEXT_PUBLIC_SUPABASE_URL is not set`)
    return
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(`[Job ${jobId}] ERROR: SUPABASE_SERVICE_ROLE_KEY is not set`)
    return
  }
  console.log(`[Job ${jobId}] Environment variables verified`)

  // Create a service client for background processing (no cookies needed)
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  console.log(`[Job ${jobId}] Supabase client created`)

  let totalGenerated = 0

  try {
    // Build context from category resources
    console.log(`[Job ${jobId}] Building context from category resources...`)
    const contextStartTime = Date.now()
    const context = await buildGenerationContext(
      supabase,
      categoryId,
      categoryName,
      questionType
    )
    console.log(`[Job ${jobId}] Context built in ${Date.now() - contextStartTime}ms, length: ${context?.length || 0} chars`)

    if (!context || context.length < 100) {
      throw new Error('Insufficient reference material. Please upload resources for this category first.')
    }

    // Determine batch size based on question type
    const BATCH_SIZE = questionType === 'emq' ? 5 : 10
    const batches = Math.ceil(quantity / BATCH_SIZE)
    console.log(`[Job ${jobId}] Will process ${batches} batches of up to ${BATCH_SIZE} questions each`)

    // Process in batches with progress updates
    for (let i = 0; i < batches; i++) {
      const batchStartTime = Date.now()
      const batchQuantity = Math.min(BATCH_SIZE, quantity - totalGenerated)
      console.log(`[Job ${jobId}] Starting batch ${i + 1}/${batches} (${batchQuantity} questions)...`)

      let batchQuestions: (GeneratedSBAQuestion | GeneratedCalculationQuestion | GeneratedEMQQuestion)[]

      try {
        if (questionType === 'sba') {
          batchQuestions = await generateSBABatch(context, categoryName, difficulty, batchQuantity, i + 1)
        } else if (questionType === 'calculation') {
          batchQuestions = await generateCalculationBatch(context, categoryName, difficulty, batchQuantity, i + 1)
        } else {
          batchQuestions = await generateEMQBatch(context, categoryName, difficulty, batchQuantity, i + 1)
        }
        console.log(`[Job ${jobId}] Batch ${i + 1} generated ${batchQuestions.length} questions in ${Date.now() - batchStartTime}ms`)
      } catch (genError) {
        console.error(`[Job ${jobId}] OpenAI generation error in batch ${i + 1}:`, genError)
        throw genError
      }

      // Insert this batch
      const questionsToInsert = batchQuestions.map(q =>
        formatQuestionForDB(q, questionType, categoryId, difficulty, jobId)
      )

      console.log(`[Job ${jobId}] Inserting ${questionsToInsert.length} questions to database...`)
      const { error: insertError } = await supabase
        .from('questions')
        .insert(questionsToInsert)

      if (insertError) {
        console.error(`[Job ${jobId}] Database insert error:`, JSON.stringify(insertError))
        throw insertError
      }
      console.log(`[Job ${jobId}] Batch ${i + 1} inserted successfully`)

      totalGenerated += batchQuestions.length

      // Update progress after each batch
      const { error: updateError } = await supabase
        .from('generation_jobs')
        .update({
          questions_generated: totalGenerated,
        })
        .eq('id', jobId)

      if (updateError) {
        console.error(`[Job ${jobId}] Progress update error:`, JSON.stringify(updateError))
      }

      console.log(`[Job ${jobId}] Progress: ${totalGenerated}/${quantity} (${Math.round(totalGenerated/quantity*100)}%)`)

      // Small delay between batches to avoid rate limiting
      if (i < batches - 1) {
        console.log(`[Job ${jobId}] Waiting 1s before next batch...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Update job as completed
    const { error: completeError } = await supabase
      .from('generation_jobs')
      .update({
        status: 'completed',
        questions_generated: totalGenerated,
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId)

    if (completeError) {
      console.error(`[Job ${jobId}] Completion update error:`, JSON.stringify(completeError))
    }

    const totalTime = Math.round((Date.now() - startTime) / 1000)
    console.log(`[Job ${jobId}] ========== COMPLETED ==========`)
    console.log(`[Job ${jobId}] Generated ${totalGenerated} questions in ${totalTime}s`)
    console.log(`[Job ${jobId}] Average: ${(totalTime / totalGenerated).toFixed(1)}s per question`)
  } catch (error) {
    const totalTime = Math.round((Date.now() - startTime) / 1000)
    console.error(`[Job ${jobId}] ========== FAILED ==========`)
    console.error(`[Job ${jobId}] Error after ${totalTime}s:`, error)
    console.error(`[Job ${jobId}] Error message:`, (error as Error).message)
    console.error(`[Job ${jobId}] Error stack:`, (error as Error).stack)
    console.error(`[Job ${jobId}] Questions generated before failure: ${totalGenerated}`)

    // Update job as failed
    const { error: failError } = await supabase
      .from('generation_jobs')
      .update({
        status: 'failed',
        questions_generated: totalGenerated,
        error_message: (error as Error).message,
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId)

    if (failError) {
      console.error(`[Job ${jobId}] Failed to update job status:`, JSON.stringify(failError))
    }
  }
}

export async function POST(request: NextRequest) {
  console.log('[Generate API] POST request received')

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('[Generate API] Unauthorized - no user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log(`[Generate API] User authenticated: ${user.id}`)

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      console.log(`[Generate API] User ${user.id} is not an admin`)
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }
    console.log(`[Generate API] Admin verified: ${adminUser.role}`)

    const { categoryId, questionType, difficulty, quantity } = await request.json()
    console.log(`[Generate API] Request: category=${categoryId}, type=${questionType}, difficulty=${difficulty}, quantity=${quantity}`)

    if (!categoryId || !questionType || !difficulty || !quantity) {
      console.log('[Generate API] Missing required fields')
      return NextResponse.json({
        error: 'categoryId, questionType, difficulty, and quantity are required'
      }, { status: 400 })
    }

    // Validate inputs
    if (!['sba', 'emq', 'calculation'].includes(questionType)) {
      console.log(`[Generate API] Invalid question type: ${questionType}`)
      return NextResponse.json({ error: 'Invalid question type' }, { status: 400 })
    }
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      console.log(`[Generate API] Invalid difficulty: ${difficulty}`)
      return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 })
    }
    if (quantity < 1 || quantity > 50) {
      console.log(`[Generate API] Invalid quantity: ${quantity}`)
      return NextResponse.json({ error: 'Quantity must be 1-50' }, { status: 400 })
    }

    // Get category info
    const { data: category, error: categoryError } = await supabase
      .from('question_categories')
      .select('*')
      .eq('id', categoryId)
      .single()

    if (categoryError || !category) {
      console.log(`[Generate API] Category not found: ${categoryId}`)
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    console.log(`[Generate API] Category found: ${category.name}`)

    // Create generation job
    console.log('[Generate API] Creating generation job...')
    const { data: job, error: jobError } = await supabase
      .from('generation_jobs')
      .insert({
        category_id: categoryId,
        question_type: questionType,
        difficulty,
        quantity,
        status: 'processing',
        started_at: new Date().toISOString(),
        created_by: user.id,
      })
      .select()
      .single()

    if (jobError) {
      console.error('[Generate API] Job creation error:', JSON.stringify(jobError))
      throw jobError
    }
    console.log(`[Generate API] Job created: ${job.id}`)

    // Schedule background processing using after()
    console.log(`[Generate API] Scheduling background processing for job ${job.id}`)
    after(async () => {
      console.log(`[Generate API] after() callback started for job ${job.id}`)
      await processGenerationJob(
        job.id,
        categoryId,
        category.name,
        questionType,
        difficulty,
        quantity
      )
    })

    // Return immediately with job ID
    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: 'processing',
      message: 'Generation started. Poll for status updates.',
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({
      error: (error as Error).message || 'Failed to start generation'
    }, { status: 500 })
  }
}

// Get generation jobs or single job status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    // If jobId is provided, return single job status (for polling)
    if (jobId) {
      const { data: job, error } = await supabase
        .from('generation_jobs')
        .select(`
          *,
          question_categories (name)
        `)
        .eq('id', jobId)
        .single()

      if (error || !job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }

      return NextResponse.json({ job })
    }

    // Otherwise return all recent jobs
    const { data: jobs, error } = await supabase
      .from('generation_jobs')
      .select(`
        *,
        question_categories (name)
      `)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      throw error
    }

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}
