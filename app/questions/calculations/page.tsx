import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pharmacy Calculations Practice - Part 1 | MRCPPACESPREP',
  description: 'Practice pharmaceutical calculations for MRCP PACES Part 1. Master all 12 calculation types with step-by-step solutions and exam-style questions.',
  keywords: 'MRCP PACES calculations, pharmacy calculations, Part 1 practice, dosage calculations, pharmaceutical math',
  openGraph: {
    title: 'Pharmacy Calculations Practice - Part 1 | MRCPPACESPREP',
    description: 'Master pharmaceutical calculations with comprehensive practice across all 12 MRCP PACES calculation types.',
    url: 'https://mrcppacesprep.com/questions/calculations',
  },
  alternates: {
    canonical: '/questions/calculations',
  },
}

export default function CalculationsPracticePage() {
  const calculationTypes = [
    { name: 'Doses and Dose Regimens', desc: 'Calculate appropriate doses and dosing schedules' },
    { name: 'Dosage and Unit Conversions', desc: 'Convert between different units and dosage forms' },
    { name: 'Estimations of Kidney Function', desc: 'CrCl and eGFR for dosing adjustments' },
    { name: 'Displacement Volumes', desc: 'Injections and suppositories calculations' },
    { name: 'Concentrations (w/v, %, 1 in x)', desc: 'Work with different concentration expressions' },
    { name: 'Dilutions', desc: 'Calculate dilutions and stock preparations' },
    { name: 'Molecular Weight', desc: 'Calculate molecular weights and molar concentrations' },
    { name: 'Using Provided Formulae', desc: 'Apply formulae given in exam questions' },
    { name: 'Infusion Rates', desc: 'IV drip rates and infusion calculations' },
    { name: 'Pharmacokinetics', desc: 'Clearance, half-life, and bioavailability' },
    { name: 'Health Economics', desc: 'Cost-effectiveness and economic evaluations' },
    { name: 'Quantities to Supply', desc: 'Pack sizes and prescription quantities' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Link href="/questions" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Questions
          </Link>
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            Part 1
          </p>
          <h1 className="text-4xl font-semibold text-gray-900 sm:text-5xl mb-6">
            Pharmaceutical Calculations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Master all 12 calculation types required for the MRCP PACES Part 1 assessment.
            Each exam includes at least one question from each category.
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

      {/* Exam Info */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-light text-gray-900 mb-2">40</div>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900 mb-2">2 hours</div>
              <p className="text-sm text-gray-600">Time Allowance</p>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900 mb-2">Calculator</div>
              <p className="text-sm text-gray-600">Permitted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculation Types */}
      <section className="bg-[#fbfaf4] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              12 Categories
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Calculation Types
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Every MRCP PACES Part 1 assessment includes questions from each of these calculation categories.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculationTypes.map((type) => (
              <div key={type.name} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-medium text-gray-900 mb-2">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Skills */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Essential Skills
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              What You'll Master
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="pill-card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Numerical Accuracy</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Precise decimal calculations
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Appropriate rounding conventions
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Significant figures
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Error checking strategies
                </li>
              </ul>
            </div>

            <div className="pill-card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Clinical Application</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Real-world clinical scenarios
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Patient safety considerations
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  BNF reference skills
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Dose verification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fbfaf4] px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Ready to Master Calculations?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Practice with hundreds of calculation questions, each with step-by-step solutions.
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
                <li><Link href="/disclaimer" className="hover:text-gray-900">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 MRCPPACESPREP. All rights reserved.</p>
            <p className="mt-2">Not affiliated with or endorsed by the General Pharmaceutical Council.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
