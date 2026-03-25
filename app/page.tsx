'use client'

import Link from "next/link";
import Script from "next/script";
import { useRef, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { getStoredGclid } from "@/app/components/GclidCapture";
import UniversityLogos from '@/app/components/home/UniversityLogos'
import FAQSection from '@/app/components/FAQSection'

const homepageFAQs = [
  {
    question: "What is the MRCP PACES exam?",
    answer: "The MRCP PACES exam is a high-stakes clinical assessment that all medical trainees must pass to become Members of the Royal College of Physicians. It tests clinical examination skills, communication, and medical knowledge across 5 stations."
  },
  {
    question: "How many stations are on the MRCP PACES exam?",
    answer: "The MRCP PACES exam contains 5 stations covering respiratory and abdominal examination, history taking, communication skills, and neurology. Each station tests different clinical competencies."
  },
  {
    question: "What is the MRCP PACES exam pass rate?",
    answer: "The national pass rate varies each sitting, typically ranging from 70-85%. With MRCPPACESPREP, 94% of our students pass on their first attempt, significantly above the national average."
  },
  {
    question: "How long should I study for the MRCP PACES exam?",
    answer: "Most successful candidates study for 8-12 weeks, dedicating 20-30 hours per week. We recommend starting with our question bank early and taking mock exams in the final 2-3 weeks."
  },
  {
    question: "How similar are your questions to the actual MRCP PACES exam?",
    answer: "Our questions are written by MRCP qualified physicians who have recently taken the exam. We regularly update our question bank based on student feedback to ensure they match the current exam format and difficulty level."
  },
  {
    question: "What if I don't pass after using your platform?",
    answer: "We provide comprehensive support throughout your exam preparation journey. Our platform includes detailed explanations, performance tracking, and various study resources. We also offer continued access if you need to retake."
  },
  {
    question: "Can I access the platform on mobile devices?",
    answer: "Yes! Our platform is fully responsive and works on all devices. Your progress syncs across all devices, so you can pick up exactly where you left off."
  },
  {
    question: "Do you cover the new MRCP PACES exam format?",
    answer: "Absolutely! We've fully updated our platform for the 2026 MRCP PACES exam format, including clinical stations and communication skills. Our content is regularly reviewed to ensure it remains current."
  },
  {
    question: "Is MRCPPACESPREP worth it?",
    answer: "Our platform has helped over 8,500 medical students pass, with a 94% first-time pass rate. Students get 2,000+ questions, mock exams, and detailed explanations starting at £25."
  },
  {
    question: "Can I try MRCPPACESPREP for free?",
    answer: "Yes! You can try 15 free practice questions without signing up. This gives you a feel for our question style, explanations, and platform before committing."
  }
];

type PlanType = '3month' | '6month' | 'lifetime';

const testimonials = [
  { initials: "SM", name: "Sarah M.", role: "Medical Registrar, London", quote: "The question bank mirrors the actual exam remarkably well. I felt genuinely prepared walking into the assessment centre." },
  { initials: "AK", name: "Ahmed K.", role: "Hospital Physician, Manchester", quote: "After an initial setback, this platform gave me the structure and confidence I needed. Three months later, I passed comfortably." },
  { initials: "EL", name: "Emma L.", role: "Clinical Fellow, Birmingham", quote: "The mock examinations are exceptionally thorough. They prepared me for scenarios even more challenging than the real assessment." },
  { initials: "JP", name: "James P.", role: "Specialty Trainee, Leeds", quote: "The detailed explanations for each question helped me understand not just the what, but the why. Invaluable for deep learning." },
  { initials: "RB", name: "Riya B.", role: "Hospital Physician, Bristol", quote: "I appreciated the calm, structured approach. No pressure tactics, just quality content that speaks for itself." },
  { initials: "MH", name: "Michael H.", role: "Medical Registrar, Edinburgh", quote: "The clinical examination section alone was worth the subscription. Complex scenarios broken down beautifully." },
  { initials: "FN", name: "Fatima N.", role: "Clinical Fellow, Glasgow", quote: "Studying alongside my medical training was demanding. This platform made efficient use of every moment I had." },
  { initials: "DW", name: "David W.", role: "Hospital Physician, Cardiff", quote: "The progress tracking helped me identify gaps I didn't know I had. Addressed them all before the exam." },
  { initials: "AS", name: "Amara S.", role: "Medical Registrar, Newcastle", quote: "Clean interface, thoughtful design, excellent content. Everything you need, nothing you don't." },
  { initials: "TK", name: "Thomas K.", role: "Specialty Trainee, Liverpool", quote: "Second attempt after failing elsewhere. This platform's approach made all the difference. Passed with confidence." },
  { initials: "NC", name: "Nadia C.", role: "Hospital Physician, Sheffield", quote: "The clinical-aligned questions were particularly helpful. Felt like proper exam preparation, not just memorisation." },
  { initials: "OP", name: "Oliver P.", role: "Clinical Fellow, Nottingham", quote: "Recommended by a colleague who passed first time. Now I understand why. Exceptional quality throughout." },
  { initials: "LR", name: "Layla R.", role: "Medical Registrar, Southampton", quote: "The mock exams replicated the pressure of the real thing. On exam day, I felt like I'd done it all before." },
  { initials: "CH", name: "Chris H.", role: "Hospital Physician, Leicester", quote: "Worth every penny. The depth of content and quality of explanations set this apart from other resources." },
  { initials: "ZA", name: "Zara A.", role: "Clinical Fellow, Oxford", quote: "Balanced my preparation across all topics thanks to the analytics. No surprises on exam day." },
  { initials: "BT", name: "Ben T.", role: "Specialty Trainee, Cambridge", quote: "The station practice was outstanding. That format used to worry me, but I went in feeling fully prepared." },
]

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null)

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleCheckout = async (planType: PlanType) => {
    if (!user) {
      window.location.href = `/signup?plan=${planType}`
      return
    }

    setIsLoading(true)
    setLoadingPlan(planType)

    try {
      const gclid = getStoredGclid()
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, gclid }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to create checkout session. Please try again.')
      setIsLoading(false)
      setLoadingPlan(null)
    }
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // MedicalWebPage - Signals medical authority
      {
        "@type": "MedicalWebPage",
        "@id": "https://www.mrcppacesprep.com/#medicalwebpage",
        "name": "MRCP PACES Exam Preparation | Pass First Time",
        "description": "UK's leading MRCP PACES exam prep platform. 2000+ questions, mock exams, 94% pass rate. From £30/month.",
        "url": "https://www.mrcppacesprep.com",
        "inLanguage": "en-GB",
        "isPartOf": {
          "@type": "WebSite",
          "name": "MRCPPACESPREP",
          "url": "https://www.mrcppacesprep.com"
        },
        "about": {
          "@type": "MedicalSpecialty",
          "name": "Internal Medicine"
        },
        "audience": {
          "@type": "PeopleAudience",
          "suggestedMinAge": 18,
          "audienceType": "Medical Trainees, MRCP Candidates"
        },
        "author": {
          "@type": "Organization",
          "name": "MRCPPACESPREP",
          "url": "https://www.mrcppacesprep.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.mrcppacesprep.com/logo.png"
          }
        },
        "datePublished": "2024-01-01",
        "dateModified": "2026-01-29",
        "mainEntity": {
          "@type": "HealthTopicContent",
          "name": "MRCP PACES Exam Preparation",
          "hasHealthAspect": [
            { "@type": "HealthAspect", "name": "ClinicalExamination" },
            { "@type": "HealthAspect", "name": "ClinicalMedicine" },
            { "@type": "HealthAspect", "name": "MedicalEthics" }
          ]
        }
      },
      // Organization - Primary entity
      {
        "@type": ["Organization", "EducationalOrganization"],
        "@id": "https://www.mrcppacesprep.com/#organization",
        "name": "MRCPPACESPREP",
        "alternateName": ["MRCP PACES Exam Prep", "MRCP PACES Prep", "PACES Prep"],
        "url": "https://www.mrcppacesprep.com",
        "description": "UK's leading platform for MRCP PACES exam preparation, trusted by 8,500+ medical graduates",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.mrcppacesprep.com/logo.png",
          "width": 600,
          "height": 60
        },
        "sameAs": [
          "https://twitter.com/mrcppacesprep",
          "https://facebook.com/mrcppacesprep",
          "https://linkedin.com/company/mrcppacesprep"
        ],
        "areaServed": {
          "@type": "Country",
          "name": "United Kingdom"
        },
        "knowsAbout": [
          "MRCP PACES Exam",
          "Medical Exam Preparation",
          "Clinical Examination Skills",
          "Clinical Medicine",
          "Medical Ethics UK",
          "MRCP Training",
          "History Taking",
          "Communication Skills",
          "Therapeutics"
        ]
      },
      // WebSite
      {
        "@type": "WebSite",
        "@id": "https://www.mrcppacesprep.com/#website",
        "url": "https://www.mrcppacesprep.com",
        "name": "MRCPPACESPREP",
        "description": "Comprehensive MRCP PACES exam preparation platform with 2000+ practice questions, mock exams, and study resources",
        "publisher": {
          "@id": "https://www.mrcppacesprep.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.mrcppacesprep.com/blog?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      // Course schema
      {
        "@type": "Course",
        "@id": "https://www.mrcppacesprep.com/#course",
        "name": "MRCP PACES Exam Preparation Course",
        "description": "Complete preparation course for the MRCP PACES exam featuring 2000+ practice questions, realistic mock exams, detailed explanations, and comprehensive study resources. 94% of students pass their exam.",
        "provider": {
          "@id": "https://www.mrcppacesprep.com/#organization"
        },
        "educationalCredentialAwarded": "MRCP PACES Preparation",
        "educationalLevel": "Professional",
        "teaches": [
          "Clinical examination skills",
          "Clinical medicine and therapeutics",
          "Medical ethics",
          "History taking",
          "Communication skills",
          "Evidence-based practice"
        ],
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "online",
          "duration": "P3M",
          "inLanguage": "en-GB",
          "courseWorkload": "PT2H per day recommended"
        },
        "offers": {
          "@type": "Offer",
          "price": "30",
          "priceCurrency": "GBP",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "30",
            "priceCurrency": "GBP",
            "billingDuration": "P1M",
            "unitText": "month"
          },
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2026-12-31"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "29583",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      // Product schema for subscription - enables star ratings in search
      {
        "@type": "Product",
        "@id": "https://www.mrcppacesprep.com/#product",
        "name": "MRCP PACES Exam Prep Subscription",
        "description": "Full access to 2000+ MRCP PACES practice questions, unlimited mock exams, clinical skills practice, detailed explanations, and progress tracking. 94% pass rate.",
        "brand": {
          "@id": "https://www.mrcppacesprep.com/#organization"
        },
        "category": "Educational Software",
        "offers": {
          "@type": "AggregateOffer",
          "lowPrice": "30",
          "highPrice": "90",
          "priceCurrency": "GBP",
          "offerCount": "3",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2026-12-31",
          "url": "https://www.mrcppacesprep.com/#pricing"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "29583",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      // SiteNavigationElement for search engines
      {
        "@type": "SiteNavigationElement",
        "name": "Main Navigation",
        "url": "https://www.mrcppacesprep.com",
        "hasPart": [
          {"@type": "WebPage", "name": "Question Bank", "url": "https://www.mrcppacesprep.com/question-bank"},
          {"@type": "WebPage", "name": "Mock Exams", "url": "https://www.mrcppacesprep.com/mock-exams"},
          {"@type": "WebPage", "name": "Calculations", "url": "https://www.mrcppacesprep.com/calculations"},
          {"@type": "WebPage", "name": "Study Guides", "url": "https://www.mrcppacesprep.com/study-guides"},
          {"@type": "WebPage", "name": "Resources", "url": "https://www.mrcppacesprep.com/resources"},
          {"@type": "WebPage", "name": "Blog", "url": "https://www.mrcppacesprep.com/blog"},
          {"@type": "WebPage", "name": "About", "url": "https://www.mrcppacesprep.com/about"},
          {"@type": "WebPage", "name": "Testimonials", "url": "https://www.mrcppacesprep.com/testimonials"}
        ]
      }
      // Note: FAQPage schema is generated by the FAQSection component
    ]
  };

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />

      {/* Hidden SEO Content - Visible to crawlers, hidden from users */}
      <div className="sr-only" aria-hidden="true">
        <h2>MRCP PACES Exam Questions UK 2026 | 94% Pass Rate</h2>
        <h3>2000+ Practice Questions Written by MRCP Qualified Physicians - Pass Your MRCP PACES Exam First Time</h3>

        <p>
          Prepare for your MRCP PACES exam with the UK's leading medical exam preparation platform.
          MRCPPACESPREP offers 2000+ practice questions, unlimited mock exams, clinical examination practice,
          and detailed explanations. Trusted by 8,500+ medical trainees from UCL, Manchester, Nottingham,
          King's College London, Oxford, Cambridge, Cardiff, Edinburgh, and Belfast. 94% pass rate. From £30/month.
        </p>

        <h3>MRCP PACES Exam Preparation Services</h3>
        <ul>
          <li>MRCP PACES Practice Questions - 2000+ Questions - From £30/month</li>
          <li>MRCP PACES Mock Exams - Unlimited Full-Length Exams - From £30/month</li>
          <li>Clinical Examination Practice - 350+ Questions - From £30/month</li>
          <li>Clinical Medicine Questions - 400+ Questions - From £30/month</li>
          <li>Medical Ethics Questions - 300+ Questions - From £30/month</li>
          <li>MRCP PACES Study Guides and Resources - Included - From £30/month</li>
        </ul>

        <h3>Why Choose MRCPPACESPREP?</h3>
        <ul>
          <li>94% Pass Rate - Higher Than National Average of 70-80%</li>
          <li>8,500+ Students Helped Pass Their MRCP PACES Exam</li>
          <li>Questions Written by Recently Qualified Physicians</li>
          <li>Content Updated for 2026 MRCP PACES Framework</li>
          <li>Detailed Explanations for Every Question</li>
          <li>Progress Analytics to Track Your Improvement</li>
          <li>Mobile-Friendly - Study Anywhere</li>
          <li>Cancel Anytime - No Long-Term Commitment</li>
        </ul>

        <h3>MRCP PACES Exam Topics Covered</h3>
        <ul>
          <li>Clinical Examination Skills - Respiratory, Cardiovascular, Abdominal</li>
          <li>Clinical Medicine and Therapeutics</li>
          <li>Medical Ethics UK</li>
          <li>Neurology and Examination</li>
          <li>History Taking</li>
          <li>Communication Skills</li>
          <li>Patient Counselling and Communication</li>
          <li>Evidence-Based Practice</li>
        </ul>

        <h3>MRCP PACES Exam Preparation UK Locations</h3>
        <ul>
          <li>MRCP PACES Exam Prep London</li>
          <li>MRCP PACES Exam Prep Manchester</li>
          <li>MRCP PACES Exam Prep Birmingham</li>
          <li>MRCP PACES Exam Prep Leeds</li>
          <li>MRCP PACES Exam Prep Glasgow</li>
          <li>MRCP PACES Exam Prep Edinburgh</li>
          <li>MRCP PACES Exam Prep Cardiff</li>
          <li>MRCP PACES Exam Prep Bristol</li>
          <li>MRCP PACES Exam Prep Newcastle</li>
          <li>MRCP PACES Exam Prep Liverpool</li>
        </ul>

        <h4>Popular MRCP PACES Exam Searches</h4>
        <ul>
          <li>mrcp paces exam questions</li>
          <li>mrcp paces exam practice test free</li>
          <li>mrcp paces exam questions medicine</li>
          <li>mrcp paces clinical examination questions</li>
          <li>mrcp paces mock exam online</li>
          <li>mrcp paces exam UK</li>
          <li>mrcp paces exam pass rate 2026</li>
          <li>how to pass mrcp paces exam first time</li>
          <li>mrcp paces exam revision notes</li>
          <li>best mrcp paces exam prep course</li>
          <li>mrcp paces exam cost UK</li>
          <li>mrcp paces retake exam preparation</li>
          <li>img exam preparation UK</li>
          <li>international medical graduate mrcp exam</li>
        </ul>

        <p>
          Keywords: MRCP PACES exam, MRCP exam, medical exam UK, MRCP PACES questions, MRCP PACES practice test,
          MRCP clinical exam, MRCP PACES station questions, MRCP PACES revision, MRCP exam questions,
          medical exam preparation, MRCP PACES mock exam, clinical examination, clinical medicine questions,
          medical ethics UK, MRCP PACES pass rate 2026, MRCP candidate exam, MRCP PACES exam 2026,
          medical student revision, clinical examination questions, therapeutics test, medicine exam,
          MRCP PACES assessment 2026, MRCP training, foundation physician exam, MBBS exam prep,
          medical graduate exam, MRCP registration exam, IMG exam, international medical graduate UK,
          clinical examination practice, history taking practice, communication skills,
          station practice medicine, MRCP PACES stations,
          MRCP PACES exam format 2026, MRCP PACES exam dates 2026, MRCP PACES exam booking, medical exam results,
          MRCP PACES exam tips, MRCP PACES exam strategy, medical revision resources, MRCP PACES study guide,
          MRCP exam revision, medical MCQ questions, therapeutics exam questions,
          clinical examination questions, patient counselling questions, medicine questions,
          examination technique questions, diagnosis questions, clinical skills test
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

      <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-80px)] flex items-center bg-gradient-to-b from-[#fbfaf4] to-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl w-full">
          <div className="text-center">
            <div className="pill-badge mb-4 sm:mb-6 text-xs sm:text-sm">
              Trusted by 8,500+ medical graduates
            </div>

            <h1 className="mb-4 sm:mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              MRCP PACES Exam Questions
              <span className="block text-gray-900">& Practice Tests 2026</span>
            </h1>

            <p className="mx-auto mb-6 sm:mb-10 max-w-2xl text-base sm:text-lg lg:text-xl text-gray-600 px-2">
              A thoughtfully designed preparation experience trusted by medical graduates across the UK. Expert-crafted questions, detailed guidance, and the confidence to succeed.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/pricing"
                className="pill-btn pill-btn-primary text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3"
              >
                Get Started
              </Link>
              <Link
                href="/try-free"
                className="pill-btn pill-btn-secondary text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3"
              >
                Take Demo
              </Link>
            </div>

            <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">4.8/5</div>
                <div className="flex justify-center mt-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Student Rating</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">94%</div>
                <div className="text-xs sm:text-sm text-gray-600">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">2,000+</div>
                <div className="text-xs sm:text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">8,500+</div>
                <div className="text-xs sm:text-sm text-gray-600">Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section className="bg-[#fbfaf4] px-4 py-10 sm:py-16 sm:px-6 lg:px-8 border-y border-gray-100">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs sm:text-sm uppercase tracking-widest text-gray-500 mb-6 sm:mb-12">
            Trusted by graduates from institutions across the UK
          </p>
          <UniversityLogos />
        </div>
      </section>

      {/* Why Preparation Matters */}
      <section className="bg-[#fbfaf4] px-4 py-12 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
              Why Preparation Matters
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              The MRCP PACES assessment is a significant milestone. Thoughtful preparation ensures you approach it with clarity and confidence.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-8 md:grid-cols-3">
            <div className="pill-card text-center p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-2 sm:mb-3">3 months</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Between Sittings</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Each assessment opportunity is valuable. Our structured approach helps you make the most of your preparation time.</p>
            </div>

            <div className="pill-card text-center p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-2 sm:mb-3">2,000+</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Practice Questions</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Carefully curated questions aligned with the MRCP PACES framework, each with detailed explanations to deepen your understanding.</p>
            </div>

            <div className="pill-card text-center p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-2 sm:mb-3">94%</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Success Rate</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Our members consistently achieve results that reflect the quality of their preparation and dedication.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/pricing"
                className="pill-btn pill-btn-primary text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3"
              >
                Start Preparing Now
              </Link>
              <Link
                href="/try-free"
                className="pill-btn pill-btn-secondary text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3"
              >
                Take Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-12 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
              A Complete Preparation Experience
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Every element designed to support your journey to MRCP.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-12 lg:grid-cols-3 mb-12 sm:mb-24">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-[#fbfaf4] flex items-center justify-center">
                <svg className="h-5 w-5 sm:h-7 sm:w-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Expert-Crafted Questions</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed px-2">Over 2,000 questions developed by practising physicians, aligned with the MRCP PACES framework and accompanied by comprehensive explanations.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-[#fbfaf4] flex items-center justify-center">
                <svg className="h-5 w-5 sm:h-7 sm:w-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Intelligent Progress Tracking</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed px-2">Understand your strengths and areas for growth with detailed analytics, allowing you to focus your time where it matters most.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-[#fbfaf4] flex items-center justify-center">
                <svg className="h-5 w-5 sm:h-7 sm:w-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Comprehensive Resources</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed px-2">Calculation guides, clinical references, and study materials thoughtfully assembled to complement your learning.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/pricing"
                className="pill-btn pill-btn-primary text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3"
              >
                Get Full Access
              </Link>
              <Link
                href="/try-free"
                className="pill-btn pill-btn-secondary text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3"
              >
                Take Demo
              </Link>
            </div>
          </div>

          {/* Testimonials */}
          <div className="border-t border-gray-100 pt-10 sm:pt-20">
            <div className="flex items-end justify-between mb-6 sm:mb-10">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 mb-2 sm:mb-3">Voices from Our Community</p>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Stories of Success</h3>
              </div>
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
                  aria-label="Previous testimonials"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
                  aria-label="Next testimonials"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="relative flex-shrink-0 w-[280px] sm:w-[340px] snap-start">
                  <div className="absolute -top-3 sm:-top-4 left-4 sm:left-6 text-4xl sm:text-6xl text-gray-100 font-serif select-none">"</div>
                  <div className="pill-card relative h-[200px] sm:h-[220px] flex flex-col p-4 sm:p-6">
                    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm flex-grow">{testimonial.quote}</p>
                    <div className="flex items-center pt-3 sm:pt-4 border-t border-gray-100 mt-3 sm:mt-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs sm:text-sm">{testimonial.initials}</div>
                      <div className="ml-2 sm:ml-3">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm">{testimonial.name}</p>
                        <p className="text-gray-500 text-[10px] sm:text-xs">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-4 sm:hidden">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600"
                aria-label="Previous testimonials"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600"
                aria-label="Next testimonials"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 py-12 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 mb-2 sm:mb-3">Membership</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
              Choose Your Plan
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-600">
              One-time payment. Full access. No subscriptions.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {/* 2 Months Plan */}
            <div className="pill-card transition-all p-4 sm:p-6">
              <div className="text-center pb-4 sm:pb-6 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">2 Months</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl font-light text-gray-900">£25</span>
                </div>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">Great for focused prep</p>
              </div>

              <div className="py-4 sm:py-6 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-xs sm:text-sm">2,000+ practice questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-xs sm:text-sm">Unlimited mock exams</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-xs sm:text-sm">Detailed explanations</span>
                </div>
              </div>

              <button
                onClick={() => handleCheckout('3month')}
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingPlan === '3month' ? 'Processing...' : 'Get 2 Months'}
              </button>
            </div>

            {/* 6 Months Plan - Most Popular */}
            <div className="pill-card relative transition-all ring-2 ring-green-500 p-4 sm:p-6">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-green-500 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white">
                  Most Popular
                </span>
              </div>

              <div className="text-center pb-4 sm:pb-6 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">6 Months</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl font-light text-gray-900">£40</span>
                </div>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">Comprehensive study</p>
              </div>

              <div className="py-4 sm:py-6 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-xs sm:text-sm">2,000+ practice questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-xs sm:text-sm">Unlimited mock exams</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-xs sm:text-sm">Detailed explanations</span>
                </div>
              </div>

              <button
                onClick={() => handleCheckout('6month')}
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingPlan === '6month' ? 'Processing...' : 'Get 6 Months'}
              </button>
            </div>

            {/* Lifetime Plan */}
            <div className="pill-card transition-all p-4 sm:p-6">
              <div className="text-center pb-4 sm:pb-6 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Lifetime</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl font-light text-gray-900">£70</span>
                </div>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">Best value - access forever</p>
              </div>

              <div className="py-4 sm:py-6 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-xs sm:text-sm">2,000+ practice questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-xs sm:text-sm">Unlimited mock exams</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-xs sm:text-sm">Detailed explanations</span>
                </div>
              </div>

              <button
                onClick={() => handleCheckout('lifetime')}
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingPlan === 'lifetime' ? 'Processing...' : 'Get Lifetime Access'}
              </button>
            </div>
          </div>

          <p className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-gray-400">
            Secure payment via Stripe. 7-day money-back guarantee.
          </p>
        </div>
      </section>

      {/* FAQ Section with Schema */}
      <FAQSection
        faqs={homepageFAQs}
        title="Frequently Asked Questions About MRCP PACES Exam Prep"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-[#fbfaf4]"
      />

      {/* Final CTA */}
      <section className="bg-[#fbfaf4] px-4 py-12 sm:py-24 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 mb-3 sm:mb-4">
            Start Today
          </p>
          <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
            Join 8,500+ Students Who Passed
          </h2>
          <p className="mb-6 sm:mb-10 text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Begin your preparation journey today. Thoughtful practice, detailed explanations, and the confidence to succeed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
            <Link
              href="/pricing"
              className="pill-btn pill-btn-primary text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3"
            >
              Get Started
            </Link>
            <Link
              href="/try-free"
              className="pill-btn pill-btn-secondary text-sm sm:text-base px-6 py-2.5 sm:px-8 sm:py-3"
            >
              Take Demo
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>2,000+ Questions</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <h3 className="mb-3 sm:mb-4 font-bold text-gray-900 text-sm sm:text-base">MRCPPACESPREP</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                The UK's leading platform for MRCP PACES exam preparation.
              </p>
            </div>

            <div>
              <h4 className="mb-3 sm:mb-4 font-semibold text-gray-900 text-sm sm:text-base">Resources</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li><Link href="/question-bank" className="hover:text-gray-900">Question Bank</Link></li>
                <li><Link href="/mock-exams" className="hover:text-gray-900">Mock Exams</Link></li>
                <li><Link href="/study-guides" className="hover:text-gray-900">Study Guides</Link></li>
                <li><Link href="/calculations" className="hover:text-gray-900">Calculations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 sm:mb-4 font-semibold text-gray-900 text-sm sm:text-base">Support</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li><Link href="/help" className="hover:text-gray-900">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">Contact Us</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="/testimonials" className="hover:text-gray-900">Success Stories</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 sm:mb-4 font-semibold text-gray-900 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms of Service</Link></li>
                <li><Link href="/support" className="hover:text-gray-900">Support</Link></li>
                <li><Link href="/disclaimer" className="hover:text-gray-900">Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 border-t border-gray-200 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-600">
            <p>© 2024 MRCPPACESPREP. All rights reserved.</p>
            <p className="mt-1 sm:mt-2">Not affiliated with or endorsed by the Royal College of Physicians.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}