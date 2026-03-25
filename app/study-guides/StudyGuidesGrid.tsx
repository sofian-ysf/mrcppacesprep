'use client'

import { useEffect, useState } from 'react'
import { StudyGuideCard } from './StudyGuideCard'

const guides = [
  {
    slug: 'pharmaceutical-calculations',
    title: 'Pharmaceutical Calculations',
    description: 'Complete guide to all calculation types with step-by-step methods, worked examples, and common formula reference.',
    items: [
      'Dosage calculations (pediatric, geriatric, weight-based)',
      'Concentration and dilution problems',
      'Business calculations and profit/loss',
      'Alligation and mixture calculations',
      'IV flow rates and infusion calculations',
    ],
    stats: '120 pages • 50 practice problems',
    color: 'blue' as const,
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    slug: 'clinical-pharmacy-therapeutics',
    title: 'Clinical Pharmacy & Therapeutics',
    description: 'Comprehensive coverage of drug interactions, patient counseling, evidence-based practice, and therapeutic monitoring.',
    items: [
      'Drug interaction mechanisms and management',
      'Patient counseling frameworks and techniques',
      'Evidence-based medicine principles',
      'Therapeutic drug monitoring',
      'Adverse drug reaction identification',
    ],
    stats: '95 pages • 40 case studies',
    color: 'green' as const,
    icon: (
      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    slug: 'pharmacy-law-ethics',
    title: 'Pharmacy Law & Ethics',
    description: 'Essential legal requirements, controlled drugs regulations, professional standards, and ethical decision-making frameworks.',
    items: [
      'Medicines Act and regulatory framework',
      'Controlled drugs classifications and requirements',
      'Professional standards and MRCP PACES guidelines',
      'Ethical decision-making models',
      'Data protection and patient confidentiality',
    ],
    stats: '85 pages • 30 scenarios',
    color: 'purple' as const,
    icon: (
      <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    slug: 'pharmaceutics-formulation',
    title: 'Pharmaceutics & Formulation',
    description: 'Drug formulation principles, stability testing, pharmaceutical technology, and quality assurance processes.',
    items: [
      'Dosage form design and development',
      'Stability testing and shelf-life determination',
      'Pharmaceutical excipients and compatibility',
      'Manufacturing processes and quality control',
      'Bioavailability and bioequivalence',
    ],
    stats: '75 pages • 25 examples',
    color: 'orange' as const,
    icon: (
      <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    slug: 'pharmacology-drug-mechanisms',
    title: 'Pharmacology & Drug Mechanisms',
    description: 'Drug mechanisms of action, pharmacokinetics, pharmacodynamics, and adverse effect management strategies.',
    items: [
      'Drug classification and mechanisms of action',
      'Pharmacokinetic principles (ADME)',
      'Pharmacodynamics and dose-response relationships',
      'Drug metabolism and enzyme interactions',
      'Adverse effects and contraindications',
    ],
    stats: '110 pages • 60 drug profiles',
    color: 'red' as const,
    icon: (
      <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    slug: 'public-health-prevention',
    title: 'Public Health & Prevention',
    description: 'Health promotion strategies, screening services, vaccination programs, and disease prevention protocols.',
    items: [
      'Health promotion and education strategies',
      'Screening and prevention programs',
      'Vaccination schedules and contraindications',
      'Lifestyle interventions and counseling',
      'Population health and epidemiology',
    ],
    stats: '65 pages • 20 protocols',
    color: 'teal' as const,
    icon: (
      <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
]

export function StudyGuidesGrid() {
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch('/api/stripe/check-access')
        const data = await response.json()
        setHasAccess(data.hasAccess === true)
      } catch (error) {
        console.error('Failed to check access:', error)
        setHasAccess(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl border bg-white p-8 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-lg bg-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {guides.map((guide) => (
        <StudyGuideCard
          key={guide.slug}
          {...guide}
          hasAccess={hasAccess}
        />
      ))}
    </div>
  )
}
