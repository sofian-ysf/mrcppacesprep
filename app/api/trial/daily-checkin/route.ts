import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get trial info for daily goal
    const { data: trial } = await supabase
      .from('user_trials')
      .select('daily_goal')
      .eq('user_id', user.id)
      .single()

    const dailyGoal = trial?.daily_goal || 15

    // Get today's activity
    const today = new Date().toISOString().split('T')[0]
    const { data: todayActivity } = await supabase
      .from('trial_daily_activity')
      .select('questions_answered, questions_correct')
      .eq('user_id', user.id)
      .eq('activity_date', today)
      .single()

    // Get yesterday's activity
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const { data: yesterdayActivity } = await supabase
      .from('trial_daily_activity')
      .select('questions_answered, questions_correct, categories_tried')
      .eq('user_id', user.id)
      .eq('activity_date', yesterdayStr)
      .single()

    // Get current streak
    const { data: streakData } = await supabase
      .rpc('get_trial_streak', { p_user_id: user.id })

    // Determine improving category (simple heuristic)
    let improvingCategory = null
    if (yesterdayActivity?.categories_tried && yesterdayActivity.categories_tried.length > 0) {
      // Just pick the first category they tried yesterday
      improvingCategory = yesterdayActivity.categories_tried[0]
        ?.split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    return NextResponse.json({
      yesterday_questions: yesterdayActivity?.questions_answered || 0,
      today_questions: todayActivity?.questions_answered || 0,
      daily_goal: dailyGoal,
      current_streak: streakData || 0,
      accuracy_trend: null, // Could calculate based on rolling average
      improving_category: improvingCategory
    })
  } catch (error) {
    console.error('Get daily checkin error:', error)
    return NextResponse.json({ error: 'Failed to get checkin data' }, { status: 500 })
  }
}
