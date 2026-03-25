import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's trial achievements
    const { data: achievements, error } = await supabase
      .rpc('get_trial_achievements', { p_user_id: user.id })

    if (error) {
      console.error('Error fetching achievements:', error)
      return NextResponse.json({ achievements: [] })
    }

    return NextResponse.json({ achievements: achievements || [] })
  } catch (error) {
    console.error('Get achievements error:', error)
    return NextResponse.json({ error: 'Failed to get achievements' }, { status: 500 })
  }
}
