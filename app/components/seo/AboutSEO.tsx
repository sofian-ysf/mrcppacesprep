'use client';

import Script from 'next/script';

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "PreRegExamPrep",
  "description": "UK's leading GPhC pre-registration exam preparation platform. Created by pharmacists for pharmacy students. 94% pass rate. 8,500+ students helped.",
  "url": "https://www.preregexamprep.com",
  "logo": "https://www.preregexamprep.com/logo.png",
  "foundingDate": "2020",
  "areaServed": {
    "@type": "Country",
    "name": "United Kingdom"
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
      "name": "Who created PreRegExamPrep?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Created by qualified pharmacists who recently passed the GPhC exam. We understand the challenges firsthand."
      }
    },
    {
      "@type": "Question",
      "name": "What is PreRegExamPrep's pass rate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "94% of our students pass their GPhC exam, compared to 70-80% national average. 96% retake success rate."
      }
    },
    {
      "@type": "Question",
      "name": "How many students use PreRegExamPrep?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "8,500+ pharmacy students have used our platform. Trusted by students from top UK pharmacy schools."
      }
    },
    {
      "@type": "Question",
      "name": "Is the content regularly updated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All content updated for 2025 GPhC framework. Regular reviews ensure current guidelines and BNF alignment."
      }
    }
  ]
};

export default function AboutSEO() {
  return (
    <>
      <Script
        id="about-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="about-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />

      <div className="sr-only" aria-hidden="true">
        <h1>About PreRegExamPrep | UK's Leading GPhC Exam Preparation Platform</h1>
        <h2>Created by Pharmacists for Pharmacy Students - 94% Pass Rate - 8,500+ Students Helped</h2>

        <p>
          PreRegExamPrep is the UK's leading GPhC pre-registration exam preparation platform.
          Created by qualified pharmacists who recently passed the exam. 94% pass rate vs 70-80% national average.
          8,500+ pharmacy students helped. Trusted by students from UCL, Manchester, Nottingham, and more.
        </p>

        <h3>Our Mission</h3>
        <p>
          We believe every pharmacy graduate deserves the best chance to pass their GPhC exam first time.
          Our mission is to provide comprehensive, high-quality exam preparation that's accessible and effective.
        </p>

        <h3>Our Impact</h3>
        <ul>
          <li>8,500+ Students Helped</li>
          <li>94% First-Time Pass Rate</li>
          <li>96% Retake Success Rate</li>
          <li>2000+ Practice Questions</li>
          <li>50+ Mock Exams</li>
        </ul>

        <h3>Our Values</h3>
        <ul>
          <li>Excellence - Highest quality content standards</li>
          <li>Accessibility - Affordable for all students</li>
          <li>Support - Help throughout your journey</li>
          <li>Innovation - Continuous improvement</li>
        </ul>

        <p>
          Keywords: about PreRegExamPrep, GPhC exam platform, pharmacy exam preparation company,
          pharmacist-created content, UK pharmacy exam, pre-reg exam platform, trusted exam prep,
          pharmacy student support, GPhC success rate, pass rate statistics
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
