'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'

export default function QuestionsPageClient() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard/sba')
    }
  }, [user, loading, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full"></div>
      </div>
    )
  }

  // If user is logged in, show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to SBA Questions...</p>
        </div>
      </div>
    )
  }

  // Show marketing page for non-logged-in users
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            Question Bank
          </p>
          <h1 className="text-4xl font-semibold text-gray-900 sm:text-5xl mb-6">
            Practice with Purpose
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Over 2,000 expertly crafted questions aligned with the MRCP PACES framework.
            Each with detailed explanations to deepen your understanding.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup" className="pill-btn pill-btn-primary pill-btn-lg">
              Start Practising
            </Link>
            <Link href="/login" className="pill-btn pill-btn-secondary pill-btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Exam Structure */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Exam Structure
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Two Parts, One Goal
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Our question bank mirrors the official MRCP PACES assessment structure,
              ensuring you&apos;re prepared for exactly what you&apos;ll face.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Part 1 */}
            <div className="pill-card">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm uppercase tracking-widest text-gray-500">Part 1</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">40 Questions</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Pharmaceutical Calculations
              </h3>
              <p className="text-gray-600 mb-6">
                2 hours of calculation questions. Free text numerical responses with calculator permitted.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Dosage calculations
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Concentrations & dilutions
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  IV flow rates
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Unit conversions
                </li>
              </ul>
              <Link
                href="/signup"
                className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Practice calculations
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Part 2 */}
            <div className="pill-card">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm uppercase tracking-widest text-gray-500">Part 2</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">120 Questions</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Clinical Knowledge
              </h3>
              <p className="text-gray-600 mb-6">
                2.5 hours covering clinical scenarios. 90 SBA and 30 EMQ questions without calculator.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Single Best Answer (SBA)
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Extended Matching Questions (EMQ)
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Therapeutics & pharmacology
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Law & ethics
                </li>
              </ul>
              <Link
                href="/signup"
                className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Practice clinical questions
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Areas */}
      <section className="bg-[#fbfaf4] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Comprehensive Coverage
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Every Topic, Thoroughly Covered
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Cardiovascular', desc: 'Heart conditions, anticoagulation, blood pressure' },
              { name: 'Respiratory', desc: 'Asthma, COPD, respiratory infections' },
              { name: 'Endocrine', desc: 'Diabetes, thyroid disorders, hormones' },
              { name: 'Infection', desc: 'Antibiotics, antivirals, antimicrobial stewardship' },
              { name: 'Mental Health', desc: 'Depression, anxiety, psychotropic medications' },
              { name: 'Gastrointestinal', desc: 'GI disorders, liver disease, nutrition' },
              { name: 'Pain Management', desc: 'Analgesics, opioids, chronic pain' },
              { name: 'Pharmacology', desc: 'Drug mechanisms, pharmacokinetics' },
              { name: 'Law & Ethics', desc: 'Legal requirements, professional standards' },
            ].map((topic) => (
              <div key={topic.name} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-medium text-gray-900 mb-2">{topic.name}</h3>
                <p className="text-sm text-gray-600">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Ready to Begin?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Join thousands of pharmacy graduates who&apos;ve prepared with confidence.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup" className="pill-btn pill-btn-primary pill-btn-lg">
              Create Free Account
            </Link>
            <Link href="/#pricing" className="pill-btn pill-btn-secondary pill-btn-lg">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
