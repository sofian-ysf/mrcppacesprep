'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import PricingSEO from '@/app/components/seo/PricingSEO'
import { RelatedPages } from '@/app/components/seo/RelatedPages'
import { getStoredGclid } from '@/app/components/GclidCapture'

const allFeatures = [
  {
    name: '2,000+ Practice Questions',
    description: 'Comprehensive question bank covering all GPhC exam topics, written by registered pharmacists',
  },
  {
    name: 'Unlimited Mock Exams',
    description: 'Realistic timed exams matching the actual GPhC format with instant results',
  },
  {
    name: 'Calculations Practice',
    description: 'Step-by-step solutions for dosage, dilutions, infusion rates, and unit conversions',
  },
  {
    name: 'Detailed Explanations',
    description: 'Expert explanations for every question, including why wrong answers are incorrect',
  },
  {
    name: 'Progress Analytics',
    description: 'Track your performance, identify weak areas, and monitor improvement over time',
  },
  {
    name: 'Spaced Repetition Flashcards',
    description: 'Intelligent flashcard system that helps you retain key information',
  },
  {
    name: 'Study Notes',
    description: 'Create and organize personal notes linked to specific questions and topics',
  },
  {
    name: 'Clinical Question Bank',
    description: '400+ clinical pharmacy and therapeutics questions with detailed rationales',
  },
  {
    name: 'Law & Ethics Questions',
    description: '300+ pharmacy law and ethics questions covering UK regulations',
  },
  {
    name: 'Mobile Access',
    description: 'Study anywhere on any device with full progress sync',
  },
  {
    name: 'BNF-Aligned Content',
    description: 'All content regularly updated to match current BNF guidelines',
  },
  {
    name: 'Achievement System',
    description: 'Stay motivated with badges and milestones as you progress',
  },
]

type PlanType = '3month' | '6month' | 'lifetime'

const plans = [
  {
    id: '3month' as PlanType,
    name: '2 Months',
    price: 25,
    period: 'one-time',
    description: 'Great for focused exam prep',
    popular: false,
  },
  {
    id: '6month' as PlanType,
    name: '6 Months',
    price: 40,
    period: 'one-time',
    description: 'Most popular for comprehensive study',
    popular: true,
  },
  {
    id: 'lifetime' as PlanType,
    name: 'Lifetime',
    price: 70,
    period: 'one-time',
    description: 'Best value - access forever',
    popular: false,
  },
]

const faqs = [
  {
    question: 'How long do I have access after purchase?',
    answer: 'Your access depends on your plan: 2 months, 6 months, or lifetime. All plans are one-time payments with no recurring charges.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure payment partner Stripe.',
  },
  {
    question: 'Can I upgrade my plan later?',
    answer: 'Yes! You can upgrade to a longer plan at any time. Contact us and we\'ll apply your remaining time as credit towards the upgrade.',
  },
  {
    question: 'Is this a subscription or one-time payment?',
    answer: 'All our plans are one-time payments. You pay once and get full access for the duration of your chosen plan. No recurring charges.',
  },
]

export default function PricingPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null)

  const handleCheckout = async (planType: PlanType) => {
    if (!user) {
      // Redirect to signup with plan type - after signup they'll go to checkout
      window.location.href = `/signup?plan=${planType}`
      return
    }

    setIsLoading(true)
    setLoadingPlan(planType)

    try {
      const gclid = getStoredGclid()
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, gclid }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to create checkout session. Please try again.')
      setIsLoading(false)
      setLoadingPlan(null)
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "GPhC Exam Prep Access",
    "description": "Complete access to GPhC pre-registration exam preparation platform including 2000+ practice questions, unlimited mock exams, detailed explanations, and progress tracking",
    "brand": {
      "@type": "Organization",
      "name": "PreRegExamPrep"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "25",
      "highPrice": "70",
      "priceCurrency": "GBP",
      "offerCount": "3",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2026-12-31",
      "url": "https://www.preregexamprep.com/pricing"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "8500",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <>
      <PricingSEO />
      <Script
        id="pricing-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Choose Your Plan
              </h1>
              <p className="mt-6 mx-auto max-w-2xl text-xl text-gray-600">
                One-time payment. Full access. No subscriptions or hidden fees.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border-2 bg-white p-8 shadow-sm transition-all ${
                    plan.popular ? 'border-green-500 shadow-lg' : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center pb-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-gray-900">£{plan.price}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                  </div>

                  <div className="py-6">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">2,000+ practice questions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Unlimited mock exams</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Detailed explanations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Calculations practice</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Progress tracking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Mobile access</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={isLoading}
                    className={`w-full rounded-lg px-6 py-3 text-base font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.popular
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'border-2 border-gray-900 bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {loadingPlan === plan.id ? 'Processing...' : `Get ${plan.name} Access`}
                  </button>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>7-Day Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Powered by Stripe</span>
              </div>
            </div>
          </div>
        </section>

        {/* Everything Included Section */}
        <section className="bg-[#fbfaf4] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Everything You Get
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              All plans include full access to every feature. No limitations, no add-ons.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allFeatures.map((feature) => (
                <div key={feature.name} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.name}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Comparison */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Exceptional Value for Your Investment
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">£237</div>
                <div className="text-gray-600 mb-2">GPhC Exam Sitting Fee</div>
                <p className="text-sm text-gray-500">Per attempt, plus 6-month wait if you fail</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">£25-70</div>
                <div className="text-gray-600 mb-2">Our Prep Cost</div>
                <p className="text-sm text-gray-500">One-time payment for comprehensive preparation</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">94%</div>
                <div className="text-gray-600 mb-2">Our Pass Rate</div>
                <p className="text-sm text-gray-500">vs ~75% national average for first-time candidates</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-[#fbfaf4] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Pricing Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group rounded-lg border border-gray-200 bg-white p-6">
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                    {faq.question}
                    <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <RelatedPages currentPath="/pricing" title="Explore Our Platform" />
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Trusted by 8,500+ Pharmacy Graduates
            </h2>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-white">
              <div>
                <div className="text-3xl font-bold mb-1">94%</div>
                <div className="text-gray-400 text-sm">Pass Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">8,500+</div>
                <div className="text-gray-400 text-sm">Students Passed</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">2,000+</div>
                <div className="text-gray-400 text-sm">Practice Questions</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">4.8/5</div>
                <div className="text-gray-400 text-sm">Student Rating</div>
              </div>
            </div>
            <div className="mt-10">
              <Link
                href="/testimonials"
                className="text-white underline hover:no-underline"
              >
                Read success stories from our students →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-4 font-bold text-gray-900">PreRegExamPrep</h3>
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
                  <li><Link href="/disclaimer" className="hover:text-gray-900">Disclaimer</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
              <p>© 2024 PreRegExamPrep. All rights reserved.</p>
              <p className="mt-2">Not affiliated with or endorsed by the General Pharmaceutical Council.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
