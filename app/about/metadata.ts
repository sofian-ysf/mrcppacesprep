import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About MRCPPACESPREP | UK MRCP PACES Exam Preparation Experts',
  description: 'MRCPPACESPREP is the UK\'s leading MRCP PACES exam preparation platform. Founded by qualified physicians, trusted by 8,500+ students with a 94% pass rate.',
  keywords: [
    'about MRCPPACESPREP',
    'MRCP PACES exam prep company',
    'medical exam experts UK',
    'who created MRCPPACESPREP',
    'MRCP PACES prep team',
    'medical education UK',
  ].join(', '),
  openGraph: {
    title: 'About MRCPPACESPREP | MRCP PACES Exam Preparation Experts',
    description: 'UK\'s leading MRCP PACES exam prep platform. 8,500+ students, 94% pass rate. Founded by qualified physicians.',
    url: 'https://www.mrcppacesprep.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About MRCPPACESPREP',
    description: 'UK\'s leading MRCP PACES exam prep platform. 94% pass rate.',
  },
  alternates: {
    canonical: '/about',
  },
}
