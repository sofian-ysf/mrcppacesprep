import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { exam_date, daily_goal, starting_category } = await request.json()

    // Call the RPC function to complete onboarding
    const { data, error } = await supabase.rpc('complete_trial_onboarding', {
      p_user_id: user.id,
      p_exam_date: exam_date || null,
      p_daily_goal: daily_goal || 15,
      p_starting_category: starting_category || null
    })

    if (error) {
      console.error('Error completing onboarding:', error)
      return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 })
    }

    // Unlock the first achievement for completing onboarding
    await supabase.rpc('unlock_trial_achievement', {
      p_user_id: user.id,
      p_achievement_type: 'first_question',
      p_metadata: { reason: 'Completed onboarding' }
    })

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed'
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get trial onboarding status
    const { data: trial, error: trialError } = await supabase
      .from('user_trials')
      .select('onboarding_completed, exam_date, daily_goal, starting_category_slug')
      .eq('user_id', user.id)
      .single()

    if (trialError) {
      return NextResponse.json({
        onboarding_completed: false,
        exam_date: null,
        daily_goal: 15,
        starting_category_slug: null
      })
    }

    return NextResponse.json(trial)
  } catch (error) {
    console.error('Get onboarding status error:', error)
    return NextResponse.json({ error: 'Failed to get onboarding status' }, { status: 500 })
  }
}
