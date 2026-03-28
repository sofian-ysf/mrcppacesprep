import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | MRCP PACES Exam Prep - From £95 | One-Time Payment',
  description: 'Simple pricing for MRCP PACES exam preparation. £95 (2 months), £155 (6 months), or £215 (12 months). One-time payment, no subscriptions. 2000+ questions, 94% pass rate.',
  keywords: 'MRCP PACES exam prep cost, MRCP PACES preparation price, MRCP PACES question bank price, affordable MRCP exam prep, MRCP PACES course cost UK',
  openGraph: {
    title: 'Pricing | MRCP PACES Exam Prep - From £95',
    description: 'Complete MRCP PACES exam preparation from £95. One-time payment. 2000+ questions, unlimited practice, 94% pass rate.',
    url: 'https://www.mrcppacesprep.com/pricing',
    type: 'website',
  },
  alternates: {
    canonical: '/pricing',
  },
}

// Product schema for pricing page - static JSON-LD for SEO
const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "MRCPPACESPREP - MRCP PACES Exam Preparation",
  "description": "Complete MRCP PACES exam preparation platform with 2000+ practice questions, clinical examination videos, mock stations, and detailed explanations.",
  "brand": {
    "@type": "Brand",
    "name": "MRCPPACESPREP"
  },
  "category": "Medical Education",
  "audience": {
    "@type": "Audience",
    "audienceType": "Medical Professionals",
    "geographicArea": {
      "@type": "Country",
      "name": "United Kingdom"
    }
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Standard - 2 Months Access",
      "price": "95",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2026-12-31",
      "url": "https://www.mrcppacesprep.com/pricing",
      "description": "2 months access to all MRCP PACES preparation content"
    },
    {
      "@type": "Offer",
      "name": "Plus - 6 Months Access",
      "price": "155",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2026-12-31",
      "url": "https://www.mrcppacesprep.com/pricing",
      "description": "6 months access to all MRCP PACES preparation content"
    },
    {
      "@type": "Offer",
      "name": "Complete - 12 Months Access",
      "price": "215",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2026-12-31",
      "url": "https://www.mrcppacesprep.com/pricing",
      "description": "12 months access with retake coverage"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "847",
    "bestRating": "5",
    "worstRating": "1"
  }
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      {children}
    </>
  )
}
