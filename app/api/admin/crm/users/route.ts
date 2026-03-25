import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const emailFilter = searchParams.get('emailFilter') || 'all' // 'all', 'not_emailed', 'emailed'
    const allIds = searchParams.get('allIds') === 'true' // Return all user IDs
    const offset = (page - 1) * limit

    // Select the appropriate view based on group
    let viewName: string
    switch (group) {
      case 'active_trial':
        viewName = 'crm_active_trial_users'
        break
      case 'expired_trial':
        viewName = 'crm_expired_trial_users'
        break
      case 'no_trial':
        viewName = 'crm_no_trial_users'
        break
      case 'active_subscribers':
        viewName = 'crm_active_subscribers'
        break
      default:
        viewName = 'crm_active_trial_users'
    }

    // If requesting all IDs, just return IDs
    if (allIds) {
      let query = supabase
        .from(viewName)
        .select('id')

      if (search) {
        query = query.ilike('email', `%${search}%`)
      }

      const { data: allUsers, error } = await query

      if (error) {
        console.error('Error fetching all user IDs:', error)
        return NextResponse.json({ error: 'Failed to fetch user IDs' }, { status: 500 })
      }

      // Get email stats to filter
      const userIds = (allUsers || []).map(u => u.id)
      let filteredIds = userIds

      if (emailFilter !== 'all' && userIds.length > 0) {
        const { data: emailData } = await getSupabaseAdmin()
          .from('crm_email_history')
          .select('user_id')
          .in('user_id', userIds)

        const userIdsWithEmails = new Set(emailData?.map(e => e.user_id) || [])

        if (emailFilter === 'not_emailed') {
          filteredIds = userIds.filter(id => !userIdsWithEmails.has(id))
        } else if (emailFilter === 'emailed') {
          filteredIds = userIds.filter(id => userIdsWithEmails.has(id))
        }
      }

      return NextResponse.json({ allIds: filteredIds })
    }

    // Build query - fetch more if we need to filter by email status
    let query = supabase
      .from(viewName)
      .select('*', { count: 'exact' })

    // Apply search filter if provided
    if (search) {
      query = query.ilike('email', `%${search}%`)
    }

    // If filtering by email status, we need all results first, then filter and paginate
    if (emailFilter !== 'all') {
      query = query.order('signup_date', { ascending: false })
    } else {
      // Apply pagination only if not filtering by email
      query = query
        .order('signup_date', { ascending: false })
        .range(offset, offset + limit - 1)
    }

    const { data: users, count, error } = await query

    if (error) {
      console.error('Error fetching CRM users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Get email counts and last email date for each user (use admin client to bypass RLS)
    const userIds = (users || []).map(u => u.id)
    let emailStats: Record<string, { count: number; lastSent: string | null }> = {}

    if (userIds.length > 0) {
      const { data: emailData } = await getSupabaseAdmin()
        .from('crm_email_history')
        .select('user_id, sent_at')
        .in('user_id', userIds)
        .order('sent_at', { ascending: false })

      // Aggregate email stats per user
      for (const email of emailData || []) {
        if (!emailStats[email.user_id]) {
          emailStats[email.user_id] = { count: 0, lastSent: email.sent_at }
        }
        emailStats[email.user_id].count++
      }
    }

    // Merge email stats with users
    let usersWithStats = (users || []).map(user => ({
      ...user,
      emails_sent: emailStats[user.id]?.count || 0,
      last_email_at: emailStats[user.id]?.lastSent || null
    }))

    // Filter by email status if needed
    if (emailFilter === 'not_emailed') {
      usersWithStats = usersWithStats.filter(u => u.emails_sent === 0)
    } else if (emailFilter === 'emailed') {
      usersWithStats = usersWithStats.filter(u => u.emails_sent > 0)
    }

    // Calculate totals after filtering
    const filteredTotal = usersWithStats.length
    const filteredTotalPages = Math.ceil(filteredTotal / limit)

    // Apply pagination after filtering (only if we filtered)
    if (emailFilter !== 'all') {
      usersWithStats = usersWithStats.slice(offset, offset + limit)
    }

    return NextResponse.json({
      users: usersWithStats,
      total: emailFilter !== 'all' ? filteredTotal : (count || 0),
      page,
      limit,
      totalPages: emailFilter !== 'all' ? filteredTotalPages : Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('CRM Users error:', error)
    return NextResponse.json({ error: 'Failed to fetch CRM users' }, { status: 500 })
  }
}
