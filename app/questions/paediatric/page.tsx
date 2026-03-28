import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Paediatric Practice Questions | MRCPPACESPREP',
  description: 'Practice paediatric pharmacy questions representing 20% of the MRCP PACES exam. Master child-specific dosing, safety, and clinical considerations.',
  keywords: 'paediatric pharmacy, children questions, MRCP PACES paediatric, child dosing, pediatric clinical',
  openGraph: {
    title: 'Paediatric Practice Questions | MRCPPACESPREP',
    description: 'Master paediatric pharmacy with dedicated practice questions covering 20% of the MRCP PACES exam.',
    url: 'https://mrcppacesprep.com/questions/paediatric',
  },
  alternates: {
    canonical: '/questions/paediatric',
  },
}

export default function PaediatricPage() {
  const ageGroups = [
    { name: 'Neonates', range: '0-28 days', desc: 'Immature metabolism, dosing per kg, limited drug data' },
    { name: 'Infants', range: '1 month - 2 years', desc: 'Rapid growth, formulation challenges, immunisations' },
    { name: 'Children', range: '2-12 years', desc: 'Age-appropriate counselling, compliance strategies' },
    { name: 'Adolescents', range: '12-18 years', desc: 'Confidentiality, transition to adult care, consent' },
  ]

  const clinicalAreas = [
    'Respiratory conditions (asthma, bronchiolitis)',
    'Paediatric infections and antibiotic dosing',
    'GI issues and nutrition',
    'Pain and fever management',
    'Paediatric emergencies',
    'Chronic conditions (diabetes, epilepsy)',
  ]

  const keyConsiderations = [
    { title: 'Weight-based dosing', desc: 'Most paediatric doses calculated per kilogram of body weight' },
    { title: 'Age-appropriate formulations', desc: 'Liquids, dispersible tablets, appropriate flavours' },
    { title: 'Maximum dose limits', desc: 'Never exceed adult maximum regardless of weight' },
    { title: 'Safety margins', desc: 'Children have less margin for error - double-check all calculations' },
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
            20% of MRCP PACES Exam
          </p>
          <h1 className="text-4xl font-semibold text-gray-900 sm:text-5xl mb-6">
            Paediatric Pharmacy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Approximately 20% of MRCP PACES questions involve paediatric patients.
            Master child-specific dosing, safety considerations, and family-centred care.
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

      {/* Age Groups */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Developmental Stages
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Age-Specific Considerations
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Paediatric patients are not simply small adults. Each age group has unique
              pharmacokinetic and pharmacodynamic considerations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ageGroups.map((group) => (
              <div key={group.name} className="pill-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {group.range}
                  </span>
                </div>
                <p className="text-gray-600">{group.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Areas */}
      <section className="bg-[#fbfaf4] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Common Topics
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Clinical Areas Covered
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {clinicalAreas.map((area) => (
              <div key={area} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Considerations */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Essential Knowledge
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Key Paediatric Principles
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {keyConsiderations.map((item) => (
              <div key={item.title} className="bg-[#fbfaf4] rounded-2xl p-6">
                <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communication */}
      <section className="bg-[#fbfaf4] px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
                Family-Centred Care
              </p>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                Communication Matters
              </h2>
              <p className="text-gray-600 mb-6">
                Paediatric pharmacy involves counselling both the child (age-appropriately)
                and their parents or carers. Questions often test your ability to:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Explain medicines to parents and carers
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Provide age-appropriate counselling to children
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Address compliance and adherence challenges
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Handle confidentiality with adolescents
                </li>
              </ul>
            </div>
            <div className="pill-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gillick Competence</h3>
              <p className="text-gray-600 mb-4">
                Understand when a child under 16 can consent to their own treatment.
                This is frequently tested in the assessment.
              </p>
              <p className="text-sm text-gray-500">
                A child who demonstrates sufficient understanding and intelligence
                to fully comprehend the proposed treatment can give valid consent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Ready to Master Paediatric Pharmacy?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Practice with dedicated paediatric questions across all age groups and clinical areas.
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
                <li><Link href="/study-guides" className="hover:text-gray-900">Study Guides</Link></li>
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
            <p className="mt-2">Not affiliated with or endorsed by the Royal College of Physicians.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
