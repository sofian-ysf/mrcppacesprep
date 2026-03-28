import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Success Stories | MRCP PACES Exam Prep Candidate Testimonials',
  description: 'Read real success stories from medical trainees who passed their MRCP PACES exam using our platform. 94% pass rate with proven study strategies.',
  keywords: 'MRCP PACES exam success stories, MRCP PACES exam testimonials, MRCP PACES exam pass rate, MRCP PACES candidate reviews, exam preparation success',
  openGraph: {
    title: 'Success Stories | MRCP PACES Exam Prep Candidate Testimonials',
    description: 'Discover how thousands of medical trainees passed their MRCP PACES exam. 94% pass rate with proven strategies.',
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
