import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | MRCP PACES Exam Prep - £30/month for Complete Access',
  description: 'Simple, transparent pricing for MRCP PACES exam preparation. £30/month for full access to 2000+ practice questions, unlimited mock exams, and comprehensive study resources. Cancel anytime.',
  keywords: 'MRCP PACES exam prep cost, MRCP PACES exam preparation price, pharmacy exam subscription, MRCP PACES practice questions price, affordable exam prep',
  openGraph: {
    title: 'Pricing | MRCP PACES Exam Prep - £30/month',
    description: 'Complete MRCP PACES exam preparation for £30/month. 2000+ questions, unlimited mock exams, 94% pass rate. Cancel anytime.',
    url: 'https://www.mrcppacesprep.com/pricing',
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
