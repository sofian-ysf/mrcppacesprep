import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { RelatedPages } from '@/app/components/seo/RelatedPages'
import FAQSection from '@/app/components/FAQSection'

export const metadata: Metadata = {
  title: 'MRCP PACES Practice Questions 2026 | 2000+ Questions | 94% Pass Rate',
  description: 'Practice MRCP PACES exam questions online. 2000+ questions with detailed answers. SBA, EMQ & calculations. 94% pass rate. Start preparing today.',
  keywords: [
    'MRCP PACES practice questions', 'MRCP PACES exam practice', 'pharmacy practice questions UK',
    'pre-reg practice questions', 'MRCP PACES mock questions', 'pharmacy exam practice',
    'MRCP PACES practice test online', 'MRCP PACES questions 2026', 'MRCP PACES revision questions',
    'pharmaceutical calculations practice', 'clinical pharmacy questions practice'
  ],
  openGraph: {
    title: 'MRCP PACES Practice Questions 2026 | 2000+ Questions | 94% Pass Rate',
    description: 'Practice MRCP PACES exam questions online. 2000+ questions with detailed answers. Start preparing today.',
    url: 'https://www.mrcppacesprep.com/gphc-practice-questions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MRCP PACES Practice Questions 2026 | 94% Pass Rate',
    description: '2000+ MRCP PACES practice questions. Start preparing today!'
  },
  alternates: {
    canonical: '/gphc-practice-questions',
  },
}

const practiceQuestionsFAQs = [
  {
    question: "How similar are your questions to the real MRCP PACES exam?",
    answer: "Very similar. Our questions are written by recently-qualified physicians using the MRCP PACES framework. Students often say our questions are slightly harder, which better prepares them."
  },
  {
    question: "How many practice questions do you have?",
    answer: "Over 2,000 questions across all MRCP PACES topics: calculations (350+), clinical pharmacy (400+), therapeutics (400+), law & ethics (300+), pharmacology (350+), and more."
  },
  {
    question: "What difficulty levels are the questions?",
    answer: "Questions range from foundation to advanced. Our adaptive system starts with moderate difficulty and adjusts based on your performance to optimise learning."
  },
  {
    question: "Do practice questions have explanations?",
    answer: "Every question has detailed explanations covering why the correct answer is right and why each incorrect option is wrong. You learn from every attempt."
  },
  {
    question: "How many questions should I practice daily?",
    answer: "We recommend 30-50 questions daily. Quality matters more than quantity - read all explanations, even for correct answers. Track weak areas and focus there."
  },
  {
    question: "Can I practice specific topics?",
    answer: "Yes! Filter by topic, difficulty, or question type. Focus on weak areas identified by your analytics dashboard. Create custom practice sessions."
  }
]

export default function MRCP PACESPracticeQuestionsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How many MRCP PACES practice questions do you have?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We have over 2000 MRCP PACES practice questions covering all exam topics including calculations, clinical pharmacy, law and ethics, pharmaceutics, and pharmacology."
        }
      },
      {
        "@type": "Question",
        "name": "Are your practice questions similar to the real MRCP PACES exam?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our questions are written by registered physicians who have recently passed the exam. Many students report our questions are slightly harder than the actual exam, helping them feel more prepared."
        }
      },
      {
        "@type": "Question",
        "name": "What question formats are included?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We include all MRCP PACES exam formats: Single Best Answer (SBA) questions, Extended Matching Questions (EMQ), and pharmaceutical calculation questions."
        }
      }
    ]
  }

  return (
    <>
      <Script
        id="practice-questions-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                MRCP PACES Practice Questions 2026
                <span className="block text-gray-600 text-3xl mt-2">2000+ Questions with Detailed Explanations</span>
              </h1>
              <p className="mt-6 mx-auto max-w-2xl text-xl text-gray-600">
                Practice with exam-style questions written by physicians who recently passed. Get instant feedback, track your progress, and build confidence for exam day.
              </p>
              <div className="mt-10 flex gap-4 justify-center flex-col sm:flex-row">
                <Link
                  href="/signup"
                  className="pill-btn pill-btn-primary pill-btn-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="#question-types"
                  className="pill-btn pill-btn-secondary pill-btn-lg"
                >
                  See Question Types
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y bg-[#fbfaf4] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">2,000+</div>
                <div className="text-sm text-gray-600">Practice Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">94%</div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">8,500+</div>
                <div className="text-sm text-gray-600">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">4.8/5</div>
                <div className="text-sm text-gray-600">Student Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Question Types */}
        <section id="question-types" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Practice All MRCP PACES Question Formats
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="pill-card text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Single Best Answer (SBA)</h3>
                <p className="text-gray-600 mb-4">Choose the single best answer from 5 options. The most common format in the MRCP PACES exam.</p>
                <span className="text-sm text-blue-600 font-semibold">1,200+ questions available</span>
              </div>

              <div className="pill-card text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Extended Matching (EMQ)</h3>
                <p className="text-gray-600 mb-4">Match clinical scenarios to the most appropriate option from a list.</p>
                <span className="text-sm text-green-600 font-semibold">500+ questions available</span>
              </div>

              <div className="pill-card text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Calculations</h3>
                <p className="text-gray-600 mb-4">Solve pharmaceutical calculations with step-by-step solutions.</p>
                <span className="text-sm text-purple-600 font-semibold">350+ questions available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Topics Covered */}
        <section className="bg-[#fbfaf4] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              MRCP PACES Practice Questions by Topic
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Pharmaceutical Calculations</h3>
                <p className="text-sm text-gray-600 mb-3">Dosage, dilutions, concentrations, infusion rates</p>
                <span className="text-sm text-blue-600">350+ questions</span>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Clinical Pharmacy</h3>
                <p className="text-sm text-gray-600 mb-3">Drug interactions, therapeutics, patient care</p>
                <span className="text-sm text-blue-600">400+ questions</span>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Pharmacy Law & Ethics</h3>
                <p className="text-sm text-gray-600 mb-3">Legal requirements, controlled drugs, standards</p>
                <span className="text-sm text-blue-600">300+ questions</span>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Pharmacology</h3>
                <p className="text-sm text-gray-600 mb-3">Drug mechanisms, pharmacokinetics, adverse effects</p>
                <span className="text-sm text-blue-600">350+ questions</span>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Pharmaceutics</h3>
                <p className="text-sm text-gray-600 mb-3">Formulation, stability, quality assurance</p>
                <span className="text-sm text-blue-600">250+ questions</span>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Public Health</h3>
                <p className="text-sm text-gray-600 mb-3">Health promotion, screening, disease prevention</p>
                <span className="text-sm text-blue-600">200+ questions</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection
          faqs={practiceQuestionsFAQs}
          title="MRCP PACES Practice Questions - FAQ"
          className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
          disableSchema={true}
        />

        {/* Related Pages */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-[#fbfaf4]">
          <div className="mx-auto max-w-7xl">
            <RelatedPages currentPath="/gphc-practice-questions" title="Continue Your Preparation" />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Practicing MRCP PACES Questions Today
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 8,500+ students who passed their exam
            </p>
            <Link
              href="/signup"
              className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
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
            <p className="mt-2">Not affiliated with or endorsed by the General Pharmaceutical Council.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
