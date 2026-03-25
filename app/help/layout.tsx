import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center | GPhC Exam Prep Support & FAQs',
  description: 'Get help with your GPhC pre-registration exam preparation. Find answers to common questions about our platform, study strategies, mock exams, and technical support.',
  keywords: 'GPhC exam help, pre-reg exam support, pharmacy exam FAQ, GPhC preparation help, exam study tips, mock exam help',
  openGraph: {
    title: 'Help Center | GPhC Exam Prep Support & FAQs',
    description: 'Get expert support for your GPhC exam preparation journey. FAQs, study tips, and technical help.',
    url: 'https://www.preregexamprep.com/help',
    type: 'website',
  },
  alternates: {
    canonical: '/help',
  },
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
