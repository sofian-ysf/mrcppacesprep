import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | GPhC Exam Prep - £30/month for Complete Access',
  description: 'Simple, transparent pricing for GPhC exam preparation. £30/month for full access to 2000+ practice questions, unlimited mock exams, and comprehensive study resources. Cancel anytime.',
  keywords: 'GPhC exam prep cost, pre-reg exam preparation price, pharmacy exam subscription, GPhC practice questions price, affordable exam prep',
  openGraph: {
    title: 'Pricing | GPhC Exam Prep - £30/month',
    description: 'Complete GPhC exam preparation for £30/month. 2000+ questions, unlimited mock exams, 94% pass rate. Cancel anytime.',
    url: 'https://www.preregexamprep.com/pricing',
    type: 'website',
  },
  alternates: {
    canonical: '/pricing',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
