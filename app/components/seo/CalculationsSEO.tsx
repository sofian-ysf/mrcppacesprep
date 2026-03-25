'use client';

import Script from 'next/script';

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "MRCP PACES Pharmaceutical Calculations Practice",
  "description": "Master pharmaceutical calculations with 350+ problems and step-by-step solutions. Dosage, dilutions, IV rates. 72% average score improvement.",
  "brand": {
    "@type": "Organization",
    "name": "MRCPPACESPREP"
  },
  "category": "Educational Software",
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
      "name": "How many calculation problems are included?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "350+ calculation problems covering dosage, dilutions, concentrations, IV rates, and business calculations."
      }
    },
    {
      "@type": "Question",
      "name": "Do calculations have step-by-step solutions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Every problem has detailed step-by-step solutions with formulas, working, and clinical context."
      }
    },
    {
      "@type": "Question",
      "name": "What calculation types are covered?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dosage, dilutions, concentrations, IV rates, alligation, unit conversions, bioavailability, and business calcs."
      }
    },
    {
      "@type": "Question",
      "name": "Are there timed calculation challenges?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Speed challenges with 15 calculations in 20 minutes. Build exam-ready speed and accuracy."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a formula reference sheet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Comprehensive downloadable PDF with all formulas, unit conversions, and calculation shortcuts included."
      }
    },
    {
      "@type": "Question",
      "name": "How much does calculation practice cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "£30/month includes all 350+ calculations plus question bank and mock exams. Full platform access."
      }
    }
  ]
};

export default function CalculationsSEO() {
  return (
    <>
      <Script
        id="calculations-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="calculations-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />

      <div className="sr-only" aria-hidden="true">
        <h1>MRCP PACES Pharmaceutical Calculations Practice | 350+ Problems | Step-by-Step Solutions | £30/month</h1>
        <h2>Master Dosage, Dilutions, IV Rates - 72% Average Score Improvement</h2>

        <p>
          Master pharmaceutical calculations for the MRCP PACES exam with 350+ practice problems.
          Step-by-step solutions for every problem. Covers dosage, dilutions, concentrations,
          IV flow rates, alligation, and business calculations. Speed challenges included.
          Formula reference sheet. 72% average score improvement. From £30/month.
        </p>

        <h3>Calculation Types Covered</h3>
        <ul>
          <li>Dosage Calculations - 85 Problems</li>
          <li>Concentration & Dilutions - 92 Problems</li>
          <li>IV Flow Rates & Infusions - 38 Problems</li>
          <li>Alligation & Mixtures - 42 Problems</li>
          <li>Business Calculations - 45 Problems</li>
          <li>Unit Conversions - 35 Problems</li>
          <li>Bioavailability & Pharmacokinetics - 32 Problems</li>
        </ul>

        <h3>Calculation Features</h3>
        <ul>
          <li>Step-by-step worked solutions</li>
          <li>Formula reference sheets</li>
          <li>Speed challenge mode</li>
          <li>Common mistake prevention tips</li>
          <li>Time-saving shortcuts</li>
          <li>Printable formula PDF</li>
        </ul>

        <h4>Popular Calculation Searches</h4>
        <ul>
          <li>gphc calculation questions</li>
          <li>pharmaceutical calculations practice</li>
          <li>pharmacy dosage calculations</li>
          <li>dilution calculations pharmacy</li>
          <li>iv rate calculations</li>
          <li>pharmacy math practice</li>
          <li>concentration calculations</li>
          <li>alligation pharmacy</li>
        </ul>

        <p>
          Keywords: MRCP PACES calculations, pharmaceutical calculations, pharmacy math, dosage calculations,
          dilution calculations, concentration calculations, IV flow rate, infusion rate calculations,
          alligation method, unit conversions pharmacy, bioavailability calculations, pharmacy business calculations,
          MRCP PACES calculation practice, step-by-step solutions, calculation formulas, pharmacy formulas,
          pre-reg calculations, calculation shortcuts, timed calculations, speed challenge
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
