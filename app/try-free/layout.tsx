import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free MRCP PACES Demo | Try Spot Diagnosis, Stations, Differentials & SBAs',
  description: 'Try our MRCP PACES exam preparation for free. Access sample Spot Diagnoses, PACES Stations, Differential Diagnosis flashcards, and SBA questions. No account required.',
  keywords: [
    'free MRCP PACES demo',
    'MRCP PACES practice test',
    'MRCP PACES spot diagnosis',
    'MRCP PACES stations practice',
    'MRCP differential diagnosis',
    'MRCP PACES SBA questions',
    'MRCP PACES trial',
    'free medical exam practice',
    'MRCP clinical examination practice'
  ],
  openGraph: {
    title: 'Try Free MRCP PACES Demo - Spot Diagnosis, Stations, Differentials & SBAs',
    description: 'Explore sample content from all MRCP PACES modules. Practice spot diagnoses, stations, differentials, and SBAs. No sign-up required.',
    url: 'https://www.mrcppacesprep.com/try-free',
    type: 'website',
    images: [
      {
        url: 'https://www.mrcppacesprep.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MRCP PACES Free Demo - Try Before You Subscribe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free MRCP PACES Demo | Try Before You Subscribe',
    description: 'Practice sample Spot Diagnoses, PACES Stations, Differentials & SBAs. No account required.',
    images: ['https://www.mrcppacesprep.com/og-image.png'],
  },
  alternates: {
    canonical: '/try-free',
  },
}

export default function TryFreeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
