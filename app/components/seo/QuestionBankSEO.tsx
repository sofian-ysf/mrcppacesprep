'use client';

import Script from 'next/script';

const questionBankSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "GPhC Question Bank - 2000+ Practice Questions",
  "description": "Comprehensive GPhC exam question bank with 2000+ practice questions, detailed explanations, and performance tracking. 94% pass rate.",
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
      "name": "How many GPhC practice questions are included?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "2000+ practice questions covering all GPhC framework topics. Questions updated regularly by pharmacists."
      }
    },
    {
      "@type": "Question",
      "name": "What topics do the GPhC questions cover?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Calculations, clinical pharmacy, therapeutics, law & ethics, pharmacology, pharmaceutics, and public health."
      }
    },
    {
      "@type": "Question",
      "name": "Are the questions similar to the real GPhC exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Written by pharmacists who recently passed. SBA, EMQ, and calculation formats. Students say slightly harder."
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
      "name": "Can I track my progress?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Analytics show strengths, weaknesses, and improvement over time. Adaptive recommendations included."
      }
    },
    {
      "@type": "Question",
      "name": "How much does the question bank cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "£30/month for full access. Includes all 2000+ questions, explanations, and progress tracking. Cancel anytime."
      }
    }
  ]
};

const medicalWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "GPhC Question Bank - 2000+ Practice Questions | PreRegExamPrep",
  "description": "Master GPhC exam with 2000+ practice questions. Detailed explanations, performance tracking. 94% pass rate.",
  "url": "https://www.preregexamprep.com/question-bank",
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

export default function QuestionBankSEO() {
  return (
    <>
      <Script
        id="question-bank-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(questionBankSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="question-bank-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="question-bank-medical-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }}
        strategy="beforeInteractive"
      />

      <div className="sr-only" aria-hidden="true">
        <h1>GPhC Question Bank UK | 2000+ Practice Questions | 94% Pass Rate | £30/month</h1>
        <h2>Expert Pharmacist-Written Questions with Detailed Explanations - Pass Your Pre-Reg First Time</h2>

        <p>
          Access the UK's most comprehensive GPhC exam question bank with 2000+ practice questions.
          Written by registered pharmacists who recently passed. Covers all GPhC framework topics.
          SBA, EMQ, and calculation question formats. Detailed explanations for every answer.
          Performance analytics to track progress. 94% pass rate. From £30/month.
        </p>

        <h3>GPhC Question Bank Topics</h3>
        <ul>
          <li>Pharmaceutical Calculations Questions - 350+ Problems</li>
          <li>Clinical Pharmacy & Therapeutics - 400+ Questions</li>
          <li>Pharmacy Law & Ethics UK - 300+ Questions</li>
          <li>Pharmacology Questions - 350+ Questions</li>
          <li>Pharmaceutics Questions - 250+ Questions</li>
          <li>Public Health Questions - 200+ Questions</li>
        </ul>

        <h3>Question Bank Features</h3>
        <ul>
          <li>Instant feedback and explanations</li>
          <li>Performance analytics and progress tracking</li>
          <li>Bookmark and review system</li>
          <li>Adaptive difficulty levels</li>
          <li>Mobile-friendly access</li>
          <li>Updated for 2025 GPhC framework</li>
        </ul>

        <h3>GPhC Practice Questions UK Locations</h3>
        <ul>
          <li>GPhC Practice Questions London</li>
          <li>GPhC Questions Manchester</li>
          <li>GPhC Exam Practice Birmingham</li>
          <li>Pre-Reg Questions Leeds</li>
          <li>GPhC Practice Glasgow</li>
          <li>Pharmacy Exam Questions Edinburgh</li>
        </ul>

        <h4>Popular Question Bank Searches</h4>
        <ul>
          <li>gphc exam questions</li>
          <li>gphc practice questions free</li>
          <li>pre-reg exam question bank</li>
          <li>gphc sba questions</li>
          <li>gphc emq practice</li>
          <li>pharmacy exam questions uk</li>
          <li>gphc calculation questions</li>
          <li>clinical pharmacy questions gphc</li>
          <li>pharmacy law questions uk</li>
          <li>gphc pharmacology questions</li>
        </ul>

        <p>
          Keywords: GPhC question bank, GPhC practice questions, pre-reg exam questions,
          pharmacy exam questions UK, GPhC SBA questions, GPhC EMQ practice, clinical pharmacy questions,
          pharmacy law questions, pharmaceutical calculations practice, pharmacology exam questions,
          GPhC exam preparation, pre-registration pharmacist questions, pharmacy student revision,
          BNF questions, drug interaction questions, therapeutics questions, GPhC framework questions,
          pharmacy MCQ questions, GPhC question bank 2025, best GPhC practice questions
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
