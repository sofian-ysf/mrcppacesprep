import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

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

    const searchParams = request.nextUrl.searchParams
    const group = searchParams.get('group') || 'active_trial'
    const search = searchParams.get('search') || ''

    // Select the appropriate view based on group
    const viewName = group === 'active_trial' ? 'crm_active_trial_users' : 'crm_expired_trial_users'

    // Build query
    let query = supabase
      .from(viewName)
      .select('*')

    // Apply search filter if provided
    if (search) {
      query = query.ilike('email', `%${search}%`)
    }

    // Order by signup date
    query = query.order('signup_date', { ascending: false })

    const { data: users, error } = await query

    if (error) {
      console.error('Error fetching CRM users for export:', error)
      return NextResponse.json({ error: 'Failed to fetch users for export' }, { status: 500 })
    }

    // Generate CSV content
    const headers = group === 'active_trial'
      ? ['Email', 'Signup Date', 'Trial Started', 'Trial Expires', 'Questions Used', 'Questions Limit', 'Days Remaining']
      : ['Email', 'Signup Date', 'Trial Started', 'Trial Expired', 'Trial Status', 'Questions Used', 'Questions Limit', 'Days Since Expiry']

    const rows = users?.map(user => {
      if (group === 'active_trial') {
        return [
          user.email,
          new Date(user.signup_date).toLocaleDateString(),
          new Date(user.trial_started_at).toLocaleDateString(),
          new Date(user.trial_expires_at).toLocaleDateString(),
          user.questions_used,
          user.questions_limit,
          user.days_remaining
        ]
      } else {
        return [
          user.email,
          new Date(user.signup_date).toLocaleDateString(),
          new Date(user.trial_started_at).toLocaleDateString(),
          new Date(user.trial_expires_at).toLocaleDateString(),
          user.trial_status,
          user.questions_used,
          user.questions_limit,
          user.days_since_expiry
        ]
      }
    }) || []

    // Build CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Return as downloadable CSV
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="crm-${group}-users-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('CRM Export error:', error)
    return NextResponse.json({ error: 'Failed to export CRM users' }, { status: 500 })
  }
}
