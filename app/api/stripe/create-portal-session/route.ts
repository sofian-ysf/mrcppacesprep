import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { stripe } from '@/app/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's subscription to find their Stripe customer ID
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      )
    }

    // Check if this is a manual/test subscription (not a real Stripe customer)
    if (subscription.stripe_customer_id.startsWith('cus_manual') ||
        subscription.stripe_customer_id.startsWith('manual_')) {
      return NextResponse.json(
        { error: 'Your subscription was granted manually. Please contact support to manage your subscription.' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://www.preregexamprep.com'
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${baseUrl}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
