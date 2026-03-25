import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MRCP PACES Exam Success Stories | Student Testimonials | MRCPPACESPREP',
  description: 'Read success stories from 8,500+ medical students who passed their MRCP PACES exam with MRCPPACESPREP. Real reviews from registrars, clinical fellows, and hospital physicians.',
  keywords: [
    'MRCPPACESPREP reviews',
    'MRCP PACES exam success stories',
    'medical student testimonials',
    'MRCP PACES pass testimonials',
    'MRCPPACESPREP testimonials',
    'MRCP PACES prep reviews UK',
  ].join(', '),
  openGraph: {
    title: 'MRCP PACES Exam Success Stories | Student Testimonials',
    description: 'Real success stories from 8,500+ students who passed their MRCP PACES exam with MRCPPACESPREP.',
    url: 'https://www.mrcppacesprep.com/testimonials',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MRCP PACES Exam Success Stories',
    description: '8,500+ students passed with MRCPPACESPREP. Read their stories.',
  },
  alternates: {
    canonical: '/testimonials',
  },
}
