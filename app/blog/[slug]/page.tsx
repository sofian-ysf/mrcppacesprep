import { createClient } from '@/app/lib/supabase/server'
import { createClient as createBrowserClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import ArticleSVG from '../ArticleSVG'
import { generateSVGIndex } from '../utils'
import './article.css'

interface Props {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, meta_title, meta_description, meta_keywords, og_image, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords?.join(', '),
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.og_image ? [post.og_image] : undefined,
      type: 'article',
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}

// Generate static params for all published posts
export async function generateStaticParams() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published')

  return posts?.map(post => ({ slug: post.slug })) || []
}

// Format date helper
function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return ''
  }
}

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  if (!markdown) return ''

  // Normalize line endings and remove excessive indentation
  let html = markdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.replace(/^[\t ]+/, '')) // Remove leading whitespace from each line
    .join('\n')

  html = html
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    .replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>') // Handle numbered lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')

  html = '<p>' + html + '</p>'
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p>(<h[123]>)/g, '$1')
  html = html.replace(/(<\/h[123]>)<\/p>/g, '$1')
  html = html.replace(/<p>(<li>)/g, '<ul>$1')
  html = html.replace(/(<\/li>)<\/p>/g, '$1</ul>')
  // Clean up any remaining empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '')

  return html
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_categories (id, slug, name)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !post) {
    notFound()
  }

  // Fetch related posts
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, featured_image, read_time_minutes')
    .eq('category_id', post.category_id)
    .neq('id', post.id)
    .eq('status', 'published')
    .limit(3)

  // Calculate word count and reading time
  const wordCount = post.content ? post.content.split(/\s+/).filter(Boolean).length : 0
  const readingTimeMinutes = post.read_time_minutes || Math.ceil(wordCount / 200)

  // Build article schema with enhanced E-E-A-T signals
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.meta_description || post.excerpt,
    "wordCount": wordCount,
    "timeRequired": `PT${readingTimeMinutes}M`,
    "author": {
      "@type": "Person",
      "name": post.author_name || "Alex Jensing, MPharm",
      "jobTitle": "MRCP PACES Registered Pharmacist",
      "description": "Qualified physician with expertise in MRCP PACES exam preparation and pharmaceutical education",
      "worksFor": {
        "@type": "Organization",
        "name": "MRCPPACESPREP",
        "url": "https://www.mrcppacesprep.com"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "MRCPPACESPREP",
      "url": "https://www.mrcppacesprep.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.mrcppacesprep.com/logo.png"
      },
      "description": "UK's leading MRCP PACES pre-registration exam preparation platform with 94% pass rate"
    },
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.mrcppacesprep.com/blog/${post.slug}`
    },
    "isPartOf": {
      "@type": "Blog",
      "@id": "https://www.mrcppacesprep.com/blog",
      "name": "MRCP PACES Exam Prep Blog",
      "description": "Expert advice, study tips, and resources for MRCP PACES pre-registration exam success"
    },
    "about": {
      "@type": "Thing",
      "name": "MRCP PACES Pre-Registration Exam",
      "description": "The Practical Assessment of Clinical Examination Skills for MRCP membership in the UK"
    },
    ...(post.featured_image && { "image": post.featured_image }),
  }

  // Breadcrumb schema for better navigation signals
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
        "name": post.title,
        "item": `https://www.mrcppacesprep.com/blog/${post.slug}`
      }
    ]
  }

  // Parse FAQ items (may be stored as string or array)
  const faqItems: { question: string; answer: string }[] = (() => {
    if (!post.faq_items) return []
    if (Array.isArray(post.faq_items)) return post.faq_items
    if (typeof post.faq_items === 'string') {
      try {
        const parsed = JSON.parse(post.faq_items)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  })()

  // FAQ schema
  const faqSchema = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null

  // Parse tags (may be stored as string or array)
  const tags: string[] = (() => {
    if (!post.tags) return []
    if (Array.isArray(post.tags)) return post.tags
    if (typeof post.tags === 'string') {
      try {
        const parsed = JSON.parse(post.tags)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  })()

  // Share URL
  const shareUrl = `https://www.mrcppacesprep.com/blog/${slug}`
  const svgIndex = generateSVGIndex(slug)

  return (
    <main className="blog-detail-page">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav className="blog-breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          {post.blog_categories && (
            <li>
              <Link href={`/blog/category/${Array.isArray(post.blog_categories) ? post.blog_categories[0]?.slug : post.blog_categories.slug}`}>
                {Array.isArray(post.blog_categories) ? post.blog_categories[0]?.name : post.blog_categories.name}
              </Link>
            </li>
          )}
          <li aria-current="page">{post.title}</li>
        </ol>
      </nav>

      <article>
        {/* Header Image/SVG */}
        <div className="blog-detail-header-image">
          {post.featured_image ? (
            <img src={post.featured_image} alt={post.title} />
          ) : (
            <ArticleSVG index={svgIndex} />
          )}
        </div>

        <div className="blog-detail-content">
          <header className="blog-detail-header">
            {/* Meta Section */}
            <div className="blog-detail-meta">
              <div className="blog-detail-meta-info">
                <div className="blog-detail-meta-item">
                  <span className="blog-detail-meta-label">Written by</span>
                  <span className="blog-detail-meta-value">{post.author_name || 'Alex Jensing, MPharm'}</span>
                </div>
                <div className="blog-detail-meta-item">
                  <span className="blog-detail-meta-label">Published on</span>
                  <time className="blog-detail-meta-value" dateTime={post.published_at || post.created_at}>
                    {formatDate(post.published_at || post.created_at)}
                  </time>
                </div>
              </div>
              <div className="blog-detail-social-buttons">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-detail-social-button"
                  aria-label="Share on X (Twitter)"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-detail-social-button"
                  aria-label="Share on LinkedIn"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <h1 className="blog-detail-title">{post.title}</h1>
          </header>

          {/* Article Body */}
          <div className="blog-detail-body">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content || '') }}
            />
          </div>

          {/* Tags - using nofollow since query params aren't ideal for crawling */}
          {tags.length > 0 && (
            <div className="blog-tags-section">
              <h3>Tags</h3>
              <div className="blog-tags">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="blog-tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Internal Links Section - Before CTA */}
          <div className="blog-internal-links">
            <h3>Continue Your MRCP PACES Prep</h3>
            <div className="internal-links-grid">
              <Link href="/question-bank" className="internal-link-card">
                <span className="internal-link-icon">📝</span>
                <span className="internal-link-text">Practice Questions</span>
                <span className="internal-link-desc">2,000+ exam-style questions</span>
              </Link>
              <Link href="/mock-exams" className="internal-link-card">
                <span className="internal-link-icon">📋</span>
                <span className="internal-link-text">Mock Exams</span>
                <span className="internal-link-desc">Full-length timed assessments</span>
              </Link>
              <Link href="/calculations" className="internal-link-card">
                <span className="internal-link-icon">🔢</span>
                <span className="internal-link-text">Calculations</span>
                <span className="internal-link-desc">Master pharmacy maths</span>
              </Link>
            </div>
          </div>

          {/* CTA Section - After Content */}
          <div className="blog-cta-section">
            <div className="blog-cta-badge">Start Practicing Today</div>
            <h2 className="blog-cta-title">Ready to Pass Your MRCP PACES Exam?</h2>
            <p className="blog-cta-description">
              Put this knowledge into practice with 2,000+ exam-style questions.
              94% of our candidates pass on their first attempt.
            </p>
            <div className="blog-cta-buttons">
              <Link href="/try-free" className="blog-cta-primary">
                Try 15 Free Questions
              </Link>
              <Link href="/pricing" className="blog-cta-secondary">
                View Pricing
              </Link>
            </div>
            <p className="blog-cta-subtext">No signup required for free demo</p>
          </div>

          {/* FAQ Section */}
          {faqItems.length > 0 && (
            <div className="faq-section">
              <h2>Frequently Asked Questions</h2>
              {faqItems.map((faq, index) => (
                <div key={index} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <footer className="blog-detail-footer">
            <Link href="/blog" className="back-link">&larr; Back to Articles</Link>
          </footer>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="related-posts-section">
          <div className="related-posts-container">
            <h2>Related Articles</h2>
            <div className="related-posts-grid">
              {relatedPosts.map((relatedPost, index) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="related-post-card"
                >
                  <div className="related-post-image">
                    {relatedPost.featured_image ? (
                      <img src={relatedPost.featured_image} alt={relatedPost.title} />
                    ) : (
                      <ArticleSVG index={generateSVGIndex(relatedPost.slug)} />
                    )}
                  </div>
                  <h3 className="related-post-title">{relatedPost.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
