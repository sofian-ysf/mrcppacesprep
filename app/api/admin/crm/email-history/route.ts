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
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get email history for the user (use admin client to bypass RLS)
    const { data: emails, error } = await getSupabaseAdmin()
      .from('crm_email_history')
      .select('id, email_type, subject, sent_at, metadata')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })

    if (error) {
      console.error('Error fetching email history:', error)
      return NextResponse.json({ error: 'Failed to fetch email history' }, { status: 500 })
    }

    return NextResponse.json({ emails: emails || [] })
  } catch (error) {
    console.error('Email history error:', error)
    return NextResponse.json({ error: 'Failed to fetch email history' }, { status: 500 })
  }
}
