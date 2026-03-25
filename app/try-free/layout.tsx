import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Try Free GPhC Practice Questions | No Sign-Up Required',
  description: 'Practice 15 free GPhC exam questions with detailed explanations. 5 calculations + 10 clinical questions. Interactive practice with study tips. No account needed.',
  keywords: [
    'free GPhC questions',
    'GPhC practice test',
    'pharmacy exam demo',
    'free calculation questions',
    'GPhC trial',
    'pharmacy practice questions free',
    'pre-registration exam sample'
  ],
  openGraph: {
    title: 'Try 15 Free GPhC Practice Questions',
    description: 'Interactive practice with detailed explanations. No sign-up required.',
    url: 'https://www.preregexamprep.com/try-free',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Try 15 Free GPhC Practice Questions',
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
