import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Success Stories | MRCP PACES Exam Prep Student Testimonials',
  description: 'Read real success stories from pharmacy graduates who passed their MRCP PACES pre-registration exam using our platform. 94% pass rate with proven study strategies.',
  keywords: 'MRCP PACES exam success stories, pre-reg exam testimonials, pharmacy exam pass rate, MRCP PACES student reviews, exam preparation success',
  openGraph: {
    title: 'Success Stories | MRCP PACES Exam Prep Student Testimonials',
    description: 'Discover how thousands of pharmacy graduates passed their MRCP PACES exam. 94% pass rate with proven strategies.',
    url: 'https://www.mrcppacesprep.com/testimonials',
    type: 'website',
  },
  alternates: {
    canonical: '/testimonials',
  },
}

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
