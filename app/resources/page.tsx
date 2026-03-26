import { Metadata } from 'next'
import Link from 'next/link'
import ResourcesSEO from '@/app/components/seo/ResourcesSEO'
import { RelatedPages } from '@/app/components/seo/RelatedPages'
import FAQSection from '@/app/components/FAQSection'

const resourcesFAQs = [
  {
    question: "Are the study resources free to download?",
    answer: "Some resources are free for all users. Premium study guides, calculation worksheets, and revision notes are included with any paid subscription."
  },
  {
    question: "What formats are resources available in?",
    answer: "Resources are available as downloadable PDFs for offline study. Some interactive content is web-based. All resources work on desktop, tablet, and mobile."
  },
  {
    question: "Are resources updated for 2026?",
    answer: "Yes! All resources are updated annually to reflect the latest MRCP PACES framework, BNF changes, and NICE guidelines. Last update: January 2026."
  },
  {
    question: "What topics do study guides cover?",
    answer: "We have guides for calculations, clinical pharmacy, therapeutics, law & ethics, pharmacology, and pharmaceutics. Each topic has dedicated revision materials."
  },
  {
    question: "Can I print the study resources?",
    answer: "Yes, all PDF resources are printable. Many students prefer to annotate printed copies alongside digital practice questions."
  }
]

export const metadata: Metadata = {
  title: 'MRCP PACES Exam Resources 2025 | Study Guides | Formula Sheets | £30/month',
  description: 'Comprehensive MRCP PACES exam resources. Calculation guides, clinical references, BNF summaries, formula sheets. Created by physicians. 94% pass rate. £30/month.',
  keywords: [
    'MRCP PACES exam resources', 'MRCP PACES study materials', 'clinical examination guide', 'MRCP PACES checklists',
    'MRCP PACES exam resources', 'MRCP PACES revision notes', 'history taking guide', 'MRCP PACES exam tips',
    'clinical examination reference', 'medical ethics summary', 'communication skills guide', 'MRCP PACES exam strategy',
    'MRCP PACES study guides UK', 'MRCP PACES preparation resources', 'exam preparation materials'
  ],
  openGraph: {
    title: 'MRCP PACES Exam Resources | Study Guides | Formula Sheets | £30/month',
    description: 'Comprehensive MRCP PACES study resources. Calculation guides, clinical references, formula sheets. Created by physicians.',
    url: 'https://www.mrcppacesprep.com/resources',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MRCP PACES Exam Resources | Study Guides | Formula Sheets',
    description: 'Comprehensive MRCP PACES exam resources created by physicians. 94% pass rate.'
  },
  alternates: {
    canonical: '/resources',
  },
}

export default function ResourcesPage() {
  return (
    <>
      <ResourcesSEO />
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Study Resources & Guides
              <span className="block text-gray-600 text-3xl mt-2">Everything You Need to Pass Your MRCP PACES Exam</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-xl text-gray-600">
              Access comprehensive study materials, calculation guides, clinical references, and proven exam strategies to maximize your chances of success.
            </p>
            <div className="mt-10">
              <Link
                href="/signup"
                className="rounded-lg bg-gray-900 px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                Access All Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Study Guides Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Study Guides
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pharmaceutical Calculations</h3>
              <p className="text-gray-600 mb-4">Master dosage calculations, dilutions, concentrations, and unit conversions with step-by-step guides and practice problems.</p>
              <Link href="/signup" className="text-gray-900 font-semibold hover:underline">
                Download Guide →
              </Link>
            </div>

            <div className="rounded-xl border bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Clinical Pharmacy & Therapeutics</h3>
              <p className="text-gray-600 mb-4">Comprehensive guides on drug interactions, patient counseling, evidence-based practice, and therapeutic monitoring.</p>
              <Link href="/signup" className="text-gray-900 font-semibold hover:underline">
                Download Guide →
              </Link>
            </div>

            <div className="rounded-xl border bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pharmacy Law & Ethics</h3>
              <p className="text-gray-600 mb-4">Essential legal requirements, controlled drugs regulations, professional standards, and ethical decision-making frameworks.</p>
              <Link href="/signup" className="text-gray-900 font-semibold hover:underline">
                Download Guide →
              </Link>
            </div>

            <div className="rounded-xl border bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pharmaceutics & Formulation</h3>
              <p className="text-gray-600 mb-4">Drug formulation principles, stability testing, pharmaceutical technology, and quality assurance processes.</p>
              <Link href="/signup" className="text-gray-900 font-semibold hover:underline">
                Download Guide →
              </Link>
            </div>

            <div className="rounded-xl border bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pharmacology & Mechanisms</h3>
              <p className="text-gray-600 mb-4">Drug mechanisms of action, pharmacokinetics, pharmacodynamics, and adverse effect management strategies.</p>
              <Link href="/signup" className="text-gray-900 font-semibold hover:underline">
                Download Guide →
              </Link>
            </div>

            <div className="rounded-xl border bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
                <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Public Health & Prevention</h3>
              <p className="text-gray-600 mb-4">Health promotion strategies, screening services, vaccination programs, and disease prevention protocols.</p>
              <Link href="/signup" className="text-gray-900 font-semibold hover:underline">
                Download Guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Materials Section */}
      <section className="bg-[#fbfaf4] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Interactive Practice Materials
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <svg className="h-8 w-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Question Bank</h3>
              <p className="text-gray-600 mb-4">2,000+ practice questions with detailed explanations covering all exam topics</p>
              <Link href="/signup" className="text-gray-900 font-semibold hover:underline">
                Start Practicing →
              </Link>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <svg className="h-8 w-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Mock Exams</h3>
              <p className="text-gray-600 mb-4">Timed practice exams that simulate the real MRCP PACES exam experience</p>
              <Link href="/signup" className="text-gray-900 font-semibold hover:underline">
                Take Mock Exam →
              </Link>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <svg className="h-8 w-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Flashcards</h3>
              <p className="text-gray-600 mb-4">Quick-review flashcards for key concepts, formulas, and drug information</p>
              <Link href="/signup" className="text-gray-900 font-semibold hover:underline">
                Review Flashcards →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Tips Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Proven Exam Success Strategies
          </h2>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">Time Management</h3>
                  <p className="text-gray-600">Learn how to allocate time effectively during the exam and avoid common time-wasting mistakes.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">Quick Calculation Methods</h3>
                  <p className="text-gray-600">Master shortcut techniques for pharmaceutical calculations to save time and reduce errors.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">Stress Management</h3>
                  <p className="text-gray-600">Techniques to stay calm under pressure and maintain focus throughout the examination.</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-[#fbfaf4] to-gray-100 p-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Study Schedule Template</h3>
              <div className="space-y-4">
                <div className="rounded-lg bg-white p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">3 Months Before Exam</h4>
                  <p className="text-sm text-gray-600">Complete foundation topics, start question practice (30 questions/day)</p>
                </div>
                <div className="rounded-lg bg-white p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">6 Weeks Before Exam</h4>
                  <p className="text-sm text-gray-600">Intensive question practice (50+ questions/day), identify weak areas</p>
                </div>
                <div className="rounded-lg bg-white p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">2 Weeks Before Exam</h4>
                  <p className="text-sm text-gray-600">Full mock exams, review mistakes, final calculations practice</p>
                </div>
                <div className="mt-6">
                  <Link href="/signup" className="inline-block w-full text-center rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors">
                    Get Personalized Study Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-[#fbfaf4]">
        <div className="mx-auto max-w-7xl">
          <RelatedPages currentPath="/resources" title="Continue Your Preparation" />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        faqs={resourcesFAQs}
        title="Study Resources - FAQ"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
        disableSchema={true}
      />

      {/* CTA Section */}
      <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Access All Resources
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get instant access to study guides, practice questions, and exam strategies
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Start Learning Today
          </Link>
          <p className="mt-4 text-gray-400">7-day money-back guarantee • Instant access</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold text-gray-900">MRCPPACESPREP</h3>
              <p className="text-sm text-gray-600">
                The UK's leading platform for MRCP PACES Pre-Registration exam preparation.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/question-bank" className="hover:text-gray-900">Question Bank</Link></li>
                <li><Link href="/mock-exams" className="hover:text-gray-900">Mock Exams</Link></li>
                <li><Link href="/study-guides" className="hover:text-gray-900">Study Guides</Link></li>
                <li><Link href="/calculations" className="hover:text-gray-900">Calculations Practice</Link></li>
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
                <li><Link href="/support" className="hover:text-gray-900">Support</Link></li>
                <li><Link href="/disclaimer" className="hover:text-gray-900">Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 MRCPPACESPREP. All rights reserved.</p>
            <p className="mt-2">Not affiliated with or endorsed by the Royal College of Physicians.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}