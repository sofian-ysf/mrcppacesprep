import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, PlanType, calculateAccessExpiry, PLANS } from '@/app/lib/stripe'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { sendSubscriptionActiveEmail } from '@/app/lib/email/resend'

// Lazy initialization of Supabase admin client
let supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }
  return supabaseAdmin
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }
      // Keep subscription handlers for any legacy subscriptions
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Filter: Only process checkouts from this site
  const site = session.metadata?.site
  if (site !== 'mrcppacesprep') {
    console.log('Ignoring checkout from another site:', site || 'no site identifier')
    return
  }

  const userId = session.metadata?.user_id
  const userEmail = session.metadata?.user_email
  const planType = session.metadata?.plan_type as PlanType
  const planPrice = session.metadata?.plan_price
  const gclid = session.metadata?.gclid

  if (!userId) {
    throw new Error('Missing user_id in checkout session metadata')
  }

  // For one-time payments, there's no subscription ID
  // Calculate access expiry based on plan type
  const accessExpiresAt = planType ? calculateAccessExpiry(planType) : null
  const plan = planType ? PLANS[planType] : null

  // Create or update subscription record for one-time payment
  const { error: dbError } = await getSupabaseAdmin()
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: session.customer as string || null,
      stripe_subscription_id: session.payment_intent as string || null, // Use payment_intent for one-time
      stripe_subscription_status: 'active',
      package_type: planType || '3month',
      amount_paid: planPrice ? parseInt(planPrice) : (plan?.price || 0),
      access_granted_at: new Date().toISOString(),
      access_expires_at: accessExpiresAt ? accessExpiresAt.toISOString() : null,
      status: 'active',
    }, {
      onConflict: 'user_id',
    })

  if (dbError) {
    console.error('Database error:', dbError)
    throw dbError
  }

  // Mark trial as converted when payment is completed
  const { error: trialError } = await getSupabaseAdmin()
    .rpc('convert_trial_to_subscription', { p_user_id: userId })

  if (trialError) {
    console.error('Failed to convert trial:', trialError)
    // Don't throw - payment was still processed successfully
  } else {
    console.log('Trial converted to paid access for user:', userId)
  }

  // Send Discord notification
  await sendDiscordNotification(userEmail || 'Unknown', planType, planPrice)

  // Send confirmation email to user
  if (userEmail) {
    try {
      await sendSubscriptionActiveEmail(userEmail)
      console.log('Purchase confirmation email sent to:', userEmail)
    } catch (emailError) {
      console.error('Failed to send purchase email:', emailError)
      // Don't throw - email failure shouldn't fail the webhook
    }
  }

  console.log('One-time payment processed:', {
    userId,
    planType,
    price: planPrice,
    expiresAt: accessExpiresAt?.toISOString() || 'never',
    gclid: gclid || 'none',
    // For offline conversion upload: use session.id as transaction_id,
    // session.amount_total/100 as value, session.currency as currency
    transactionId: session.id,
    amountTotal: session.amount_total ? session.amount_total / 100 : null,
    currency: session.currency?.toUpperCase() || 'GBP'
  })

  // TODO: Implement Google Ads offline conversion upload using gclid
  // This would call the Google Ads API to report the conversion server-side
  // See: https://developers.google.com/google-ads/api/docs/conversions/upload-clicks
  if (gclid) {
    console.log('GCLID available for offline conversion:', {
      gclid,
      conversionValue: session.amount_total ? session.amount_total / 100 : null,
      currency: session.currency?.toUpperCase() || 'GBP',
      transactionId: session.id
    })
  }
}

// Legacy subscription handlers for any existing subscriptions
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id

  if (!userId) {
    console.log('No user_id in subscription metadata, skipping update')
    return
  }

  const { error: dbError } = await getSupabaseAdmin()
    .from('user_subscriptions')
    .update({
      stripe_subscription_status: subscription.status,
      status: subscription.status === 'active' ? 'active' : 'inactive',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (dbError) {
    console.error('Database error updating subscription:', dbError)
    throw dbError
  }

  console.log('Subscription updated:', { userId, status: subscription.status })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id

  if (!userId) {
    console.log('No user_id in subscription metadata, skipping deletion')
    return
  }

  const { error: dbError } = await getSupabaseAdmin()
    .from('user_subscriptions')
    .update({
      stripe_subscription_status: 'canceled',
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (dbError) {
    console.error('Database error cancelling subscription:', dbError)
    throw dbError
  }

  console.log('Subscription cancelled:', { userId })
}

async function sendDiscordNotification(userEmail: string, planType?: string, price?: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://www.mrcppacesprep.com'
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const planName = planType === '3month' ? 'Standard (3 Months)'
      : planType === '6month' ? 'Plus (6 Months)'
      : planType === '12month' ? 'Complete (12 Months)'
      : 'Unknown'

    await fetch(`${baseUrl}/api/discord/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `💰 New purchase: ${userEmail} - ${planName} (£${price || '?'})`,
        userEmail,
        userName: userEmail.split('@')[0],
        type: 'purchase'
      }),
    })
  } catch (error) {
    console.error('Failed to send Discord notification:', error)
  }
}
