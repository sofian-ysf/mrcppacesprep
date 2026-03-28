import { Metadata } from 'next'
import Link from 'next/link'
import CalculationsSEO from '@/app/components/seo/CalculationsSEO'
import { RelatedPages } from '@/app/components/seo/RelatedPages'
import {
  Pill,
  Flask,
  Drop,
  ChartBar,
  Calculator,
  Lightning,
  TrendUp,
  CheckCircle,
  ArrowRight,
  Warning,
  Clock,
  ShieldCheck,
  Star
} from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'MRCP PACES Calculation Questions 2025 | 350+ Problems | Step-by-Step Solutions',
  description: 'Master pharmaceutical calculations for the 2025 MRCP PACES exam. 350+ problems with step-by-step solutions. Dosage, dilutions, IV rates, alligation. 72% score improvement.',
  keywords: [
    'MRCP PACES calculations', 'pharmaceutical calculations', 'dosage calculations', 'dilution calculations',
    'concentration calculations', 'IV flow rate', 'infusion rate calculations', 'pharmacy math',
    'alligation method', 'unit conversions pharmacy', 'bioavailability calculations',
    'calculation formulas', 'step-by-step solutions', 'calculation shortcuts', 'timed calculations'
  ],
  openGraph: {
    title: 'MRCP PACES Calculation Questions 2025 | 350+ Problems | Step-by-Step',
    description: 'Master pharmaceutical calculations for the 2025 MRCP PACES exam. 350+ problems with step-by-step solutions.',
    url: 'https://www.mrcppacesprep.com/calculations',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MRCP PACES Calculation Questions 2025 | 350+ Problems',
    description: '350+ pharmaceutical calculation problems with step-by-step solutions. Master MRCP PACES calculations for 2025.'
  },
  alternates: {
    canonical: '/calculations',
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Solve MRCP PACES Pharmaceutical Calculations",
  "description": "Learn how to solve pharmaceutical calculations for the MRCP PACES exam using our proven 4-step method.",
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Identify what you know", "text": "Start by identifying all the values given in the problem." },
    { "@type": "HowToStep", "position": 2, "name": "Calculate total dose needed", "text": "Use the formula: Total dose = Weight × Dose per kg." },
    { "@type": "HowToStep", "position": 3, "name": "Calculate volume required", "text": "Use the formula: Volume = Dose Required ÷ Concentration." },
    { "@type": "HowToStep", "position": 4, "name": "Perform a sensibility check", "text": "Verify your answer makes clinical sense." }
  ],
  "totalTime": "PT5M",
  "tool": [{ "@type": "HowToTool", "name": "Calculator" }]
}

export default function CalculationsPage() {
  return (
    <>
      <CalculationsSEO />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section - Conversion focused */}
        <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-5 py-10 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl w-full">
            <div className="text-center">
              <div className="pill-badge mb-5 md:mb-6 inline-block">
                Used by 8,500+ medical trainees
              </div>

              <h1 className="mb-5 md:mb-6 text-[28px] leading-tight font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Stop Struggling with
                <span className="block">Medical Calculations</span>
              </h1>

              <p className="mx-auto mb-8 md:mb-10 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg lg:text-xl">
                350+ practice problems with step-by-step solutions. Students improve their calculation scores by 72% on average.
              </p>

              {/* Primary CTA - Free Demo (lower friction) */}
              <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-center">
                <Link
                  href="/try-free"
                  className="pill-btn pill-btn-primary w-full md:w-auto min-h-[48px] text-base px-8 py-3"
                >
                  Try 5 Free Calculations
                </Link>
                <Link
                  href="/pricing"
                  className="pill-btn pill-btn-secondary w-full md:w-auto min-h-[48px] text-base px-8 py-3"
                >
                  Get Started — From £25
                </Link>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Join 8,500+ candidates • 72% score improvement
              </p>

              {/* Social proof stats */}
              <div className="mt-10 md:mt-12 grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">72%</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">Score Improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">94%</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">Pass Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">4.8</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Agitation - Why calculations are hard */}
        <section className="px-5 py-12 md:px-6 md:py-20 lg:px-8 border-t border-gray-100">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
              Calculations are the #1 reason students fail the MRCP PACES exam
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8">
              Unit conversion errors, decimal mistakes, and time pressure cause even prepared students to lose marks. Our structured approach fixes this.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {[
                { icon: Warning, text: 'Decimal errors cause 10x dosing mistakes' },
                { icon: Clock, text: 'Not enough time to check your work' },
                { icon: Calculator, text: 'Forgetting which formula to use' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#fbfaf4] rounded-lg p-4">
                  <item.icon className="h-5 w-5 text-amber-500 flex-shrink-0" weight="fill" />
                  <span className="text-sm text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/try-free"
                className="pill-btn pill-btn-primary min-h-[48px] text-base px-8 py-3"
              >
                Practice Free - See How You Score
              </Link>
            </div>
          </div>
        </section>

        {/* What You Get - Value proposition */}
        <section className="bg-[#fbfaf4] px-5 py-12 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
                Everything You Need to Master Calculations
              </h2>
            </div>

            <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Pill, title: 'Dosage', count: '85 problems', desc: 'Weight-based, pediatric, geriatric' },
                { icon: Flask, title: 'Dilutions', count: '92 problems', desc: 'Concentrations, molarity, %w/v' },
                { icon: Drop, title: 'IV Rates', count: '38 problems', desc: 'Drip rates, infusion times' },
                { icon: ChartBar, title: 'Alligation', count: '42 problems', desc: 'Mixture calculations' },
              ].map((item, i) => (
                <div key={i} className="pill-card p-5 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <item.icon className="h-6 w-6 text-gray-700" weight="duotone" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm font-medium text-gray-900 mb-1">{item.count}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4">Plus unit conversions, pharmacokinetics, business calculations, and more</p>
              <Link
                href="/try-free"
                className="pill-btn pill-btn-primary min-h-[48px] text-base px-8 py-3"
              >
                Try Free Calculations Now
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works - Sample problem */}
        <section className="px-5 py-12 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                See How Our Step-by-Step Method Works
              </h2>
            </div>

            <div className="pill-card p-5 md:p-8">
              <div className="bg-[#fbfaf4] rounded-xl p-4 md:p-5 mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Sample Question</p>
                <p className="text-base md:text-lg text-gray-900">
                  A 70 kg patient needs digoxin 10 micrograms/kg. Stock is 250 micrograms/ml. What volume do you give?
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  { step: '1', title: 'Total dose', calc: '70 kg × 10 mcg/kg = 700 mcg' },
                  { step: '2', title: 'Volume needed', calc: '700 mcg ÷ 250 mcg/ml = 2.8 ml' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm font-mono text-gray-600">{item.calc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" weight="fill" />
                  <span className="font-semibold text-green-800">Answer: 2.8 ml</span>
                </div>
                <p className="text-sm text-green-700">Every question includes detailed explanations, common mistakes to avoid, and exam tips.</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/try-free"
                className="pill-btn pill-btn-primary min-h-[48px] text-base px-8 py-3"
              >
                Try This Type of Question Free
              </Link>
              <p className="mt-3 text-sm text-gray-500">5 calculation questions included in free demo</p>
            </div>
          </div>
        </section>

        {/* Social Proof - Results */}
        <section className="bg-[#fbfaf4] px-5 py-12 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Real Results from Real Candidates
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {[
                { name: 'Aisha K.', location: 'Leeds', before: '45%', after: '89%', quote: 'The step-by-step approach finally made calculations click for me.' },
                { name: 'Tom R.', location: 'Bristol', before: '52%', after: '85%', quote: 'Went from dreading calculations to finishing them with time to spare.' },
                { name: 'Fatima N.', location: 'Glasgow', before: '58%', after: '92%', quote: 'The practice problems are exactly like the real exam.' },
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
                      <p className="text-xs text-gray-500">Calc score</p>
                      <p className="text-sm"><span className="text-red-500">{student.before}</span> → <span className="text-green-600 font-bold">{student.after}</span></p>
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
                Start Your Free Practice
              </Link>
            </div>
          </div>
        </section>

        {/* Formula Preview - Value teaser */}
        <section className="px-5 py-12 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Printable Formula Sheet Included
              </h2>
              <p className="mt-3 text-gray-600">Every subscription includes a downloadable cheat sheet</p>
            </div>

            <div className="pill-card p-5 md:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Core Formulas</h3>
                  {[
                    'Dose = Weight × Dose per kg',
                    'Volume = Dose ÷ Concentration',
                    'C₁V₁ = C₂V₂ (dilutions)',
                  ].map((formula, i) => (
                    <p key={i} className="text-sm font-mono bg-[#fbfaf4] p-2 rounded">{formula}</p>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Key Conversions</h3>
                  {[
                    '1 mg = 1000 micrograms',
                    '1 L = 1000 ml',
                    '1 pint = 568 ml',
                  ].map((conversion, i) => (
                    <p key={i} className="text-sm font-mono bg-[#fbfaf4] p-2 rounded">{conversion}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-3 justify-center">
              <Link
                href="/try-free"
                className="pill-btn pill-btn-primary min-h-[48px] text-base px-8 py-3"
              >
                Try Free Demo
              </Link>
              <Link
                href="/pricing"
                className="pill-btn pill-btn-secondary min-h-[48px] text-base px-8 py-3"
              >
                Get Started — From £25
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
              The MRCP PACES exam costs £237. Our complete calculation practice costs a fraction of that.
            </p>

            <div className="pill-card p-6 md:p-8 max-w-md mx-auto">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">From £25</div>
              <p className="text-gray-600 mb-6">One-time payment • No subscription</p>

              <ul className="space-y-3 text-left mb-6">
                {[
                  '350+ calculation problems',
                  'Step-by-step solutions',
                  'Printable formula sheet',
                  'Timed practice sessions',
                  'Progress tracking',
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
                <Lightning className="h-4 w-4" weight="fill" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 py-12 md:px-6 md:py-20 lg:px-8 border-t border-gray-100">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
              Ready to Master Calculations?
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8">
              Try 5 free calculation questions right now. No signup required.
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
                <span>Start in 10 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" weight="fill" />
                <span>5 questions included</span>
              </div>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="bg-[#fbfaf4] px-5 py-12 md:px-6 md:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <RelatedPages currentPath="/calculations" title="Continue Your Preparation" />
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
