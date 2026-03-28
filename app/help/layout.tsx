import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center | MRCP PACES Exam Prep Support & FAQs',
  description: 'Get help with your MRCP PACES exam preparation. Find answers to common questions about our platform, study strategies, mock exams, and technical support.',
  keywords: 'MRCP PACES exam help, MRCP PACES exam support, MRCP PACES exam FAQ, MRCP PACES preparation help, exam study tips, mock exam help',
  openGraph: {
    title: 'Help Center | MRCP PACES Exam Prep Support & FAQs',
    description: 'Get expert support for your MRCP PACES exam preparation journey. FAQs, study tips, and technical help.',
    url: 'https://www.mrcppacesprep.com/help',
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
