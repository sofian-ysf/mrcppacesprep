const INDEXNOW_KEY = '8a10754b7a51a7b60b26ee723f619dd2'
const SITE_HOST = 'www.mrcppacesprep.com'
const BASE_URL = `https://${SITE_HOST}`

/**
 * Submit a URL to IndexNow for faster indexing by Bing, Yandex, and other search engines
 */
export async function submitToIndexNow(url: string): Promise<boolean> {
  try {
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`

    const response = await fetch(
      `https://api.indexnow.org/indexnow?url=${encodeURIComponent(fullUrl)}&key=${INDEXNOW_KEY}`
    )

    return response.ok || response.status === 202
  } catch (error) {
    console.error('IndexNow submission error:', error)
    return false
  }
}

/**
 * Submit multiple URLs to IndexNow in batch
 */
export async function submitBatchToIndexNow(urls: string[]): Promise<{ success: boolean; submitted: number }> {
  try {
    const fullUrls = urls.map(url =>
      url.startsWith('http') ? url : `${BASE_URL}${url}`
    )

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: fullUrls,
      }),
    })

    return {
      success: response.ok || response.status === 202,
      submitted: fullUrls.length,
    }
  } catch (error) {
    console.error('IndexNow batch submission error:', error)
    return { success: false, submitted: 0 }
  }
}

/**
 * Submit a blog post URL to IndexNow
 */
export async function submitBlogPostToIndexNow(slug: string): Promise<boolean> {
  return submitToIndexNow(`/blog/${slug}`)
}

/**
 * Get all static URLs to submit for initial indexing
 */
export function getAllStaticUrls(): string[] {
  return [
    '/',
    '/gphc-exam-questions',
    '/question-bank',
    '/mock-exams',
    '/calculations',
    '/study-guides',
    '/resources',
    '/blog',
    '/testimonials',
    '/about',
    '/contact',
    '/help',
    '/pricing',
    '/signup',
    '/faq',
    '/privacy',
    '/terms',
    '/disclaimer',
  ].map(path => `${BASE_URL}${path}`)
}

/**
 * Ping Google with updated sitemap
 */
export async function pingGoogle(): Promise<boolean> {
  try {
    const sitemapUrl = `${BASE_URL}/sitemap.xml`
    const response = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    )
    console.log(`[SEO] Google ping: ${response.status}`)
    return response.ok
  } catch (error) {
    console.error('Google ping error:', error)
    return false
  }
}

/**
 * Ping Bing with updated sitemap
 */
export async function pingBing(): Promise<boolean> {
  try {
    const sitemapUrl = `${BASE_URL}/sitemap.xml`
    const response = await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    )
    console.log(`[SEO] Bing ping: ${response.status}`)
    return response.ok
  } catch (error) {
    console.error('Bing ping error:', error)
    return false
  }
}

/**
 * Ping all search engines (Google, Bing, and IndexNow)
 */
export async function pingAllSearchEngines(blogSlug?: string): Promise<void> {
  const promises: Promise<any>[] = [
    pingGoogle(),
    pingBing(),
  ]

  if (blogSlug) {
    promises.push(submitBlogPostToIndexNow(blogSlug))
  }

  await Promise.allSettled(promises)
}
