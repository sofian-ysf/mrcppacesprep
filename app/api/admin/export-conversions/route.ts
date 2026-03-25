import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/app/lib/stripe'

// GET /api/admin/export-conversions?days=30
// Returns CSV formatted for Google Ads offline conversion import
export async function GET(request: NextRequest) {
  try {
    // Simple auth check - require a secret key
    const authKey = request.nextUrl.searchParams.get('key')
    if (authKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const days = parseInt(request.nextUrl.searchParams.get('days') || '30')
    const since = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60)

    // Fetch successful checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: since },
    })

    const conversions = sessions.data
      .filter(s => s.payment_status === 'paid' && s.amount_total)
      .map(s => ({
        // Google Ads format - include gclid if available for direct attribution
        'Google Click ID': s.metadata?.gclid || '',
        'Conversion Name': 'Purchase',
        'Conversion Time': new Date(s.created * 1000).toISOString(),
        'Conversion Value': (s.amount_total! / 100).toFixed(2),
        'Conversion Currency': (s.currency || 'GBP').toUpperCase(),
        'Email': s.customer_details?.email || '',
        'Order ID': s.id,
      }))

    // Generate CSV
    if (conversions.length === 0) {
      return NextResponse.json({ message: 'No conversions found', count: 0 })
    }

    const headers = Object.keys(conversions[0])
    const csv = [
      headers.join(','),
      ...conversions.map(row =>
        headers.map(h => `"${(row as Record<string, string>)[h] || ''}"`).join(',')
      )
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="conversions-${days}days.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting conversions:', error)
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
  }
}
