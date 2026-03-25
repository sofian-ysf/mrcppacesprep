import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | GPhC Exam Prep',
  description: 'Sign in to your GPhC Exam Prep account to access practice questions, mock exams, and study resources for your pre-registration pharmacy exam.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Login | GPhC Exam Prep',
    description: 'Sign in to access your GPhC exam preparation materials.',
    url: 'https://www.preregexamprep.com/login',
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
