import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 })
    }

    // Check if user is in admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (adminError || !adminUser) {
      return NextResponse.json({ isAdmin: false })
    }

    return NextResponse.json({
      isAdmin: true,
      role: adminUser.role
    })
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}
