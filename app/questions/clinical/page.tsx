import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Clinical Knowledge Practice - Part 2 | MRCPPACESPREP',
  description: 'Practice MRCP PACES Part 2 clinical knowledge questions across all 15 therapeutic areas. Master SBA and EMQ question formats.',
  keywords: 'MRCP PACES clinical questions, Part 2 practice, therapeutic areas, clinical knowledge, SBA questions, EMQ questions',
  openGraph: {
    title: 'Clinical Knowledge Practice - Part 2 | MRCPPACESPREP',
    description: 'Comprehensive clinical practice across all 15 MRCP PACES therapeutic areas with proper exam weighting.',
    url: 'https://mrcppacesprep.com/questions/clinical',
  },
  alternates: {
    canonical: '/questions/clinical',
  },
}

export default function ClinicalPracticePage() {
  const highWeightAreas = [
    { name: 'Cardiovascular System', desc: 'Heart conditions, hypertension, heart failure, arrhythmias', weight: '15-17.5%' },
    { name: 'Nervous System', desc: 'Mental health, epilepsy, Parkinson\'s, pain management', weight: '15-17.5%' },
    { name: 'Endocrine System', desc: 'Diabetes, thyroid disorders, hormonal conditions', weight: '15-17.5%' },
    { name: 'Infection', desc: 'Antibiotics, antivirals, antimicrobials, infectious diseases', weight: '15-17.5%' },
  ]

  const mediumWeightAreas = [
    { name: 'Genito-urinary System', desc: 'Kidney disease, UTIs, prostate conditions' },
    { name: 'Gastrointestinal System', desc: 'IBD, GERD, liver disease, constipation' },
    { name: 'Respiratory System', desc: 'Asthma, COPD, respiratory infections' },
    { name: 'Immune System & Malignant Disease', desc: 'Cancer treatments, immunosuppressants' },
    { name: 'Blood and Nutrition', desc: 'Anaemia, nutrition, vitamins, minerals' },
  ]

  const lowWeightAreas = [
    'Musculoskeletal System',
    'Eye Conditions',
    'Ear, Nose and Throat',
    'Skin Conditions',
    'Vaccines',
    'Anaesthesia',
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
            Part 2
          </p>
          <h1 className="text-4xl font-semibold text-gray-900 sm:text-5xl mb-6">
            Clinical Knowledge
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Practice across all 15 therapeutic areas with proper MRCP PACES exam weighting.
            Master both SBA and EMQ question formats.
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
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-light text-gray-900 mb-2">120</div>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900 mb-2">2.5 hours</div>
              <p className="text-sm text-gray-600">Time Allowance</p>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900 mb-2">90 SBA</div>
              <p className="text-sm text-gray-600">Single Best Answer</p>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900 mb-2">30 EMQ</div>
              <p className="text-sm text-gray-600">Extended Matching</p>
            </div>
          </div>
        </div>
      </section>

      {/* High-Weight Areas */}
      <section className="bg-[#fbfaf4] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              60-70% of Exam
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              High-Weighted Areas
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              These four therapeutic areas comprise the majority of clinical questions.
              Prioritise these in your preparation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {highWeightAreas.map((area) => (
              <div key={area.name} className="pill-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{area.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {area.weight}
                  </span>
                </div>
                <p className="text-gray-600">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medium-Weight Areas */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              25-35% of Exam
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Medium-Weighted Areas
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediumWeightAreas.map((area) => (
              <div key={area.name} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-medium text-gray-900 mb-2">{area.name}</h3>
                <p className="text-sm text-gray-600">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Low-Weight Areas */}
      <section className="bg-[#fbfaf4] px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              ≤10% of Exam
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Lower-Weighted Areas
            </h2>
            <p className="mt-4 text-gray-600">
              Still important for a complete understanding, but fewer questions overall.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {lowWeightAreas.map((area) => (
              <span key={area} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Question Formats */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Question Types
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              Two Formats to Master
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="pill-card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Single Best Answer (SBA)</h3>
              <p className="text-gray-600 mb-6">
                90 questions requiring you to select the single best answer from 5 options.
                Tests knowledge application and clinical judgement.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• One correct answer from A-E</li>
                <li>• Clinical scenario-based</li>
                <li>• Tests depth of knowledge</li>
              </ul>
            </div>

            <div className="pill-card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Extended Matching Questions (EMQ)</h3>
              <p className="text-gray-600 mb-6">
                30 questions with a theme, options list, and multiple scenarios.
                Each scenario requires matching to the best option.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Theme with 8-10 options</li>
                <li>• 3-5 scenarios per question</li>
                <li>• Tests pattern recognition</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fbfaf4] px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Ready to Build Clinical Confidence?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Practice with thousands of clinical questions across all therapeutic areas.
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
