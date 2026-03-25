'use client';

import Script from 'next/script';

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "MRCP PACES Exam Study Resources",
  "description": "Comprehensive MRCP PACES exam study resources including guides, formula sheets, clinical references, and exam strategies. Created by physicians.",
  "brand": {
    "@type": "Organization",
    "name": "MRCPPACESPREP"
  },
  "category": "Educational Materials",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "30",
    "highPrice": "90",
    "priceCurrency": "GBP",
    "offerCount": "3",
    "availability": "https://schema.org/InStock"
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
      "name": "What study resources are included?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Calculation guides, clinical references, BNF summaries, formula sheets, exam strategies, and topic-specific notes."
      }
    },
    {
      "@type": "Question",
      "name": "Are resources downloadable?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! All guides and formula sheets are available as downloadable PDFs for offline study and printing."
      }
    },
    {
      "@type": "Question",
      "name": "Who created the study resources?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All materials created by qualified physicians with recent MRCP PACES exam experience. Expert-verified content."
      }
    },
    {
      "@type": "Question",
      "name": "Are resources updated regularly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Content updated for 2025 MRCP PACES framework. Regular reviews ensure alignment with current BNF and guidelines."
      }
    },
    {
      "@type": "Question",
      "name": "How much do study resources cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "£30/month includes all resources plus question bank and mock exams. Complete platform access. Cancel anytime."
      }
    }
  ]
};

export default function ResourcesSEO() {
  return (
    <>
      <Script
        id="resources-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="resources-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />

      <div className="sr-only" aria-hidden="true">
        <h1>MRCP PACES Exam Resources UK | Study Guides | Formula Sheets | £30/month</h1>
        <h2>Comprehensive Study Materials Created by Pharmacists - Pass Your Pre-Reg First Time</h2>

        <p>
          Access comprehensive MRCP PACES exam study resources including calculation guides, clinical references,
          BNF summaries, formula sheets, and proven exam strategies. Created by qualified physicians.
          Updated for 2025 MRCP PACES framework. 94% pass rate. From £30/month.
        </p>

        <h3>Study Resources Available</h3>
        <ul>
          <li>Pharmaceutical Calculations Guide - Step-by-Step Methods</li>
          <li>Clinical Pharmacy Reference - Drug Interactions & Therapeutics</li>
          <li>Pharmacy Law & Ethics Summary - UK Regulations</li>
          <li>BNF Quick Reference Cards - Essential Drug Information</li>
          <li>Formula Sheets - Downloadable PDFs</li>
          <li>Exam Strategy Guides - Time Management & Technique</li>
        </ul>

        <h3>Resource Features</h3>
        <ul>
          <li>Downloadable PDF formats</li>
          <li>Printable formula sheets</li>
          <li>Mobile-friendly access</li>
          <li>Regular content updates</li>
          <li>BNF-aligned information</li>
          <li>Created by physicians</li>
        </ul>

        <h3>MRCP PACES Resources UK Locations</h3>
        <ul>
          <li>MRCP PACES Resources London</li>
          <li>Pharmacy Study Materials Manchester</li>
          <li>MRCP PACES Guides Birmingham</li>
          <li>Pre-Reg Resources Leeds</li>
          <li>Pharmacy Resources Glasgow</li>
        </ul>

        <h4>Popular Resource Searches</h4>
        <ul>
          <li>gphc exam resources</li>
          <li>gphc study materials</li>
          <li>pharmacy calculation guide</li>
          <li>gphc formula sheet</li>
          <li>pre-reg exam resources</li>
          <li>pharmacy revision notes</li>
          <li>bnf summary guide</li>
          <li>gphc exam tips</li>
        </ul>

        <p>
          Keywords: MRCP PACES exam resources, MRCP PACES study materials, pharmacy calculation guide, MRCP PACES formula sheet,
          pre-reg exam resources, pharmacy revision notes, BNF summary guide, MRCP PACES exam tips,
          clinical pharmacy reference, pharmacy law summary, drug interaction guide, MRCP PACES exam strategy,
          pharmacy study guides UK, pre-registration resources, exam preparation materials
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
