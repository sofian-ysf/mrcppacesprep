'use client';

import Script from 'next/script';

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "GPhC Mock Exams - Realistic Practice Tests",
  "description": "Realistic GPhC mock exams with exact timing and format. 110 questions, 2.5 hours. Detailed performance analysis. 94% pass rate.",
  "brand": {
    "@type": "Organization",
    "name": "PreRegExamPrep"
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
      "name": "How realistic are the GPhC mock exams?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Exact exam format: 110 questions, 2.5 hours. Students report mock scores within ±3% of real exam results."
      }
    },
    {
      "@type": "Question",
      "name": "How many mock exams can I take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlimited full-length mocks plus topic-specific mini exams. Take as many as you need to feel confident."
      }
    },
    {
      "@type": "Question",
      "name": "Do I get feedback after mock exams?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Detailed breakdown by topic, question type, and difficulty. Instant explanations for every question."
      }
    },
    {
      "@type": "Question",
      "name": "How often should I take mock exams?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start with 1 baseline mock, then weekly mocks in final month. Take 3+ full mocks in final 2 weeks."
      }
    },
    {
      "@type": "Question",
      "name": "What mock exam types are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Full-length exams (110 questions), topic minis (25 questions), and rapid calculation sessions (15 questions)."
      }
    },
    {
      "@type": "Question",
      "name": "How much do GPhC mock exams cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "£30/month includes unlimited mock exams, plus all questions and study materials. No limit on attempts."
      }
    }
  ]
};

export default function MockExamsSEO() {
  return (
    <>
      <Script
        id="mock-exams-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="mock-exams-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />

      <div className="sr-only" aria-hidden="true">
        <h1>GPhC Mock Exams UK | Realistic Practice Tests | 94% Pass Rate | £30/month</h1>
        <h2>Exact Exam Format - 110 Questions, 2.5 Hours - Detailed Performance Analysis</h2>

        <p>
          Take realistic GPhC mock exams that match the exact format of the real exam.
          110 questions in 2.5 hours with detailed performance analysis.
          Students score within ±3% of their real exam results.
          Unlimited attempts included. 94% pass rate. From £30/month.
        </p>

        <h3>Mock Exam Types Available</h3>
        <ul>
          <li>Full-Length Practice Exams - 110 Questions, 2.5 Hours</li>
          <li>Topic-Specific Mini Exams - 25 Questions, 30 Minutes</li>
          <li>Rapid-Fire Calculation Sessions - 15 Questions, 20 Minutes</li>
          <li>Unlimited Exam Attempts - Take As Many As You Need</li>
        </ul>

        <h3>Mock Exam Features</h3>
        <ul>
          <li>Exact GPhC exam timing and format</li>
          <li>Realistic question distribution by topic</li>
          <li>Instant results with detailed breakdown</li>
          <li>Performance tracking over time</li>
          <li>Pass/fail prediction accuracy</li>
          <li>Explanations for every question</li>
        </ul>

        <h3>GPhC Mock Exams UK Locations</h3>
        <ul>
          <li>GPhC Mock Exam London</li>
          <li>Practice Test Manchester</li>
          <li>Mock Exam Birmingham</li>
          <li>GPhC Practice Leeds</li>
          <li>Mock Test Glasgow</li>
          <li>Practice Exam Edinburgh</li>
        </ul>

        <h4>Popular Mock Exam Searches</h4>
        <ul>
          <li>gphc mock exam online</li>
          <li>gphc practice test free</li>
          <li>pre-reg mock exam</li>
          <li>gphc exam simulation</li>
          <li>pharmacy mock exam uk</li>
          <li>gphc timed practice test</li>
          <li>realistic gphc exam</li>
          <li>gphc exam practice papers</li>
        </ul>

        <p>
          Keywords: GPhC mock exam, GPhC practice test, pre-reg mock exam, pharmacy mock exam UK,
          GPhC exam simulation, timed practice test, realistic GPhC exam, GPhC practice papers,
          GPhC exam format, 110 question mock, 2.5 hour exam practice, GPhC exam timing,
          mock exam feedback, performance analysis, pass prediction, topic mock exams,
          calculation practice exam, GPhC mini exam, rapid fire practice
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
