'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function UnsubscribeForm() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''

  const [email, setEmail] = useState(emailParam)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [emailParam])

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('You have been successfully unsubscribed from our marketing emails.')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            PreRegExamPrep
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {status === 'success' ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unsubscribed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-4">
                You will still receive important account-related emails.
              </p>
              <Link
                href="/"
                className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                Unsubscribe from Emails
              </h2>
              <p className="text-gray-600 text-center mb-6">
                We're sorry to see you go. Enter your email to unsubscribe from our marketing emails.
              </p>

              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                {status === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading' || !email}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
                </button>
              </form>

              <p className="mt-6 text-xs text-center text-gray-500">
                Changed your mind?{' '}
                <Link href="/" className="text-gray-900 hover:underline">
                  Go back to our website
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    }>
      <UnsubscribeForm />
    </Suspense>
  )
}
