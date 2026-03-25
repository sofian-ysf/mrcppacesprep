import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About PreRegExamPrep | UK GPhC Exam Preparation Experts',
  description: 'PreRegExamPrep is the UK\'s leading GPhC exam preparation platform. Founded by registered pharmacists, trusted by 8,500+ students with a 94% pass rate.',
  keywords: [
    'about PreRegExamPrep',
    'GPhC exam prep company',
    'pharmacy exam experts UK',
    'who created PreRegExamPrep',
    'GPhC prep team',
    'pharmacy education UK',
  ].join(', '),
  openGraph: {
    title: 'About PreRegExamPrep | GPhC Exam Preparation Experts',
    description: 'UK\'s leading GPhC exam prep platform. 8,500+ students, 94% pass rate. Founded by registered pharmacists.',
    url: 'https://www.preregexamprep.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About PreRegExamPrep',
    description: 'UK\'s leading GPhC exam prep platform. 94% pass rate.',
  },
  alternates: {
    canonical: '/about',
  },
}
