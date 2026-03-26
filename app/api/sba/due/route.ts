import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

// GET - Fetch SBA questions due for review
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const includeDetails = searchParams.get('details') === 'true'

    // Get all questions due for review (due_date <= today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // First, get the count of due questions
    const { count: dueCount, error: countError } = await supabase
      .from('user_question_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .lte('due_date', today.toISOString())

    if (countError) {
      console.error('Error counting due questions:', countError)
    }

    if (!includeDetails) {
      // Just return the count
      return NextResponse.json({
        dueCount: dueCount || 0
      })
    }

    // Get due SBA questions with full details
    const { data: dueProgress, error: progressError } = await supabase
      .from('user_question_progress')
      .select(`
        id,
        question_id,
        ease_factor,
        interval_days,
        repetitions,
        due_date,
        times_correct,
        times_incorrect,
        sba_questions (
          id,
          category_id,
          difficulty,
          question_text,
          options,
          correct_answer,
          explanation,
          key_points,
          clinical_pearl,
          exam_tip,
          sba_categories (name, slug)
        )
      `)
      .eq('user_id', user.id)
      .lte('due_date', today.toISOString())
      .order('due_date', { ascending: true })
      .limit(limit)

    if (progressError) {
      console.error('Error fetching due questions:', progressError)
      return NextResponse.json({ error: 'Failed to fetch due questions' }, { status: 500 })
    }

    // Transform the data
    const dueQuestions = (dueProgress || [])
      .filter(p => p.sba_questions) // Filter out any null questions
      .map(p => ({
        ...p.sba_questions,
        progress: {
          ease_factor: p.ease_factor,
          interval_days: p.interval_days,
          repetitions: p.repetitions,
          due_date: p.due_date,
          times_correct: p.times_correct,
          times_incorrect: p.times_incorrect
        }
      }))

    return NextResponse.json({
      dueCount: dueCount || 0,
      questions: dueQuestions
    })
  } catch (error) {
    console.error('Due SBA questions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
