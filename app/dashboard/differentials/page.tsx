'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import { Differential } from '@/app/types/differentials'
import DifferentialCard from '@/app/components/differentials/DifferentialCard'
import { DashboardLayout } from '@/app/components/dashboard'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DifferentialsPage() {
  const { user, loading: authLoading } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const apiUrl = selectedCategory
    ? `/api/differentials?category=${encodeURIComponent(selectedCategory)}`
    : '/api/differentials'

  const { data, error: fetchError, isLoading } = useSWR(
    user ? apiUrl : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  const differentials: Differential[] = data?.differentials || []
  const categories: string[] = data?.categories || []
  const error = fetchError?.message || data?.error

  const handlePrevious = useCallback(() => {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : differentials.length - 1))
  }, [differentials.length])

  const handleNext = useCallback(() => {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev < differentials.length - 1 ? prev + 1 : 0))
  }, [differentials.length])

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev)
  }, [])

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category)
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious()
    } else if (e.key === 'ArrowRight') {
      handleNext()
    }
  }, [handlePrevious, handleNext])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading differentials...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to access differentials</h2>
          <Link href="/login" className="pill-btn pill-btn-primary">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  const currentDifferential = differentials[currentIndex]

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Differentials' }
      ]}
    >
      <div onKeyDown={handleKeyDown} tabIndex={-1} className="outline-none">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Differential Diagnosis</h1>
          <p className="text-sm text-gray-500">Sign to causes flashcards</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedCategory === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Card Display */}
        {differentials.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No differentials available yet.</p>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="mb-4 flex items-center justify-center gap-4">
              <span className="text-sm text-gray-500">
                {currentIndex + 1} of {differentials.length}
              </span>
              <div className="w-48 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gray-900 h-1.5 rounded-full transition-all"
                  style={{ width: `${((currentIndex + 1) / differentials.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Card */}
            {currentDifferential && (
              <DifferentialCard
                differential={currentDifferential}
                isFlipped={isFlipped}
                onFlip={handleFlip}
              />
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Keyboard hint */}
            <p className="mt-4 text-center text-xs text-gray-400">
              Use arrow keys to navigate, space to flip
            </p>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
