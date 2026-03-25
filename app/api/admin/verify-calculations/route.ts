import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface VerificationResult {
  isCorrect: boolean
  aiAnswer: string
  aiExplanation: string
  discrepancyNotes: string | null
  confidenceScore: number
}

async function verifyCalculation(
  questionText: string,
  options: { letter: string; text: string }[] | null,
  correctAnswer: string,
  explanation: string
): Promise<VerificationResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const optionsText = options
    ? options.map(o => `${o.letter}. ${o.text}`).join('\n')
    : 'No options provided (free-text answer expected)'

  const prompt = `You are a pharmaceutical calculations expert verifying exam questions.

QUESTION:
${questionText}

OPTIONS:
${optionsText}

STORED CORRECT ANSWER: ${correctAnswer}

STORED EXPLANATION:
${explanation}

YOUR TASK:
1. Work through this calculation step-by-step
2. Determine the correct answer
3. Compare your answer to the stored correct answer
4. Check if the explanation is accurate and complete

Respond in this exact JSON format:
{
  "isCorrect": true/false,
  "myAnswer": "Your calculated answer (e.g., 'B' for MCQ or the numerical value)",
  "workingOut": "Your step-by-step calculation showing all working",
  "discrepancies": "If incorrect, explain what's wrong. If correct, set to null",
  "confidenceScore": 0.0-1.0
}

Be strict - if there are ANY errors in the answer OR the explanation (wrong formula, incorrect rounding, missing units, mathematical errors), mark as incorrect.`

  const result = await model.generateContent(prompt)
  const response = result.response.text()

  // Parse the JSON response
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Failed to parse Gemini response as JSON')
  }

  const parsed = JSON.parse(jsonMatch[0])

  return {
    isCorrect: parsed.isCorrect,
    aiAnswer: parsed.myAnswer,
    aiExplanation: parsed.workingOut,
    discrepancyNotes: parsed.discrepancies,
    confidenceScore: parsed.confidenceScore
  }
}

// GET - Fetch calculation questions with verification status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || 'all' // all, pending, verified, needs_review, not_verified
    const offset = (page - 1) * limit

    // Get calculation questions with their verification status
    let query = supabase
      .from('questions')
      .select(`
        id,
        question_text,
        options,
        correct_answer,
        explanation,
        difficulty,
        status,
        question_categories (name),
        question_verifications (
          id,
          is_correct,
          ai_answer,
          discrepancy_notes,
          confidence_score,
          status,
          verified_at
        )
      `, { count: 'exact' })
      .eq('question_type', 'calculation')
      .eq('status', 'approved')

    // Filter by verification status
    if (status === 'not_verified') {
      query = query.is('question_verifications', null)
    } else if (status === 'needs_review') {
      query = query.not('question_verifications', 'is', null)
        .eq('question_verifications.is_correct', false)
    } else if (status === 'verified') {
      query = query.not('question_verifications', 'is', null)
        .eq('question_verifications.is_correct', true)
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: questions, count, error } = await query

    if (error) {
      console.error('Error fetching questions:', error)
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }

    // Get summary stats
    const { count: totalCalc } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('question_type', 'calculation')
      .eq('status', 'approved')

    const { count: verifiedCount } = await supabase
      .from('question_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_correct', true)

    const { count: needsReviewCount } = await supabase
      .from('question_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_correct', false)

    return NextResponse.json({
      questions: questions || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      stats: {
        totalCalculations: totalCalc || 0,
        verified: verifiedCount || 0,
        needsReview: needsReviewCount || 0,
        notVerified: (totalCalc || 0) - (verifiedCount || 0) - (needsReviewCount || 0)
      }
    })
  } catch (error) {
    console.error('Verify calculations GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

// POST - Verify a question or batch of questions
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const { questionIds } = await request.json()

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: 'No question IDs provided' }, { status: 400 })
    }

    // Limit batch size
    if (questionIds.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 questions per batch' }, { status: 400 })
    }

    // Fetch questions
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('id, question_text, options, correct_answer, explanation')
      .in('id', questionIds)

    if (fetchError || !questions) {
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }

    const results = []

    for (const question of questions) {
      try {
        const verification = await verifyCalculation(
          question.question_text,
          question.options,
          question.correct_answer,
          question.explanation
        )

        // Upsert verification result
        const { error: upsertError } = await supabase
          .from('question_verifications')
          .upsert({
            question_id: question.id,
            verified_by: user.id,
            verified_at: new Date().toISOString(),
            is_correct: verification.isCorrect,
            ai_answer: verification.aiAnswer,
            ai_explanation: verification.aiExplanation,
            discrepancy_notes: verification.discrepancyNotes,
            confidence_score: verification.confidenceScore,
            model_used: 'gemini-2.0-flash-exp',
            status: verification.isCorrect ? 'verified' : 'needs_review'
          }, {
            onConflict: 'question_id'
          })

        if (upsertError) {
          console.error('Error saving verification:', upsertError)
        }

        results.push({
          questionId: question.id,
          success: true,
          isCorrect: verification.isCorrect,
          aiAnswer: verification.aiAnswer,
          discrepancyNotes: verification.discrepancyNotes
        })

        // Rate limit: wait between API calls
        if (questions.indexOf(question) < questions.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      } catch (err) {
        console.error(`Error verifying question ${question.id}:`, err)
        results.push({
          questionId: question.id,
          success: false,
          error: String(err)
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      verified: results.filter(r => r.success && r.isCorrect).length,
      needsReview: results.filter(r => r.success && !r.isCorrect).length,
      failed: results.filter(r => !r.success).length
    })
  } catch (error) {
    console.error('Verify calculations POST error:', error)
    return NextResponse.json({ error: 'Failed to verify questions' }, { status: 500 })
  }
}

// PATCH - Mark a question as reviewed/fixed
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const { questionId, status } = await request.json()

    if (!questionId || !status) {
      return NextResponse.json({ error: 'Question ID and status required' }, { status: 400 })
    }

    if (!['verified', 'needs_review', 'fixed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from('question_verifications')
      .update({
        status,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('question_id', questionId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify calculations PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
