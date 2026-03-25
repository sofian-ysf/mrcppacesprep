'use client';

import { useState } from 'react';
import Script from 'next/script';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  className?: string;
  disableSchema?: boolean;
}

export default function FAQSection({
  faqs,
  title = 'Frequently Asked Questions',
  className = '',
  disableSchema = false
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Generate FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {!disableSchema && (
        <Script
          id={`faq-schema-${title.toLowerCase().replace(/\s+/g, '-')}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          strategy="afterInteractive"
        />
      )}

      <div className={className}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-gray-200">
                    <p className="pt-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
