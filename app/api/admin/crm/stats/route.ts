import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET() {
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

    // Get active subscribers count using the view
    const { count: activeSubscribersCount } = await supabase
      .from('crm_active_subscribers')
      .select('*', { count: 'exact', head: true })

    // Get active trial count using the view
    const { count: activeTrialCount } = await supabase
      .from('crm_active_trial_users')
      .select('*', { count: 'exact', head: true })

    // Get expired trial count using the view
    const { count: expiredTrialCount } = await supabase
      .from('crm_expired_trial_users')
      .select('*', { count: 'exact', head: true })

    // Get no trial (new signups without trial) count
    const { count: noTrialCount } = await supabase
      .from('crm_no_trial_users')
      .select('*', { count: 'exact', head: true })

    // Get emails sent today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: emailsSentToday } = await supabase
      .from('crm_email_history')
      .select('*', { count: 'exact', head: true })
      .gte('sent_at', today.toISOString())

    // Get emails sent this week
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const { count: emailsSentThisWeek } = await supabase
      .from('crm_email_history')
      .select('*', { count: 'exact', head: true })
      .gte('sent_at', weekStart.toISOString())

    // Get recent email activity
    const { data: recentEmails } = await supabase
      .from('crm_email_history')
      .select('id, email_type, subject, sent_at, user_id')
      .order('sent_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      activeSubscribersCount: activeSubscribersCount || 0,
      activeTrialCount: activeTrialCount || 0,
      expiredTrialCount: expiredTrialCount || 0,
      noTrialCount: noTrialCount || 0,
      totalNurtureUsers: (activeTrialCount || 0) + (expiredTrialCount || 0) + (noTrialCount || 0),
      emailsSentToday: emailsSentToday || 0,
      emailsSentThisWeek: emailsSentThisWeek || 0,
      recentEmails: recentEmails || []
    })
  } catch (error) {
    console.error('CRM Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch CRM stats' }, { status: 500 })
  }
}
