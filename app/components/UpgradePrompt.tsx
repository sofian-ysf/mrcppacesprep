'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getStoredGclid } from '@/app/components/GclidCapture'

interface TrialInfo {
  questionsUsed: number
  questionsRemaining: number
  daysRemaining: number
  isExpired: boolean
  isExhausted: boolean
  status: string
  accuracy?: number
}

interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  isLoggedIn: boolean
  trial?: TrialInfo | null
  reason?: 'trial_exhausted' | 'trial_expired' | 'calculation_blocked' | 'general'
}

// Personalized messaging based on trial performance
function getPersonalizedMessage(trial: TrialInfo | null | undefined, reason: string): { title: string; message: string; highlight?: string } {
  // High accuracy user
  if (trial?.accuracy && trial.accuracy >= 80) {
    if (reason === 'trial_exhausted') {
      return {
        title: "Impressive Performance!",
        message: `You scored ${trial.accuracy}% accuracy on your trial. Imagine mastering calculations too!`,
        highlight: `${trial.accuracy}% accuracy`
      }
    }
    return {
      title: "You're Scoring High!",
      message: `With ${trial.accuracy}% accuracy, you're well on your way. Unlock calculations and mock exams to boost your confidence further.`,
      highlight: 'Ready for full access'
    }
  }

  // Lower accuracy - emphasize learning value
  if (trial?.accuracy && trial.accuracy < 60) {
    return {
      title: "Get Detailed Explanations",
      message: "Every question comes with comprehensive explanations, clinical pearls, and exam tips to help you improve quickly.",
      highlight: 'Learn as you practice'
    }
  }

  // Running low on questions
  if (trial && trial.questionsRemaining <= 20 && trial.questionsRemaining > 0) {
    return {
      title: "Running Low on Trial Questions",
      message: `Only ${trial.questionsRemaining} questions left in your trial. Unlock 2,000+ more to continue your progress!`,
      highlight: `${trial.questionsRemaining} remaining`
    }
  }

  // Expiring soon
  if (trial && trial.daysRemaining <= 2 && trial.daysRemaining > 0) {
    return {
      title: "Trial Ending Soon",
      message: `Only ${trial.daysRemaining} day${trial.daysRemaining === 1 ? '' : 's'} left. Lock in your progress with full access.`,
      highlight: 'Subscribe to continue'
    }
  }

  // Default messages based on reason
  switch (reason) {
    case 'trial_exhausted':
      return {
        title: "You've Used All 100 Trial Questions",
        message: 'Great progress! Subscribe now to continue your exam preparation with unlimited questions.'
      }
    case 'trial_expired':
      return {
        title: 'Your 7-Day Trial Has Ended',
        message: 'Subscribe to continue practicing with unlimited questions and full access to all features.'
      }
    case 'calculation_blocked':
      return {
        title: 'Unlock Calculation Questions',
        message: 'Pharmaceutical calculations are essential for the MRCP PACES exam. Subscribe to access 500+ calculation problems with step-by-step solutions.'
      }
    default:
      if (trial && trial.questionsRemaining > 0) {
        return {
          title: 'Upgrade to Full Access',
          message: `You have ${trial.questionsRemaining} trial questions remaining. Upgrade now for unlimited questions and access to calculations.`
        }
      }
      return {
        title: 'Unlock Full Access',
        message: 'Subscribe to practice questions, take mock exams, and track your progress towards MRCP PACES exam success.'
      }
  }
}

export default function UpgradePrompt({
  isOpen,
  onClose,
  isLoggedIn,
  trial,
  reason = 'general'
}: UpgradePromptProps) {
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const gclid = getStoredGclid()
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gclid })
      })
      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        setLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(false)
    }
  }

  // Get personalized messaging based on trial performance
  const effectiveReason = trial?.isExhausted ? 'trial_exhausted' : trial?.isExpired ? 'trial_expired' : reason
  const { title, message, highlight } = getPersonalizedMessage(trial, effectiveReason)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              {reason === 'calculation_blocked' ? (
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {title}
            </h2>
            {highlight && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {highlight}
              </div>
            )}
            <p className="text-gray-600 mb-6">
              {message}
            </p>

            {/* Trial progress indicator */}
            {trial && trial.questionsRemaining > 0 && trial.questionsRemaining < 100 && (
              <div className="mb-6 bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-800">Trial Usage</span>
                  <span className="text-blue-800 font-medium">{trial.questionsUsed}/100 questions</span>
                </div>
                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${(trial.questionsUsed / 100) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  {trial.daysRemaining} {trial.daysRemaining === 1 ? 'day' : 'days'} remaining
                </p>
              </div>
            )}

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-baseline justify-center gap-1 mb-4">
                <span className="text-4xl font-bold text-gray-900">£30</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  2,500+ practice questions
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Full calculation questions
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited mock exams
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Cancel anytime
                </li>
              </ul>
            </div>

            {/* CTA */}
            {isLoggedIn ? (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/signup"
                  className="block w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
                >
                  Create Account
                </Link>
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link href="/login" className="text-gray-900 hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
