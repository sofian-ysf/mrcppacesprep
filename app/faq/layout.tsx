import { Metadata } from 'next'
import { generateFAQSchema } from './faqData'

export const metadata: Metadata = {
  title: 'MRCP PACES Exam FAQ 2026 | Pass Rates, Exam Format & Study Tips',
  description: 'Get answers to 25+ MRCP PACES exam questions. Learn about exam dates, fees (£237), pass rates (70-80%), format (110 questions), and preparation tips from our 94% pass rate experts.',
  keywords: 'MRCP PACES exam FAQ, MRCP PACES exam questions, MRCP PACES exam pass rate, pharmacy exam format, MRCP PACES retake, how to prepare for MRCP PACES exam, MRCP PACES exam topics, MRCP PACES exam 2026',
  openGraph: {
    title: 'MRCP PACES Exam FAQ 2026 | Pass Rates, Exam Format & Study Tips',
    description: 'Everything you need to know about the MRCP PACES exam. Pass rates, format, fees, and expert preparation tips.',
    url: 'https://www.mrcppacesprep.com/faq',
    type: 'website',
  },
  alternates: {
    canonical: '/faq',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const faqSchema = generateFAQSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
