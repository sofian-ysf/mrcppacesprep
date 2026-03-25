import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET() {
  const baseUrl = 'https://www.preregexamprep.com'

  try {
    const supabase = await createClient()

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, published_at, meta_description, author_name')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('RSS feed error:', error)
      throw error
    }

    const rssItems = posts?.map(post => {
      const title = escapeXml(post.title)
      const description = escapeXml(post.meta_description || post.excerpt || '')
      const pubDate = new Date(post.published_at).toUTCString()
      const link = `${baseUrl}/blog/${post.slug}`
      const author = escapeXml(post.author_name || 'PreRegExamPrep Team')

      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${link}</guid>
      <author>contact@preregexamprep.com (${author})</author>
    </item>`
    }).join('\n') || ''

    const lastBuildDate = posts?.[0]?.published_at
      ? new Date(posts[0].published_at).toUTCString()
      : new Date().toUTCString()

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>PreRegExamPrep Blog - GPhC Exam Preparation</title>
    <link>${baseUrl}/blog</link>
    <description>Expert pharmacy insights, study tips, and career guidance for GPhC pre-registration exam preparation. Stay updated with the latest exam strategies and pharmacy news.</description>
    <language>en-gb</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <copyright>Copyright ${new Date().getFullYear()} PreRegExamPrep. All rights reserved.</copyright>
    <managingEditor>contact@preregexamprep.com (PreRegExamPrep Team)</managingEditor>
    <webMaster>contact@preregexamprep.com (PreRegExamPrep Team)</webMaster>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>PreRegExamPrep Blog</title>
      <link>${baseUrl}/blog</link>
    </image>
${rssItems}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('RSS feed generation error:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}

// Helper function to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
