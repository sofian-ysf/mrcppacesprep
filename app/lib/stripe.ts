import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    })
  }
  return stripeInstance
}

// For backwards compatibility - getter that lazily initializes
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe]
  }
})

// Plan types
export type PlanType = '3month' | '6month' | '12month'

// Plan configurations - One-time payments
export const PLANS: Record<PlanType, {
  name: string
  price: number
  duration_months: number
  stripe_price_id: string
  features: string[]
}> = {
  '3month': {
    name: 'Standard',
    price: 75,
    duration_months: 3,
    stripe_price_id: process.env.STRIPE_PRICE_3MONTH || '',
    features: [
      'Full access to all content',
      'Spot diagnosis flashcards',
      'PACES station practice',
      'High yield SBAs',
      'Progress tracking'
    ]
  },
  '6month': {
    name: 'Plus',
    price: 135,
    duration_months: 6,
    stripe_price_id: process.env.STRIPE_PRICE_6MONTH || '',
    features: [
      'Everything in Standard',
      '6 months access',
      'Best value for exam prep'
    ]
  },
  '12month': {
    name: 'Premium',
    price: 215,
    duration_months: 12,
    stripe_price_id: process.env.STRIPE_PRICE_12MONTH || '',
    features: [
      'Everything in Plus',
      'Full year access',
      'Retake coverage'
    ]
  }
}

// Helper to get plan by type
export function getPlan(planType: PlanType) {
  return PLANS[planType]
}

// Calculate access expiry date based on plan
export function calculateAccessExpiry(planType: PlanType): Date {
  const plan = PLANS[planType]
  const expiry = new Date()
  expiry.setMonth(expiry.getMonth() + plan.duration_months)
  return expiry
}

// Legacy exports for backward compatibility
export const SUBSCRIPTION = PLANS['6month']
export const ANNUAL_SUBSCRIPTION = PLANS['12month']
export type PackageType = PlanType | 'monthly' | 'annual' | 'standard' | 'premium' | 'ultimate'
