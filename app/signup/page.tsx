'use client'

import { Suspense, useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

function SignupForm() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const planType = searchParams.get('plan') // Capture plan from pricing page

  // Determine where to redirect after signup
  const getRedirectUrl = () => {
    if (planType) {
      // If coming from pricing with a plan, go to checkout after signup
      return `/checkout/${planType}`
    }
    // Default redirect to pricing page for new signups
    return redirectTo || '/pricing'
  }

  const handleGoogleSignup = async () => {
    setError(null)
    setGoogleLoading(true)

    try {
      const nextUrl = getRedirectUrl()
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || 'An error occurred with Google sign up')
      setGoogleLoading(false)
    }
  }

  const sendDiscordNotification = async () => {
    try {
      await fetch('/api/discord/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `New signup: ${fullName || 'Unknown'} (${email})`,
          userEmail: email,
          userName: fullName || email.split('@')[0],
          type: 'new_signup'
        }),
      })
    } catch (error) {
      console.error('Failed to send Discord notification:', error)
      // Don't throw error - let signup continue even if Discord fails
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate password
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Verify Turnstile token if available (temporarily optional)
      if (turnstileToken) {
        const verifyResponse = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        })

        const verifyResult = await verifyResponse.json()

        if (!verifyResult.success) {
          // Reset Turnstile widget for retry
          turnstileRef.current?.reset()
          setTurnstileToken(null)
          // Continue anyway - temporary bypass
          console.warn('Turnstile verification failed, continuing anyway')
        }
      }

      const nextUrl = getRedirectUrl()
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl,
          data: {
            full_name: fullName,
          }
        }
      })

      if (error) throw error

      // Send Discord notification after successful signup
      await sendDiscordNotification()

      // Check if email confirmation is required
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error('An account with this email already exists. Please sign in instead.')
      }

      // Check if user has a session (email verification disabled)
      if (data.session) {
        // User is signed in immediately, redirect to pricing
        router.push(getRedirectUrl())
        return
      }

      // If no session, email confirmation is still required
      setSignupSuccess(true)
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup')
      setLoading(false)
    }
  }

  const planNames: Record<string, string> = {
    '3month': 'Standard (3 Months)',
    '6month': 'Plus (6 Months)',
    '12month': 'Premium (12 Months)',
  }

  const planPrices: Record<string, string> = {
    '3month': '£75',
    '6month': '£135',
    '12month': '£215',
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <Link href="/" className="flex justify-center text-2xl font-bold text-gray-900">
          MRCPPACESPREP
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        {planType && planNames[planType] ? (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-800">
              You're signing up for <strong>{planNames[planType]}</strong> ({planPrices[planType]})
            </p>
            <p className="text-xs text-green-600 mt-1">
              You'll be taken to checkout after creating your account
            </p>
          </div>
        ) : (
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'} className="font-medium text-gray-900 hover:text-gray-700">
              sign in to your existing account
            </Link>
          </p>
        )}
      </div>

      {/* Google Sign Up Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-full bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <svg className="animate-spin h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Continue with Google
        </button>
      </div>

      {/* Divider */}
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#fbfaf4] text-gray-500">or continue with email</span>
        </div>
      </div>

      {signupSuccess ? (
        <div className="mt-6">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Account created successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Please check your email at <strong>{email}</strong> to verify your account.</p>
                  <p className="mt-1">Click the confirmation link to activate your account and sign in.</p>
                </div>
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <strong>Can't find it?</strong> Check your spam or junk folder!
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link
              href={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'}
              className="text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              Go to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form className="mt-6 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className="pill-input mt-1"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="pill-input mt-1"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="pill-input mt-1"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="pill-input mt-1"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Turnstile Bot Protection */}
          <div className="flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => {
                setTurnstileToken(null)
                setError('Verification failed. Please refresh and try again.')
              }}
              onExpire={() => {
                setTurnstileToken(null)
                turnstileRef.current?.reset()
              }}
              options={{
                theme: 'light',
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full pill-btn pill-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          <div className="text-xs text-center text-gray-600">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="font-medium text-gray-900 hover:text-gray-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-gray-900 hover:text-gray-700">
              Privacy Policy
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}

function SignupFallback() {
  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <Link href="/" className="flex justify-center text-2xl font-bold text-gray-900">
          MRCPPACESPREP
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      <div className="flex justify-center">
        <svg className="animate-spin h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4] py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<SignupFallback />}>
        <SignupForm />
      </Suspense>
    </div>
  )
}
