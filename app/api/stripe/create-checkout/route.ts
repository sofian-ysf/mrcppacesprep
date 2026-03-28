import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { stripe, PLANS, PlanType } from '@/app/lib/stripe'

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

    // Get plan type and gclid from request body
    const body = await request.json().catch(() => ({}))
    const planType = body.planType as PlanType
    const gclid = body.gclid as string | undefined

    // Validate plan type
    if (!planType || !PLANS[planType]) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be one of: 2month, 6month, 12month' },
        { status: 400 }
      )
    }

    const selectedPlan = PLANS[planType]

    if (!selectedPlan.stripe_price_id) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured for this plan' },
        { status: 500 }
      )
    }

    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://www.mrcppacesprep.com'
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session for ONE-TIME payment
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // One-time payment, not subscription
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPlan.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?cancelled=true`,
      customer_email: user.email,
      metadata: {
        site: 'mrcppacesprep', // Site identifier to filter webhooks
        user_id: user.id,
        user_email: user.email || '',
        plan_type: planType,
        plan_name: selectedPlan.name,
        plan_price: selectedPlan.price.toString(),
        duration_months: selectedPlan.duration_months.toString(),
        ...(gclid && { gclid }), // Include gclid for offline conversion tracking
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
