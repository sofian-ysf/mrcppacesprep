import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | MRCPPACESPREP',
  description: 'Terms of service for MRCPPACESPREP. Read our terms and conditions for using our MRCP PACES exam preparation platform.',
  keywords: 'terms of service, terms and conditions, MRCPPACESPREP, MRCP PACES exam prep',
  openGraph: {
    title: 'Terms of Service | MRCPPACESPREP',
    description: 'Terms and conditions for using our MRCP PACES exam preparation platform.',
    url: 'https://mrcppacesprep.com/terms',
  },
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">Last updated: December 2024</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using MRCPPACESPREP ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-700 mb-4">
                These Terms of Service govern your use of our MRCP PACES exam preparation platform, including all content, services, and products available at or through the website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                MRCPPACESPREP provides an online educational platform designed to help medical trainees prepare for the MRCP PACES (Practical Assessment of Clinical Examination Skills) examination. Our services include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Clinical examination technique tutorials and videos</li>
                <li>Communication skills guidance and frameworks</li>
                <li>Mock station scenarios and case presentations</li>
                <li>Performance tracking and analytics</li>
                <li>Study planning tools</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-700 mb-4">
                To access our services, you must create an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Account Responsibilities</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>You must be at least 16 years old to create an account</li>
                <li>You agree to provide accurate and truthful information</li>
                <li>You are responsible for keeping your login credentials secure</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>One account per person - sharing accounts is prohibited</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription and Payment Terms</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Subscription Plans</h3>
              <p className="text-gray-700 mb-4">
                We offer various subscription plans with different features and durations. Subscription fees are charged in advance.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Payment Processing</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Payments are processed securely through third-party payment processors</li>
                <li>You authorize us to charge your payment method for all fees due</li>
                <li>Subscription fees are billed according to your chosen plan</li>
                <li>Price changes will be communicated 30 days in advance</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Cancellation</h3>
              <p className="text-gray-700 mb-4">
                You may cancel your subscription at any time through your account settings. Cancellation will be effective at the end of your current billing period. You will retain access to the service until the end of your paid subscription period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Permitted Use</h3>
              <p className="text-gray-700 mb-4">
                You may use our platform solely for personal, non-commercial educational purposes to prepare for the MRCP PACES examination.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Prohibited Activities</h3>
              <p className="text-gray-700 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Share your account credentials with others</li>
                <li>Copy, reproduce, or distribute our content without permission</li>
                <li>Use automated tools to access or scrape our platform</li>
                <li>Attempt to reverse engineer or hack our systems</li>
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Upload malicious code or attempt to disrupt our services</li>
                <li>Impersonate others or provide false information</li>
                <li>Circumvent any security measures or access controls</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property Rights</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Our Content</h3>
              <p className="text-gray-700 mb-4">
                All content on our platform, including but not limited to text, graphics, logos, images, questions, explanations, and software, is the property of MRCPPACESPREP or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Limited License</h3>
              <p className="text-gray-700 mb-4">
                We grant you a limited, non-exclusive, non-transferable license to access and use our platform for your personal educational use only. This license does not include any resale or commercial use of our service or content.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 User-Generated Content</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of any content you submit to our platform, but you grant us a worldwide, royalty-free license to use, modify, and display such content in connection with our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Service Availability and Modifications</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Service Availability</h3>
              <p className="text-gray-700 mb-4">
                While we strive to provide continuous service availability, we do not guarantee uninterrupted access. We may experience downtime for maintenance, updates, or due to factors beyond our control.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Service Modifications</h3>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify, suspend, or discontinue any part of our service at any time. We will provide reasonable notice for significant changes that affect your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Limitations</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Educational Purpose Only</h3>
              <p className="text-gray-700 mb-4">
                Our platform is designed for educational purposes only. We do not guarantee that using our service will result in passing the MRCP PACES examination. Success depends on individual effort, study habits, and other factors beyond our control.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.2 No Warranties</h3>
              <p className="text-gray-700 mb-4">
                Our service is provided "as is" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.3 Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, MRCPPACESPREP shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 Termination by You</h3>
              <p className="text-gray-700 mb-4">
                You may terminate your account at any time by contacting us or using the account cancellation feature in your account settings.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2 Termination by Us</h3>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account immediately, without prior notice, if you breach these Terms of Service or engage in prohibited activities.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.3 Effect of Termination</h3>
              <p className="text-gray-700 mb-4">
                Upon termination, your right to use our service will cease immediately. We may delete your account and data, though we may retain certain information as required by law or for legitimate business purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms of Service are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms of Service at any time. We will provide notice of significant changes by posting the updated terms on our website and updating the "Last updated" date. Your continued use of the service after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-[#fbfaf4] p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> team@mrcppacesprep.com</p>
                <p className="text-gray-700 mb-2"><strong>Address:</strong> MRCPPACESPREP, London, United Kingdom</p>
                <p className="text-gray-700"><strong>Response Time:</strong> We aim to respond to all inquiries within 3 business days</p>
              </div>
            </section>
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
                <li><Link href="/terms" className="text-gray-900 font-medium">Terms of Service</Link></li>
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
  )
}