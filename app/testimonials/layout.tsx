import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Success Stories | GPhC Exam Prep Student Testimonials',
  description: 'Read real success stories from pharmacy graduates who passed their GPhC pre-registration exam using our platform. 94% pass rate with proven study strategies.',
  keywords: 'GPhC exam success stories, pre-reg exam testimonials, pharmacy exam pass rate, GPhC student reviews, exam preparation success',
  openGraph: {
    title: 'Success Stories | GPhC Exam Prep Student Testimonials',
    description: 'Discover how thousands of pharmacy graduates passed their GPhC exam. 94% pass rate with proven strategies.',
    url: 'https://www.preregexamprep.com/testimonials',
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
