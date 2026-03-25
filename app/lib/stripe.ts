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
export type PlanType = '3month' | '6month' | 'lifetime'

// Plan configurations - One-time payments
export const PLANS = {
  '3month': {
    name: '2 Months Access',
    price: 25,
    duration_months: 2,
    stripe_price_id: process.env.STRIPE_3MONTH_PRICE_ID || '',
    features: [
      '2,000+ practice questions',
      'Unlimited mock exams',
      'Calculations practice',
      'Detailed explanations',
      'Progress tracking',
      'Mobile access',
    ],
  },
  '6month': {
    name: '6 Months Access',
    price: 40,
    duration_months: 6,
    stripe_price_id: process.env.STRIPE_6MONTH_PRICE_ID || '',
    features: [
      '2,000+ practice questions',
      'Unlimited mock exams',
      'Calculations practice',
      'Detailed explanations',
      'Progress tracking',
      'Mobile access',
    ],
  },
  'lifetime': {
    name: 'Lifetime Access',
    price: 70,
    duration_months: null, // null = forever
    stripe_price_id: process.env.STRIPE_LIFETIME_PRICE_ID || '',
    features: [
      '2,000+ practice questions',
      'Unlimited mock exams',
      'Calculations practice',
      'Detailed explanations',
      'Progress tracking',
      'Mobile access',
      'Access forever',
    ],
  },
} as const

// Helper to get plan by type
export function getPlan(planType: PlanType) {
  return PLANS[planType]
}

// Calculate access expiry date based on plan
export function calculateAccessExpiry(planType: PlanType): Date | null {
  const plan = PLANS[planType]
  if (plan.duration_months === null) {
    return null // Lifetime = no expiry
  }
  const expiry = new Date()
  expiry.setMonth(expiry.getMonth() + plan.duration_months)
  return expiry
}

// Legacy exports for backward compatibility
export const SUBSCRIPTION = PLANS['6month']
export const ANNUAL_SUBSCRIPTION = PLANS['lifetime']
export type PackageType = PlanType | 'monthly' | 'annual' | 'standard' | 'premium' | 'ultimate'
