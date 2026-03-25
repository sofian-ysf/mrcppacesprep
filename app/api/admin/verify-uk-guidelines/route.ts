import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

interface VerificationResult {
  questionId: string
  isAccurate: boolean
  confidenceScore: number
  issues: string[]
  suggestedCorrections: string | null
  guidelinesReferenced: string[]
  lastVerified: string
}

// Verify a question against UK pharmacy guidelines
async function verifyAgainstUKGuidelines(
  questionText: string,
  options: { letter: string; text: string }[] | null,
  correctAnswer: string,
  explanation: string,
  questionType: string,
  categoryName: string
): Promise<{
  isAccurate: boolean
  confidenceScore: number
  issues: string[]
  suggestedCorrections: string | null
  guidelinesReferenced: string[]
}> {
  const optionsText = options
    ? options.map(o => `${o.letter}: ${o.text}`).join('\n')
    : 'N/A (calculation question)'

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a UK pharmacy expert with comprehensive knowledge of:
- British National Formulary (BNF) - current edition
- NICE guidelines and technology appraisals
- MRCP PACES standards and requirements
- UK Medicines and Healthcare products Regulatory Agency (MHRA) guidance
- NHS England prescribing guidelines
- UK-specific drug formulations and brand names

Your task is to verify pharmacy exam questions for accuracy against current UK guidelines (as of 2024-2025).

Be STRICT about:
1. Drug doses and frequencies matching BNF recommendations
2. Correct drug classifications per UK scheduling
3. Accurate side effects and contraindications
4. Current NICE-recommended first-line treatments
5. UK-specific brand names and formulations
6. Legal requirements for controlled drugs in the UK
7. Any changes in guidelines since 2022

Flag as INACCURATE if:
- Doses don't match current BNF
- Classifications are wrong (e.g., CD schedule)
- Outdated treatment recommendations
- Non-UK brand names used
- Legal/regulatory information is incorrect`
      },
      {
        role: 'user',
        content: `Verify this UK pharmacy exam question for accuracy:

CATEGORY: ${categoryName}
QUESTION TYPE: ${questionType}

QUESTION:
${questionText}

${options ? `OPTIONS:\n${optionsText}\n` : ''}
STATED CORRECT ANSWER: ${correctAnswer}

EXPLANATION PROVIDED:
${explanation}

Analyze this question against current UK pharmacy guidelines and return a JSON object:
{
  "isAccurate": true/false,
  "confidenceScore": 0.0-1.0,
  "issues": ["List any accuracy issues found", "Each issue as separate string"],
  "suggestedCorrections": "If inaccurate, provide the correct information. If accurate, set to null",
  "guidelinesReferenced": ["BNF", "NICE guideline X", "etc"]
}

Return ONLY the JSON object.`
      }
    ],
    temperature: 0.2, // Low temperature for factual accuracy
    max_tokens: 1500,
  })

  const content = response.choices[0]?.message?.content || '{}'

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON object found in response')
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to parse verification response:', content)
    throw new Error('Failed to parse verification response')
  }
}

// Background processing function
async function processVerificationBatch(
  questionIds: string[],
  requestId: string
) {
  console.log(`[UKVerify ${requestId}] Starting batch of ${questionIds.length} questions`)

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(`[UKVerify ${requestId}] Missing environment variables`)
    return
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  let processed = 0
  let accurate = 0
  let needsReview = 0
  let failed = 0
  const results: VerificationResult[] = []

  for (const questionId of questionIds) {
    try {
      // Fetch the question with category info
      const { data: question, error: fetchError } = await supabase
        .from('questions')
        .select(`
          id,
          question_text,
          question_type,
          options,
          correct_answer,
          explanation,
          question_categories (name)
        `)
        .eq('id', questionId)
        .single()

      if (fetchError || !question) {
        console.error(`[UKVerify ${requestId}] Question ${questionId} not found`)
        failed++
        continue
      }

      const categoryData = question.question_categories
      const categoryName = Array.isArray(categoryData)
        ? categoryData[0]?.name
        : (categoryData as { name: string } | null)?.name || 'General Pharmacy'

      console.log(`[UKVerify ${requestId}] Verifying question ${questionId}...`)

      const verification = await verifyAgainstUKGuidelines(
        question.question_text,
        question.options,
        question.correct_answer,
        question.explanation,
        question.question_type,
        categoryName
      )

      processed++

      const result: VerificationResult = {
        questionId: question.id,
        isAccurate: verification.isAccurate,
        confidenceScore: verification.confidenceScore,
        issues: verification.issues || [],
        suggestedCorrections: verification.suggestedCorrections,
        guidelinesReferenced: verification.guidelinesReferenced || [],
        lastVerified: new Date().toISOString()
      }

      results.push(result)

      if (verification.isAccurate) {
        accurate++
      } else {
        needsReview++
      }

      // Update question metadata with verification results
      const { error: updateError } = await supabase
        .from('questions')
        .update({
          updated_at: new Date().toISOString(),
          metadata: {
            ...((question as { metadata?: Record<string, unknown> }).metadata || {}),
            uk_guidelines_verified: verification.isAccurate,
            uk_verification_date: new Date().toISOString(),
            uk_verification_issues: verification.issues,
            uk_verification_corrections: verification.suggestedCorrections,
            uk_guidelines_referenced: verification.guidelinesReferenced,
            uk_verification_confidence: verification.confidenceScore
          }
        })
        .eq('id', questionId)

      if (updateError) {
        console.error(`[UKVerify ${requestId}] Failed to update question ${questionId}:`, updateError)
      }

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`[UKVerify ${requestId}] Error processing question ${questionId}:`, error)
      failed++
    }
  }

  console.log(`[UKVerify ${requestId}] Completed. Processed: ${processed}, Accurate: ${accurate}, Needs Review: ${needsReview}, Failed: ${failed}`)

  // Store results summary
  try {
    await supabase
      .from('generation_jobs')
      .insert({
        id: requestId,
        status: 'completed',
        metadata: {
          type: 'uk_guidelines_verification',
          processed,
          accurate,
          needsReview,
          failed,
          results: results.filter(r => !r.isAccurate).slice(0, 50) // Store issues only
        }
      })
  } catch (err) {
    console.error(`[UKVerify ${requestId}] Failed to store results:`, err)
  }
}

// POST: Start UK guidelines verification
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
      categoryId,
      questionType,
      limit = 25,
      unverifiedOnly = true
    } = body

    let targetQuestionIds: string[] = []

    if (questionIds && Array.isArray(questionIds) && questionIds.length > 0) {
      targetQuestionIds = questionIds
    } else {
      // Build query to find questions to verify
      let query = supabase
        .from('questions')
        .select('id, metadata')
        .eq('status', 'approved')

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      if (questionType) {
        query = query.eq('question_type', questionType)
      }

      const { data: questions, error: queryError } = await query.limit(limit * 2) // Fetch extra to filter

      if (queryError) {
        throw queryError
      }

      // Filter for unverified if requested
      if (unverifiedOnly) {
        targetQuestionIds = questions
          ?.filter(q => {
            const meta = q.metadata as Record<string, unknown> | null
            return !meta?.uk_guidelines_verified
          })
          .map(q => q.id)
          .slice(0, limit) || []
      } else {
        targetQuestionIds = questions?.map(q => q.id).slice(0, limit) || []
      }
    }

    if (targetQuestionIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No questions to verify',
        questionsToProcess: 0
      })
    }

    const requestId = Date.now().toString(36)

    // Schedule background processing
    after(async () => {
      await processVerificationBatch(targetQuestionIds, requestId)
    })

    return NextResponse.json({
      success: true,
      requestId,
      questionsToProcess: targetQuestionIds.length,
      message: `UK guidelines verification started for ${targetQuestionIds.length} questions`
    })
  } catch (error) {
    console.error('UK verification error:', error)
    return NextResponse.json({
      error: (error as Error).message || 'Failed to start verification'
    }, { status: 500 })
  }
}

// GET: Get verification statistics and issues
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
    const showIssuesOnly = searchParams.get('issuesOnly') === 'true'

    // Count verified vs unverified
    const { data: allQuestions } = await supabase
      .from('questions')
      .select('id, metadata')
      .eq('status', 'approved')

    let verified = 0
    let unverified = 0
    let withIssues = 0

    allQuestions?.forEach(q => {
      const meta = q.metadata as Record<string, unknown> | null
      if (meta?.uk_guidelines_verified === true) {
        verified++
      } else if (meta?.uk_guidelines_verified === false) {
        withIssues++
      } else {
        unverified++
      }
    })

    // Get questions with issues if requested
    let issuesList: Array<{
      id: string
      question_text: string
      issues: string[]
      corrections: string | null
    }> = []

    if (showIssuesOnly) {
      const { data: issueQuestions } = await supabase
        .from('questions')
        .select('id, question_text, metadata')
        .eq('status', 'approved')
        .limit(100)

      issuesList = issueQuestions
        ?.filter(q => {
          const meta = q.metadata as Record<string, unknown> | null
          return meta?.uk_guidelines_verified === false
        })
        .map(q => {
          const meta = q.metadata as Record<string, unknown>
          return {
            id: q.id,
            question_text: q.question_text.substring(0, 150) + '...',
            issues: (meta.uk_verification_issues as string[]) || [],
            corrections: (meta.uk_verification_corrections as string) || null
          }
        }) || []
    }

    return NextResponse.json({
      stats: {
        total: allQuestions?.length || 0,
        verified,
        unverified,
        withIssues
      },
      issuesList: showIssuesOnly ? issuesList : undefined
    })
  } catch (error) {
    console.error('Get verification stats error:', error)
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}
