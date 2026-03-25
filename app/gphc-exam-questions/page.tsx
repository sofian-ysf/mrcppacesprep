import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import MRCP PACESExamQuestionsSEO from '@/app/components/seo/MRCP PACESExamQuestionsSEO'
import { RelatedPages } from '@/app/components/seo/RelatedPages'

export const metadata: Metadata = {
  title: 'MRCP PACES Exam Questions 2026 | 2000+ Practice Questions | 94% Pass Rate',
  description: '2000+ MRCP PACES exam practice questions for 2026 with detailed explanations. SBA, EMQ & calculations. 94% pass rate. 8,500+ students. Start preparing today.',
  keywords: [
    'MRCP PACES exam questions', 'MRCP PACES practice questions', 'MRCP PACES exam questions 2026', 'MRCP PACES past papers',
    'MRCP PACES MCQ questions', 'pre-reg exam questions', 'pharmacy exam questions UK', 'MRCP PACES SBA questions',
    'MRCP PACES EMQ questions', 'MRCP PACES calculation questions', 'MRCP PACES questions free', 'MRCP PACES practice test',
    'pharmacy pre-registration questions', 'MRCP PACES question bank', 'MRCP PACES exam preparation',
    'clinical pharmacy questions', 'pharmacy law questions UK', 'pharmacology exam questions'
  ],
  openGraph: {
    title: 'MRCP PACES Exam Questions 2026 | 2000+ Practice Questions | 94% Pass Rate',
    description: '2000+ MRCP PACES exam practice questions for 2026 with detailed explanations. SBA, EMQ & calculations. 94% pass rate.',
    url: 'https://www.mrcppacesprep.com/gphc-exam-questions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MRCP PACES Exam Questions | 2000+ Practice Questions | 94% Pass Rate',
    description: '2000+ MRCP PACES practice questions with detailed explanations. 94% pass rate. Start preparing today!'
  },
  alternates: {
    canonical: '/gphc-exam-questions',
  },
}

export default function MRCP PACESExamQuestionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "MRCP PACES Exam Questions",
    "description": "Practice with 2000+ MRCP PACES exam questions with detailed explanations",
    "url": "https://www.mrcppacesprep.com/gphc-exam-questions",
    "mainEntity": {
      "@type": "ItemList",
      "name": "MRCP PACES Exam Question Categories",
      "numberOfItems": 10,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Pharmaceutical Calculations",
          "description": "Master dosage calculations, dilutions, and formulations"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Clinical Pharmacy",
          "description": "Drug interactions, therapeutics, and patient care"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Pharmacy Law & Ethics",
          "description": "Legal requirements and professional standards"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Pharmaceutics",
          "description": "Drug formulation, stability, and delivery systems"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Pharmacology",
          "description": "Drug mechanisms, pharmacokinetics, and pharmacodynamics"
        }
      ]
    }
  }

  return (
    <>
      <MRCP PACESExamQuestionsSEO />
      <Script
        id="gphc-questions-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                MRCP PACES Exam Questions Bank
                <span className="block text-gray-600 text-3xl mt-2">2000+ Practice Questions with Detailed Answers</span>
              </h1>
              <p className="mt-6 mx-auto max-w-2xl text-xl text-gray-600">
                Master every topic with our comprehensive question bank. Get instant feedback, track your progress, and identify weak areas to focus your study time effectively.
              </p>
              <div className="mt-10 flex gap-4 justify-center flex-col sm:flex-row">
                <Link
                  href="/signup"
                  className="pill-btn pill-btn-primary pill-btn-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="#topics"
                  className="pill-btn pill-btn-secondary pill-btn-lg"
                >
                  Browse Topics
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y bg-[#fbfaf4] py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">2,000+</div>
                <div className="text-sm text-gray-600">Exam Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Topic Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">94%</div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Access</div>
              </div>
            </div>
          </div>
        </section>

        {/* Question Categories */}
        <section id="topics" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Question Categories Aligned with MRCP PACES Framework
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Category Cards */}
              <div className="pill-card">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pharmaceutical Calculations</h3>
                <p className="text-gray-600 mb-4">350+ questions covering dosage calculations, dilutions, concentrations, and formulations</p>
                <div className="flex items-center justify-between">
                  <span className="pill-badge">Difficulty: High</span>
                  <Link href="/signup" className="pill-btn pill-btn-primary pill-btn-sm">
                    Practice Now
                  </Link>
                </div>
              </div>

              <div className="pill-card">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Clinical Pharmacy & Therapeutics</h3>
                <p className="text-gray-600 mb-4">400+ questions on drug interactions, patient counseling, and evidence-based practice</p>
                <div className="flex items-center justify-between">
                  <span className="pill-badge">Difficulty: Medium</span>
                  <Link href="/signup" className="pill-btn pill-btn-primary pill-btn-sm">
                    Practice Now
                  </Link>
                </div>
              </div>

              <div className="pill-card">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pharmacy Law & Ethics</h3>
                <p className="text-gray-600 mb-4">300+ questions on legal requirements, controlled drugs, and professional standards</p>
                <div className="flex items-center justify-between">
                  <span className="pill-badge">Difficulty: Medium</span>
                  <Link href="/signup" className="pill-btn pill-btn-primary pill-btn-sm">
                    Practice Now
                  </Link>
                </div>
              </div>

              <div className="pill-card">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pharmaceutics</h3>
                <p className="text-gray-600 mb-4">250+ questions on drug formulation, stability, and pharmaceutical technology</p>
                <div className="flex items-center justify-between">
                  <span className="pill-badge">Difficulty: Medium</span>
                  <Link href="/signup" className="pill-btn pill-btn-primary pill-btn-sm">
                    Practice Now
                  </Link>
                </div>
              </div>

              <div className="pill-card">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pharmacology</h3>
                <p className="text-gray-600 mb-4">350+ questions on drug mechanisms, pharmacokinetics, and adverse effects</p>
                <div className="flex items-center justify-between">
                  <span className="pill-badge">Difficulty: High</span>
                  <Link href="/signup" className="pill-btn pill-btn-primary pill-btn-sm">
                    Practice Now
                  </Link>
                </div>
              </div>

              <div className="pill-card">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Public Health & Prevention</h3>
                <p className="text-gray-600 mb-4">200+ questions on health promotion, screening services, and disease prevention</p>
                <div className="flex items-center justify-between">
                  <span className="pill-badge">Difficulty: Low</span>
                  <Link href="/signup" className="pill-btn pill-btn-primary pill-btn-sm">
                    Practice Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[#fbfaf4] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Our Question Bank Works
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-8 w-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Instant Feedback</h3>
                <p className="text-gray-600">Get immediate explanations for both correct and incorrect answers to reinforce learning</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-8 w-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Performance Analytics</h3>
                <p className="text-gray-600">Track your progress by topic and identify areas that need more practice</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-8 w-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Adaptive Learning</h3>
                <p className="text-gray-600">Questions adapt to your performance level, focusing on areas where you need improvement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-[#fbfaf4]">
          <div className="mx-auto max-w-7xl">
            <RelatedPages currentPath="/gphc-exam-questions" title="Continue Your Preparation" />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Practicing MRCP PACES Exam Questions Today
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of students who passed their exam using our question bank
            </p>
            <Link
              href="/signup"
              className="pill-btn pill-btn-secondary pill-btn-lg"
            >
              Get Started
            </Link>
            <p className="mt-4 text-gray-400">7-day money-back guarantee</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center text-sm text-gray-600">
            <p>© 2024 MRCPPACESPREP. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}