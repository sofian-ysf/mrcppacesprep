import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | MRCP PACES Exam Prep',
  description: 'Sign in to your MRCP PACES Exam Prep account to access practice questions, mock exams, and study resources for your pre-registration pharmacy exam.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Login | MRCP PACES Exam Prep',
    description: 'Sign in to access your MRCP PACES exam preparation materials.',
    url: 'https://www.mrcppacesprep.com/login',
    type: 'website',
  },
  alternates: {
    canonical: '/login',
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
