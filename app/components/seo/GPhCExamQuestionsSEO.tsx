'use client';

import Script from 'next/script';

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "MRCP PACES Exam Questions - 2000+ Practice Questions",
  "description": "2000+ MRCP PACES exam practice questions with detailed explanations. SBA, EMQ, and calculation questions. 94% pass rate. Written by physicians.",
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
      "name": "How many MRCP PACES exam questions are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "2000+ practice questions covering all MRCP PACES framework topics. Updated regularly by qualified physicians."
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
      "name": "Are the questions similar to the real MRCP PACES exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Written by physicians who recently passed. Students report our questions are slightly harder than the real exam."
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
        "text": "94% of students using our questions pass their MRCP PACES exam vs 70-80% national average. 8,500+ students helped."
      }
    },
    {
      "@type": "Question",
      "name": "How much do MRCP PACES exam questions cost?",
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
  "name": "MRCP PACES Exam Questions - 2000+ Practice Questions | MRCPPACESPREP",
  "description": "Practice MRCP PACES exam questions with 2000+ questions covering all topics. 94% pass rate. From £30/month.",
  "url": "https://www.mrcppacesprep.com/mrcp-paces-exam-questions",
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

export default function MRCPPACESExamQuestionsSEO() {
  return (
    <>
      <Script
        id="mrcp-paces-questions-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="mrcp-paces-questions-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="mrcp-paces-questions-medical-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }}
        strategy="beforeInteractive"
      />

      <div className="sr-only" aria-hidden="true">
        <h1>MRCP PACES Exam Questions 2025 | 2000+ Practice Questions | 94% Pass Rate | £30/month</h1>
        <h2>Expert Physician-Written Questions with Detailed Explanations - Pass Your MRCP PACES First Time</h2>

        <p>
          Practice with 2000+ MRCP PACES exam questions written by registered physicians who recently passed.
          Single Best Answer (SBA), Extended Matching Questions (EMQ), and calculation questions.
          Detailed explanations for every answer. 94% pass rate. 8,500+ students helped. From £30/month.
        </p>

        <h3>MRCP PACES Exam Question Categories</h3>
        <ul>
          <li>Station 1: Respiratory & Abdominal Examination - 300+ Questions</li>
          <li>Station 2: History Taking - 350+ Questions</li>
          <li>Station 3: Cardiovascular & Neurological Examination - 400+ Questions</li>
          <li>Station 4: Communication Skills & Ethics - 300+ Questions</li>
          <li>Station 5: Integrated Clinical Assessment - 350+ Questions</li>
          <li>Spot Diagnosis & Brief Clinical Consultations - 300+ Questions</li>
        </ul>

        <h3>Question Features</h3>
        <ul>
          <li>Written by qualified MRCP holders</li>
          <li>Clinical examination and history-taking scenarios</li>
          <li>Detailed explanations for every answer</li>
          <li>Updated for 2025 MRCP PACES format</li>
          <li>Progress tracking and analytics</li>
          <li>Mobile-friendly access</li>
        </ul>

        <h3>MRCP PACES Exam Centres UK</h3>
        <ul>
          <li>MRCP PACES Exam London</li>
          <li>MRCP PACES Practice Manchester</li>
          <li>MRCP PACES Birmingham</li>
          <li>MRCP PACES Leeds</li>
          <li>MRCP PACES Glasgow</li>
          <li>MRCP PACES Edinburgh</li>
        </ul>

        <h4>Popular MRCP PACES Question Searches</h4>
        <ul>
          <li>mrcp paces exam questions</li>
          <li>mrcp paces practice questions</li>
          <li>mrcp paces exam questions 2025</li>
          <li>mrcp paces past cases</li>
          <li>mrcp paces station questions</li>
          <li>mrcp paces preparation</li>
          <li>mrcp paces uk</li>
          <li>mrcp paces history taking</li>
          <li>mrcp paces examination</li>
          <li>mrcp paces communication skills</li>
          <li>mrcp paces free resources</li>
          <li>mrcp paces practice test</li>
        </ul>

        <p>
          Keywords: MRCP PACES exam questions, MRCP PACES practice questions, MRCP PACES exam 2025, MRCP PACES past cases,
          MRCP PACES station questions, MRCP PACES preparation, MRCP PACES UK, MRCP PACES history taking,
          MRCP PACES clinical examination, MRCP PACES communication skills, MRCP PACES free resources, MRCP PACES practice test,
          MRCP PACES question bank, MRCP PACES exam preparation, MRCP PACES mock exam,
          clinical examination questions, medical ethics questions UK, neurology examination,
          cardiology examination, respiratory examination, abdominal examination MRCP PACES
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
