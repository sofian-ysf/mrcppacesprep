import { createClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'

async function sendDiscordNotification(userEmail: string, userName: string, isNewUser: boolean) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://mrcppacesprep.vercel.app'  // Update this to your production URL
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    await fetch(`${baseUrl}/api/discord/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: isNewUser
          ? 'A new user has completed their signup and verified their email!'
          : 'A user has logged in successfully!',
        userEmail,
        userName,
        type: isNewUser ? 'signup' : 'login'
      }),
    })
  } catch (error) {
    console.error('Failed to send Discord notification:', error)
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/pricing'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if this is a new user by looking at created_at timestamp
      // If the user was created very recently (within last 5 minutes), treat as new signup
      const userCreatedAt = new Date(data.user.created_at)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const isNewUser = userCreatedAt > fiveMinutesAgo

      // Send Discord notification only for new signups
      if (isNewUser) {
        await sendDiscordNotification(
          data.user.email || '',
          data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Unknown User',
          isNewUser
        )
      }

      // Redirect to dashboard or the 'next' parameter
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // If there's an error or no code, redirect to login with error
  return NextResponse.redirect(
    new URL('/login?error=Unable to sign in', requestUrl.origin)
  )
}