import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

interface TrialInfo {
  questionsUsed: number
  questionsRemaining: number
  daysRemaining: number
  expiresAt: string
  isExpired: boolean
  isExhausted: boolean
  status: string
}

interface CheckAccessResponse {
  hasAccess: boolean
  accessType: 'trial' | 'subscription' | 'none'
  subscription?: {
    status: string
    customerId: string
  }
  trial?: TrialInfo
  error?: string
}

export async function GET(request: NextRequest): Promise<NextResponse<CheckAccessResponse>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { hasAccess: false, accessType: 'none', error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has active subscription first
    const { data: subscription, error: dbError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (dbError && dbError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Database error:', dbError)
      return NextResponse.json(
        { hasAccess: false, accessType: 'none', error: 'Database error' },
        { status: 500 }
      )
    }

    // If user has active subscription, return subscription access
    if (subscription && subscription.status === 'active') {
      return NextResponse.json({
        hasAccess: true,
        accessType: 'subscription',
        subscription: {
          status: subscription.stripe_subscription_status,
          customerId: subscription.stripe_customer_id,
        }
      })
    }

    // No subscription - check for active trial
    const { data: trialData, error: trialError } = await supabase
      .rpc('check_and_update_trial_status', { p_user_id: user.id })

    if (trialError) {
      console.error('Trial check error:', trialError)
      // If RPC fails (e.g., function doesn't exist yet), return no access
      return NextResponse.json({ hasAccess: false, accessType: 'none' })
    }

    // trialData is an array with one row from the RPC function
    const trial = trialData && trialData[0]

    if (!trial || trial.status === 'none') {
      // No trial record exists - this shouldn't happen for new users
      // but could for users created before the migration
      return NextResponse.json({ hasAccess: false, accessType: 'none' })
    }

    const trialInfo: TrialInfo = {
      questionsUsed: trial.questions_used,
      questionsRemaining: trial.questions_remaining,
      daysRemaining: trial.days_remaining,
      expiresAt: trial.trial_expires_at,
      isExpired: trial.status === 'expired',
      isExhausted: trial.status === 'exhausted',
      status: trial.status
    }

    // Check if trial is active
    if (trial.has_active_trial && trial.questions_remaining > 0) {
      return NextResponse.json({
        hasAccess: true,
        accessType: 'trial',
        trial: trialInfo
      })
    }

    // Trial is not active (expired, exhausted, or converted)
    return NextResponse.json({
      hasAccess: false,
      accessType: 'none',
      trial: trialInfo
    })
  } catch (error) {
    console.error('Check access error:', error)
    return NextResponse.json(
      { hasAccess: false, accessType: 'none', error: 'Internal server error' },
      { status: 500 }
    )
  }
}
