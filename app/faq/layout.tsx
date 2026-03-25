import { Metadata } from 'next'
import { generateFAQSchema } from './faqData'

export const metadata: Metadata = {
  title: 'GPhC Exam FAQ 2026 | Pass Rates, Exam Format & Study Tips',
  description: 'Get answers to 25+ GPhC exam questions. Learn about exam dates, fees (£237), pass rates (70-80%), format (110 questions), and preparation tips from our 94% pass rate experts.',
  keywords: 'GPhC exam FAQ, pre-reg exam questions, GPhC exam pass rate, pharmacy exam format, GPhC retake, how to prepare for GPhC exam, GPhC exam topics, GPhC exam 2026',
  openGraph: {
    title: 'GPhC Exam FAQ 2026 | Pass Rates, Exam Format & Study Tips',
    description: 'Everything you need to know about the GPhC pre-registration exam. Pass rates, format, fees, and expert preparation tips.',
    url: 'https://www.preregexamprep.com/faq',
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
