import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Try Free MRCP PACES Practice Questions | No Sign-Up Required',
  description: 'Practice 15 free MRCP PACES exam questions with detailed explanations. 5 calculations + 10 clinical questions. Interactive practice with study tips. No account needed.',
  keywords: [
    'free MRCP PACES questions',
    'MRCP PACES practice test',
    'pharmacy exam demo',
    'free calculation questions',
    'MRCP PACES trial',
    'pharmacy practice questions free',
    'pre-registration exam sample'
  ],
  openGraph: {
    title: 'Try 15 Free MRCP PACES Practice Questions',
    description: 'Interactive practice with detailed explanations. No sign-up required.',
    url: 'https://www.mrcppacesprep.com/try-free',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Try 15 Free MRCP PACES Practice Questions',
    description: 'Interactive practice with detailed explanations. No sign-up required.',
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
