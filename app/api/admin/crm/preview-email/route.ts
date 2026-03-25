import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { getTrialReminderEmail } from '@/app/lib/email/templates/trial-reminder'
import { getTrialExpiringEmail } from '@/app/lib/email/templates/trial-expiring'
import { getWinBackEmail } from '@/app/lib/email/templates/win-back'

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
    const emailType = searchParams.get('type') || 'trial_reminder'

    // Generate preview with sample email and name
    const sampleEmail = 'user@example.com'
    const sampleFirstName = 'Sarah'
    let html: string
    let subject: string

    switch (emailType) {
      case 'trial_reminder':
        html = getTrialReminderEmail(sampleEmail, sampleFirstName)
        subject = 'Keep the Momentum Going'
        break
      case 'trial_expiring':
        html = getTrialExpiringEmail(sampleEmail, 2, sampleFirstName)
        subject = 'Your Trial is Expiring Soon'
        break
      case 'win_back':
        html = getWinBackEmail(sampleEmail, sampleFirstName)
        subject = 'Ready to Get Back on Track?'
        break
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    return NextResponse.json({ html, subject })
  } catch (error) {
    console.error('Email preview error:', error)
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 })
  }
}
