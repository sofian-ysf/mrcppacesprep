import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | MRCP PACES Exam Prep',
  description: 'Create your MRCP PACES Exam Prep account and start preparing for your exam. Join 8,500+ candidates with a 94% pass rate.',
  keywords: 'MRCP PACES exam signup, pharmacy exam preparation account, MRCP PACES practice questions',
  openGraph: {
    title: 'Sign Up | MRCP PACES Exam Prep',
    description: 'Join 8,500+ pharmacy graduates preparing for their MRCP PACES exam.',
    url: 'https://www.mrcppacesprep.com/signup',
    type: 'website',
  },
  alternates: {
    canonical: '/signup',
  },
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
