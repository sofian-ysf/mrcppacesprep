import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'High-Risk Drugs Practice | PreRegExamPrep',
  description: 'Practice questions on the 11 high-risk drug categories that appear in every GPhC exam. Critical safety knowledge for exam success.',
  keywords: 'high-risk drugs, GPhC safety questions, anticoagulants, antibiotics, insulins, methotrexate, opiates',
  openGraph: {
    title: 'High-Risk Drugs Practice | PreRegExamPrep',
    description: 'Master critical safety knowledge for the 11 high-risk drug categories required in every GPhC exam.',
    url: 'https://preregexamprep.com/questions/high-risk-drugs',
  },
  alternates: {
    canonical: '/questions/high-risk-drugs',
  },
}

export default function HighRiskDrugsPage() {
  const highRiskCategories = [
    { name: 'Antibiotics', desc: 'Antimicrobial resistance, dosing, interactions, allergies, C. diff risk' },
    { name: 'Anticoagulants', desc: 'Warfarin, DOACs, bleeding risk, INR monitoring, drug interactions' },
    { name: 'Antihypertensives', desc: 'ACE inhibitors, ARBs, calcium channel blockers, monitoring' },
    { name: 'Chemotherapy Agents', desc: 'Cytotoxic drugs, handling safety, monitoring, severe side effects' },
    { name: 'Insulins & Antidiabetics', desc: 'Insulin types, hypoglycaemia risk, drug interactions, monitoring' },
    { name: 'Parenteral Drugs', desc: 'IV medications, infusion safety, extravasation risk, compatibility' },
    { name: 'Narrow Therapeutic Index', desc: 'Lithium, digoxin, phenytoin, theophylline - monitoring and toxicity' },
    { name: 'NSAIDs', desc: 'GI risk, cardiovascular risk, renal effects, drug interactions' },
    { name: 'Methotrexate', desc: 'Weekly dosing, folic acid, toxicity monitoring, drug interactions' },
    { name: 'Opiates', desc: 'Controlled drug requirements, respiratory depression, dependence' },
    { name: 'Valproate', desc: 'Pregnancy prevention programme, teratogenicity, liver monitoring' },
  ]

  const safetyThemes = [
    'Therapeutic drug monitoring requirements',
    'Drug-drug interactions',
    'Contraindications and cautions',
    'Serious adverse effects',
    'Patient counselling points',
    'Special populations (elderly, renal, hepatic)',
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
            Critical Safety Knowledge
          </p>
          <h1 className="text-4xl font-semibold text-gray-900 sm:text-5xl mb-6">
            High-Risk Drugs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Master the 11 high-risk drug categories that feature in every GPhC assessment.
            Essential knowledge for patient safety and exam success.
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

      {/* Important Notice */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-3xl">
          <div className="bg-[#fbfaf4] border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Exam Requirement</h3>
                <p className="text-gray-600">
                  Every GPhC assessment includes at least one question from each of these 11 high-risk
                  drug categories. This section is essential for both exam success and clinical practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11 Categories */}
      <section className="bg-[#fbfaf4] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Required in Every Exam
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              11 High-Risk Categories
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highRiskCategories.map((category) => (
              <div key={category.name} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-medium text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Themes */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Common Themes
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              What You'll Be Tested On
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Questions focus on these recurring safety themes across all high-risk drug categories.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {safetyThemes.map((theme) => (
              <div key={theme} className="flex items-center gap-3 p-4 bg-[#fbfaf4] rounded-xl">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">{theme}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Tips */}
      <section className="bg-[#fbfaf4] px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Preparation Strategy
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              How to Approach High-Risk Drugs
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-900">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-3">Know the Monitoring</h3>
              <p className="text-sm text-gray-600">
                Understand what parameters need monitoring for each drug category
                and how frequently.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-900">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-3">Learn Key Interactions</h3>
              <p className="text-sm text-gray-600">
                Focus on clinically significant drug interactions that could cause
                serious harm.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-900">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-3">Practice Counselling</h3>
              <p className="text-sm text-gray-600">
                Be prepared to advise patients on key safety points and warning
                signs to watch for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Ready to Master High-Risk Drugs?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Practice with dedicated questions for each high-risk category.
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
  )
}
