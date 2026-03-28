import { createClient } from '@/app/lib/supabase/server'
import { createClient as createBrowserClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import ArticleSVG from '../../ArticleSVG'
import '../../blog-styles.css'

interface Props {
  params: Promise<{ slug: string }>
}

// Generate static params for all categories
export async function generateStaticParams() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: categories } = await supabase
    .from('blog_categories')
    .select('slug')

  return categories?.map(category => ({ slug: category.slug })) || []
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('blog_categories')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!category) {
    return { title: 'Category Not Found' }
  }

  const title = `${category.name} | MRCP PACES Exam Prep Blog`
  const description = category.description ||
    `Browse our ${category.name.toLowerCase()} articles for MRCP PACES exam preparation tips, strategies, and insights.`

  return {
    title,
    description,
    keywords: `${category.name}, MRCP PACES exam, MRCP PACES blog, MRCP PACES, ${slug.replace(/-/g, ' ')}`,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      canonical: `/blog/category/${slug}`,
    },
  }
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
  description?: string
}

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  featured_image?: string
  author_name: string
  read_time_minutes: number
  published_at: string
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch category details
  const { data: category, error: categoryError } = await supabase
    .from('blog_categories')
    .select('id, slug, name, description')
    .eq('slug', slug)
    .single()

  if (categoryError || !category) {
    notFound()
  }

  // Fetch posts in this category
  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`
      id,
      slug,
      title,
      excerpt,
      featured_image,
      author_name,
      read_time_minutes,
      published_at
    `)
    .eq('category_id', category.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  // Fetch all categories for sidebar navigation
  const { data: allCategories } = await supabase
    .from('blog_categories')
    .select('id, slug, name')
    .order('sort_order')

  // Collection page schema for better indexing - server-generated, safe
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} - MRCP PACES Exam Prep Blog`,
    "description": category.description || `Browse ${category.name} articles for MRCP PACES exam preparation.`,
    "url": `https://www.mrcppacesprep.com/blog/category/${slug}`,
    "isPartOf": {
      "@type": "Blog",
      "@id": "https://www.mrcppacesprep.com/blog",
      "name": "MRCP PACES Exam Prep Blog"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": posts?.length || 0,
      "itemListElement": (posts || []).slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://www.mrcppacesprep.com/blog/${post.slug}`,
        "name": post.title
      }))
    }
  }

  // Breadcrumb schema - server-generated, safe
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.mrcppacesprep.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.mrcppacesprep.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category.name,
        "item": `https://www.mrcppacesprep.com/blog/category/${slug}`
      }
    ]
  }

  return (
    <main className="blog-page blog-category-page">
      {/* JSON-LD Schema - server-generated from database, safe */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="blog-container">
        {/* Breadcrumb Navigation */}
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li aria-current="page">{category.name}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <header className="category-header">
          <h1>{category.name}</h1>
          {category.description && (
            <p className="category-description">{category.description}</p>
          )}
          <p className="category-count">
            {posts?.length || 0} {posts?.length === 1 ? 'article' : 'articles'}
          </p>
        </header>

        {/* Category Navigation */}
        {allCategories && allCategories.length > 0 && (
          <nav className="blog-category-nav" aria-label="Blog categories">
            <Link href="/blog" className="category-link">
              All Articles
            </Link>
            {allCategories.map((cat: Category) => (
              <Link
                key={cat.id}
                href={`/blog/category/${cat.slug}`}
                className={`category-link ${cat.slug === slug ? 'active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Posts Grid */}
        {!posts || posts.length === 0 ? (
          <div className="empty-state">
            <h3>No Articles Yet</h3>
            <p>We're working on adding articles to this category. Check back soon!</p>
            <Link href="/blog" className="empty-state-cta">
              Browse All Articles
            </Link>
          </div>
        ) : (
          <section className="blog-grid-section">
            <div className="blog-grid">
              {posts.map((post: Post, index: number) => (
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
                      <ArticleSVG index={index} />
                    )}
                  </div>
                  <div className="blog-card-content">
                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <p className="blog-card-date">
                      {formatDate(post.published_at)} &middot; {post.read_time_minutes} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="blog-category-cta">
          <div className="blog-category-cta-content">
            <h2>Ready to Practice?</h2>
            <p>Put these insights into action with 2,000+ MRCP PACES exam-style questions.</p>
            <Link href="/try-free" className="blog-cta-primary">
              Try 15 Free Questions
            </Link>
          </div>
        </section>
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
