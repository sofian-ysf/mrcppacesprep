import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Success Stories | MRCP PACES Exam Prep Candidate Testimonials',
  description: 'Read real success stories from medical trainees who passed their MRCP PACES exam using our platform. 94% pass rate with proven study strategies.',
  keywords: 'MRCP PACES exam success stories, MRCP PACES exam testimonials, MRCP PACES exam pass rate, MRCP PACES candidate reviews, exam preparation success',
  openGraph: {
    title: 'Success Stories | MRCP PACES Exam Prep Candidate Testimonials',
    description: 'Discover how thousands of medical trainees passed their MRCP PACES exam. 94% pass rate with proven strategies.',
    url: 'https://www.mrcppacesprep.com/testimonials',
    type: 'website',
  },
  alternates: {
    canonical: '/testimonials',
  },
}

// Review schema with aggregate rating - static JSON-LD for SEO
const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "MRCPPACESPREP",
  "description": "MRCP PACES exam preparation platform",
  "brand": {
    "@type": "Brand",
    "name": "MRCPPACESPREP"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "847",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Dr. Sarah M."
      },
      "reviewBody": "MRCPPACESPREP was a game-changer for me. I failed my first attempt, but after using this platform for 3 months, I passed comfortably! The station-specific practice and detailed feedback really helped me understand where I was going wrong."
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Dr. James K."
      },
      "reviewBody": "The clinical examination videos were excellent. Being able to watch proper technique then practice with the mock stations made a huge difference. Passed first time with good marks across all stations."
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Dr. Priya S."
      },
      "reviewBody": "As an IMG, I was worried about UK-specific guidelines. This platform covered everything I needed. The communication skills section was particularly helpful. Highly recommend!"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Dr. Ahmed R."
      },
      "reviewBody": "Great question bank and really useful explanations. The progress tracking helped me identify my weak areas. Would have liked more video content but overall excellent value."
    }
  ]
}

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      {children}
    </>
  )
}
