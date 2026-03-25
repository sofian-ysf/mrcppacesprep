'use client';

import Script from 'next/script';

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "GPhC Exam Questions - 2000+ Practice Questions",
  "description": "2000+ GPhC exam practice questions with detailed explanations. SBA, EMQ, and calculation questions. 94% pass rate. Written by pharmacists.",
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
      "name": "How many GPhC exam questions are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "2000+ practice questions covering all GPhC framework topics. Updated regularly by qualified pharmacists."
      }
    },
    {
      "@type": "Question",
      "name": "What question types are included?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Single Best Answer (SBA), Extended Matching Questions (EMQ), and calculation questions. Matches real exam format."
      }
    },
    {
      "@type": "Question",
      "name": "Are the questions similar to the real GPhC exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Written by pharmacists who recently passed. Students report our questions are slightly harder than the real exam."
      }
    },
    {
      "@type": "Question",
      "name": "Do questions have explanations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every question has detailed explanations for correct and incorrect answers. Learn from every attempt."
      }
    },
    {
      "@type": "Question",
      "name": "What is the pass rate with these questions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "94% of students using our questions pass their GPhC exam vs 70-80% national average. 8,500+ students helped."
      }
    },
    {
      "@type": "Question",
      "name": "How much do GPhC exam questions cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "£30/month for full access to all 2000+ questions, mock exams, and study resources. Cancel anytime."
      }
    }
  ]
};

const medicalWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "GPhC Exam Questions - 2000+ Practice Questions | PreRegExamPrep",
  "description": "Practice GPhC exam questions with 2000+ questions covering all topics. 94% pass rate. From £30/month.",
  "url": "https://www.preregexamprep.com/gphc-exam-questions",
  "inLanguage": "en-GB",
  "about": {
    "@type": "MedicalSpecialty",
    "name": "Pharmacy"
  },
  "audience": {
    "@type": "PeopleAudience",
    "suggestedMinAge": 18,
    "audienceType": "Pharmacy Students, Pre-Registration Pharmacists"
  }
};

export default function GPhCExamQuestionsSEO() {
  return (
    <>
      <Script
        id="gphc-questions-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="gphc-questions-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="gphc-questions-medical-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }}
        strategy="beforeInteractive"
      />

      <div className="sr-only" aria-hidden="true">
        <h1>GPhC Exam Questions 2025 | 2000+ Practice Questions | 94% Pass Rate | £30/month</h1>
        <h2>Expert Pharmacist-Written Questions with Detailed Explanations - Pass Your Pre-Reg First Time</h2>

        <p>
          Practice with 2000+ GPhC exam questions written by registered pharmacists who recently passed.
          Single Best Answer (SBA), Extended Matching Questions (EMQ), and calculation questions.
          Detailed explanations for every answer. 94% pass rate. 8,500+ students helped. From £30/month.
        </p>

        <h3>GPhC Exam Question Categories</h3>
        <ul>
          <li>Pharmaceutical Calculations Questions - 350+ Problems</li>
          <li>Clinical Pharmacy & Therapeutics Questions - 400+ Questions</li>
          <li>Pharmacy Law & Ethics Questions - 300+ Questions</li>
          <li>Pharmacology Questions - 350+ Questions</li>
          <li>Pharmaceutics Questions - 250+ Questions</li>
          <li>Public Health Questions - 200+ Questions</li>
        </ul>

        <h3>Question Features</h3>
        <ul>
          <li>Written by qualified pharmacists</li>
          <li>SBA, EMQ, and calculation formats</li>
          <li>Detailed explanations for every answer</li>
          <li>Updated for 2025 GPhC framework</li>
          <li>Progress tracking and analytics</li>
          <li>Mobile-friendly access</li>
        </ul>

        <h3>GPhC Exam Questions UK Locations</h3>
        <ul>
          <li>GPhC Exam Questions London</li>
          <li>GPhC Practice Questions Manchester</li>
          <li>Pre-Reg Questions Birmingham</li>
          <li>Pharmacy Exam Questions Leeds</li>
          <li>GPhC Questions Glasgow</li>
          <li>GPhC Practice Edinburgh</li>
        </ul>

        <h4>Popular GPhC Question Searches</h4>
        <ul>
          <li>gphc exam questions</li>
          <li>gphc practice questions</li>
          <li>gphc exam questions 2025</li>
          <li>gphc past papers</li>
          <li>gphc mcq questions</li>
          <li>pre-reg exam questions</li>
          <li>pharmacy exam questions uk</li>
          <li>gphc sba questions</li>
          <li>gphc emq questions</li>
          <li>gphc calculation questions</li>
          <li>gphc questions free</li>
          <li>gphc practice test</li>
        </ul>

        <p>
          Keywords: GPhC exam questions, GPhC practice questions, GPhC exam questions 2025, GPhC past papers,
          GPhC MCQ questions, pre-reg exam questions, pharmacy exam questions UK, GPhC SBA questions,
          GPhC EMQ questions, GPhC calculation questions, GPhC questions free, GPhC practice test,
          pharmacy pre-registration questions, GPhC question bank, GPhC exam preparation, GPhC mock questions,
          clinical pharmacy questions, pharmacy law questions UK, pharmacology exam questions,
          BNF questions, drug interaction questions, therapeutics questions GPhC
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
