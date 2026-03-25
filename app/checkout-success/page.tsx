'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface SessionData {
  amount: number | null
  currency: string
  payment_status: string
  session_id: string
  customer_email: string | null
  gclid: string | null
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const sessionId = searchParams.get('session_id')
  const conversionFiredRef = useRef(false)

  // Google Ads conversion tracking with dynamic value
  useEffect(() => {
    if (!sessionId || conversionFiredRef.current) return

    async function fetchSessionAndTrack() {
      try {
        const response = await fetch(`/api/stripe/get-session?session_id=${sessionId}`)
        if (!response.ok) {
          console.error('Failed to fetch session data')
          return
        }

        const data: SessionData = await response.json()

        // Only fire conversion if payment was successful and we have amount
        if (data.payment_status === 'paid' && data.amount && window.gtag) {
          // Set user data for Enhanced Conversions (Google hashes the email)
          if (data.customer_email) {
            window.gtag('set', 'user_data', {
              'email': data.customer_email
            })
          }

          window.gtag('event', 'conversion', {
            'send_to': 'AW-17903779734/KTyXCOGkoewbEJb_l9lC',
            'value': data.amount,
            'currency': data.currency,
            'transaction_id': sessionId,
            ...(data.gclid && { 'gclid': data.gclid })
          })
          conversionFiredRef.current = true
          console.log('Google Ads conversion fired:', {
            value: data.amount,
            currency: data.currency,
            transaction_id: sessionId,
            email_provided: !!data.customer_email,
            gclid: data.gclid || 'none'
          })
        }
      } catch (error) {
        console.error('Error tracking conversion:', error)
      }
    }

    fetchSessionAndTrack()
  }, [sessionId])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/dashboard/question-bank'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#fbfaf4] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase! Your account has been upgraded and you now have full access to all question banks, mock exams, and study materials.
          </p>

          {/* Redirect Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Redirecting to Question Bank in <span className="font-bold">{countdown}</span> seconds...
            </p>
          </div>

          {/* Session ID (for reference) */}
          {sessionId && (
            <div className="mb-6">
              <p className="text-xs text-gray-500">
                Session ID: {sessionId.substring(0, 20)}...
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/dashboard/question-bank"
              className="block w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Start Practicing Now
            </Link>
            <Link
              href="/dashboard"
              className="block w-full rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:border-gray-400 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help getting started?{' '}
              <Link href="/help" className="text-blue-600 hover:underline">
                Visit our Help Center
              </Link>
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Access thousands of GPhC exam practice questions</span>
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Take realistic timed mock exams</span>
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Download comprehensive study guides</span>
            </li>
            <li className="flex items-start">
              <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Track your progress and identify weak areas</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#fbfaf4] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gray-200"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
