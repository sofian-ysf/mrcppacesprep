'use client'

import { useEffect, useState } from 'react'
import { StudyGuideCard } from './StudyGuideCard'

const guides = [
  {
    slug: 'cardiovascular-examination',
    title: 'Cardiovascular Examination',
    description: 'Complete guide to cardiovascular examination with systematic approach, common findings, and presentation techniques.',
    items: [
      'Systematic examination sequence',
      'Heart sounds and murmur recognition',
      'JVP assessment and interpretation',
      'Peripheral vascular examination',
      'Common PACES cardiovascular cases',
    ],
    stats: '120 pages • 50 clinical cases',
    color: 'red' as const,
    icon: (
      <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    slug: 'respiratory-examination',
    title: 'Respiratory Examination',
    description: 'Comprehensive respiratory examination guide including chest inspection, percussion, auscultation, and common pathologies.',
    items: [
      'Inspection and palpation techniques',
      'Percussion patterns and findings',
      'Breath sounds and added sounds',
      'Spirometry interpretation basics',
      'Common PACES respiratory cases',
    ],
    stats: '95 pages • 40 case studies',
    color: 'blue' as const,
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    slug: 'neurological-examination',
    title: 'Neurological Examination',
    description: 'Essential neurological examination skills including cranial nerves, peripheral nerves, and common neurological presentations.',
    items: [
      'Cranial nerve examination (I-XII)',
      'Upper and lower limb examination',
      'Cerebellar examination',
      'Sensory examination techniques',
      'Common PACES neurological cases',
    ],
    stats: '130 pages • 60 scenarios',
    color: 'purple' as const,
    icon: (
      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    slug: 'history-taking',
    title: 'History Taking Skills',
    description: 'Structured approach to history taking with frameworks for common presentations and patient-centred techniques.',
    items: [
      'Calgary-Cambridge framework',
      'Systematic history structure',
      'Red flag symptoms by system',
      'Psychosocial history and ICE',
      'Common PACES history scenarios',
    ],
    stats: '85 pages • 45 scenarios',
    color: 'green' as const,
    icon: (
      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    slug: 'communication-skills',
    title: 'Communication & Ethics',
    description: 'Communication frameworks for difficult conversations, breaking bad news, and ethical decision-making in clinical practice.',
    items: [
      'SPIKES protocol for bad news',
      'Consent and capacity assessment',
      'Ethical frameworks (4 principles)',
      'Dealing with complaints',
      'Common PACES Station 4 scenarios',
    ],
    stats: '75 pages • 35 scenarios',
    color: 'orange' as const,
    icon: (
      <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
  {
    slug: 'abdominal-examination',
    title: 'Abdominal Examination',
    description: 'Systematic abdominal examination guide including hepatomegaly, splenomegaly, masses, and common gastrointestinal cases.',
    items: [
      'Inspection and surface anatomy',
      'Palpation techniques (superficial/deep)',
      'Liver and spleen assessment',
      'Ascites and organomegaly',
      'Common PACES abdominal cases',
    ],
    stats: '90 pages • 40 cases',
    color: 'teal' as const,
    icon: (
      <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
