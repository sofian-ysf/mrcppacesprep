import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GPhC Study Guides 2026 | Pharmacy Revision Notes | PreRegExamPrep',
  description: 'Comprehensive GPhC study guides covering all exam topics. BNF-aligned revision notes, clinical pharmacy guides, pharmacy law summaries. Download and study offline.',
  keywords: [
    'GPhC study guide',
    'GPhC revision notes',
    'pharmacy study materials',
    'BNF revision guide',
    'clinical pharmacy notes',
    'pharmacy law study guide',
    'GPhC exam revision',
    'pre-reg study materials',
  ].join(', '),
  openGraph: {
    title: 'GPhC Study Guides 2026 | Comprehensive Revision Notes',
    description: 'BNF-aligned study guides covering all GPhC exam topics. Clinical pharmacy, law, calculations.',
    url: 'https://www.preregexamprep.com/study-guides',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPhC Study Guides | Revision Notes',
    description: 'Comprehensive study guides for all GPhC exam topics.',
  },
  alternates: {
    canonical: '/study-guides',
  },
}
