import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | GPhC Exam Prep',
  description: 'Create your GPhC Exam Prep account and start preparing for your exam. Join 8,500+ students with a 94% pass rate.',
  keywords: 'GPhC exam signup, pharmacy exam preparation account, GPhC practice questions',
  openGraph: {
    title: 'Sign Up | GPhC Exam Prep',
    description: 'Join 8,500+ pharmacy graduates preparing for their GPhC exam.',
    url: 'https://www.preregexamprep.com/signup',
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
