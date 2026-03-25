/**
 * Script to fetch historical email data from Resend API and import into user_email_history
 *
 * Usage: npx tsx scripts/import-resend-history.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role to insert

if (!RESEND_API_KEY) {
  console.error('Missing RESEND_API_KEY environment variable')
  process.exit(1)
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Path to CSV file
const CSV_PATH = '/Users/sofianyoussef/Desktop/logs-1769954438021.csv'

interface ResendEmail {
  id: string
  from: string
  to: string[]
  subject: string
  created_at: string
}

interface CsvRow {
  id: string
  created_at: string
  response_status: string
}

async function fetchEmailFromResend(emailId: string): Promise<ResendEmail | null> {
  try {
    const response = await fetch(`https://api.resend.com/emails/${emailId}`, {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`  Email ${emailId} not found (may have been deleted)`)
        return null
      }
      console.error(`  Failed to fetch ${emailId}: ${response.status}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`  Error fetching ${emailId}:`, error)
    return null
  }
}

function parseEmailType(subject: string): string {
  const subjectLower = subject.toLowerCase()

  if (subjectLower.includes('welcome')) return 'welcome'
  if (subjectLower.includes('trial') && subjectLower.includes('end')) return 'trial_ending'
  if (subjectLower.includes('trial')) return 'trial_reminder'
  if (subjectLower.includes('magic link') || subjectLower.includes('sign in')) return 'magic_link'
  if (subjectLower.includes('password')) return 'password_reset'
  if (subjectLower.includes('verify')) return 'verification'
  if (subjectLower.includes('subscription')) return 'subscription'
  if (subjectLower.includes('payment')) return 'payment'
  if (subjectLower.includes('inactive') || subjectLower.includes('miss you')) return 'inactive_reminder'

  return 'custom'
}

async function getUserIdByEmail(email: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', email)
    .single()

  if (error) {
    // Try using auth admin API instead
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error(`  Error fetching user for ${email}:`, authError)
      return null
    }

    const user = authData.users.find(u => u.email === email)
    return user?.id || null
  }

  return data?.id || null
}

async function main() {
  console.log('Reading CSV file...')

  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8')
  const lines = csvContent.trim().split('\n')
  const header = lines[0].split(',')

  // Parse CSV
  const rows: CsvRow[] = lines.slice(1).map(line => {
    const values = line.split(',')
    return {
      id: values[0],
      created_at: values[1],
      response_status: values[6],
    }
  })

  // Filter only successful emails (status 200)
  const successfulEmails = rows.filter(row => row.response_status === '200')
  console.log(`Found ${successfulEmails.length} successful email sends out of ${rows.length} total`)

  // Fetch all users once for faster lookup
  console.log('\nFetching all users from Supabase...')
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.error('Failed to fetch users:', authError)
    process.exit(1)
  }

  const userMap = new Map<string, string>()
  authData.users.forEach(user => {
    if (user.email) {
      userMap.set(user.email.toLowerCase(), user.id)
    }
  })
  console.log(`Loaded ${userMap.size} users`)

  // Process emails
  console.log('\nFetching email details from Resend API...')

  const emailsToInsert: Array<{
    user_id: string
    email_type: string
    sent_at: string
    metadata: object
  }> = []

  let processed = 0
  let skipped = 0
  let notFound = 0

  for (const row of successfulEmails) {
    processed++

    if (processed % 10 === 0) {
      console.log(`Processing ${processed}/${successfulEmails.length}...`)
    }

    // Rate limit: Resend allows 10 requests per second
    await new Promise(resolve => setTimeout(resolve, 150))

    const emailDetails = await fetchEmailFromResend(row.id)

    if (!emailDetails) {
      notFound++
      continue
    }

    // Get recipient email
    const recipientEmail = emailDetails.to[0]?.toLowerCase()

    if (!recipientEmail) {
      console.log(`  No recipient for ${row.id}`)
      skipped++
      continue
    }

    // Find user ID
    const userId = userMap.get(recipientEmail)

    if (!userId) {
      console.log(`  No user found for ${recipientEmail}`)
      skipped++
      continue
    }

    // Determine email type from subject
    const emailType = parseEmailType(emailDetails.subject || '')

    emailsToInsert.push({
      user_id: userId,
      email_type: emailType,
      sent_at: emailDetails.created_at,
      metadata: {
        resend_id: emailDetails.id,
        subject: emailDetails.subject,
        from: emailDetails.from,
        imported: true,
      },
    })
  }

  console.log(`\n\nSummary:`)
  console.log(`  Processed: ${processed}`)
  console.log(`  Not found in Resend: ${notFound}`)
  console.log(`  Skipped (no user match): ${skipped}`)
  console.log(`  Ready to import: ${emailsToInsert.length}`)

  if (emailsToInsert.length === 0) {
    console.log('\nNo emails to import.')
    return
  }

  // Insert into database
  console.log('\nInserting into user_email_history...')

  const { data, error } = await supabase
    .from('user_email_history')
    .insert(emailsToInsert)
    .select()

  if (error) {
    console.error('Error inserting:', error)

    // Try inserting one by one to see which ones fail
    console.log('\nTrying individual inserts...')
    let insertedCount = 0

    for (const email of emailsToInsert) {
      const { error: insertError } = await supabase
        .from('user_email_history')
        .insert(email)

      if (insertError) {
        console.error(`  Failed to insert for user ${email.user_id}:`, insertError.message)
      } else {
        insertedCount++
      }
    }

    console.log(`\nInserted ${insertedCount} emails individually`)
  } else {
    console.log(`Successfully imported ${emailsToInsert.length} emails!`)
  }
}

main().catch(console.error)
