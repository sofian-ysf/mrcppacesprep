import { NextRequest, NextResponse } from 'next/server'

const INDEXNOW_KEY = '8a10754b7a51a7b60b26ee723f619dd2'
const SITE_HOST = 'www.preregexamprep.com'

// IndexNow endpoints for different search engines
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
]

export async function POST(request: NextRequest) {
  try {
    // Verify admin access (you can add your auth check here)
    const authHeader = request.headers.get('authorization')
    const expectedKey = process.env.INDEXNOW_API_SECRET || INDEXNOW_KEY

    if (authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'URLs array required' }, { status: 400 })
    }

    // Limit to 10,000 URLs per request (IndexNow limit)
    const urlsToSubmit = urls.slice(0, 10000)

    const results = await Promise.allSettled(
      INDEXNOW_ENDPOINTS.map(async (endpoint) => {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            host: SITE_HOST,
            key: INDEXNOW_KEY,
            keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
            urlList: urlsToSubmit,
          }),
        })

        return {
          endpoint,
          status: response.status,
          ok: response.ok,
        }
      })
    )

    return NextResponse.json({
      success: true,
      urlsSubmitted: urlsToSubmit.length,
      results: results.map((r) => {
        if (r.status === 'fulfilled') {
          return r.value
        }
        return { error: String(r.reason) }
      }),
    })
  } catch (error) {
    console.error('IndexNow error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint to submit a single URL (useful for webhooks)
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
  }

  try {
    // Submit to IndexNow (using the first endpoint)
    const response = await fetch(
      `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${INDEXNOW_KEY}`
    )

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      url,
    })
  } catch (error) {
    console.error('IndexNow error:', error)
    return NextResponse.json({ error: 'Failed to submit URL' }, { status: 500 })
  }
}
