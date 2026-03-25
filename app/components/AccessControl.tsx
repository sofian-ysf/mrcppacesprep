'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'

interface AccessControlProps {
  children: React.ReactNode
}

export default function AccessControl({ children }: AccessControlProps) {
  const { user, loading: authLoading } = useAuth()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      if (!user) {
        setHasAccess(false)
        setChecking(false)
        return
      }

      try {
        const response = await fetch('/api/stripe/check-access')
        const data = await response.json()

        setHasAccess(data.hasAccess)
      } catch (error) {
        console.error('Failed to check access:', error)
        setHasAccess(false)
      } finally {
        setChecking(false)
      }
    }

    if (!authLoading) {
      checkAccess()
    }
  }, [user, authLoading])

  // Loading state
  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-4 text-gray-600">Checking access...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access this content.</p>
          <Link href="/login" className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  // No active subscription
  if (hasAccess === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-lg">
          <div className="mb-6">
            <svg className="mx-auto h-20 w-20 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscribe to Access This Content</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get unlimited access to our comprehensive question bank, mock exams, and study materials.
          </p>

          {/* Single Subscription Card */}
          <div className="bg-white rounded-xl border-2 border-gray-900 p-8 mb-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
              FULL ACCESS
            </div>
            <div className="mb-4">
              <p className="text-4xl font-bold text-gray-900">£30<span className="text-lg font-normal text-gray-600">/month</span></p>
              <p className="text-sm text-gray-500 mt-1">Cancel anytime</p>
            </div>
            <ul className="text-left space-y-2 mb-6 text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                2,500+ practice questions
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Unlimited mock exams
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Full calculations practice
              </li>
            </ul>
            <Link href="/#pricing" className="block w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-gray-800 transition-colors">
              Subscribe Now
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            Already subscribed?{' '}
            <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">
              Refresh the page
            </button>
          </p>
        </div>
      </div>
    )
  }

  // Has access - show content
  return <>{children}</>
}
