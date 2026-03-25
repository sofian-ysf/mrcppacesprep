import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Successful | MRCP PACES Exam Prep',
  description: 'Your payment was successful. Welcome to MRCP PACES Exam Prep - start your exam preparation journey now.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/checkout-success',
  },
}

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
