'use client'

import Link from 'next/link'

interface InternalLink {
  href: string
  label: string
  description?: string
}

const PRODUCT_LINKS: InternalLink[] = [
  { href: '/mrcp-paces-exam-questions', label: 'MRCP PACES Exam Questions', description: 'Practice with 2000+ exam questions' },
  { href: '/question-bank', label: 'Question Bank', description: 'Access our complete question database' },
  { href: '/mock-exams', label: 'Mock Exams', description: 'Simulate real exam conditions' },
  { href: '/calculations', label: 'Calculations', description: 'Practice clinical calculations' },
  { href: '/study-guides', label: 'Study Guides', description: 'Download comprehensive guides' },
]

const RESOURCE_LINKS: InternalLink[] = [
  { href: '/resources', label: 'Free Resources', description: 'Access free revision materials' },
  { href: '/blog', label: 'Blog', description: 'Tips and strategies for exam success' },
  { href: '/faq', label: 'FAQ', description: 'Common questions answered' },
]

const TRUST_LINKS: InternalLink[] = [
  { href: '/testimonials', label: 'Student Reviews', description: 'Read success stories' },
  { href: '/about', label: 'About Us', description: 'Learn about our team' },
  { href: '/pricing', label: 'Pricing', description: 'View subscription plans' },
]

interface InternalLinksProps {
  variant?: 'footer' | 'sidebar' | 'inline'
  showProducts?: boolean
  showResources?: boolean
  showTrust?: boolean
  className?: string
}

export function InternalLinks({
  variant = 'footer',
  showProducts = true,
  showResources = true,
  showTrust = true,
  className = '',
}: InternalLinksProps) {
  if (variant === 'inline') {
    // Inline variant for within-content linking
    const allLinks = [
      ...(showProducts ? PRODUCT_LINKS : []),
      ...(showResources ? RESOURCE_LINKS : []),
      ...(showTrust ? TRUST_LINKS : []),
    ]

    return (
      <nav aria-label="Related pages" className={`flex flex-wrap gap-2 ${className}`}>
        {allLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    )
  }

  if (variant === 'sidebar') {
    return (
      <aside aria-label="Related content" className={`space-y-6 ${className}`}>
        {showProducts && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Our Products</h3>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {showResources && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    )
  }

  // Footer variant (default)
  return (
    <nav aria-label="Site navigation" className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
      {showProducts && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Exam Preparation</h3>
          <ul className="space-y-3">
            {PRODUCT_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors block"
                  title={link.description}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showResources && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
          <ul className="space-y-3">
            {RESOURCE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors block"
                  title={link.description}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showTrust && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
          <ul className="space-y-3">
            {TRUST_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors block"
                  title={link.description}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

// Export link arrays for use elsewhere
export { PRODUCT_LINKS, RESOURCE_LINKS, TRUST_LINKS }
