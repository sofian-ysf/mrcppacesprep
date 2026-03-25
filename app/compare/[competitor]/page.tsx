import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import FAQSection from '@/app/components/FAQSection'

// Competitor data - add more as needed
const competitors: Record<string, {
  name: string;
  fullName: string;
  description: string;
  features: Record<string, { us: string; them: string }>;
  pricing: { us: string; them: string };
  faqs: Array<{ question: string; answer: string }>;
}> = {
  'passmedicine': {
    name: 'PassMedicine',
    fullName: 'PassMedicine GPhC Prep',
    description: 'PassMedicine offers question banks for various medical exams including GPhC preparation.',
    features: {
      'GPhC-Specific Questions': { us: '2,000+ questions written by UK pharmacists', them: 'Mixed medical/pharmacy content' },
      'Mock Exams': { us: 'Unlimited full-length mock exams', them: 'Limited mock exam functionality' },
      'Calculations Practice': { us: '350+ calculation questions with step-by-step solutions', them: 'Basic calculation coverage' },
      'Progress Tracking': { us: 'Detailed analytics and weak area identification', them: 'Basic progress tracking' },
      'Mobile Access': { us: 'Fully responsive, works on all devices', them: 'Web-based access' },
      'Content Updates': { us: 'Updated for 2026 GPhC framework', them: 'Periodic updates' },
    },
    pricing: { us: 'From 25 GBP one-time payment', them: 'Subscription-based' },
    faqs: [
      { question: 'Is PreRegExamPrep better than PassMedicine for GPhC?', answer: 'PreRegExamPrep is purpose-built for the GPhC exam with 2,000+ UK pharmacist-written questions, while PassMedicine covers multiple medical exams. For GPhC-specific preparation, our focused approach and 94% pass rate speak to our effectiveness.' },
      { question: 'Which has more GPhC practice questions?', answer: 'PreRegExamPrep has 2,000+ questions specifically written for the GPhC exam by registered UK pharmacists. All questions are aligned with the 2026 GPhC framework.' },
      { question: 'Do both platforms offer mock exams?', answer: 'Yes, both offer mock exams. PreRegExamPrep provides unlimited full-length mock exams that simulate the real exam environment with 110 questions in 2.5 hours.' },
    ]
  },
  'pharmatutor': {
    name: 'PharmaTutor',
    fullName: 'PharmaTutor Pharmacy Revision',
    description: 'PharmaTutor provides pharmacy study materials and revision resources.',
    features: {
      'Question Bank Size': { us: '2,000+ GPhC questions', them: 'Smaller question bank' },
      'Exam Simulation': { us: 'Full mock exam experience', them: 'Question practice only' },
      'Expert Authors': { us: 'Written by recently passed pharmacists', them: 'Various contributors' },
      'Detailed Explanations': { us: 'Every question has detailed rationale', them: 'Basic explanations' },
      'Student Success Rate': { us: '94% first-time pass rate', them: 'Not published' },
      'Support': { us: 'Email support included', them: 'Limited support' },
    },
    pricing: { us: 'From 25 GBP one-time payment', them: 'Varies by package' },
    faqs: [
      { question: 'How does PreRegExamPrep compare to PharmaTutor?', answer: 'PreRegExamPrep focuses exclusively on GPhC exam preparation with 2,000+ questions, unlimited mock exams, and a 94% pass rate. Our content is written by pharmacists who recently passed the exam.' },
      { question: 'Which platform has better GPhC pass rates?', answer: 'PreRegExamPrep has a documented 94% first-time pass rate, significantly above the national average of 70-85%.' },
      { question: 'Is PreRegExamPrep worth the investment over free resources?', answer: 'Free resources can supplement your study, but PreRegExamPrep provides structured exam-style practice, realistic mock exams, and detailed explanations that significantly improve pass rates.' },
    ]
  },
  'gphc-vs-naplex': {
    name: 'NAPLEX',
    fullName: 'GPhC vs NAPLEX Exam Comparison',
    description: 'Comparing the UK GPhC exam with the US NAPLEX pharmacy licensing exam.',
    features: {
      'Location': { us: 'United Kingdom', them: 'United States' },
      'Question Count': { us: '110 questions', them: '180 questions' },
      'Exam Duration': { us: '2.5 hours', them: '4 hours' },
      'Question Types': { us: 'SBA and EMQ', them: 'MCQ and case-based' },
      'Pass Rate': { us: '~75% nationally', them: '~84% nationally' },
      'Retake Policy': { us: '6-month wait, unlimited attempts', them: '45-day wait, limited attempts' },
    },
    pricing: { us: '253 GBP exam fee', them: '545 USD exam fee (approx)' },
    faqs: [
      { question: 'Can I practice in the UK with a NAPLEX qualification?', answer: 'No, you need to pass the GPhC exam to practice in the UK. US pharmacists must complete the OSPAP programme and pass the GPhC assessment.' },
      { question: 'Which exam is harder - GPhC or NAPLEX?', answer: 'Both exams are rigorous. The GPhC focuses on UK-specific practice including NHS guidelines, while NAPLEX tests US pharmacy law and practice. Difficulty is subjective based on your training.' },
      { question: 'How do I prepare for the GPhC as an international graduate?', answer: 'International graduates should complete OSPAP, then use PreRegExamPrep to practice with UK-specific questions covering BNF, NHS, and UK pharmacy law.' },
    ]
  }
}

interface Props {
  params: Promise<{ competitor: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitor } = await params
  const data = competitors[competitor]

  if (!data) {
    return {
      title: 'Compare GPhC Exam Prep Platforms',
    }
  }

  const isExamComparison = competitor === 'gphc-vs-naplex'
  const title = isExamComparison
    ? 'GPhC vs NAPLEX: Complete Exam Comparison 2026'
    : 'PreRegExamPrep vs ' + data.name + ': GPhC Exam Prep Comparison 2026'

  const description = isExamComparison
    ? 'Compare the UK GPhC exam with the US NAPLEX. See differences in format, questions, duration, and pass rates for both pharmacy licensing exams.'
    : 'Compare PreRegExamPrep with ' + data.name + ' for GPhC exam preparation. See features, pricing, and student success rates side by side.'

  return {
    title,
    description,
    keywords: [
      'GPhC exam prep comparison',
      'PreRegExamPrep vs ' + data.name,
      data.name + ' alternative',
      'best GPhC exam prep',
      'GPhC question bank comparison',
      'pharmacy exam prep UK'
    ],
    openGraph: {
      title,
      description,
      url: 'https://www.preregexamprep.com/compare/' + competitor,
    },
    alternates: {
      canonical: '/compare/' + competitor,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(competitors).map((competitor) => ({
    competitor,
  }))
}

export default async function ComparePage({ params }: Props) {
  const { competitor } = await params
  const data = competitors[competitor]

  if (!data) {
    notFound()
  }

  const isExamComparison = competitor === 'gphc-vs-naplex'
  const title = isExamComparison
    ? 'GPhC vs NAPLEX: UK vs US Pharmacy Exam Comparison'
    : 'PreRegExamPrep vs ' + data.name

  // Generate comparison schema
  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": data.description,
    "url": 'https://www.preregexamprep.com/compare/' + competitor,
    "mainEntity": {
      "@type": "ItemList",
      "name": isExamComparison ? 'GPhC vs NAPLEX Comparison' : 'PreRegExamPrep vs ' + data.name + ' Comparison',
      "itemListElement": Object.entries(data.features).map(([feature, values], index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": feature,
        "description": (isExamComparison ? 'GPhC' : 'PreRegExamPrep') + ': ' + values.us + '. ' + data.name + ': ' + values.them
      }))
    }
  }

  return (
    <>
      <Script
        id="comparison-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumbs items={[
            { label: 'Compare', href: '/compare' },
            { label: data.name, href: '/compare/' + competitor }
          ]} />

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            {data.description}
          </p>

          {/* Comparison Table */}
          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b">Feature</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b bg-green-50">
                    {isExamComparison ? 'GPhC (UK)' : 'PreRegExamPrep'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b">
                    {data.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.features).map(([feature, values], index) => (
                  <tr key={feature} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-b">{feature}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b bg-green-50/30">{values.us}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{values.them}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 border-b">Pricing</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-700 border-b bg-green-50">{data.pricing.us}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">{data.pricing.them}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verdict Section */}
          {!isExamComparison && (
            <div className="bg-[#fbfaf4] rounded-lg p-6 sm:p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Verdict</h2>
              <p className="text-gray-700 mb-6">
                While {data.name} offers valuable resources, PreRegExamPrep is purpose-built for the GPhC exam with
                2,000+ questions written by UK pharmacists who recently passed the exam. Our 94% first-time pass rate,
                unlimited mock exams, and detailed explanations make us the preferred choice for serious candidates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Get Started with PreRegExamPrep
                </Link>
                <Link
                  href="/try-free"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-900 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Try Free Questions
                </Link>
              </div>
            </div>
          )}

          {/* FAQs */}
          <FAQSection
            faqs={data.faqs}
            title={title + ' - FAQ'}
            className="mb-12"
          />

          {/* Related Comparisons */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Other Comparisons</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(competitors)
                .filter(([key]) => key !== competitor)
                .slice(0, 4)
                .map(([key, comp]) => (
                  <Link
                    key={key}
                    href={'/compare/' + key}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
                  >
                    <span className="font-medium text-gray-900">
                      {key === 'gphc-vs-naplex' ? 'GPhC vs NAPLEX' : 'vs ' + comp.name}
                    </span>
                    <span className="block text-sm text-gray-600 mt-1">Compare features and pricing</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
