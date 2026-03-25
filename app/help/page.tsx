'use client'

import { useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'

const helpTopics = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn how to set up your account and start studying',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Get Started" button on the homepage, enter your email and full name, then check your email for a magic link to complete registration. No password is required.'
      },
      {
        question: 'How do I navigate the platform?',
        answer: 'Use the main dashboard to access practice questions, mock exams, study guides, and progress tracking. The navigation menu at the top provides quick access to all features.'
      },
      {
        question: 'How do I take my first practice test?',
        answer: 'Go to the Question Bank from your dashboard, select a topic or choose "Random Practice," and start answering questions. You\'ll get immediate feedback after each question.'
      }
    ]
  },
  {
    id: 'practice-questions',
    title: 'Using Practice Questions',
    description: 'Make the most of our question bank and practice system',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    questions: [
      {
        question: 'How should I practice questions effectively?',
        answer: 'Start with 20-30 questions per day, read all explanations (even for correct answers), and focus on understanding concepts rather than memorizing. Review incorrect answers immediately.'
      },
      {
        question: 'What do the explanations include?',
        answer: 'Each question includes detailed explanations for why the correct answer is right and why other options are wrong, plus relevant background information and related concepts.'
      },
      {
        question: 'How do I track my progress?',
        answer: 'Your dashboard shows overall performance, topic-specific scores, improvement trends, and weak areas. Use the analytics to focus your study time effectively.'
      },
      {
        question: 'Can I bookmark questions for later review?',
        answer: 'Yes, click the bookmark icon on any question to save it to your review list. Access bookmarked questions from your dashboard under "Saved Questions."'
      }
    ]
  },
  {
    id: 'mock-exams',
    title: 'Mock Exams',
    description: 'Understanding and using our exam simulation system',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    questions: [
      {
        question: 'When should I take my first mock exam?',
        answer: 'Take a baseline mock exam after 2-4 weeks of study to identify knowledge gaps. Then take regular mocks every 2 weeks to track improvement.'
      },
      {
        question: 'How do I interpret my mock exam results?',
        answer: 'Results show your overall score, topic breakdown, question type performance, and comparison to other students. Focus on topics scoring below 70%.'
      },
      {
        question: 'Are the mock exams exactly like the real exam?',
        answer: 'Yes, our mocks use the same timing (2.5 hours), question count (110), format, and difficulty distribution as the actual GPhC exam.'
      },
      {
        question: 'Can I retake mock exams?',
        answer: 'Yes, you can retake any mock exam. We recommend waiting at least a week between attempts to allow for focused study on weak areas.'
      }
    ]
  },
  {
    id: 'technical-support',
    title: 'Technical Support',
    description: 'Solving technical issues and platform problems',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    questions: [
      {
        question: 'Which browsers are supported?',
        answer: 'We support Chrome, Firefox, Safari, and Edge (latest versions). For best performance, we recommend Chrome or Firefox with JavaScript enabled.'
      },
      {
        question: 'Can I use the platform on mobile devices?',
        answer: 'Yes, our platform is fully responsive and works on tablets and smartphones. For the best experience, we recommend using a tablet or computer for mock exams.'
      },
      {
        question: 'What should I do if the platform is running slowly?',
        answer: 'Try refreshing the page, clearing your browser cache, or switching to a different browser. Check your internet connection and close other browser tabs.'
      },
      {
        question: 'I\'m having trouble logging in, what should I do?',
        answer: 'Click "Send magic link" on the login page to receive a new login email. Check your spam folder if you don\'t see it. Contact support if problems persist.'
      }
    ]
  },
  {
    id: 'account-billing',
    title: 'Account & Billing',
    description: 'Managing your subscription and account settings',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    questions: [
      {
        question: 'How do I upgrade or change my subscription?',
        answer: 'Go to Account Settings > Subscription to view and change your plan. Changes take effect immediately, and you\'ll be charged/credited the difference.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. All payments are processed securely.'
      },
      {
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel anytime from Account Settings > Subscription. You\'ll retain access until your current billing period ends.'
      }
    ]
  },
  {
    id: 'study-strategies',
    title: 'Study Tips & Strategies',
    description: 'Expert advice on exam preparation and study techniques',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    questions: [
      {
        question: 'How long should I study for the GPhC exam?',
        answer: 'Most successful students study for 8-12 weeks, spending 20-30 hours per week. Start with foundation topics, then progress to practice questions and mock exams.'
      },
      {
        question: 'How do I improve my calculation scores?',
        answer: 'Practice calculations daily, learn time-saving shortcuts, memorize key formulas, and always show your work. Focus on understanding methods, not just memorizing.'
      },
      {
        question: 'What should I do if I keep getting questions wrong in certain topics?',
        answer: 'Focus on those weak areas with targeted study. Read the relevant study guides, practice more questions in those topics, and review explanations carefully.'
      },
      {
        question: 'How can I manage exam anxiety?',
        answer: 'Take regular mock exams to build confidence, practice relaxation techniques, maintain a consistent study schedule, and ensure you\'re well-prepared with adequate practice.'
      }
    ]
  }
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  // Filter help topics based on search
  const filteredTopics = helpTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.questions.some(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Extract all FAQs for schema
  const allFAQs = helpTopics.flatMap(topic => topic.questions)

  // FAQPage JSON-LD schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFAQs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Help Center
              <span className="block text-gray-600 text-3xl mt-2">Get the Support You Need</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-xl text-gray-600">
              Find answers to common questions, learn how to use our platform effectively, and get expert study advice from qualified pharmacists.
            </p>

            {/* Search Bar */}
            <div className="mt-10 mx-auto max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
                <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Help Topics */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Popular Help Topics
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="rounded-xl border bg-white p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
              >
                <div className="flex items-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    {topic.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">{topic.title}</h3>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{topic.questions.length} articles</span>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${selectedTopic === topic.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded FAQ Section */}
                {selectedTopic === topic.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-4">
                      {topic.questions.map((faq, index) => (
                        <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <button
                            className="w-full text-left flex items-center justify-between font-medium text-gray-900 hover:text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenFAQ(openFAQ === `${topic.id}-${index}` ? null : `${topic.id}-${index}`)
                            }}
                          >
                            <span className="text-sm">{faq.question}</span>
                            <svg
                              className={`h-4 w-4 flex-shrink-0 transition-transform ${openFAQ === `${topic.id}-${index}` ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {openFAQ === `${topic.id}-${index}` && (
                            <div className="mt-3 text-sm text-gray-600">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredTopics.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-600">No help topics found for "{searchTerm}". Try a different search term or browse our popular topics above.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-[#fbfaf4] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Need More Help?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Chat Support</h3>
              <p className="text-gray-600 mb-6">Get instant help from our support team during business hours (9 AM - 6 PM GMT, Mon-Fri).</p>
              <button className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition-colors">
                Start Live Chat
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Email Support</h3>
              <p className="text-gray-600 mb-6">Send us a detailed message and we'll respond within 24 hours. Perfect for complex questions.</p>
              <Link
                href="/contact"
                className="inline-block w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Send Email
              </Link>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Study Guides</h3>
              <p className="text-gray-600 mb-6">Access comprehensive guides on how to use our platform and effective study strategies.</p>
              <Link
                href="/resources"
                className="inline-block w-full rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 transition-colors"
              >
                View Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-200">
            <div className="flex items-start">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-red-900 mb-2">Exam Emergency Support</h3>
                <p className="text-red-800 mb-4">
                  Taking your GPhC exam within 48 hours? We provide priority support for urgent questions about our platform, study strategies, or last-minute technical issues.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Emergency Support
                  </Link>
                  <p className="text-sm text-red-700 flex items-center">
                    Use subject line "URGENT - Exam Support" for priority response
                  </p>
                </div>
              </div>
            </div>
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
                <li><Link href="/support" className="hover:text-gray-900">Support</Link></li>
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