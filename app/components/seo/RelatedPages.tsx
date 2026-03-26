'use client'

import Link from 'next/link'

interface RelatedPage {
  href: string
  title: string
  description: string
}

// Pre-defined related page mappings for better internal linking
const PAGE_RELATIONS: Record<string, RelatedPage[]> = {
  '/gphc-exam-questions': [
    { href: '/question-bank', title: 'Question Bank', description: 'Access 2000+ practice questions' },
    { href: '/mock-exams', title: 'Mock Exams', description: 'Test yourself under exam conditions' },
    { href: '/calculations', title: 'Calculations', description: 'Practice clinical calculations' },
  ],
  '/question-bank': [
    { href: '/gphc-exam-questions', title: 'MRCP PACES Exam Questions', description: 'Learn about question types' },
    { href: '/mock-exams', title: 'Mock Exams', description: 'Take full-length practice tests' },
    { href: '/study-guides', title: 'Study Guides', description: 'Download revision materials' },
  ],
  '/mock-exams': [
    { href: '/question-bank', title: 'Question Bank', description: 'Practice individual questions' },
    { href: '/calculations', title: 'Calculations', description: 'Master clinical calculations' },
    { href: '/pricing', title: 'Pricing', description: 'View subscription plans' },
  ],
  '/calculations': [
    { href: '/question-bank', title: 'Question Bank', description: 'Practice SBA and EMQ questions' },
    { href: '/mock-exams', title: 'Mock Exams', description: 'Full exam simulations' },
    { href: '/study-guides', title: 'Study Guides', description: 'Download calculation guides' },
  ],
  '/study-guides': [
    { href: '/resources', title: 'Free Resources', description: 'Access more revision materials' },
    { href: '/question-bank', title: 'Question Bank', description: 'Practice what you learn' },
    { href: '/blog', title: 'Blog', description: 'Tips and strategies' },
  ],
  '/blog': [
    { href: '/resources', title: 'Resources', description: 'Free study materials' },
    { href: '/faq', title: 'FAQ', description: 'Common questions answered' },
    { href: '/gphc-exam-questions', title: 'MRCP PACES Exam Questions', description: 'Start practicing' },
  ],
  '/resources': [
    { href: '/study-guides', title: 'Study Guides', description: 'Comprehensive revision guides' },
    { href: '/blog', title: 'Blog', description: 'Expert tips and advice' },
    { href: '/question-bank', title: 'Question Bank', description: 'Practice questions' },
  ],
  '/pricing': [
    { href: '/testimonials', title: 'Testimonials', description: 'What our students say' },
    { href: '/faq', title: 'FAQ', description: 'Common questions' },
    { href: '/question-bank', title: 'Question Bank', description: 'See what you get' },
  ],
  '/faq': [
    { href: '/pricing', title: 'Pricing', description: 'View our plans' },
    { href: '/contact', title: 'Contact', description: 'Get in touch' },
    { href: '/about', title: 'About', description: 'Learn about us' },
  ],
  '/about': [
    { href: '/testimonials', title: 'Testimonials', description: 'Student success stories' },
    { href: '/contact', title: 'Contact', description: 'Get in touch with us' },
    { href: '/pricing', title: 'Pricing', description: 'View subscription plans' },
  ],
  '/testimonials': [
    { href: '/pricing', title: 'Pricing', description: 'Start your journey' },
    { href: '/about', title: 'About', description: 'Learn about us' },
    { href: '/question-bank', title: 'Question Bank', description: 'Try our questions' },
  ],
}

// Default related pages for any page
const DEFAULT_RELATED: RelatedPage[] = [
  { href: '/gphc-exam-questions', title: 'MRCP PACES Exam Questions', description: 'Start your exam preparation' },
  { href: '/pricing', title: 'Pricing', description: 'View subscription plans' },
  { href: '/blog', title: 'Blog', description: 'Tips and strategies' },
]

interface RelatedPagesProps {
  currentPath: string
  customRelated?: RelatedPage[]
  className?: string
  title?: string
}

export function RelatedPages({
  currentPath,
  customRelated,
  className = '',
  title = 'Related Pages',
}: RelatedPagesProps) {
  const relatedPages = customRelated || PAGE_RELATIONS[currentPath] || DEFAULT_RELATED

  return (
    <section aria-label="Related content" className={`py-8 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {relatedPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <h3 className="font-medium text-gray-900">{page.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{page.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export { PAGE_RELATIONS, DEFAULT_RELATED }
export type { RelatedPage }
