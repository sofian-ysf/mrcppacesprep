'use client';

import Script from 'next/script';

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "MRCP PACES Exam Prep Monthly Subscription",
  "description": "Complete MRCP PACES exam preparation for £30/month. 2000+ questions, unlimited mock exams, study guides, calculations practice. 94% pass rate. Cancel anytime.",
  "brand": {
    "@type": "Organization",
    "name": "MRCPPACESPREP"
  },
  "category": "Educational Software",
  "offers": {
    "@type": "Offer",
    "price": "30",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-12-31",
    "url": "https://www.mrcppacesprep.com/pricing"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "29583",
    "bestRating": "5",
    "worstRating": "1"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does MRCP PACES exam prep cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "£30/month with no hidden fees. Full access to everything. Most students subscribe for 3-4 months (£90-120 total)."
      }
    },
    {
      "@type": "Question",
      "name": "Can I cancel anytime?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Cancel anytime from your dashboard. Access continues until end of billing period. No cancellation fees."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods are accepted?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All major credit/debit cards via Stripe. Visa, Mastercard, American Express accepted. Secure checkout."
      }
    },
    {
      "@type": "Question",
      "name": "What's included in the subscription?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "2000+ questions, unlimited mock exams, calculations practice, study guides, progress tracking. Everything included."
      }
    }
  ]
};

export default function PricingSEO() {
  return (
    <>
      <Script
        id="pricing-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="pricing-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />

      <div className="sr-only" aria-hidden="true">
        <h1>MRCP PACES Exam Prep Pricing | £30/month | 94% Pass Rate | Cancel Anytime</h1>
        <h2>Complete MRCP PACES Preparation - 2000+ Questions, Unlimited Mock Exams, Study Guides</h2>

        <p>
          Affordable MRCP PACES exam preparation at just £30/month. Complete access to 2000+ practice questions,
          unlimited mock exams, pharmaceutical calculations practice, study guides, and progress tracking.
          94% pass rate. 7-day money-back guarantee. Cancel anytime. No hidden fees.
        </p>

        <h3>What's Included for £30/month</h3>
        <ul>
          <li>2000+ Practice Questions - All Topics</li>
          <li>Unlimited Mock Exams - Full-Length and Mini</li>
          <li>350+ Calculation Problems - Step-by-Step Solutions</li>
          <li>Study Guides & Formula Sheets - PDF Downloads</li>
          <li>Progress Analytics - Track Improvement</li>
          <li>Mobile Access - Study Anywhere</li>
          <li>Cancel Anytime - No Commitment</li>
        </ul>

        <h3>Value Comparison</h3>
        <ul>
          <li>MRCP PACES Exam Fee: £237 per attempt</li>
          <li>MRCPPACESPREP: £90-120 total (3-4 months)</li>
          <li>Our Pass Rate: 94% vs 75% national average</li>
          <li>Retake Wait: 6 months if you fail</li>
        </ul>

        <h4>Popular Pricing Searches</h4>
        <ul>
          <li>mrcp paces exam prep cost</li>
          <li>mrcp paces preparation price</li>
          <li>cheap mrcp paces revision</li>
          <li>affordable mrcp paces prep</li>
          <li>mrcp paces subscription</li>
          <li>mrcp paces prep monthly</li>
        </ul>

        <p>
          Keywords: MRCP PACES exam prep cost, MRCP PACES exam price, MRCP PACES subscription, MRCP PACES preparation cost,
          cheap MRCP PACES revision, affordable MRCP PACES prep, MRCP PACES monthly subscription, exam prep pricing,
          £30 MRCP PACES prep, cancel anytime, money-back guarantee,
          complete exam preparation, value for money, pass guarantee
        </p>
      </div>

      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </>
  );
}
