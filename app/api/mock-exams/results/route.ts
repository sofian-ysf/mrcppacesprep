import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

// GET - Fetch user's mock exam history
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: results, error } = await supabase
      .from('mock_exam_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching exam results:', error)
      return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
    }

    // Calculate summary stats
    const totalExams = results?.length || 0
    const averageScore = totalExams > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score_percentage, 0) / totalExams)
      : 0
    const bestScore = totalExams > 0
      ? Math.max(...results.map(r => r.score_percentage))
      : 0
    const totalTimeSeconds = results?.reduce((sum, r) => sum + r.time_taken_seconds, 0) || 0

    return NextResponse.json({
      results,
      summary: {
        totalExams,
        averageScore,
        bestScore,
        totalTimeSeconds
      }
    })
  } catch (error) {
    console.error('Error fetching exam results:', error)
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}

// POST - Save a new mock exam result
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      exam_type,
      exam_name,
      total_questions,
      answered_questions,
      correct_answers,
      score_percentage,
      time_taken_seconds,
      time_limit_seconds
    } = body

    // Validate required fields
    if (!exam_type || !exam_name || total_questions === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('mock_exam_results')
      .insert({
        user_id: user.id,
        exam_type,
        exam_name,
        total_questions,
        answered_questions: answered_questions || 0,
        correct_answers: correct_answers || 0,
        score_percentage: score_percentage || 0,
        time_taken_seconds: time_taken_seconds || 0,
        time_limit_seconds: time_limit_seconds || 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving exam result:', error)
      return NextResponse.json({ error: 'Failed to save result' }, { status: 500 })
    }

    return NextResponse.json({ success: true, result: data })
  } catch (error) {
    console.error('Error saving exam result:', error)
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 })
  }
}
