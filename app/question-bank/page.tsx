import { Metadata } from 'next'
import Link from 'next/link'
import QuestionBankSEO from '@/app/components/seo/QuestionBankSEO'
import { RelatedPages } from '@/app/components/seo/RelatedPages'
import {
  Calculator,
  Flask,
  Scales,
  Pill,
  Heart,
  Users,
  CheckCircle,
  ArrowRight,
  Lightning,
  TrendUp,
  BookmarkSimple,
  Sliders,
  Star,
  ShieldCheck,
  Clock
} from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'MRCP PACES Question Bank 2025 | 2000+ Practice Questions | 94% Pass Rate',
  description: 'Master your 2025 MRCP PACES exam with 2000+ practice questions. SBA, EMQ & calculations. Detailed explanations, progress tracking. 94% pass rate.',
  keywords: [
    'MRCP PACES question bank', 'MRCP PACES practice questions', 'pre-reg exam questions', 'pharmacy exam questions UK',
    'MRCP PACES SBA questions', 'MRCP PACES EMQ practice', 'clinical pharmacy questions', 'pharmacy law questions',
    'pharmaceutical calculations practice', 'pharmacology exam questions', 'MRCP PACES exam preparation',
    'pre-registration physician questions', 'BNF questions', 'MRCP PACES question bank 2025'
  ],
  openGraph: {
    title: 'MRCP PACES Question Bank | 2000+ Questions | 94% Pass Rate | £25',
    description: 'Master MRCP PACES exam with 2000+ practice questions. Detailed explanations, progress tracking. 94% pass rate.',
    url: 'https://www.mrcppacesprep.com/question-bank',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MRCP PACES Question Bank | 2000+ Questions | 94% Pass Rate',
    description: '2000+ MRCP PACES practice questions with detailed explanations. 94% pass rate. Start practicing today!'
  },
  alternates: {
    canonical: '/question-bank',
  },
}

const questionCategories = [
  { icon: Calculator, title: 'Calculations', count: '350+', desc: 'Dosage, dilutions, IV rates' },
  { icon: Flask, title: 'Clinical Pharmacy', count: '400+', desc: 'Drug interactions, therapeutics' },
  { icon: Scales, title: 'Law & Ethics', count: '300+', desc: 'Regulations, professional standards' },
  { icon: Pill, title: 'Pharmaceutics', count: '250+', desc: 'Formulation, stability' },
  { icon: Heart, title: 'Pharmacology', count: '350+', desc: 'Mechanisms, adverse effects' },
  { icon: Users, title: 'Public Health', count: '200+', desc: 'Prevention, health promotion' },
]

export default function QuestionBankPage() {
  return (
    <>
      <QuestionBankSEO />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-5 py-10 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl w-full">
            <div className="text-center">
              <div className="pill-badge mb-5 md:mb-6 inline-block">
                Used by 8,500+ medical trainees
              </div>

              <h1 className="mb-5 md:mb-6 text-[28px] leading-tight font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                2,000+ MRCP PACES Practice
                <span className="block">Questions</span>
              </h1>

              <p className="mx-auto mb-8 md:mb-10 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg lg:text-xl">
                Exam-style questions with detailed explanations. Written by qualified physicians. 94% of our students pass on their first attempt.
              </p>

              <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-center">
                <Link
                  href="/try-free"
                  className="pill-btn pill-btn-primary w-full md:w-auto min-h-[48px] text-base px-8 py-3"
                >
                  Try 15 Free Questions
                </Link>
                <Link
                  href="/pricing"
                  className="pill-btn pill-btn-secondary w-full md:w-auto min-h-[48px] text-base px-8 py-3"
                >
                  Get Started — From £25
                </Link>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Join 8,500+ students • 94% pass rate
              </p>

              {/* Stats */}
              <div className="mt-10 md:mt-12 grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">2,000+</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">94%</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">Pass Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">4.8</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Question Categories - Horizontal scroll on mobile */}
        <section className="px-5 py-12 md:px-6 md:py-20 lg:px-8 border-t border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Every MRCP PACES Topic Covered
              </h2>
              <p className="mt-3 text-gray-600">Questions across all framework areas</p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-4 md:overflow-visible scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0">
              {questionCategories.map((cat, i) => (
                <div key={i} className="flex-shrink-0 w-[160px] md:w-auto pill-card p-4 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#fbfaf4]">
                    <cat.icon className="h-5 w-5 text-gray-700" weight="duotone" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{cat.title}</h3>
                  <p className="text-sm font-medium text-gray-900">{cat.count}</p>
                  <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/try-free"
                className="pill-btn pill-btn-primary min-h-[48px] text-base px-8 py-3"
              >
                Try Free Questions
              </Link>
            </div>
          </div>
        </section>

        {/* Question Formats */}
        <section className="bg-[#fbfaf4] px-5 py-12 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Real Exam Question Formats
              </h2>
              <p className="mt-3 text-gray-600">Practice with the exact formats you&apos;ll see on exam day</p>
            </div>

            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
              {[
                {
                  title: 'Single Best Answer',
                  desc: 'Choose the best option from 5 choices. Tests clinical decision-making.',
                  example: 'A patient on warfarin presents with...',
                  count: '1,200+ questions'
                },
                {
                  title: 'Extended Matching',
                  desc: 'Match scenarios to options from a list. Tests pattern recognition.',
                  example: 'For each patient, select the appropriate...',
                  count: '400+ questions'
                },
                {
                  title: 'Calculations',
                  desc: 'Numerical problems requiring precise answers. Step-by-step solutions.',
                  example: 'Calculate the volume of 2% solution...',
                  count: '350+ questions'
                },
              ].map((format, i) => (
                <div key={i} className="pill-card p-5 md:p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{format.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{format.desc}</p>
                  <div className="bg-[#fbfaf4] rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">Example:</p>
                    <p className="text-sm text-gray-700 italic">&ldquo;{format.example}&rdquo;</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{format.count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-5 py-12 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Features That Help You Pass
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Lightning, title: 'Instant Feedback', desc: 'Get explanations immediately after each question' },
                { icon: TrendUp, title: 'Progress Tracking', desc: 'See your improvement across all topics' },
                { icon: Sliders, title: 'Adaptive Learning', desc: 'Questions adjust to your skill level' },
                { icon: BookmarkSimple, title: 'Bookmark & Review', desc: 'Save difficult questions for later' },
              ].map((feature, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fbfaf4]">
                    <feature.icon className="h-6 w-6 text-gray-700" weight="duotone" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/try-free"
                className="pill-btn pill-btn-primary min-h-[48px] text-base px-8 py-3"
              >
                Experience It Free
              </Link>
            </div>
          </div>
        </section>

        {/* Sample Question Preview */}
        <section className="bg-[#fbfaf4] px-5 py-12 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                See Our Question Quality
              </h2>
            </div>

            <div className="pill-card p-5 md:p-8">
              <div className="mb-6">
                <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded mb-3">Clinical Pharmacy</span>
                <p className="text-base md:text-lg text-gray-900 leading-relaxed">
                  A 72-year-old patient taking atorvastatin reports persistent muscle pain. Which of the following is the most appropriate initial action?
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {['A. Continue statin and monitor', 'B. Check creatine kinase levels', 'C. Switch to a different statin', 'D. Stop statin immediately', 'E. Add coenzyme Q10'].map((option, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${i === 1 ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <span className="text-sm text-gray-700">{option}</span>
                    {i === 1 && <span className="ml-2 text-green-600 text-sm font-medium">Correct</span>}
                  </div>
                ))}
              </div>

              <div className="bg-[#fbfaf4] rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Explanation</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Checking CK levels is the appropriate first step to assess for statin-induced myopathy. This helps differentiate between myalgia (normal CK) and myositis (elevated CK), guiding further management...
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/try-free"
                className="pill-btn pill-btn-primary min-h-[48px] text-base px-8 py-3"
              >
                Try 15 Questions Free
              </Link>
              <p className="mt-3 text-sm text-gray-500">No signup required</p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="px-5 py-12 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Students Love Our Question Bank
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {[
                { name: 'Aisha K.', location: 'Leeds', score: '78%', quote: 'The explanations are incredibly detailed. Finally understood pharmacology.' },
                { name: 'Tom R.', location: 'Bristol', score: '82%', quote: 'Improved from 55% to 84% in 6 weeks using the question bank.' },
                { name: 'Fatima N.', location: 'Glasgow', score: '81%', quote: 'Having 2000+ questions gave me confidence I\'d seen everything.' },
              ].map((student, i) => (
                <div key={i} className="pill-card p-5">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-yellow-400" weight="fill" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mb-4 italic">&ldquo;{student.quote}&rdquo;</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Passed with</p>
                      <p className="text-sm font-bold text-green-600">{student.score}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/try-free"
                className="pill-btn pill-btn-primary min-h-[48px] text-base px-8 py-3"
              >
                Start Practicing Free
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Teaser */}
        <section className="bg-[#fbfaf4] px-5 py-12 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Less Than the Cost of One Resit
            </h2>
            <p className="text-gray-600 mb-8">
              The MRCP PACES exam costs £237. Full access to our question bank costs a fraction of that.
            </p>

            <div className="pill-card p-6 md:p-8 max-w-md mx-auto">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">From £25</div>
              <p className="text-gray-600 mb-6">One-time payment • No subscription</p>

              <ul className="space-y-3 text-left mb-6">
                {[
                  '2,000+ practice questions',
                  'Detailed explanations',
                  'Progress tracking',
                  'All question formats',
                  'Mobile access',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" weight="fill" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className="pill-btn pill-btn-primary w-full min-h-[48px] text-base"
              >
                Get Started Now
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" weight="fill" />
                <span>7-day money back</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" weight="fill" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 py-12 md:px-6 md:py-20 lg:px-8 border-t border-gray-100">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
              Ready to Start Practicing?
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8">
              Try 15 free questions right now. See why 94% of our students pass.
            </p>

            <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-center">
              <Link
                href="/try-free"
                className="pill-btn pill-btn-primary w-full md:w-auto min-h-[52px] text-lg px-10 py-3"
              >
                Start Free Practice <ArrowRight className="inline h-5 w-5 ml-1" />
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Or <Link href="/pricing" className="underline hover:text-gray-900">view pricing</Link> for full access
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" weight="fill" />
                <span>No signup needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" weight="fill" />
                <span>15 questions included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" weight="fill" />
                <span>Full explanations</span>
              </div>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="bg-[#fbfaf4] px-5 py-12 md:px-6 md:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <RelatedPages currentPath="/question-bank" title="Continue Your Preparation" />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-5 py-10 md:px-6 md:py-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
              <div className="col-span-2 md:col-span-1">
                <h3 className="mb-4 font-bold text-gray-900">MRCPPACESPREP</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The UK&apos;s leading platform for MRCP PACES Pre-Registration exam preparation.
                </p>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-gray-900">Resources</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><Link href="/question-bank" className="hover:text-gray-900 py-1 inline-block">Question Bank</Link></li>
                  <li><Link href="/mock-exams" className="hover:text-gray-900 py-1 inline-block">Mock Exams</Link></li>
                  <li><Link href="/study-guides" className="hover:text-gray-900 py-1 inline-block">Study Guides</Link></li>
                  <li><Link href="/calculations" className="hover:text-gray-900 py-1 inline-block">Calculations</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-gray-900">Support</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><Link href="/help" className="hover:text-gray-900 py-1 inline-block">Help Center</Link></li>
                  <li><Link href="/contact" className="hover:text-gray-900 py-1 inline-block">Contact Us</Link></li>
                  <li><Link href="/blog" className="hover:text-gray-900 py-1 inline-block">Blog</Link></li>
                  <li><Link href="/testimonials" className="hover:text-gray-900 py-1 inline-block">Success Stories</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-gray-900">Legal</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><Link href="/privacy" className="hover:text-gray-900 py-1 inline-block">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-gray-900 py-1 inline-block">Terms of Service</Link></li>
                  <li><Link href="/support" className="hover:text-gray-900 py-1 inline-block">Support</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-gray-900 py-1 inline-block">Disclaimer</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-10 md:mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
              <p>© 2024 MRCPPACESPREP. All rights reserved.</p>
              <p className="mt-2">Not affiliated with or endorsed by the Royal College of Physicians.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
