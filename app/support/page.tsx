import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Support | MRCPPACESPREP Help Center',
  description: 'Get help with MRCPPACESPREP. Find answers to common questions, contact support, and access resources for your MRCP PACES exam preparation.',
  keywords: 'support, help center, MRCPPACESPREP, MRCP PACES exam help, customer support',
  openGraph: {
    title: 'Support | MRCPPACESPREP Help Center',
    description: 'Get help and support for your MRCP PACES exam preparation journey.',
    url: 'https://mrcppacesprep.com/support',
  },
  alternates: {
    canonical: '/support',
  },
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
            <p className="text-xl text-gray-600">Get help with your MRCP PACES exam preparation journey</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
              <p className="text-gray-600 mb-4">Find answers to common questions about our platform and the MRCP PACES exam</p>
              <Link href="#faq" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                View FAQs
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat Support</h3>
              <p className="text-gray-600 mb-4">Get instant help from our support team during business hours</p>
              <button className="inline-flex items-center text-green-600 hover:text-green-800 font-medium">
                Start Chat
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Send us a detailed message and we'll respond within 24 hours</p>
              <Link href="/contact" className="inline-flex items-center text-gray-800 hover:text-gray-900 font-medium">
                Send Email
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-[#fbfaf4] rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Hours</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM GMT</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM GMT</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> team@mrcppacesprep.com</p>
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                  <p><strong>Emergency Support:</strong> Available for premium subscribers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Getting Started Guide */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Getting Started Guide</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Account</h3>
                <p className="text-gray-600">Sign up and choose your subscription plan</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Take Assessment</h3>
                <p className="text-gray-600">Complete our initial assessment to identify your strengths</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Studying</h3>
                <p className="text-gray-600">Begin with your personalized study plan</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gray-800">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-gray-600">Monitor your improvement with detailed analytics</p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div id="faq" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-4xl mx-auto">

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                  How do I reset my password?
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600">
                  Click on "Forgot Password" on the login page, enter your email address, and we'll send you a password reset link. If you don't receive the email within 5 minutes, check your spam folder or contact support.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                  Can I change my subscription plan?
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600">
                  Yes, you can upgrade or downgrade your subscription at any time from your account settings. Changes will be prorated and take effect immediately for upgrades, or at the end of your current billing period for downgrades.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                  How accurate are the practice questions compared to the real exam?
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600">
                  Our questions are written by registered physicians who have recently taken the MRCP PACES exam. We regularly update our question bank based on student feedback and current exam trends. Many students report our questions are slightly harder than the actual exam, which helps build confidence.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                  Can I access the platform on mobile devices?
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600">
                  Yes! Our platform is fully responsive and works perfectly on smartphones, tablets, and computers. Your progress syncs across all devices, so you can study anywhere, anytime.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                  What happens if I fail my exam after using your platform?
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600">
                  While we can't guarantee exam success, we provide comprehensive support for retakes. Our Complete plan (12 months) includes retake coverage, giving you extended access to help prepare for your next attempt if needed.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                  How do I cancel my subscription?
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600">
                  You can cancel your subscription anytime from your account settings under "Billing & Subscription." Your access will continue until the end of your current billing period. You can also contact our support team for assistance with cancellation.
                </p>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-white p-6">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                  How often is the content updated?
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600">
                  We update our content monthly based on the latest MRCP PACES guidelines, student feedback, and exam trends. New questions are added regularly, and existing content is reviewed by our team of registered physicians to ensure accuracy and relevance.
                </p>
              </details>

            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-gray-300 mb-6">
              Our dedicated support team is here to help you succeed in your MRCP PACES exam preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/help"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold text-gray-900">MRCPPACESPREP</h3>
              <p className="text-sm text-gray-600">
                The UK's leading platform for MRCP PACES exam preparation.
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
                <li><Link href="/support" className="text-gray-900 font-medium">Support</Link></li>
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