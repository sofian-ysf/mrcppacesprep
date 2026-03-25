import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Admin client for bypassing RLS
function getSupabaseAdmin() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
import { getTrialReminderEmail } from '@/app/lib/email/templates/trial-reminder'
import { getTrialExpiringEmail } from '@/app/lib/email/templates/trial-expiring'
import { getWinBackEmail } from '@/app/lib/email/templates/win-back'

const resend = new Resend(process.env.RESEND_API_KEY)

// Helper to add delay between API calls (respect rate limits)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Common typo domains that indicate fake/invalid emails
const INVALID_DOMAINS = [
  'gmall.com',
  'gmal.com',
  'gamil.com',
  'gnail.com',
  'gmaill.com',
  'gmail.con',
  'gmail.co',
  'hotmal.com',
  'hotmai.com',
  'hotmail.con',
  'yaho.com',
  'yahho.com',
  'yahoo.con',
  'outlok.com',
  'outloo.com',
]

function isValidEmail(email: string): { valid: boolean; reason?: string } {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid format' }
  }

  const domain = email.split('@')[1]?.toLowerCase()

  // Check for typo domains
  if (INVALID_DOMAINS.includes(domain)) {
    return { valid: false, reason: `Typo domain: ${domain}` }
  }

  // Check for suspicious TLDs
  if (domain && !domain.includes('.')) {
    return { valid: false, reason: 'Missing TLD' }
  }

  return { valid: true }
}

interface SendEmailRequest {
  userIds: string[]
  emailType: 'trial_reminder' | 'trial_expiring' | 'win_back' | 'custom'
  customSubject?: string
  customBody?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const body: SendEmailRequest = await request.json()
    const { userIds, emailType, customSubject, customBody } = body

    if (!userIds || userIds.length === 0) {
      return NextResponse.json({ error: 'No users selected' }, { status: 400 })
    }

    if (!emailType) {
      return NextResponse.json({ error: 'Email type is required' }, { status: 400 })
    }

    if (emailType === 'custom' && (!customSubject || !customBody)) {
      return NextResponse.json({ error: 'Custom subject and body are required for custom emails' }, { status: 400 })
    }

    // Get user emails from all CRM views
    const { data: activeUsers } = await supabase
      .from('crm_active_trial_users')
      .select('id, email, days_remaining')
      .in('id', userIds)

    const { data: expiredUsers } = await supabase
      .from('crm_expired_trial_users')
      .select('id, email, days_since_expiry')
      .in('id', userIds)

    const { data: noTrialUsers } = await supabase
      .from('crm_no_trial_users')
      .select('id, email')
      .in('id', userIds)

    const allUsers = [...(activeUsers || []), ...(expiredUsers || []), ...(noTrialUsers || [])]

    if (allUsers.length === 0) {
      return NextResponse.json({ error: 'No valid users found' }, { status: 400 })
    }

    // Fetch user names from auth.users using admin client
    const adminClient = getSupabaseAdmin()
    const userNames: Record<string, string> = {}

    // Fetch all users with pagination (listUsers returns max 50 per page)
    let page = 1
    let hasMore = true
    while (hasMore) {
      const { data: authUsers, error: listError } = await adminClient.auth.admin.listUsers({
        page,
        perPage: 100
      })

      if (listError || !authUsers?.users?.length) {
        hasMore = false
        break
      }

      for (const authUser of authUsers.users) {
        // Try to get first name from various sources:
        // 1. Google OAuth provides given_name directly
        // 2. Magic link signup stores full_name
        // 3. Some OAuth providers use 'name'
        const firstName = authUser.user_metadata?.given_name ||
                         (authUser.user_metadata?.full_name?.split(' ')[0]) ||
                         (authUser.user_metadata?.name?.split(' ')[0]) ||
                         ''
        userNames[authUser.id] = firstName
      }

      // Check if there are more pages
      if (authUsers.users.length < 100) {
        hasMore = false
      } else {
        page++
      }
    }

    // Get unsubscribed emails
    const allEmails = allUsers.map(u => u.email.toLowerCase())
    const { data: unsubscribedData } = await supabase
      .from('email_unsubscribes')
      .select('email')
      .in('email', allEmails)

    const unsubscribedEmails = new Set((unsubscribedData || []).map(u => u.email.toLowerCase()))

    // Send emails and track results
    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
      skippedEmails: [] as string[]
    }

    for (const targetUser of allUsers) {
      // Check if unsubscribed
      if (unsubscribedEmails.has(targetUser.email.toLowerCase())) {
        results.skipped++
        results.skippedEmails.push(`${targetUser.email} (Unsubscribed)`)
        continue
      }

      // Validate email first
      const validation = isValidEmail(targetUser.email)
      if (!validation.valid) {
        results.skipped++
        results.skippedEmails.push(`${targetUser.email} (${validation.reason})`)
        continue
      }

      try {
        let subject: string
        let htmlContent: string

        const firstName = userNames[targetUser.id] || ''

        switch (emailType) {
          case 'trial_reminder':
            subject = 'Continue Your MRCP PACES Exam Preparation'
            htmlContent = getTrialReminderEmail(targetUser.email, firstName)
            break
          case 'trial_expiring':
            subject = 'Your Free Trial is Expiring Soon'
            htmlContent = getTrialExpiringEmail(targetUser.email, (targetUser as { days_remaining?: number }).days_remaining || 0, firstName)
            break
          case 'win_back':
            subject = 'We Miss You! Come Back to MRCPPACESPREP'
            htmlContent = getWinBackEmail(targetUser.email, firstName)
            break
          case 'custom':
            // Replace placeholders in subject and body
            const replacePlaceholders = (text: string) => {
              let result = text

              // Handle various placeholder formats (with or without proper closing braces)
              // Matches: {{first_name}}, {{first_name}, {first_name}, etc.
              const firstNamePattern = /\{?\{first_name\}?\}?/gi

              if (!firstName) {
                // If no first name, replace greeting patterns with generic greeting
                result = result
                  .replace(/Hi \{?\{first_name\}?\}?,?/gi, 'Hi there,')
                  .replace(/Hello \{?\{first_name\}?\}?,?/gi, 'Hello,')
                  .replace(/Dear \{?\{first_name\}?\}?,?/gi, 'Dear Customer,')
                  .replace(firstNamePattern, 'there')
              } else {
                result = result.replace(firstNamePattern, firstName)
              }

              // Replace email placeholder
              result = result.replace(/\{?\{email\}?\}?/gi, targetUser.email)

              return result
            }

            subject = replacePlaceholders(customSubject!)
            const processedBody = replacePlaceholders(customBody!)

            // Style links in the HTML content
            const styledBody = processedBody.replace(/<a /g, '<a style="color: #0066cc; text-decoration: none;" ')

            htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #333; margin-bottom: 20px;">MRCPPACESPREP</h2>
    <div style="font-size: 14px;">
      ${styledBody}
    </div>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 20px 0;">
    <p style="font-size: 12px; color: #666; margin: 0;">
      You're receiving this email because you signed up for MRCPPACESPREP.<br>
      <a href="https://www.mrcppacesprep.com/unsubscribe?email=${encodeURIComponent(targetUser.email)}" style="color: #666;">Unsubscribe</a> |
      <a href="https://www.mrcppacesprep.com" style="color: #666;">Visit our website</a>
    </p>
  </div>
</body>
</html>`
            break
          default:
            throw new Error('Invalid email type')
        }

        const unsubscribeUrl = `https://www.mrcppacesprep.com/unsubscribe?email=${encodeURIComponent(targetUser.email)}`

        const { error: sendError } = await resend.emails.send({
          from: 'MRCPPACESPREP <team@mrcppacesprep.com>',
          to: targetUser.email,
          subject,
          html: htmlContent,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
          }
        })

        if (sendError) {
          throw sendError
        }

        // Log the email in history (use admin client to bypass RLS)
        const { error: historyError } = await getSupabaseAdmin()
          .from('crm_email_history')
          .insert({
            user_id: targetUser.id,
            email_type: emailType,
            subject,
            sent_by: user.id,
            metadata: emailType === 'custom' ? { customBody } : {}
          })

        if (historyError) {
          console.error('Failed to log email history:', historyError)
        }

        results.sent++

        // Rate limit: wait 600ms between emails (Resend allows 2/sec)
        await delay(600)
      } catch (emailError) {
        results.failed++
        results.errors.push(`Failed to send to ${targetUser.email}: ${emailError}`)
        console.error(`Failed to send email to ${targetUser.email}:`, emailError)
      }
    }

    return NextResponse.json({
      success: true,
      sent: results.sent,
      failed: results.failed,
      skipped: results.skipped,
      errors: results.errors.length > 0 ? results.errors : undefined,
      skippedEmails: results.skippedEmails.length > 0 ? results.skippedEmails : undefined
    })
  } catch (error) {
    console.error('CRM Send Email error:', error)
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}
