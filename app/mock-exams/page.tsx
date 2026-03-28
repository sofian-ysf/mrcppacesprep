import { Metadata } from 'next'
import Link from 'next/link'
import MockExamsSEO from '@/app/components/seo/MockExamsSEO'
import { RelatedPages } from '@/app/components/seo/RelatedPages'
import {
  Clock,
  ChartBar,
  Lightning,
  TrendUp,
  FileText,
  Stack,
  Calculator,
  Timer,
  ChartLine,
  Users,
  Target,
  CheckCircle
} from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'MRCP PACES Mock Exams 2025 | Realistic Practice Tests | 94% Pass Rate | £30/month',
  description: 'Take realistic MRCP PACES mock exams. 110 questions, 2.5 hours, exact exam format. Detailed performance analysis. ±3% accuracy vs real exam. Unlimited attempts. £30/month.',
  keywords: [
    'MRCP PACES mock exams', 'MRCP PACES practice test', 'MRCP PACES mock exam', 'medical mock exam UK',
    'MRCP PACES exam simulation', 'timed practice test', 'realistic MRCP PACES exam', 'MRCP PACES practice papers',
    'MRCP PACES exam format', '110 question mock', '2.5 hour exam practice', 'MRCP PACES exam timing',
    'mock exam feedback', 'performance analysis', 'pass prediction', 'topic mock exams'
  ],
  openGraph: {
    title: 'MRCP PACES Mock Exams | Realistic Practice Tests | 94% Pass Rate',
    description: 'Realistic MRCP PACES mock exams with exact timing. 110 questions, 2.5 hours. ±3% accuracy vs real exam.',
    url: 'https://www.mrcppacesprep.com/mock-exams',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MRCP PACES Mock Exams | Realistic Practice Tests | 94% Pass Rate',
    description: 'Take unlimited MRCP PACES mock exams. Exact exam format. Detailed performance analysis.'
  },
  alternates: {
    canonical: '/mock-exams',
  },
}

export default function MockExamsPage() {
  return (
    <>
      <MockExamsSEO />
      <div className="min-h-screen bg-white">
        {/* Hero Section - Mobile optimized with proper viewport handling */}
        <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-5 py-10 md:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl w-full">
            <div className="text-center">
              <div className="pill-badge mb-5 md:mb-6 inline-block">
                ±3% accuracy vs real exam
              </div>

              <h1 className="mb-5 md:mb-6 text-[28px] leading-tight font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Simulate the Real MRCP PACES
                <span className="block">Exam Experience</span>
              </h1>

              <p className="mx-auto mb-8 md:mb-10 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg lg:text-xl">
                Practice under real exam conditions with comprehensive mock exams. Get detailed feedback and build confidence for your MRCP PACES examination.
              </p>

              {/* Mobile-first buttons with proper touch targets (min 44px height) */}
              <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-center">
                <Link
                  href="/pricing"
                  className="pill-btn pill-btn-primary w-full md:w-auto min-h-[48px] text-base px-8 py-3"
                >
                  Get Started — From £25
                </Link>
                <Link
                  href="/try-free"
                  className="pill-btn pill-btn-secondary w-full md:w-auto min-h-[48px] text-base px-8 py-3"
                >
                  Try Free Demo
                </Link>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Join 8,500+ candidates • 94% pass rate
              </p>

              {/* Stats - 2x2 grid on mobile, 4 columns on tablet+ */}
              <div className="mt-10 md:mt-12 grid grid-cols-2 gap-6 md:gap-8 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">2.5 hrs</div>
                  <div className="text-sm text-gray-600 mt-1">Exact Timing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">110</div>
                  <div className="text-sm text-gray-600 mt-1">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">94%</div>
                  <div className="text-sm text-gray-600 mt-1">Pass Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">Instant</div>
                  <div className="text-sm text-gray-600 mt-1">Results</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features - Horizontal scroll on mobile, grid on tablet+ */}
        <section className="bg-[#fbfaf4] px-5 py-10 md:px-6 md:py-16 lg:px-8 border-y border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="flex gap-6 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 md:gap-8 md:overflow-visible scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0">
              {[
                { icon: Clock, title: 'Exact Timing', desc: '2.5 hours, 110 questions - exactly like the real exam' },
                { icon: ChartBar, title: 'Detailed Analysis', desc: 'Performance breakdown by topic and question type' },
                { icon: Lightning, title: 'Instant Results', desc: 'Immediate feedback with explanations for every question' },
                { icon: TrendUp, title: 'Progress Tracking', desc: 'Monitor improvement across multiple mock attempts' },
              ].map((feature, i) => (
                <div key={i} className="flex-shrink-0 w-[200px] md:w-auto text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white">
                    <feature.icon className="h-6 w-6 text-gray-700" weight="duotone" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mock Exam Types - Stack on mobile */}
        <section id="exam-types" className="px-5 py-12 md:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
                Choose Your Mock Exam Type
              </h2>
              <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Different exam formats to match your preparation needs.
              </p>
            </div>

            <div className="space-y-6 md:space-y-0 md:grid md:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Full-Length Exam */}
              <div className="pill-card p-6 md:p-8">
                <div className="mb-5 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#fbfaf4]">
                  <FileText className="h-7 w-7 md:h-8 md:w-8 text-gray-700" weight="duotone" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Full-Length Practice Exams</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-5">
                  Complete 110-question exams in 2.5 hours, exactly matching the real MRCP PACES exam format.
                </p>
                <ul className="space-y-3 mb-6">
                  {['110 questions in 150 minutes', 'Realistic question distribution', 'Complete performance analysis', 'Pass/fail prediction'].map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" weight="fill" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing" className="pill-btn pill-btn-primary w-full min-h-[48px] text-base">
                  Start Practicing Today
                </Link>
                <p className="mt-4 py-2 text-sm text-gray-500 text-center">
                  7-day money-back guarantee
                </p>
              </div>

              {/* Mini Exam */}
              <div className="pill-card p-6 md:p-8">
                <div className="mb-5 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#fbfaf4]">
                  <Stack className="h-7 w-7 md:h-8 md:w-8 text-gray-700" weight="duotone" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Topic-Specific Mini Exams</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-5">
                  Focused 25-question exams on specific topics. Perfect for building confidence gradually.
                </p>
                <ul className="space-y-3 mb-6">
                  {['25 questions in 30 minutes', 'Single topic focus', 'Topic mastery tracking', 'Ideal for weak area practice'].map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" weight="fill" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing" className="pill-btn pill-btn-primary w-full min-h-[48px] text-base">
                  Start Practicing Today
                </Link>
                <p className="mt-4 py-2 text-sm text-gray-500 text-center">
                  7-day money-back guarantee
                </p>
              </div>

              {/* Calculation Sessions */}
              <div className="pill-card p-6 md:p-8 md:col-span-2 lg:col-span-1">
                <div className="mb-5 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#fbfaf4]">
                  <Calculator className="h-7 w-7 md:h-8 md:w-8 text-gray-700" weight="duotone" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Rapid-Fire Calculation Sessions</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-5">
                  Intensive calculation practice with time pressure. Master pharmaceutical calculations.
                </p>
                <ul className="space-y-3 mb-6">
                  {['15 calculations in 20 minutes', 'Speed and accuracy focus', 'Time-saving techniques', 'Error pattern analysis'].map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" weight="fill" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing" className="pill-btn pill-btn-primary w-full min-h-[48px] text-base">
                  Start Practicing Today
                </Link>
                <p className="mt-4 py-2 text-sm text-gray-500 text-center">
                  7-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exam Simulation Features */}
        <section className="bg-[#fbfaf4] px-5 py-12 md:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
                Realistic Exam Simulation
              </h2>
              <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the real exam before exam day.
              </p>
            </div>

            <div className="space-y-10 lg:space-y-0 lg:grid lg:gap-12 lg:grid-cols-2">
              {/* Features List */}
              <div className="space-y-6">
                {[
                  { icon: Timer, title: 'Exact Timing & Format', desc: 'Experience the real exam pressure with exact 2.5-hour timing and interface that matches the actual MRCP PACES exam.' },
                  { icon: ChartLine, title: 'Realistic Question Distribution', desc: 'Questions distributed across topics exactly as in the real exam, with the correct balance of subjects.' },
                  { icon: Users, title: 'Performance Benchmarking', desc: 'Compare your performance against thousands of other students. Know where you stand before the real exam.' },
                  { icon: Target, title: 'Instant Result Analysis', desc: 'Get immediate feedback with detailed breakdowns by topic, question type, and difficulty level.' },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white">
                      <feature.icon className="h-6 w-6 text-gray-700" weight="duotone" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-base md:text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Results Card */}
              <div className="pill-card p-5 md:p-8">
                <h3 className="mb-5 md:mb-6 text-lg md:text-xl font-bold text-gray-900">Sample Mock Exam Results</h3>
                <div className="space-y-5">
                  <div className="bg-[#fbfaf4] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Overall Score</h4>
                      <span className="text-xl md:text-2xl font-bold text-green-600">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{width: '78%'}}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">PASS - Above 70% threshold</p>
                  </div>

                  <div className="bg-[#fbfaf4] rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Performance by Topic</h4>
                    <div className="space-y-3">
                      {[
                        { topic: 'Calculations', score: 85, color: 'bg-blue-500' },
                        { topic: 'Clinical Medical', score: 82, color: 'bg-green-500' },
                        { topic: 'Law & Ethics', score: 68, color: 'bg-yellow-500' },
                        { topic: 'Pharmacology', score: 65, color: 'bg-red-500' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 w-28 flex-shrink-0">{item.topic}</span>
                          <div className="flex items-center flex-1 ml-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                              <div className={`${item.color} h-2 rounded-full`} style={{width: `${item.score}%`}}></div>
                            </div>
                            <span className="text-sm font-semibold w-10 text-right">{item.score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preparation Timeline - Horizontal scroll on mobile */}
        <section className="px-5 py-12 md:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
                When to Take Mock Exams
              </h2>
              <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                A structured approach to maximise your exam readiness.
              </p>
            </div>

            {/* Timeline cards - horizontal scroll on mobile */}
            <div className="flex gap-5 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0">
              {[
                { weeks: '8-12', title: 'Baseline Assessment', items: ['Take 1 full mock exam', 'Identify knowledge gaps', 'Create study plan', 'Set improvement targets'] },
                { weeks: '4-6', title: 'Progress Check', items: ['Take 1 mock every 2 weeks', 'Mix with topic minis', 'Focus on weak areas', 'Monitor improvements'] },
                { weeks: '1-2', title: 'Final Preparation', items: ['Take 2-3 full mocks', 'Practice exact timing', 'Build confidence', 'Fine-tune strategy'] },
              ].map((phase, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] md:w-auto text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-[#fbfaf4]">
                    <span className="text-xl md:text-2xl font-bold text-gray-900">{phase.weeks}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">Weeks Before Exam</h3>
                  <div className="pill-card p-5 md:p-6 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">{phase.title}</h4>
                    <ul className="text-sm text-gray-600 space-y-2 text-left">
                      {phase.items.map((item, j) => (
                        <li key={j}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips Section */}
            <div className="mt-10 md:mt-16 border border-gray-200 rounded-2xl p-5 md:p-8 bg-white">
              <h3 className="text-lg md:text-xl font-semibold mb-5 text-center text-gray-900">Mock Exam Success Tips</h3>
              <div className="space-y-6 md:space-y-0 md:grid md:gap-8 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3 text-base text-gray-900">During the exam</h4>
                  <ul className="space-y-2.5 text-sm text-gray-600 leading-relaxed">
                    <li>• Treat it like the real exam - no interruptions</li>
                    <li>• Don&apos;t look up answers or use external resources</li>
                    <li>• Practice your time management strategy</li>
                    <li>• Note questions you found challenging</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-base text-gray-900">After the exam</h4>
                  <ul className="space-y-2.5 text-sm text-gray-600 leading-relaxed">
                    <li>• Review all incorrect answers immediately</li>
                    <li>• Identify patterns in your mistakes</li>
                    <li>• Create targeted study plans for weak areas</li>
                    <li>• Track your progress over time</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Student Results */}
        <section className="bg-[#fbfaf4] px-5 py-12 md:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10 md:mb-16">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">Success Stories</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
                Real Student Results
              </h2>
            </div>

            {/* Testimonial cards - horizontal scroll on mobile */}
            <div className="flex gap-5 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0">
              {[
                { initials: 'AK', name: 'Aisha K.', role: 'Hospital Physician, Leeds', first: 52, final: 78, real: 76, quote: 'My final mock was almost identical to my actual result. Felt properly prepared.' },
                { initials: 'TR', name: 'Tom R.', role: 'Community Physician, Bristol', first: 48, final: 82, real: 79, quote: 'Failed first time round. The mocks showed me exactly where I was going wrong.' },
                { initials: 'FN', name: 'Fatima N.', role: 'Clinical Physician, Glasgow', first: 67, final: 84, real: 81, quote: 'The time pressure practice was key. Finished the real thing with time to spare.' },
              ].map((student, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] md:w-auto pill-card p-5 md:p-6">
                  <div className="text-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-gray-600">{student.initials}</span>
                    </div>
                    <div className="font-semibold text-gray-900">{student.name}</div>
                    <p className="text-sm text-gray-500">{student.role}</p>
                  </div>
                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">First Mock:</span>
                      <span className={`font-semibold ${student.first < 60 ? 'text-red-600' : 'text-yellow-600'}`}>{student.first}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Final Mock:</span>
                      <span className="font-semibold text-green-600">{student.final}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Real Exam:</span>
                      <span className="font-semibold text-green-600">{student.real}%</span>
                    </div>
                  </div>
                  <blockquote className="text-sm text-gray-700 italic border-t pt-4">
                    &ldquo;{student.quote}&rdquo;
                  </blockquote>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-10 md:mt-16 grid grid-cols-3 gap-4 md:gap-12 md:flex md:justify-center">
              {[
                { value: '94%', label: 'Pass Rate', sub: '5+ mocks taken' },
                { value: '23%', label: 'Avg Improvement', sub: 'First to final' },
                { value: '±3%', label: 'Accuracy', sub: 'Mock vs real' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">{stat.label}</div>
                  <div className="text-[10px] md:text-xs text-gray-400">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="px-5 py-12 md:px-6 md:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <RelatedPages currentPath="/mock-exams" title="Continue Your Preparation" />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#fbfaf4] px-5 py-12 md:px-6 md:py-24 lg:px-8 border-t border-gray-100">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
              Start Today
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 md:mb-6">
              Ready to See Where You Stand?
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
              Join 8,500+ candidates who passed with our mock exams.
            </p>

            <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-center">
              <Link
                href="/pricing"
                className="pill-btn pill-btn-primary w-full md:w-auto min-h-[48px] text-base px-8 py-3"
              >
                Get Started Now
              </Link>
              <Link
                href="/try-free"
                className="pill-btn pill-btn-secondary w-full md:w-auto min-h-[48px] text-base px-8 py-3"
              >
                Try Free Demo
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              94% pass rate • 7-day money-back guarantee
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-5 py-10 md:px-6 md:py-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
              <div className="col-span-2 md:col-span-1">
                <h3 className="mb-4 font-bold text-gray-900">MRCPPACESPREP</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The UK&apos;s leading platform for MRCP PACES exam preparation.
                </p>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-gray-900">Resources</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><Link href="/question-bank" className="hover:text-gray-900 py-1 inline-block">Question Bank</Link></li>
                  <li><Link href="/mock-exams" className="hover:text-gray-900 py-1 inline-block">Mock Exams</Link></li>
                  <li><Link href="/study-guides" className="hover:text-gray-900 py-1 inline-block">Study Guides</Link></li>
                  <li><Link href="/study-guides" className="hover:text-gray-900 py-1 inline-block">Study Guides</Link></li>
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
