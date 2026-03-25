import { createClient } from '@/app/lib/supabase/server'
import { Metadata } from 'next'
import Link from 'next/link'
import ArticleSVG from './ArticleSVG'
import './blog-styles.css'

export const metadata: Metadata = {
  title: 'Pharmacy Blog | Study Tips & Career Advice | MRCP PACES Exam Prep',
  description: 'Expert pharmacy insights, study tips, and career guidance for MRCP PACES pre-registration exam preparation. Stay updated with the latest exam strategies and pharmacy updates.',
  keywords: 'MRCP PACES exam blog, pharmacy study tips, pre-registration advice, pharmacy career guidance, exam strategies',
  openGraph: {
    title: 'Pharmacy Blog | Study Tips & Career Advice | MRCP PACES Exam Prep',
    description: 'Expert pharmacy insights, study tips, and career guidance for MRCP PACES pre-registration exam preparation.',
    type: 'website',
  },
  alternates: {
    canonical: '/blog',
  },
}

// Format date helper
function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return ''
  }
}

interface Category {
  id: string
  slug: string
  name: string
}

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  featured_image?: string
  author_name: string
  read_time_minutes: number
  tags: string[]
  featured: boolean
  published_at: string
  blog_categories: { id: string; slug: string; name: string } | null
}

export default async function BlogPage() {
  const supabase = await createClient()

  // Fetch published posts
  const { data: postsData } = await supabase
    .from('blog_posts')
    .select(`
      id,
      slug,
      title,
      excerpt,
      featured_image,
      author_name,
      read_time_minutes,
      tags,
      featured,
      published_at,
      blog_categories (id, slug, name)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  // Transform posts to flatten blog_categories (Supabase returns it as array)
  const posts: Post[] = (postsData || []).map(post => ({
    ...post,
    blog_categories: Array.isArray(post.blog_categories)
      ? post.blog_categories[0] || null
      : post.blog_categories
  }))

  // Fetch categories
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('id, slug, name')
    .order('sort_order')

  const featuredPost = posts[0]
  const remainingPosts = posts.slice(1)

  // Collection page schema for better indexing
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "MRCP PACES Exam Preparation Blog",
    "description": "Expert pharmacy insights, study tips, and career guidance for MRCP PACES pre-registration exam preparation.",
    "url": "https://www.mrcppacesprep.com/blog",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": posts.length,
      "itemListElement": posts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://www.mrcppacesprep.com/blog/${post.slug}`,
        "name": post.title
      }))
    }
  }

  return (
    <main className="blog-page">
      {/* JSON-LD Schema for Collection Page - server-generated, safe */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="blog-container">
        {/* Breadcrumb Navigation */}
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li aria-current="page">Blog</li>
          </ol>
        </nav>

        {/* Category Navigation */}
        {categories && categories.length > 0 && (
          <nav className="blog-category-nav" aria-label="Blog categories">
            <Link href="/blog" className="category-link active">
              All Articles
            </Link>
            {categories.map((category: Category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="category-link"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        )}

        {posts.length === 0 ? (
          <div className="empty-state">
            <h3>No Articles Found</h3>
            <p>Check back soon for new pharmacy insights and study tips.</p>
            <Link href="/try-free" className="empty-state-cta">
              Start Practicing Instead
            </Link>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="featured-post">
                <Link href={`/blog/${featuredPost.slug}`} className="featured-post-link">
                  <div className="featured-post-image-wrapper">
                    {featuredPost.featured_image ? (
                      <img
                        src={featuredPost.featured_image}
                        alt={featuredPost.title}
                      />
                    ) : (
                      <ArticleSVG index={0} />
                    )}
                  </div>
                  <div className="featured-post-content">
                    {featuredPost.blog_categories && (
                      <span className="featured-post-category">
                        {featuredPost.blog_categories.name}
                      </span>
                    )}
                    <h2 className="featured-post-title">{featuredPost.title}</h2>
                    <p className="featured-post-description">{featuredPost.excerpt}</p>
                    <p className="featured-post-meta">
                      {formatDate(featuredPost.published_at)} &middot; {featuredPost.read_time_minutes} min read
                    </p>
                    <span className="featured-post-button">READ MORE &rarr;</span>
                  </div>
                </Link>
              </section>
            )}

            {/* Inline CTA - Between featured and grid */}
            <section className="blog-inline-cta">
              <div className="blog-inline-cta-content">
                <h3>Ready to Start Practicing?</h3>
                <p>2,000+ exam-style questions with detailed explanations. 94% of our students pass on their first attempt.</p>
                <div className="blog-inline-cta-buttons">
                  <Link href="/try-free" className="blog-cta-primary">
                    Try 15 Free Questions
                  </Link>
                  <Link href="/pricing" className="blog-cta-secondary">
                    View Pricing
                  </Link>
                </div>
                <p className="blog-inline-cta-subtext">No signup required for free demo</p>
              </div>
            </section>

            {/* All Posts Grid */}
            {remainingPosts.length > 0 && (
              <section className="blog-grid-section">
                <div className="blog-grid">
                  {remainingPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="blog-card"
                    >
                      <div className="blog-card-image-wrapper">
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                          />
                        ) : (
                          <ArticleSVG index={index + 1} />
                        )}
                      </div>
                      <div className="blog-card-content">
                        {post.blog_categories && (
                          <span className="blog-card-category">
                            {post.blog_categories.name}
                          </span>
                        )}
                        <h3 className="blog-card-title">{post.title}</h3>
                        <p className="blog-card-date">{formatDate(post.published_at)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Bottom CTA Section */}
      <section className="blog-bottom-cta">
        <div className="blog-bottom-cta-content">
          <p className="blog-bottom-cta-badge">Start Today</p>
          <h2>Put These Tips Into Practice</h2>
          <p className="blog-bottom-cta-description">
            Reading about exam strategies is great. Practicing with real questions is better.
          </p>
          <Link href="/try-free" className="blog-cta-primary blog-cta-large">
            Start Free Practice
          </Link>
          <p className="blog-bottom-cta-subtext">
            Or <Link href="/pricing" className="blog-bottom-cta-link">view pricing</Link> for full access
          </p>
          <div className="blog-bottom-cta-stats">
            <div className="blog-stat">
              <span className="blog-stat-value">2,000+</span>
              <span className="blog-stat-label">Questions</span>
            </div>
            <div className="blog-stat">
              <span className="blog-stat-value">94%</span>
              <span className="blog-stat-label">Pass Rate</span>
            </div>
            <div className="blog-stat">
              <span className="blog-stat-value">4.8</span>
              <span className="blog-stat-label">Rating</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
