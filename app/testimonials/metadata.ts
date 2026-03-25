import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GPhC Exam Success Stories | Student Testimonials | PreRegExamPrep',
  description: 'Read success stories from 8,500+ pharmacy students who passed their GPhC exam with PreRegExamPrep. Real reviews from community, hospital, and clinical pharmacists.',
  keywords: [
    'PreRegExamPrep reviews',
    'GPhC exam success stories',
    'pharmacy student testimonials',
    'GPhC pass testimonials',
    'PreRegExamPrep testimonials',
    'GPhC prep reviews UK',
  ].join(', '),
  openGraph: {
    title: 'GPhC Exam Success Stories | Student Testimonials',
    description: 'Real success stories from 8,500+ students who passed their GPhC exam with PreRegExamPrep.',
    url: 'https://www.preregexamprep.com/testimonials',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPhC Exam Success Stories',
    description: '8,500+ students passed with PreRegExamPrep. Read their stories.',
  },
  alternates: {
    canonical: '/testimonials',
  },
}
