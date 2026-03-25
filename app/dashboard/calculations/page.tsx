'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSubscription } from '@/app/hooks/useSubscription'
import UpgradePrompt from '@/app/components/UpgradePrompt'

interface CalculationCategory {
  id: string
  dbId: string
  name: string
  description: string
  questionCount: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  difficultyCounts: {
    Easy: number
    Medium: number
    Hard: number
  }
}

export default function CalculationsPracticePage() {
  const router = useRouter()
  const { hasAccess, loading, isLoggedIn } = useSubscription()
  const [categories, setCategories] = useState<CalculationCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [totalAvailableQuestions, setTotalAvailableQuestions] = useState(0)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/calculations/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories || [])
          setTotalAvailableQuestions(data.totalQuestions || 0)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Calculate filtered question count
  const getFilteredQuestionCount = () => {
    if (categories.length === 0) return 0

    let total = 0
    const categoriesToCount = selectedCategories.length > 0
      ? categories.filter(c => selectedCategories.includes(c.id))
      : categories

    categoriesToCount.forEach(cat => {
      if (selectedDifficulties.length === 0) {
        total += cat.questionCount
      } else {
        selectedDifficulties.forEach(diff => {
          total += cat.difficultyCounts[diff as keyof typeof cat.difficultyCounts] || 0
        })
      }
    })

    return total
  }

  const filteredQuestionCount = getFilteredQuestionCount()

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleDifficultyToggle = (difficulty: string) => {
    setSelectedDifficulties(prev => {
      if (prev.includes(difficulty)) {
        return prev.filter(d => d !== difficulty)
      } else {
        return [...prev, difficulty]
      }
    })
  }

  const handleSelectAllCategories = () => {
    setSelectedCategories(categories.map(cat => cat.id))
  }

  const handleClearAllCategories = () => {
    setSelectedCategories([])
  }

  const handleStartPractice = () => {
    if (!hasAccess) {
      setShowUpgradePrompt(true)
      return
    }

    // Build query params for practice session
    const params = new URLSearchParams()
    params.set('type', 'calculation')

    if (selectedCategories.length > 0) {
      const dbIds = categories
        .filter(c => selectedCategories.includes(c.id))
        .map(c => c.dbId)
      params.set('categories', dbIds.join(','))
    }

    if (selectedDifficulties.length > 0) {
      params.set('difficulties', selectedDifficulties.join(','))
    }

    router.push(`/dashboard/question-bank/practice?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to access calculations practice</h2>
          <Link href="/login" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        isLoggedIn={isLoggedIn}
      />
    <div className="min-h-screen bg-[#fbfaf4]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-900">Calculations Practice</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filter Sidebar - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Practice Filters</h2>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Difficulty Level</h3>
                <div className="space-y-2">
                  {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                    <label key={difficulty} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDifficulties.includes(difficulty)}
                        onChange={() => handleDifficultyToggle(difficulty)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-900">{difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
                  <span className="text-xs text-gray-500">
                    {selectedCategories.length} of {categories.length} selected
                  </span>
                </div>

                {categoriesLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full mx-auto"></div>
                  </div>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No calculation categories available yet</p>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryToggle(category.id)}
                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-900">{category.name}</span>
                              <span className="text-xs text-gray-500">{category.questionCount} questions</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Filter Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleSelectAllCategories}
                        className="flex-1 py-2 text-center text-xs font-medium text-gray-900 hover:bg-gray-50 rounded border border-gray-300 transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        onClick={handleClearAllCategories}
                        className="flex-1 py-2 text-center text-xs font-medium text-gray-900 hover:bg-gray-50 rounded border border-gray-300 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Practice Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Practice Summary</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Available Questions:</span>
                    <span className="font-medium">{filteredQuestionCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-medium">{selectedCategories.length || categories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Time:</span>
                    <span className="font-medium">{Math.ceil(Math.min(filteredQuestionCount, 50) * 2.5)} min</span>
                  </div>
                </div>

                <button
                  onClick={handleStartPractice}
                  disabled={filteredQuestionCount === 0}
                  className="w-full mt-4 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {!hasAccess && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  Start Practice Session
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Right Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-semibold text-gray-900">Pharmaceutical Calculations Practice</h1>
                <span className="text-sm text-gray-500">{totalAvailableQuestions} total questions</span>
              </div>
              <p className="text-gray-600 mb-6">
                Master the most challenging part of the GPhC exam with step-by-step calculation practice.
              </p>

              {/* Category Overview */}
              {categoriesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-4 text-gray-600">No calculation questions available yet</p>
                  <p className="text-sm text-gray-500 mt-2">Check back soon as we add more content</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2 mb-6">
                    {categories
                      .filter(cat => {
                        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(cat.id)
                        const difficultyMatch = selectedDifficulties.length === 0 ||
                          selectedDifficulties.some(d => cat.difficultyCounts[d as keyof typeof cat.difficultyCounts] > 0)
                        return categoryMatch && difficultyMatch
                      })
                      .map((category) => (
                        <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              category.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                              category.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {category.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{category.description || 'Practice calculation questions'}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{category.questionCount} questions</span>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id)}
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                              />
                              <span className="ml-2 text-sm text-gray-700">Include</span>
                            </label>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Quick Start Options */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Options</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <button
                        onClick={() => {
                          setSelectedCategories([])
                          setSelectedDifficulties(['Easy', 'Medium'])
                        }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">Standard Practice</h4>
                        <p className="text-sm text-gray-600">Easy & Medium questions</p>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCategories([])
                          setSelectedDifficulties(['Easy'])
                        }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">Quick Review</h4>
                        <p className="text-sm text-gray-600">Easy questions only</p>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCategories([])
                          setSelectedDifficulties(['Hard'])
                        }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">Challenge Mode</h4>
                        <p className="text-sm text-gray-600">Hard questions only</p>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
