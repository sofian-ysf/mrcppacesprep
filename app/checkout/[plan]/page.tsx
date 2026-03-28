'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import { getStoredGclid } from '@/app/components/GclidCapture'

const validPlans = ['2month', '6month', '12month'] as const
type PlanType = typeof validPlans[number]

const planNames: Record<PlanType, string> = {
  '2month': 'Standard (2 Months)',
  '6month': 'Plus (6 Months)',
  '12month': 'Complete (12 Months)',
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const plan = params.plan as string

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return

    // If not logged in, redirect to signup with the plan
    if (!user) {
      router.push(`/signup?plan=${plan}`)
      return
    }

    // Validate plan type
    if (!validPlans.includes(plan as PlanType)) {
      setError('Invalid plan selected')
      return
    }

    // Automatically trigger checkout
    const initiateCheckout = async () => {
      setIsRedirecting(true)

      try {
        const gclid = getStoredGclid()
        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planType: plan, gclid }),
        })

        const data = await response.json()

        if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error(data.error || 'Failed to create checkout session')
        }
      } catch (err: any) {
        console.error('Checkout error:', err)
        setError(err.message || 'Failed to initiate checkout. Please try again.')
        setIsRedirecting(false)
      }
    }

    initiateCheckout()
  }, [user, authLoading, plan, router])

  // Show loading state
  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-3 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isRedirecting ? 'Redirecting to checkout...' : 'Loading...'}
          </h2>
          {plan && validPlans.includes(plan as PlanType) && (
            <p className="text-gray-600">
              Setting up your {planNames[plan as PlanType]} plan
            </p>
          )}
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4] px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="pill-btn pill-btn-primary"
            >
              Back to Pricing
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="pill-btn pill-btn-secondary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
