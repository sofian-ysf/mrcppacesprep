'use client'

import { useState } from 'react'
import Link from 'next/link'
import { faqCategories } from './faqData'
import FAQSEO from '@/app/components/seo/FAQSEO'
import { RelatedPages } from '@/app/components/seo/RelatedPages'

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  'exam-basics': (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  'preparation': (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  'retake': (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  'international': (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'platform': (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter FAQs based on search
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <>
      <FAQSEO />
    <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Frequently Asked Questions
                <span className="block text-gray-600 text-3xl mt-2">Everything About the GPhC Exam</span>
              </h1>
              <p className="mt-6 mx-auto max-w-2xl text-xl text-gray-600">
                Find answers to common questions about the GPhC pre-registration exam, preparation strategies, our platform, and more.
              </p>

              {/* Search Bar */}
              <div className="mt-10 mx-auto max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="bg-[#fbfaf4] px-4 py-8 sm:px-6 lg:px-8 border-y border-gray-200">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Questions
              </button>
              {faqCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {(searchTerm ? filteredCategories : faqCategories)
              .filter(cat => !selectedCategory || cat.id === selectedCategory)
              .map(category => (
                <div key={category.id} className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                      {categoryIcons[category.id]}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  </div>

                  <div className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <details key={index} className="group rounded-lg border border-gray-200 bg-white">
                        <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-gray-900">
                          <span className="pr-4">{faq.question}</span>
                          <svg className="h-5 w-5 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="px-6 pb-6">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}

            {searchTerm && filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No questions found matching "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gray-900 font-medium hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Related Pages */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-[#fbfaf4]">
          <div className="mx-auto max-w-7xl">
            <RelatedPages currentPath="/faq" title="Explore Our Platform" />
          </div>
        </section>

        {/* Still Have Questions CTA */}
        <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Our support team is here to help with any questions about the GPhC exam or our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/help"
                className="inline-block rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-gray-900 transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-4 font-bold text-gray-900">GPhC Exam Prep</h3>
                <p className="text-sm text-gray-600">
                  The UK's leading platform for GPhC Pre-Registration exam preparation.
                </p>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-gray-900">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/question-bank" className="hover:text-gray-900">Question Bank</Link></li>
                  <li><Link href="/mock-exams" className="hover:text-gray-900">Mock Exams</Link></li>
                  <li><Link href="/study-guides" className="hover:text-gray-900">Study Guides</Link></li>
                  <li><Link href="/calculations" className="hover:text-gray-900">Calculations</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-gray-900">Support</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/help" className="hover:text-gray-900">Help Center</Link></li>
                  <li><Link href="/contact" className="hover:text-gray-900">Contact Us</Link></li>
                  <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
                  <li><Link href="/testimonials" className="hover:text-gray-900">Success Stories</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-gray-900">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-gray-900">Terms of Service</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-gray-900">Disclaimer</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
              <p>© 2024 GPhC Exam Prep. All rights reserved.</p>
              <p className="mt-2">Not affiliated with or endorsed by the General Pharmaceutical Council.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
