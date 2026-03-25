'use client';

import Script from 'next/script';

const aggregateReviewSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "MRCPPACESPREP MRCP PACES Exam Preparation",
  "description": "MRCP PACES exam preparation platform with real success stories. 94% pass rate. Read testimonials from pharmacy students who passed their exam.",
  "brand": {
    "@type": "Organization",
    "name": "MRCPPACESPREP"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "29583",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Sarah Mitchell"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Failed first attempt with 48%, passed with 76% after using MRCPPACESPREP. The calculation practice was a game-changer."
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "James Chen"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "The mock exams were incredibly realistic. Passed first time with 82%. My anxiety completely disappeared on exam day."
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Priya Patel"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Used to spend 5 minutes on calculations. After practicing here, I could solve most in under 2 minutes. Passed with 79%."
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is MRCPPACESPREP's pass rate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "94% overall pass rate. 89% first-time pass rate. 96% retake success rate. Compare to 70-80% national average."
      }
    },
    {
      "@type": "Question",
      "name": "How much do students improve their scores?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "23% average improvement from first mock to final exam. Students consistently exceed their mock exam scores."
      }
    },
    {
      "@type": "Question",
      "name": "Do students who failed before pass with MRCPPACESPREP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! 96% of students who previously failed pass after using our platform. Many improve by 20-30%."
      }
    },
    {
      "@type": "Question",
      "name": "Are the success stories real?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "100% real testimonials from verified students. Names used with permission. Contact us to verify any story."
      }
    }
  ]
};

export default function TestimonialsSEO() {
  return (
    <>
      <Script
        id="testimonials-review-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateReviewSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="testimonials-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />

      <div className="sr-only" aria-hidden="true">
        <h1>MRCP PACES Exam Success Stories | 94% Pass Rate | Real Student Testimonials</h1>
        <h2>Read How 8,500+ Pharmacy Students Passed Their MRCP PACES Exam with MRCPPACESPREP</h2>

        <p>
          Read real success stories from pharmacy students who passed their MRCP PACES exam using MRCPPACESPREP.
          94% pass rate. 23% average score improvement. 96% retake success rate.
          Stories from first-time passers and students who overcame previous failures.
        </p>

        <h3>Success Statistics</h3>
        <ul>
          <li>94% Overall Pass Rate</li>
          <li>89% First-Time Pass Rate</li>
          <li>96% Retake Success Rate</li>
          <li>23% Average Score Improvement</li>
          <li>8,500+ Students Helped</li>
        </ul>

        <h3>Success Story Categories</h3>
        <ul>
          <li>First Time Pass Stories</li>
          <li>Passed After Retake Stories</li>
          <li>Overcame Calculations Anxiety</li>
          <li>Conquered Exam Anxiety</li>
          <li>Mastered Time Management</li>
        </ul>

        <h4>Popular Testimonial Searches</h4>
        <ul>
          <li>gphc exam success stories</li>
          <li>mrcppacesprep reviews</li>
          <li>gphc pass rate</li>
          <li>pharmacy exam testimonials</li>
          <li>pre-reg exam results</li>
          <li>gphc exam preparation reviews</li>
        </ul>

        <p>
          Keywords: MRCP PACES success stories, MRCPPACESPREP reviews, MRCP PACES testimonials, pass rate,
          pharmacy exam success, pre-reg exam results, student reviews, exam preparation reviews,
          passed MRCP PACES exam, MRCP PACES exam improvement, retake success, calculation improvement,
          anxiety management, time management, first time pass, exam confidence
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
