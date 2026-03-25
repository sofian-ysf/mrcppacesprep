import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export interface UserSettings {
  user_id: string
  exam_date: string | null
  daily_question_goal: number
  daily_flashcard_goal: number
  weekly_mock_exam_goal: number
  created_at: string
  updated_at: string
}

// GET - Fetch user settings
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    // Return default settings if none exist
    if (!settings) {
      return NextResponse.json({
        settings: {
          user_id: user.id,
          exam_date: null,
          daily_question_goal: 20,
          daily_flashcard_goal: 50,
          weekly_mock_exam_goal: 2
        }
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create or update user settings
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { exam_date, daily_question_goal, daily_flashcard_goal, weekly_mock_exam_goal } = body

    // Upsert settings
    const { data: settings, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        exam_date: exam_date || null,
        daily_question_goal: daily_question_goal ?? 20,
        daily_flashcard_goal: daily_flashcard_goal ?? 50,
        weekly_mock_exam_goal: weekly_mock_exam_goal ?? 2,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving settings:', error)
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Partial update of settings
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    // Check if settings exist
    const { data: existing } = await supabase
      .from('user_settings')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    let result
    if (existing) {
      // Update existing settings
      result = await supabase
        .from('user_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single()
    } else {
      // Create new settings with defaults + updates
      result = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          exam_date: null,
          daily_question_goal: 20,
          daily_flashcard_goal: 50,
          weekly_mock_exam_goal: 2,
          ...updates
        })
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error updating settings:', result.error)
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }

    return NextResponse.json({ success: true, settings: result.data })
  } catch (error) {
    console.error('Settings PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
