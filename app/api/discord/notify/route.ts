import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let userEmail: string | undefined
  let type: string | undefined

  try {
    const body = await request.json()
    userEmail = body.userEmail
    const userName = body.userName
    type = body.type
    const message = body.message

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Discord webhook URL not configured' },
        { status: 500 }
      )
    }

    // Different styling based on notification type
    let embedTitle, embedColor, embedIcon

    switch (type) {
      case 'signup':
        embedTitle = "🎉 New User Signup!"
        embedColor = 0x00ff00  // Green
        embedIcon = "🆕"
        break
      case 'login':
        embedTitle = "👋 User Login"
        embedColor = 0x0099ff  // Blue
        embedIcon = "🔓"
        break
      case 'magic_link_sent':
        embedTitle = "📧 Magic Link Sent"
        embedColor = 0xff9900  // Orange
        embedIcon = "✨"
        break
      default:
        embedTitle = "🔔 User Activity"
        embedColor = 0x666666  // Gray
        embedIcon = "ℹ️"
    }

    const discordMessage = {
      content: null,
      embeds: [
        {
          title: embedTitle,
          description: message || `${embedIcon} User activity detected for MRCP PACES Exam Prep!`,
          color: embedColor,
          fields: [
            {
              name: "👤 Name",
              value: userName || "Not provided",
              inline: true
            },
            {
              name: "📧 Email",
              value: userEmail || "Not provided",
              inline: true
            },
            {
              name: "⏰ Time",
              value: new Date().toLocaleString('en-GB', {
                timeZone: 'Europe/London',
                dateStyle: 'medium',
                timeStyle: 'medium'
              }),
              inline: true
            }
          ],
          footer: {
            text: "MRCPPACESPREP Notifications"
          }
        }
      ]
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage)
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error(`Discord API error: ${response.status} - ${errorText}`)
      throw new Error(`Discord API error: ${response.status} - ${response.statusText}`)
    }

    const responseData = await response.text().catch(() => 'Success')
    console.log('Discord notification sent successfully:', {
      type,
      userEmail,
      status: response.status
    })

    return NextResponse.json({
      success: true,
      message: 'Discord notification sent successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Discord notification error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userEmail,
      type,
      timestamp: new Date().toISOString()
    })

    // Don't fail the request if Discord notification fails
    // This ensures user auth flow continues even if Discord is down
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send Discord notification',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 } // Return 200 so auth flow continues
    )
  }
}