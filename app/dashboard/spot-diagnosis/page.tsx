'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import { DashboardLayout } from '@/app/components/dashboard'
import SpotDiagnosisCard from '@/app/components/spot-diagnosis/SpotDiagnosisCard'
import StudyModeSelector from '@/app/components/spot-diagnosis/StudyModeSelector'
import { SpotDiagnosis, StudyMode } from '@/app/types/spot-diagnosis'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SpotDiagnosisPage() {
  const { user, loading: authLoading } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [studyMode, setStudyMode] = useState<StudyMode>('classic')
  const [difficulty, setDifficulty] = useState<string | null>(null)

  const queryParams = new URLSearchParams()
  if (difficulty) queryParams.set('difficulty', difficulty)
  const queryString = queryParams.toString()

  const { data, error, isLoading } = useSWR(
    user ? `/api/spot-diagnosis${queryString ? `?${queryString}` : ''}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  const spotDiagnoses: SpotDiagnosis[] = data?.spotDiagnoses || []
  const currentCard = spotDiagnoses[currentIndex]

  const handleNext = () => {
    if (currentIndex < spotDiagnoses.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Loop back to start
      setCurrentIndex(0)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleModeChange = (mode: StudyMode) => {
    setStudyMode(mode)
    setCurrentIndex(0)
  }

  const handleDifficultyChange = (diff: string | null) => {
    setDifficulty(diff)
    setCurrentIndex(0)
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading spot diagnoses...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to access Spot Diagnosis</h2>
          <Link href="/login" className="pill-btn pill-btn-primary">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Spot Diagnosis' },
      ]}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Spot Diagnosis</h1>
        <p className="text-sm text-gray-500">Test your visual diagnosis skills</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <StudyModeSelector currentMode={studyMode} onModeChange={handleModeChange} />

        {/* Difficulty filter */}
        <div className="flex gap-2">
          <button
            onClick={() => handleDifficultyChange(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              difficulty === null
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            All
          </button>
          {['Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                difficulty === diff
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error.message || 'Failed to load spot diagnoses'}
        </div>
      )}

      {/* Card display */}
      {spotDiagnoses.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No spot diagnoses available yet.</p>
        </div>
      ) : currentCard ? (
        <div>
          {/* Progress indicator */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">{currentIndex + 1}</span> of{' '}
              <span className="font-medium text-gray-900">{spotDiagnoses.length}</span>
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Card */}
          <SpotDiagnosisCard
            card={currentCard}
            mode={studyMode}
            allCards={spotDiagnoses}
            onNext={handleNext}
          />

          {/* Progress bar */}
          <div className="mt-6 w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / spotDiagnoses.length) * 100}%` }}
            />
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  )
}
