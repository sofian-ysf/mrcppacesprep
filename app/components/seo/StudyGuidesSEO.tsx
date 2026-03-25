'use client';

import Script from 'next/script';

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "GPhC Study Guides - Comprehensive Learning Materials",
  "description": "Download comprehensive GPhC study guides. PDF guides, formula sheets, mind maps, structured learning pathways. Created by pharmacists.",
  "brand": {
    "@type": "Organization",
    "name": "PreRegExamPrep"
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
      "name": "What study guides are included?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Topic guides for all GPhC framework areas, formula sheets, mind maps, quick reference cards, and study pathways."
      }
    },
    {
      "@type": "Question",
      "name": "Can I download study guides as PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! All study guides, formula sheets, and reference materials available as downloadable PDFs for offline study."
      }
    },
    {
      "@type": "Question",
      "name": "Are study guides updated regularly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Content updated for 2025 GPhC framework. Regular reviews ensure alignment with latest guidelines and BNF."
      }
    },
    {
      "@type": "Question",
      "name": "What learning pathways are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Foundation (8-12 weeks), Intensive (4-6 weeks), and Rapid Review (1-2 weeks) pathways with daily schedules."
      }
    },
    {
      "@type": "Question",
      "name": "Who created the study guides?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All materials created by qualified pharmacists with recent GPhC exam experience. Expert-verified content."
      }
    },
    {
      "@type": "Question",
      "name": "How much do study guides cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "£30/month includes all study guides plus full question bank and mock exams. Complete platform access."
      }
    }
  ]
};

export default function StudyGuidesSEO() {
  return (
    <>
      <Script
        id="study-guides-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="study-guides-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />

      <div className="sr-only" aria-hidden="true">
        <h1>GPhC Study Guides UK | PDF Downloads | Formula Sheets | Learning Pathways | £30/month</h1>
        <h2>Comprehensive Study Materials Created by Pharmacists - All GPhC Topics Covered</h2>

        <p>
          Download comprehensive GPhC study guides covering all exam topics.
          PDF guides, formula sheets, mind maps, and quick reference cards.
          Structured learning pathways for 8-week, 4-week, and 2-week preparation.
          Created by qualified pharmacists. Updated for 2025 GPhC framework. From £30/month.
        </p>

        <h3>Study Guide Topics</h3>
        <ul>
          <li>Pharmaceutical Calculations Guide</li>
          <li>Clinical Pharmacy & Therapeutics Guide</li>
          <li>Pharmacy Law & Ethics UK Guide</li>
          <li>Pharmacology Guide</li>
          <li>Pharmaceutics Guide</li>
          <li>Public Health Guide</li>
        </ul>

        <h3>Study Materials Included</h3>
        <ul>
          <li>Comprehensive PDF Guides</li>
          <li>Formula Reference Sheets</li>
          <li>Mind Maps for Visual Learning</li>
          <li>Quick Reference Cards</li>
          <li>Study Schedule Templates</li>
          <li>Learning Pathway Plans</li>
        </ul>

        <h3>Learning Pathways</h3>
        <ul>
          <li>Foundation Pathway - 8-12 Weeks Before Exam</li>
          <li>Intensive Pathway - 4-6 Weeks Before Exam</li>
          <li>Rapid Review Pathway - 1-2 Weeks Before Exam</li>
        </ul>

        <h4>Popular Study Guide Searches</h4>
        <ul>
          <li>gphc study guide</li>
          <li>gphc revision notes</li>
          <li>pre-reg exam study materials</li>
          <li>pharmacy exam guide pdf</li>
          <li>gphc formula sheet</li>
          <li>pharmacy mind maps</li>
          <li>gphc study schedule</li>
          <li>pharmacy revision resources</li>
        </ul>

        <p>
          Keywords: GPhC study guide, GPhC revision notes, pre-reg study materials, pharmacy exam guide,
          GPhC formula sheet, pharmacy mind maps, GPhC study schedule, pharmacy revision resources,
          GPhC study plan, learning pathway, study pathway, exam preparation guide, pharmacy study tips,
          GPhC topic guides, BNF study guide, clinical pharmacy guide, pharmacy law guide,
          pharmacology revision, pharmaceutics guide, public health pharmacy
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
