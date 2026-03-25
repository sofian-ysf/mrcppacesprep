import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Disclaimer | PreRegExamPrep',
  description: 'Important disclaimers and legal information about PreRegExamPrep GPhC exam preparation platform. Read our educational disclaimers and limitations.',
  keywords: 'disclaimer, legal notice, PreRegExamPrep, GPhC exam preparation, educational platform',
  openGraph: {
    title: 'Disclaimer | PreRegExamPrep',
    description: 'Important legal disclaimers about our GPhC exam preparation platform.',
    url: 'https://preregexamprep.com/disclaimer',
  },
  alternates: {
    canonical: '/disclaimer',
  },
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Disclaimer</h1>
            <p className="text-lg text-gray-600">Last updated: December 2024</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The information contained on PreRegExamPrep ("we," "our," or "us") is for general educational and informational purposes only. While we strive to provide accurate and up-to-date content, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on our platform.
              </p>
              <p className="text-gray-700 mb-4">
                Any reliance you place on such information is therefore strictly at your own risk. In no event will we be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Educational Purpose Only</h2>
              <p className="text-gray-700 mb-4">
                PreRegExamPrep is an educational platform designed to assist pharmacy students in preparing for the General Pharmaceutical Council (GPhC) pre-registration examination. Our content is intended for educational purposes only and should not be considered as:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>A guarantee of examination success or passing scores</li>
                <li>Official GPhC examination content or materials</li>
                <li>Professional medical, pharmaceutical, or legal advice</li>
                <li>A substitute for official study materials or guidance</li>
                <li>A replacement for practical pharmacy training or experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. No Affiliation with GPhC</h2>
              <p className="text-gray-700 mb-4">
                <strong>Important Notice:</strong> PreRegExamPrep is not affiliated with, endorsed by, or officially connected to the General Pharmaceutical Council (GPhC) in any way. We are an independent educational platform created to assist students in their exam preparation.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>We are not an official GPhC training provider</li>
                <li>Our questions and materials are not official GPhC content</li>
                <li>We do not represent or speak for the GPhC</li>
                <li>GPhC has not reviewed or approved our content</li>
                <li>Any reference to GPhC is for identification purposes only</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. No Guarantee of Success</h2>
              <p className="text-gray-700 mb-4">
                While our platform is designed to help students prepare for the GPhC pre-registration examination, we cannot and do not guarantee:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>That you will pass the GPhC examination</li>
                <li>Any specific score or performance outcome</li>
                <li>That our content will appear on the actual examination</li>
                <li>Employment or career advancement opportunities</li>
                <li>Professional registration or certification</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Examination success depends on numerous factors including but not limited to individual effort, study habits, prior knowledge, test-taking skills, and circumstances beyond our control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content Accuracy and Currency</h2>
              <p className="text-gray-700 mb-4">
                While we make every effort to ensure our content is accurate and up-to-date:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Information may become outdated due to changes in regulations, guidelines, or examination formats</li>
                <li>We rely on publicly available information and expert knowledge</li>
                <li>Content is reviewed regularly but may contain errors or omissions</li>
                <li>Users should verify critical information with official sources</li>
                <li>We reserve the right to modify content without notice</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Students are encouraged to consult official GPhC resources, current pharmaceutical references, and other authoritative sources in addition to using our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Performance Statistics and Success Rates</h2>
              <p className="text-gray-700 mb-4">
                Any performance statistics, success rates, or user testimonials displayed on our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Are based on self-reported user data and may not be independently verified</li>
                <li>May not be representative of all users' experiences</li>
                <li>Should not be considered as predictions of your individual performance</li>
                <li>Are provided for informational purposes only</li>
                <li>May change over time as we gather more data</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Past performance of other users does not guarantee future results or your individual success.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Technical Limitations</h2>
              <p className="text-gray-700 mb-4">
                Our platform is provided "as is" and may be subject to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Technical difficulties, interruptions, or downtime</li>
                <li>Software bugs or compatibility issues</li>
                <li>Data loss or corruption (though we implement safeguards)</li>
                <li>Changes in functionality or features</li>
                <li>Internet connectivity requirements</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We recommend users maintain their own study records and not rely solely on our platform for tracking their preparation progress.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Content and Links</h2>
              <p className="text-gray-700 mb-4">
                Our platform may contain links to third-party websites or reference external resources. We do not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Endorse or assume responsibility for third-party content</li>
                <li>Control the availability or accuracy of external websites</li>
                <li>Warrant the quality or suitability of linked resources</li>
                <li>Accept liability for any loss or damage from using third-party content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Professional Advice Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The content on our platform is not intended to provide:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Professional medical or pharmaceutical advice</li>
                <li>Legal guidance or interpretation of regulations</li>
                <li>Career counseling or employment advice</li>
                <li>Financial planning or investment advice</li>
                <li>Personal counseling or mental health support</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Always consult with qualified professionals for advice specific to your individual circumstances.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, PreRegExamPrep, its owners, employees, agents, and affiliates shall not be liable for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Any direct, indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Examination failure or poor performance</li>
                <li>Career setbacks or professional disappointments</li>
                <li>Any damages arising from use or inability to use our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. User Responsibility</h2>
              <p className="text-gray-700 mb-4">
                Users are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Verifying their eligibility to take the GPhC examination</li>
                <li>Understanding current examination requirements and procedures</li>
                <li>Consulting official GPhC resources and guidelines</li>
                <li>Making informed decisions about their study preparation</li>
                <li>Seeking additional support or resources as needed</li>
                <li>Maintaining appropriate study habits and time management</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify this disclaimer at any time without prior notice. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our platform after any changes constitutes acceptance of the updated disclaimer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                This disclaimer is governed by and construed in accordance with the laws of England and Wales. Any disputes arising from this disclaimer will be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions or concerns about this disclaimer, please contact us:
              </p>
              <div className="bg-[#fbfaf4] p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> team@preregexamprep.com</p>
                <p className="text-gray-700 mb-2"><strong>Address:</strong> PreRegExamPrep, London, United Kingdom</p>
                <p className="text-gray-700"><strong>Response Time:</strong> We aim to respond to all inquiries within 3 business days</p>
              </div>
            </section>

            {/* Important Notice Box */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Reminder</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      PreRegExamPrep is an independent educational platform and is not affiliated with or endorsed by the General Pharmaceutical Council (GPhC).
                      Always consult official GPhC resources for the most current examination information and requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <li><Link href="/disclaimer" className="text-gray-900 font-medium">Disclaimer</Link></li>
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