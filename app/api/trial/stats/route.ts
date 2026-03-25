import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get trial stats using RPC
    const { data: stats, error } = await supabase
      .rpc('get_trial_stats', { p_user_id: user.id })

    if (error) {
      console.error('Error fetching trial stats:', error)
      return NextResponse.json({ stats: null })
    }

    // The RPC returns an array with one row
    const statsData = stats && stats.length > 0 ? stats[0] : null

    return NextResponse.json({ stats: statsData })
  } catch (error) {
    console.error('Get trial stats error:', error)
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}
