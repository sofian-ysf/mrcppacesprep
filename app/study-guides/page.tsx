import { Metadata } from 'next'
import Link from 'next/link'
import { StudyGuidesGrid } from './StudyGuidesGrid'
import StudyGuidesSEO from '@/app/components/seo/StudyGuidesSEO'
import { RelatedPages } from '@/app/components/seo/RelatedPages'

export const metadata: Metadata = {
  title: 'MRCP PACES Study Guides 2025 | PDF Downloads | Formula Sheets | £30/month',
  description: 'Download comprehensive MRCP PACES study guides. PDF guides, formula sheets, mind maps, learning pathways. Created by physicians. Updated for 2025 MRCP PACES framework. £30/month.',
  keywords: [
    'MRCP PACES study guide', 'MRCP PACES revision notes', 'MRCP PACES study materials', 'medical exam guide',
    'MRCP PACES examination techniques', 'MRCP PACES mind maps', 'MRCP PACES study schedule', 'medical revision resources',
    'MRCP PACES study plan', 'learning pathway', 'exam preparation guide', 'MRCP PACES study tips',
    'MRCP PACES station guides', 'clinical examination guide', 'history taking guide'
  ],
  openGraph: {
    title: 'MRCP PACES Study Guides | PDF Downloads | Formula Sheets | Learning Pathways',
    description: 'Comprehensive MRCP PACES study guides covering all topics. PDF downloads, formula sheets, mind maps.',
    url: 'https://www.mrcppacesprep.com/study-guides',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MRCP PACES Study Guides | PDF Downloads | Formula Sheets',
    description: 'Download comprehensive MRCP PACES study guides and formula sheets. Created by physicians.'
  },
  alternates: {
    canonical: '/study-guides',
  },
}

export default function StudyGuidesPage() {
  return (
    <>
      <StudyGuidesSEO />
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Comprehensive Study Guides for Every MRCP PACES Topic
              <span className="block text-gray-600 text-3xl mt-2">Structured Learning Materials Created by MRCP Holders</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-xl text-gray-600">
              Master every aspect of the MRCP PACES exam with our comprehensive study guides, formula sheets, mind maps, and structured learning pathways designed for efficient exam preparation.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Link
                href="/pricing"
                className="rounded-lg bg-gray-900 px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                Get Started — From £25
              </Link>
              <Link
                href="#topic-guides"
                className="rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-gray-400 transition-colors"
              >
                Browse Topics
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Join 8,500+ candidates • 94% pass rate
            </p>
          </div>
        </div>
      </section>

      {/* Guide Features */}
      <section className="border-y bg-[#fbfaf4] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">PDF Downloads</h3>
              <p className="text-sm text-gray-600">Offline access to all study materials</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Visual Learning</h3>
              <p className="text-sm text-gray-600">Mind maps and diagrams for complex topics</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Self-Assessment</h3>
              <p className="text-sm text-gray-600">Built-in quizzes and knowledge checks</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Regular Updates</h3>
              <p className="text-sm text-gray-600">Content updated with latest guidelines</p>
            </div>
          </div>
        </div>
      </section>

      {/* Topic-Based Guides */}
      <section id="topic-guides" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Study Guides by MRCP PACES Framework Topic
          </h2>

          <StudyGuidesGrid />
        </div>
      </section>

      {/* Learning Pathways */}
      <section className="bg-[#fbfaf4] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Structured Learning Pathways
          </h2>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Foundation Pathway</h3>
                <p className="text-gray-600 mt-2">8-12 weeks before exam</p>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Week 1-2: Core Concepts</h4>
                  <p className="text-sm text-gray-600">Start with Pharmacology and Pharmaceutics fundamentals</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Week 3-4: Calculations</h4>
                  <p className="text-sm text-gray-600">Master all calculation types with systematic practice</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Week 5-6: Clinical Practice</h4>
                  <p className="text-sm text-gray-600">Study Clinical Pharmacy and therapeutic principles</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Week 7-8: Law & Ethics</h4>
                  <p className="text-sm text-gray-600">Complete legal frameworks and ethical guidelines</p>
                </div>
              </div>
              <Link href="/pricing" className="block mt-6 text-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors">
                Get Started Today
              </Link>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-green-500">
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Intensive Pathway</h3>
                <p className="text-gray-600 mt-2">4-6 weeks before exam</p>
                <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  Most Popular
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Week 1: High-Yield Topics</h4>
                  <p className="text-sm text-gray-600">Focus on most commonly tested concepts across all areas</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Week 2-3: Problem Areas</h4>
                  <p className="text-sm text-gray-600">Target personal weak spots with focused study sessions</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Week 4: Integration</h4>
                  <p className="text-sm text-gray-600">Combine topics and practice cross-cutting questions</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Week 5-6: Exam Practice</h4>
                  <p className="text-sm text-gray-600">Intensive mock exam practice and final review</p>
                </div>
              </div>
              <Link href="/pricing" className="block mt-6 text-center rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition-colors">
                Get Started Today
              </Link>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-2xl font-bold text-gray-800">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Rapid Review Pathway</h3>
                <p className="text-gray-600 mt-2">1-2 weeks before exam</p>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-gray-800 pl-4">
                  <h4 className="font-semibold text-gray-900">Days 1-3: Formula Review</h4>
                  <p className="text-sm text-gray-600">Memorize all essential formulas and quick references</p>
                </div>
                <div className="border-l-4 border-gray-800 pl-4">
                  <h4 className="font-semibold text-gray-900">Days 4-7: Key Facts</h4>
                  <p className="text-sm text-gray-600">Review high-yield facts and common exam traps</p>
                </div>
                <div className="border-l-4 border-gray-800 pl-4">
                  <h4 className="font-semibold text-gray-900">Days 8-10: Mock Exams</h4>
                  <p className="text-sm text-gray-600">Take timed practice exams and identify final gaps</p>
                </div>
                <div className="border-l-4 border-gray-800 pl-4">
                  <h4 className="font-semibold text-gray-900">Days 11-14: Final Polish</h4>
                  <p className="text-sm text-gray-600">Light review and confidence building exercises</p>
                </div>
              </div>
              <Link href="/pricing" className="block mt-6 text-center rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white hover:bg-gray-900 transition-colors">
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Study Materials Types */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Types of Study Materials Available
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Guides</h3>
              <p className="text-sm text-gray-600">In-depth coverage of each topic with detailed explanations, examples, and practice questions integrated throughout.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Formula Sheets</h3>
              <p className="text-sm text-gray-600">Quick-reference sheets with all essential formulas, unit conversions, and calculation shortcuts for rapid review.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-8 w-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mind Maps</h3>
              <p className="text-sm text-gray-600">Visual learning aids that connect related concepts and help with memory retention for complex topics.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Reference Cards</h3>
              <p className="text-sm text-gray-600">Pocket-sized reference cards with key facts, drug information, and important guidelines for easy review.</p>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-br from-[#fbfaf4] to-gray-100 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Integration with Practice Questions</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Seamless Connection</h4>
                <p className="text-gray-600 mb-4">
                  Every study guide is directly linked to relevant practice questions. When studying a topic, you can immediately test your understanding with targeted questions.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Click from guide sections to related questions</li>
                  <li>• Automatic recommendations based on study progress</li>
                  <li>• Performance tracking across materials and questions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Adaptive Learning</h4>
                <p className="text-gray-600 mb-4">
                  The system tracks which study materials you've reviewed and suggests additional resources based on your question performance.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Personalized study recommendations</li>
                  <li>• Weak area identification and targeted materials</li>
                  <li>• Progress tracking across all resources</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Study Schedule Templates */}
      <section className="bg-[#fbfaf4] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Customizable Study Schedule Templates
          </h2>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Sample 8-Week Study Schedule</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">Week 1-2: Foundation Building</h4>
                    <span className="text-sm text-blue-600">20 hours/week</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Read Pharmacology guide (30 pages/day)</li>
                    <li>• Complete 25 practice questions daily</li>
                    <li>• Review formula sheet for calculations</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">Week 3-4: Core Topics</h4>
                    <span className="text-sm text-green-600">25 hours/week</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Study Clinical Pharmacy guide</li>
                    <li>• Practice 40 questions daily</li>
                    <li>• Focus on calculation problems</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">Week 5-6: Application</h4>
                    <span className="text-sm text-gray-800">25 hours/week</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Complete Law & Ethics guide</li>
                    <li>• Take first full mock exam</li>
                    <li>• Review weak areas identified</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">Week 7-8: Final Preparation</h4>
                    <span className="text-sm text-orange-600">30 hours/week</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Take 3 full mock exams</li>
                    <li>• Review all quick reference cards</li>
                    <li>• Light revision of strong areas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Personalized Schedule Generator</h3>
              <p className="text-gray-600 mb-6">
                Answer a few questions about your exam date, available study time, and current knowledge level to get a personalized study schedule.
              </p>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-[#fbfaf4] rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Your inputs:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Exam date and weeks available</li>
                    <li>• Hours per day you can study</li>
                    <li>• Current strengths and weaknesses</li>
                    <li>• Preferred learning style</li>
                    <li>• Previous exam attempts</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">You get:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Daily study targets and materials</li>
                    <li>• Automatic progress tracking</li>
                    <li>• Schedule adjustments based on performance</li>
                    <li>• Reminders and motivation</li>
                  </ul>
                </div>
              </div>

              <Link href="/pricing" className="block text-center rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors">
                Get Started — From £25
              </Link>
              <p className="mt-3 text-sm text-gray-500 text-center">
                7-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <RelatedPages currentPath="/study-guides" title="Continue Your Preparation" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Access All Study Guides and Materials Today
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join 8,500+ candidates who passed with our comprehensive study materials.
          </p>
          <Link
            href="/pricing"
            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </Link>
          <p className="mt-4 text-gray-400">94% pass rate • 7-day money-back guarantee</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
            <div className="flex items-center justify-center">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>All topics covered</span>
            </div>
            <div className="flex items-center justify-center">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>PDF downloads</span>
            </div>
            <div className="flex items-center justify-center">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Regular updates</span>
            </div>
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
                <li><Link href="/support" className="hover:text-gray-900">Support</Link></li>
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
    </>
  )
}