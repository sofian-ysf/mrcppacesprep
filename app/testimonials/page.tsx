'use client'

import { useState } from 'react'
import Link from 'next/link'
import TestimonialsSEO from '@/app/components/seo/TestimonialsSEO'
import { RelatedPages } from '@/app/components/seo/RelatedPages'
import FAQSection from '@/app/components/FAQSection'

const testimonialsFAQs = [
  {
    question: "Do students actually pass using MRCPPACESPREP?",
    answer: "Yes! 94% of our candidates pass the MRCP PACES exam on their first attempt. We've helped over 29,000 medical trainees since 2019, with thousands of verified success stories."
  },
  {
    question: "How long do successful students study?",
    answer: "Most successful students use our platform for 8-12 weeks, practicing 30-50 questions daily. They typically complete 3-5 mock exams in the final weeks before sitting."
  },
  {
    question: "Is MRCPPACESPREP worth the money?",
    answer: "Our candidates think so - we have a 4.8/5 rating from over 29,000 users. At £30/month, it's significantly cheaper than retaking the £253 MRCP PACES exam."
  },
  {
    question: "What do students say about the questions?",
    answer: "Students consistently say our questions are realistic and slightly harder than the actual exam. This extra challenge means they feel confident and prepared on exam day."
  },
  {
    question: "Can international graduates use MRCPPACESPREP?",
    answer: "Absolutely! Many OSPAP students use our platform. Our questions cover the full MRCP PACES framework, which applies to all candidates regardless of where they qualified."
  }
]

const successFilters = [
  { id: 'all', name: 'All Stories', count: 18 },
  { id: 'first-time', name: 'First Time Pass', count: 12 },
  { id: 'retake', name: 'Passed After Retake', count: 6 },
  { id: 'calculations', name: 'Overcame Calculations', count: 8 },
  { id: 'anxiety', name: 'Conquered Anxiety', count: 4 },
  { id: 'time-management', name: 'Mastered Time Management', count: 5 }
]

const successStories = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    location: 'London',
    background: 'Medical Trainee',
    challenge: 'Failed first attempt with 48% - struggled with clinical examination and time management',
    solution: 'Used MRCPPACESPREP for 3 months, focused on calculation practice and took 8 mock exams',
    results: {
      firstAttempt: '48%',
      finalScore: '76%',
      improvement: '+28%',
      passStatus: 'Passed on second attempt'
    },
    quote: "The calculation practice was a game-changer. I went from dreading math questions to feeling confident. The step-by-step explanations finally made everything click.",
    advice: "Don't give up after failure. Use it as motivation to identify exactly what went wrong and address it systematically.",
    category: 'retake',
    tags: ['calculations', 'time-management'],
    image: '/testimonials/sarah-m.jpg',
    featured: true,
    studyDuration: '3 months',
    questionsCompleted: 2400,
    mocksCompleted: 8
  },
  {
    id: 2,
    name: 'James Chen',
    location: 'Manchester',
    background: 'Hospital Doctor',
    challenge: 'Severe exam anxiety led to poor performance despite strong knowledge',
    solution: 'Combined platform study with anxiety management techniques and regular mock exam practice',
    results: {
      firstAttempt: 'N/A',
      finalScore: '82%',
      improvement: 'First attempt pass',
      passStatus: 'Passed first attempt'
    },
    quote: "The mock exams were incredibly realistic. By my 10th mock, I felt like I'd already taken the real exam. My anxiety completely disappeared on exam day.",
    advice: "Practice under exam conditions as much as possible. The more familiar the format feels, the less anxious you'll be.",
    category: 'first-time',
    tags: ['anxiety', 'mock-exams'],
    image: '/testimonials/james-c.jpg',
    featured: true,
    studyDuration: '4 months',
    questionsCompleted: 3200,
    mocksCompleted: 10
  },
  {
    id: 3,
    name: 'Priya Patel',
    location: 'Birmingham',
    background: 'Medical Registrar',
    challenge: 'Strong in theory but struggled with calculation speed and accuracy',
    solution: 'Daily calculation practice with timed sessions and formula memorization',
    results: {
      firstAttempt: 'N/A',
      finalScore: '79%',
      improvement: 'First attempt pass',
      passStatus: 'Passed first attempt'
    },
    quote: "I used to spend 5 minutes on simple calculations. After practicing with MRCPPACESPREP, I could solve most problems in under 2 minutes.",
    advice: "Master the calculations early. They're often the difference between pass and fail, and speed comes with practice.",
    category: 'first-time',
    tags: ['calculations', 'speed'],
    image: '/testimonials/priya-p.jpg',
    featured: true,
    studyDuration: '2.5 months',
    questionsCompleted: 2800,
    mocksCompleted: 6
  },
  {
    id: 4,
    name: 'Ahmed Hassan',
    location: 'Leeds',
    background: 'International Graduate',
    challenge: 'Language barriers and unfamiliar UK medical practice',
    solution: 'Focused on communication skills & ethics stations with detailed explanation reading',
    results: {
      firstAttempt: '52%',
      finalScore: '71%',
      improvement: '+19%',
      passStatus: 'Passed on second attempt'
    },
    quote: "The explanations were so detailed that I learned not just the right answer, but the reasoning behind UK medical practice.",
    advice: "Don't rush through explanations. Take time to understand the 'why' behind each answer, especially for ethics stations.",
    category: 'retake',
    tags: ['law-ethics', 'international'],
    image: '/testimonials/ahmed-h.jpg',
    featured: false,
    studyDuration: '4 months',
    questionsCompleted: 3500,
    mocksCompleted: 7
  },
  {
    id: 5,
    name: 'Emma Thompson',
    location: 'Edinburgh',
    background: 'Hospital Doctor',
    challenge: 'Poor time management led to incomplete exam attempts',
    solution: 'Systematic timing practice with mock exams and speed challenges',
    results: {
      firstAttempt: 'Incomplete',
      finalScore: '77%',
      improvement: 'Completed with time to spare',
      passStatus: 'Passed on second attempt'
    },
    quote: "I finished my second attempt with 15 minutes to spare! The timing practice completely transformed my exam strategy.",
    advice: "Time management is a skill you can learn. Practice with strict timing until it becomes automatic.",
    category: 'retake',
    tags: ['time-management', 'strategy'],
    image: '/testimonials/emma-t.jpg',
    featured: false,
    studyDuration: '3 months',
    questionsCompleted: 2200,
    mocksCompleted: 9
  },
  {
    id: 6,
    name: 'David Roberts',
    location: 'Cardiff',
    background: 'Medical Trainee',
    challenge: 'Inconsistent performance across different topics',
    solution: 'Used analytics to identify weak areas and focused study accordingly',
    results: {
      firstAttempt: 'N/A',
      finalScore: '84%',
      improvement: 'First attempt pass',
      passStatus: 'Passed first attempt'
    },
    quote: "The performance analytics showed me exactly where I was weak. I could focus my limited study time on what mattered most.",
    advice: "Let the data guide your study plan. Don't waste time on topics you've already mastered.",
    category: 'first-time',
    tags: ['analytics', 'focused-study'],
    image: '/testimonials/david-r.jpg',
    featured: false,
    studyDuration: '3 months',
    questionsCompleted: 2600,
    mocksCompleted: 5
  }
]

const stats = [
  { label: 'Overall Pass Rate', value: '94%', description: 'Students who used our platform' },
  { label: 'Average Score Improvement', value: '+23%', description: 'From first mock to final exam' },
  { label: 'First-Time Pass Rate', value: '89%', description: 'Students taking exam for first time' },
  { label: 'Retake Success Rate', value: '96%', description: 'Students who failed previously' }
]

export default function TestimonialsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedStory, setSelectedStory] = useState<number | null>(null)

  // Filter stories based on selected category
  const filteredStories = successStories.filter(story => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'first-time' || selectedFilter === 'retake') {
      return story.category === selectedFilter
    }
    return story.tags.includes(selectedFilter)
  })

  const featuredStories = successStories.filter(story => story.featured)

  return (
    <>
      <TestimonialsSEO />
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Real Candidates, Real Success
              <span className="block text-gray-600 text-3xl mt-2">Stories of MRCP PACES Exam Achievement</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-xl text-gray-600">
              Discover how thousands of medical trainees have transformed their exam preparation and achieved their MRCP qualification using our platform.
            </p>
          </div>
        </div>
      </section>

      {/* Success Statistics */}
      <section className="border-y bg-[#fbfaf4] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Success by the Numbers</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Success Stories */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Featured Success Stories</h2>

          <div className="grid gap-8 lg:grid-cols-3">
            {featuredStories.map((story) => (
              <div key={story.id} className="bg-white rounded-xl shadow-lg border overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">
                        {story.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                      <p className="text-gray-600">{story.location}</p>
                      <p className="text-sm text-gray-500">{story.background}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-[#fbfaf4] rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{story.results.finalScore}</div>
                      <div className="text-sm text-gray-600">Final Score</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{story.results.improvement}</div>
                      <div className="text-sm text-gray-600">Improvement</div>
                    </div>
                  </div>

                  <blockquote className="text-gray-700 italic mb-6 text-center">
                    "{story.quote}"
                  </blockquote>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold text-gray-900">Challenge:</span>
                      <p className="text-gray-600 mt-1">{story.challenge}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Solution:</span>
                      <p className="text-gray-600 mt-1">{story.solution}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold text-gray-900">{story.studyDuration}</div>
                        <div className="text-gray-600">Study Time</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{story.questionsCompleted.toLocaleString()}</div>
                        <div className="text-gray-600">Questions</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{story.mocksCompleted}</div>
                        <div className="text-gray-600">Mock Exams</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-[#fbfaf4] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Filter Success Stories</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {successFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.name} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Success Stories */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            {selectedFilter === 'all' ? 'All Success Stories' : `${successFilters.find(f => f.id === selectedFilter)?.name} Stories`}
          </h2>

          <div className="space-y-8">
            {filteredStories.map((story) => (
              <div key={story.id} className="bg-white rounded-xl border shadow-sm p-8">
                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Student Info */}
                  <div className="text-center lg:text-left">
                    <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
                      <span className="text-3xl font-bold text-gray-600">
                        {story.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{story.name}</h3>
                    <p className="text-gray-600 mb-1">{story.location}</p>
                    <p className="text-sm text-gray-500 mb-4">{story.background}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between lg:justify-start lg:space-x-4">
                        <span className="text-gray-600">Study Duration:</span>
                        <span className="font-semibold">{story.studyDuration}</span>
                      </div>
                      <div className="flex justify-between lg:justify-start lg:space-x-4">
                        <span className="text-gray-600">Questions Completed:</span>
                        <span className="font-semibold">{story.questionsCompleted.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between lg:justify-start lg:space-x-4">
                        <span className="text-gray-600">Mock Exams:</span>
                        <span className="font-semibold">{story.mocksCompleted}</span>
                      </div>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-[#fbfaf4] rounded-lg">
                        <div className="text-3xl font-bold text-gray-900">{story.results.finalScore}</div>
                        <div className="text-sm text-gray-600">Final Score</div>
                        {story.results.firstAttempt !== 'N/A' && (
                          <div className="text-xs text-gray-500 mt-1">From {story.results.firstAttempt}</div>
                        )}
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">{story.results.improvement}</div>
                        <div className="text-sm text-gray-600">Result</div>
                        <div className="text-xs text-gray-500 mt-1">{story.results.passStatus}</div>
                      </div>
                    </div>

                    <blockquote className="text-lg text-gray-700 italic mb-6 border-l-4 border-gray-300 pl-4">
                      "{story.quote}"
                    </blockquote>

                    <button
                      onClick={() => setSelectedStory(selectedStory === story.id ? null : story.id)}
                      className="flex items-center text-gray-700 hover:text-gray-900 font-medium mb-4"
                    >
                      <span>Read full story</span>
                      <svg
                        className={`ml-2 h-4 w-4 transition-transform ${selectedStory === story.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {selectedStory === story.id && (
                      <div className="space-y-4 border-t border-gray-200 pt-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">The Challenge</h4>
                          <p className="text-gray-700">{story.challenge}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">The Solution</h4>
                          <p className="text-gray-700">{story.solution}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Advice for Other Students</h4>
                          <p className="text-gray-700">{story.advice}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      {story.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-[#fbfaf4]">
        <div className="mx-auto max-w-7xl">
          <RelatedPages currentPath="/testimonials" title="Start Your Journey" />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        faqs={testimonialsFAQs}
        title="Candidate Success Stories - FAQ"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-[#fbfaf4]"
        disableSchema={true}
      />

      {/* Submit Your Story */}
      <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Share Your Success Story
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Inspire future physicians by sharing how you conquered the MRCP PACES exam
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Submit Your Story
          </Link>
          <p className="mt-4 text-gray-400">Help others succeed by sharing your journey</p>
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