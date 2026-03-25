import { NextRequest, NextResponse } from 'next/server'

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing Turnstile token' },
        { status: 400 }
      )
    }

    if (!TURNSTILE_SECRET_KEY) {
      console.error('TURNSTILE_SECRET_KEY is not configured')
      return NextResponse.json(
        { success: false, error: 'Turnstile not configured' },
        { status: 500 }
      )
    }

    // Verify the token with Cloudflare
    const formData = new FormData()
    formData.append('secret', TURNSTILE_SECRET_KEY)
    formData.append('response', token)

    const result = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    )

    const outcome = await result.json()

    if (outcome.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'Verification failed', codes: outcome['error-codes'] },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
