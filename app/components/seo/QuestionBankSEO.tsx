'use client';

import Script from 'next/script';

const questionBankSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "MRCP PACES Question Bank - 2000+ Practice Questions",
  "description": "Comprehensive MRCP PACES exam question bank with 2000+ practice questions, detailed explanations, and performance tracking. 94% pass rate.",
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
      "name": "How many MRCP PACES practice questions are included?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "2000+ practice questions covering all MRCP PACES framework topics. Questions updated regularly by physicians."
      }
    },
    {
      "@type": "Question",
      "name": "What topics do the MRCP PACES questions cover?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Calculations, clinical pharmacy, therapeutics, law & ethics, pharmacology, pharmaceutics, and public health."
      }
    },
    {
      "@type": "Question",
      "name": "Are the questions similar to the real MRCP PACES exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Written by physicians who recently passed. SBA, EMQ, and calculation formats. Students say slightly harder."
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
  "name": "MRCP PACES Question Bank - 2000+ Practice Questions | MRCPPACESPREP",
  "description": "Master MRCP PACES exam with 2000+ practice questions. Detailed explanations, performance tracking. 94% pass rate.",
  "url": "https://www.mrcppacesprep.com/question-bank",
  "inLanguage": "en-GB",
  "about": {
    "@type": "MedicalSpecialty",
    "name": "Internal Medicine"
  },
  "audience": {
    "@type": "PeopleAudience",
    "suggestedMinAge": 18,
    "audienceType": "Medical Trainees, MRCP Candidates"
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
        <h1>MRCP PACES Question Bank UK | 2000+ Practice Questions | 94% Pass Rate | £30/month</h1>
        <h2>Expert Physician-Written Questions with Detailed Explanations - Pass Your MRCP PACES First Time</h2>

        <p>
          Access the UK's most comprehensive MRCP PACES exam question bank with 2000+ practice questions.
          Written by registered physicians who recently passed. Covers all MRCP PACES framework topics.
          SBA, EMQ, and calculation question formats. Detailed explanations for every answer.
          Performance analytics to track progress. 94% pass rate. From £30/month.
        </p>

        <h3>MRCP PACES Question Bank Topics</h3>
        <ul>
          <li>Station 1: Respiratory & Abdominal Examination - 300+ Questions</li>
          <li>Station 2: History Taking - 350+ Questions</li>
          <li>Station 3: Cardiovascular & Neurological Examination - 400+ Questions</li>
          <li>Station 4: Communication Skills & Ethics - 300+ Questions</li>
          <li>Station 5: Integrated Clinical Assessment - 350+ Questions</li>
          <li>Spot Diagnosis & Brief Clinical Consultations - 300+ Questions</li>
        </ul>

        <h3>Question Bank Features</h3>
        <ul>
          <li>Instant feedback and explanations</li>
          <li>Performance analytics and progress tracking</li>
          <li>Bookmark and review system</li>
          <li>Adaptive difficulty levels</li>
          <li>Mobile-friendly access</li>
          <li>Updated for 2025 MRCP PACES framework</li>
        </ul>

        <h3>MRCP PACES Practice Questions UK Locations</h3>
        <ul>
          <li>MRCP PACES Practice London</li>
          <li>MRCP PACES Questions Manchester</li>
          <li>MRCP PACES Exam Practice Birmingham</li>
          <li>MRCP PACES Questions Leeds</li>
          <li>MRCP PACES Practice Glasgow</li>
          <li>MRCP PACES Questions Edinburgh</li>
        </ul>

        <h4>Popular Question Bank Searches</h4>
        <ul>
          <li>mrcp paces exam questions</li>
          <li>mrcp paces practice questions free</li>
          <li>mrcp paces question bank</li>
          <li>mrcp paces station questions</li>
          <li>mrcp paces clinical cases</li>
          <li>mrcp paces questions uk</li>
          <li>mrcp paces history taking questions</li>
          <li>mrcp paces examination questions</li>
          <li>medical ethics questions uk</li>
          <li>mrcp paces neurology questions</li>
        </ul>

        <p>
          Keywords: MRCP PACES question bank, MRCP PACES practice questions, MRCP PACES exam questions,
          MRCP PACES questions UK, MRCP PACES station questions, MRCP PACES clinical cases, clinical examination questions,
          medical ethics questions, history taking practice, neurology exam questions,
          MRCP PACES exam preparation, MRCP candidate questions, medical trainee revision,
          cardiology questions, respiratory examination questions, communication skills questions, MRCP PACES station questions,
          MRCP PACES questions, MRCP PACES question bank 2025, best MRCP PACES practice questions
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
