import { Metadata } from 'next'
import Link from 'next/link'
import AboutSEO from '@/app/components/seo/AboutSEO'
import { RelatedPages } from '@/app/components/seo/RelatedPages'

export const metadata: Metadata = {
  title: 'About MRCPPACESPREP | UK MRCP PACES Exam Platform | 94% Pass Rate | 8,500+ Students',
  description: 'MRCPPACESPREP: UK\'s leading MRCP PACES exam prep platform. Created by physicians. 94% pass rate. 8,500+ students helped. Learn our mission and story.',
  keywords: [
    'about MRCPPACESPREP', 'MRCP PACES exam platform', 'clinical exam preparation',
    'physician-created content', 'UK MRCP exam', 'PACES exam platform',
    'trusted exam prep', 'medical trainee support', 'MRCP PACES success rate'
  ],
  openGraph: {
    title: 'About MRCPPACESPREP | UK MRCP PACES Exam Platform | 94% Pass Rate',
    description: 'UK\'s leading MRCP PACES exam preparation platform. Created by physicians. 94% pass rate. 8,500+ students.',
    url: 'https://www.mrcppacesprep.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About MRCPPACESPREP | UK MRCP PACES Exam Platform',
    description: 'Learn about MRCPPACESPREP - Created by physicians, trusted by 8,500+ students.'
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <>
      <AboutSEO />
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              About MRCPPACESPREP
              <span className="block text-gray-600 text-3xl mt-2">Empowering Future Physicians to Succeed</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-xl text-gray-600">
              Created by physicians who understand the challenges of the MRCP PACES exam, we're committed to helping every medical trainee achieve their MRCP qualification.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At MRCPPACESPREP, we believe that every medical trainee deserves the best possible chance to pass their MRCP PACES exam on their first attempt. Our mission is to provide comprehensive, high-quality exam preparation resources that are accessible, effective, and tailored to the real exam experience.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We understand that failing the MRCP PACES exam can significantly impact your career progression. That's why we've dedicated ourselves to creating the most effective clinical exam preparation platform in the UK.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-gray-900">94% of our students pass on their first attempt</span>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-[#fbfaf4] to-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Core Values</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Excellence</h4>
                    <p className="text-gray-600">We maintain the highest standards in our content, regularly updating questions and explanations.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 mt-1">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Accessibility</h4>
                    <p className="text-gray-600">Quality exam preparation should be affordable and available to everyone.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 mt-1">
                    <div className="h-2 w-2 rounded-full bg-gray-800"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Support</h4>
                    <p className="text-gray-600">We're here to support you throughout your entire exam preparation journey.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Our Impact in Numbers</h2>
          <div className="grid grid-cols-2 gap-8 text-center text-white lg:grid-cols-4">
            <div>
              <div className="text-4xl font-bold mb-2">8,500+</div>
              <div className="text-gray-400">Students Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">94%</div>
              <div className="text-gray-400">Pass Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,000+</div>
              <div className="text-gray-400">Practice Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-gray-400">Mock Exams</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Story</h2>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">The Problem</h3>
              <p className="text-gray-600">We noticed that despite strong clinical knowledge, many medical trainees struggle with the specific format and station requirements of the MRCP PACES exam. Traditional study methods weren't adequately preparing candidates for the real exam experience.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">The Solution</h3>
              <p className="text-gray-600">We created a platform that mirrors the actual exam experience while providing detailed explanations and personalized feedback. Our questions are written by practicing physicians who have recently taken the exam themselves.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-8 w-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">The Results</h3>
              <p className="text-gray-600">Since launching, we've helped over 8,500 students pass their MRCP PACES exam, with a 94% first-time pass rate. Our students consistently report feeling more confident and better prepared than their peers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance Section */}
      <section className="bg-[#fbfaf4] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Commitment to Quality
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <svg className="h-8 w-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Physician-Verified Content</h3>
              <p className="text-gray-600">All our content and scenarios are created and reviewed by qualified physicians with recent MRCP PACES exam experience</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <svg className="h-8 w-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Regular Updates</h3>
              <p className="text-gray-600">We continuously update our content based on current MRCP PACES guidelines, candidate feedback, and changes in clinical practice</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <svg className="h-8 w-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Data-Driven Insights</h3>
              <p className="text-gray-600">We analyze performance data to identify common knowledge gaps and continuously improve our question difficulty and coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Students Say
          </h2>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-8 shadow-sm border">
              <div className="mb-4 flex text-yellow-400">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-xl">{star}</span>
                ))}
              </div>
              <p className="mb-6 text-gray-600">
                "MRCPPACESPREP was a game-changer for me. I failed my first attempt, but after using this platform for 3 months, I passed comfortably! The station-specific practice and detailed feedback really helped me understand where I was going wrong."
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">Dr Priya Patel</p>
                <p className="text-sm text-gray-600">Medical Registrar, London</p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm border">
              <div className="mb-4 flex text-yellow-400">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-xl">{star}</span>
                ))}
              </div>
              <p className="mb-6 text-gray-600">
                "The mock stations were incredibly accurate to the real thing. The practice scenarios prepared me well for the actual exam format. The communication skills guidance was especially helpful."
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">Dr James Wilson</p>
                <p className="text-sm text-gray-600">Core Medical Trainee, Manchester</p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-sm border">
              <div className="mb-4 flex text-yellow-400">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-xl">{star}</span>
                ))}
              </div>
              <p className="mb-6 text-gray-600">
                "Worth every penny! The performance tracking helped me identify my weak stations and focus my study time effectively. The clinical examination techniques guidance was invaluable. The support team was also incredibly helpful."
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">Dr Fatima Ali</p>
                <p className="text-sm text-gray-600">IMT Doctor, Birmingham</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <RelatedPages currentPath="/about" title="Explore Our Platform" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Join Our Success Story?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your preparation today and join thousands who've passed their exam with confidence
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </Link>
          <p className="mt-4 text-gray-400">7-day money-back guarantee</p>
        </div>
      </section>

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