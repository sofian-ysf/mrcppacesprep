import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { RelatedPages } from '@/app/components/seo/RelatedPages'
import FAQSection from '@/app/components/FAQSection'

export const metadata: Metadata = {
  title: 'MRCP PACES Exam Guide 2026 | Format, Dates, Tips & How to Pass',
  description: 'Complete MRCP PACES exam guide for 2026. Learn about exam format, dates, fees, pass rates, topics covered, and how to prepare effectively. Expert tips from physicians.',
  keywords: [
    'MRCP PACES exam', 'MRCP PACES exam guide', 'MRCP PACES exam 2026', 'MRCP PACES exam format',
    'MRCP PACES exam dates', 'MRCP PACES exam tips', 'how to pass MRCP PACES exam',
    'MRCP PACES exam topics', 'MRCP PACES exam pass rate', 'MRCP PACES exam UK',
    'medical exam guide', 'MRCP PACES assessment'
  ],
  openGraph: {
    title: 'MRCP PACES Exam Guide 2026 | Complete Preparation Guide',
    description: 'Everything you need to know about the MRCP PACES exam. Format, dates, topics, and expert preparation tips.',
    url: 'https://www.mrcppacesprep.com/gphc-exam-guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MRCP PACES Exam Guide 2026 | How to Pass First Time',
    description: 'Complete guide to the MRCP PACES exam. Learn the format, topics, and preparation strategies.'
  },
  alternates: {
    canonical: '/gphc-exam-guide',
  },
}

const examGuideFAQs = [
  {
    question: "When is the MRCP PACES exam in 2026?",
    answer: "The MRCP PACES exam runs twice yearly, typically in June and September. The June 2026 sitting registration opens in April 2026. Check the MRCP PACES website for exact dates."
  },
  {
    question: "What is the MRCP PACES exam pass mark?",
    answer: "The pass mark is set using the Angoff method and varies each sitting, typically around 65-70%. You need to meet the standard for both calculation and non-calculation sections."
  },
  {
    question: "What question types are on the MRCP PACES exam?",
    answer: "The exam has 90 Single Best Answer (SBA) questions and 20 Extended Matching Questions (EMQs). Topics include calculations, therapeutics, clinical pharmacy, law, and pharmaceutics."
  },
  {
    question: "How do I register for the MRCP PACES exam?",
    answer: "Register through the MRCP PACES online portal during the registration window. You'll need to pay the £253 exam fee and provide proof of pre-registration training completion."
  },
  {
    question: "Can I use a calculator in the MRCP PACES exam?",
    answer: "Yes, a basic on-screen calculator is provided for calculation questions. You cannot bring your own calculator. Practice with our calculation questions to build speed."
  },
  {
    question: "What happens if I fail the MRCP PACES exam?",
    answer: "You can retake the exam at the next sitting. There's no limit on attempts, but you'll need to pay the exam fee each time. Most retake candidates pass with focused preparation."
  },
  {
    question: "How long are MRCP PACES exam results valid?",
    answer: "Once you pass, your result doesn't expire. However, you must complete your pre-registration training and apply for registration within a reasonable timeframe."
  },
  {
    question: "What ID do I need for the MRCP PACES exam?",
    answer: "Bring valid photo ID (passport or UK driving licence) that matches your registration name exactly. Arrive 30 minutes early to allow time for check-in."
  }
];

export default function MRCP PACESExamGuidePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Complete MRCP PACES Exam Guide 2026: Format, Dates & How to Pass",
    "description": "Everything you need to know about the MRCP PACES pre-registration exam in 2026. Expert tips, preparation strategies, and resources to help you pass first time.",
    "author": {
      "@type": "Organization",
      "name": "MRCPPACESPREP"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MRCPPACESPREP",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.mrcppacesprep.com/logo.png"
      }
    },
    "datePublished": "2024-01-01",
    "dateModified": "2026-01-29"
  }

  return (
    <>
      <Script
        id="exam-guide-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        strategy="beforeInteractive"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Complete MRCP PACES Exam Guide 2026
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Everything you need to know about the MRCP PACES pre-registration exam. Format, dates, topics, and expert strategies to help you pass first time.
              </p>
              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <Link href="#format" className="text-blue-600 hover:underline">Exam Format</Link>
                <span className="text-gray-300">|</span>
                <Link href="#dates" className="text-blue-600 hover:underline">2026 Dates</Link>
                <span className="text-gray-300">|</span>
                <Link href="#topics" className="text-blue-600 hover:underline">Topics Covered</Link>
                <span className="text-gray-300">|</span>
                <Link href="#preparation" className="text-blue-600 hover:underline">How to Prepare</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Facts */}
        <section className="border-y bg-[#fbfaf4] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">110</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">2.5 hours</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">£237</div>
                <div className="text-sm text-gray-600">Exam Fee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">~75%</div>
                <div className="text-sm text-gray-600">National Pass Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <article className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl prose prose-lg">
            {/* What is the MRCP PACES Exam */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is the MRCP PACES Exam?</h2>
              <p className="text-gray-600 mb-4">
                The MRCP PACES (Practical Assessment of Clinical Examination Skills) is a mandatory clinical examination for doctors pursuing MRCP membership in the UK. It tests your clinical examination skills, communication abilities, and medical knowledge through a series of patient encounters.
              </p>
              <p className="text-gray-600">
                The exam consists of five clinical stations held at approved examination centres. You must pass this exam to obtain MRCP(UK) membership and progress in your medical career.
              </p>
            </section>

            {/* Exam Format */}
            <section id="format" className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MRCP PACES Exam Format</h2>
              <p className="text-gray-600 mb-6">
                The MRCP PACES exam consists of 110 questions to be completed in 2.5 hours (150 minutes). The exam includes three question types:
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-[#fbfaf4] rounded-lg p-4">
                  <h3 className="font-bold text-gray-900">Single Best Answer (SBA)</h3>
                  <p className="text-sm text-gray-600">Choose the single best answer from 5 options. This is the most common question format.</p>
                </div>
                <div className="bg-[#fbfaf4] rounded-lg p-4">
                  <h3 className="font-bold text-gray-900">Extended Matching Questions (EMQ)</h3>
                  <p className="text-sm text-gray-600">Match clinical scenarios to the most appropriate option from a longer list of answers.</p>
                </div>
                <div className="bg-[#fbfaf4] rounded-lg p-4">
                  <h3 className="font-bold text-gray-900">Calculation Questions</h3>
                  <p className="text-sm text-gray-600">Solve pharmaceutical calculations and enter numerical answers directly.</p>
                </div>
              </div>
            </section>

            {/* Exam Dates */}
            <section id="dates" className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MRCP PACES Exam Dates 2026</h2>
              <p className="text-gray-600 mb-4">
                The MRCP PACES exam is typically held twice per year. The 2026 exam dates are:
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>June 2026</strong> - Exact dates announced by MRCP PACES</li>
                  <li><strong>September 2026</strong> - Exact dates announced by MRCP PACES</li>
                </ul>
              </div>
              <p className="text-gray-600">
                Registration opens approximately 3 months before each sitting. Check the official MRCP PACES website for confirmed dates and registration deadlines.
              </p>
            </section>

            {/* Topics Covered */}
            <section id="topics" className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Topics Are Covered?</h2>
              <p className="text-gray-600 mb-6">
                The MRCP PACES exam covers all areas of the MRCP PACES framework for initial education and training:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Pharmaceutical Calculations</h3>
                  <p className="text-sm text-gray-600">Dosage calculations, dilutions, concentrations, IV flow rates</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Clinical Pharmacy & Therapeutics</h3>
                  <p className="text-sm text-gray-600">Drug interactions, patient counseling, evidence-based practice</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Pharmacy Law & Ethics</h3>
                  <p className="text-sm text-gray-600">Legal requirements, controlled drugs, professional standards</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Pharmacology</h3>
                  <p className="text-sm text-gray-600">Drug mechanisms, pharmacokinetics, adverse effects</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Pharmaceutics</h3>
                  <p className="text-sm text-gray-600">Drug formulation, stability, pharmaceutical technology</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">Public Health</h3>
                  <p className="text-sm text-gray-600">Health promotion, screening, disease prevention</p>
                </div>
              </div>
            </section>

            {/* How to Prepare */}
            <section id="preparation" className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Prepare for the MRCP PACES Exam</h2>

              <h3 className="font-bold text-gray-900 mb-3 mt-6">1. Start Early</h3>
              <p className="text-gray-600 mb-4">
                Begin your preparation at least 12 weeks (3 months) before your exam date. This gives you enough time to cover all topics, practice extensively, and address weak areas.
              </p>

              <h3 className="font-bold text-gray-900 mb-3">2. Practice Questions Daily</h3>
              <p className="text-gray-600 mb-4">
                Complete 30-50 practice questions every day. Focus on understanding the explanations for both correct and incorrect answers. Quality matters more than quantity.
              </p>

              <h3 className="font-bold text-gray-900 mb-3">3. Take Regular Mock Exams</h3>
              <p className="text-gray-600 mb-4">
                Take full-length mock exams under timed conditions every 1-2 weeks. This builds exam stamina and helps you manage time effectively on the day.
              </p>

              <h3 className="font-bold text-gray-900 mb-3">4. Focus on Calculations</h3>
              <p className="text-gray-600 mb-4">
                Practice pharmaceutical calculations daily. Learn common formulas, shortcuts, and avoid common mistakes. Calculations questions can make or break your result.
              </p>

              <h3 className="font-bold text-gray-900 mb-3">5. Review Weak Areas</h3>
              <p className="text-gray-600 mb-4">
                Use practice analytics to identify your weak areas and focus extra time on these topics. Don't neglect any area completely.
              </p>
            </section>

            {/* Pass Rate */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MRCP PACES Exam Pass Rate</h2>
              <p className="text-gray-600 mb-4">
                The national MRCP PACES exam pass rate typically ranges from 70-80% for first-time candidates, though this varies between sittings. With proper preparation, you can significantly increase your chances of passing.
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-800">
                  <strong>MRCPPACESPREP students achieve a 94% pass rate</strong> - significantly higher than the national average. This is because our platform provides comprehensive coverage and realistic practice.
                </p>
              </div>
            </section>

            {/* What Happens If You Fail */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What If I Fail the MRCP PACES Exam?</h2>
              <p className="text-gray-600 mb-4">
                If you don't pass, you can retake the exam. However:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>You must wait at least 6 months before your next attempt</li>
                <li>You'll need to pay the £237 sitting fee again</li>
                <li>There's no limit to the number of retakes allowed</li>
              </ul>
              <p className="text-gray-600">
                Given the waiting period and cost, it's worth investing in thorough preparation to maximize your chances of passing first time.
              </p>
            </section>
          </div>
        </article>

        {/* CTA Section */}
        <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your MRCP PACES Exam Preparation?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 8,500+ students who passed their exam with our platform
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

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#fbfaf4]">
          <div className="mx-auto max-w-3xl">
            <FAQSection
              faqs={examGuideFAQs}
              title="MRCP PACES Exam 2026 - Frequently Asked Questions"
            />
          </div>
        </section>

        {/* Related Pages */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-[#fbfaf4]">
          <div className="mx-auto max-w-7xl">
            <RelatedPages currentPath="/gphc-exam-guide" title="Explore Our Resources" />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center text-sm text-gray-600">
            <p>© 2024 MRCPPACESPREP. All rights reserved.</p>
            <p className="mt-2">Not affiliated with or endorsed by the Royal College of Physicians.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
