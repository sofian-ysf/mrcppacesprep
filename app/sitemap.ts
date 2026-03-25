import { MetadataRoute } from 'next'
import { createClient } from '@/app/lib/supabase/server'

// Revalidate sitemap hourly to ensure new content is discovered promptly
export const revalidate = 3600

// Last deployment/update date - update this when you deploy significant changes
const LAST_MAJOR_UPDATE = new Date('2026-03-10')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.preregexamprep.com'

  // Static pages with realistic lastModified dates
  // Pages that change based on dynamic content will be updated accordingly
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage - highest priority (updated frequently with content)
    {
      url: baseUrl,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'daily',
      priority: 1,
    },
    // Main product pages (content changes with questions/features)
    {
      url: `${baseUrl}/gphc-exam-questions`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/question-bank`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mock-exams`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculations`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/study-guides`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Content pages
    {
      url: `${baseUrl}/resources`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Blog index will be updated when we fetch posts below
    {
      url: `${baseUrl}/testimonials`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // About & trust pages (stable content)
    {
      url: `${baseUrl}/about`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // Conversion pages
    {
      url: `${baseUrl}/pricing`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Legal pages (rarely change)
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Additional product/landing pages
    {
      url: `${baseUrl}/gphc-exam-guide`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gphc-practice-questions`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Conversion pages
    {
      url: `${baseUrl}/try-free`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Fetch dynamic blog posts and categories
  let blogPages: MetadataRoute.Sitemap = []
  let blogIndexPage: MetadataRoute.Sitemap = []
  let categoryPages: MetadataRoute.Sitemap = []

  try {
    const supabase = await createClient()

    // Get blog categories
    const { data: categories } = await supabase
      .from('blog_categories')
      .select('slug')
      .order('sort_order')

    if (categories && categories.length > 0) {
      categoryPages = categories.map(category => ({
        url: `${baseUrl}/blog/category/${category.slug}`,
        lastModified: LAST_MAJOR_UPDATE,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }

    // Get published blog posts ordered by most recent
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (posts && posts.length > 0) {
      // Blog index page uses the most recent post date
      const latestPostDate = new Date(posts[0].updated_at || posts[0].published_at)
      blogIndexPage = [{
        url: `${baseUrl}/blog`,
        lastModified: latestPostDate,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }]

      blogPages = posts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    } else {
      // No posts yet, use fallback
      blogIndexPage = [{
        url: `${baseUrl}/blog`,
        lastModified: LAST_MAJOR_UPDATE,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }]
    }
  } catch (error) {
    console.error('Error fetching dynamic sitemap entries:', error)
    // Fallback blog page
    blogIndexPage = [{
      url: `${baseUrl}/blog`,
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }]
  }

  return [...staticPages, ...blogIndexPage, ...categoryPages, ...blogPages]
}
