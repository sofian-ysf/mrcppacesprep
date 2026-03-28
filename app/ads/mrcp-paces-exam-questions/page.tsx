import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MRCP PACES Exam Questions 2026 | 94% Pass Rate',
  description: 'Practice 2000+ MRCP PACES exam questions. 94% pass rate. SBA, EMQ & calculations with detailed explanations.',
  robots: {
    index: false, // Don't index ad landing pages
    follow: false,
  },
}

export default function AdsMRCPPACESExamQuestionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simplified Hero - No Navigation */}
      <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 mb-6">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            94% Pass Rate | 8,500+ Candidates
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            MRCP PACES Exam Questions 2026
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            2,000+ practice questions written by physicians. SBA, EMQ, and calculations with detailed explanations.
          </p>

          {/* CTA */}
          <div className="mt-10">
            <Link
              href="/signup"
              className="inline-block rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white hover:bg-green-700 transition-colors"
            >
              Get Started - £30/month
            </Link>
            <p className="mt-3 text-sm text-gray-500">7-day money-back guarantee</p>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-gray-900">2,000+</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">94%</div>
              <div className="text-sm text-gray-600">Pass Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">4.8/5</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-[#fbfaf4] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-widest text-gray-500">Trusted by graduates from</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <img src="/universities/ucl.png" alt="UCL" className="h-8 object-contain opacity-70" />
            <img src="/universities/manchester.png" alt="Manchester" className="h-8 object-contain opacity-70" />
            <img src="/universities/nottingham.png" alt="Nottingham" className="h-8 object-contain opacity-70" />
            <img src="/universities/kcl.png" alt="KCL" className="h-8 object-contain opacity-70" />
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Everything You Need to Pass
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">2,000+ Exam Questions</h3>
                <p className="text-sm text-gray-600">SBA, EMQ & calculations covering all topics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Unlimited Mock Exams</h3>
                <p className="text-sm text-gray-600">Realistic timed exams under exam conditions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Detailed Explanations</h3>
                <p className="text-sm text-gray-600">Learn from every question you answer</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Progress Tracking</h3>
                <p className="text-sm text-gray-600">Identify weak areas and track improvement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Start Practicing Today
          </h2>
          <p className="text-gray-300 mb-8">
            Join 8,500+ candidates who passed their MRCP PACES exam
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
          <div className="mt-6 flex justify-center gap-6 text-sm text-gray-400">
            <span>2000+ questions</span>
            <span>7-day money-back</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>
    </div>
  )
}
