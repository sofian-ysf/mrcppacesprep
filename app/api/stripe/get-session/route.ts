import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/app/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      )
    }

    // Fetch the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Only return the data needed for conversion tracking
    // Email is needed for Enhanced Conversions (Google hashes it client-side)
    // GCLID is needed for direct click attribution
    return NextResponse.json({
      // amount_total is in smallest currency unit (pence for GBP)
      amount: session.amount_total ? session.amount_total / 100 : null,
      currency: session.currency?.toUpperCase() || 'GBP',
      payment_status: session.payment_status,
      session_id: session.id,
      customer_email: session.customer_details?.email || null,
      gclid: session.metadata?.gclid || null,
    })
  } catch (error) {
    console.error('Error fetching Stripe session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}
