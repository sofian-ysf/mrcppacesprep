'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SBACategory } from '@/app/types/sba'
import { useSubscription } from '@/app/hooks/useSubscription'
import UpgradePrompt from '@/app/components/UpgradePrompt'
import { getSmartPracticeRecommendation, getWeakCategories, type CategoryPerformance, type SmartPracticeRecommendation } from '@/app/lib/adaptive/prioritizer'
import { DashboardLayout } from '@/app/components/dashboard'

export default function SBAPracticePage() {
  const { hasAccess, loading, isLoggedIn } = useSubscription()
  const router = useRouter()
  const [categories, setCategories] = useState<SBACategory[]>([])
  const [totalQuestionCount, setTotalQuestionCount] = useState(0)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>([])
  const [smartPracticeRecommendation, setSmartPracticeRecommendation] = useState<SmartPracticeRecommendation | null>(null)
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([])
  const [totalQuestionsCompleted, setTotalQuestionsCompleted] = useState(0)
  const [dueForReviewCount, setDueForReviewCount] = useState(0)

  // Fetch categories and bookmarks on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/sba/categories')
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data = await res.json()
        setCategories(data.categories || [])
        setTotalQuestionCount(data.total || 0)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setCategoryError('Failed to load categories')
      } finally {
        setLoadingCategories(false)
      }
    }

    async function fetchBookmarks() {
      try {
        const res = await fetch('/api/sba/bookmark')
        if (res.ok) {
          const data = await res.json()
          setBookmarkCount(data.count || 0)
          setBookmarkedQuestionIds(data.bookmarks?.map((b: { question_id: string }) => b.question_id) || [])
        }
      } catch (err) {
        console.error('Error fetching bookmarks:', err)
      }
    }

    async function fetchUserProgress() {
      try {
        const res = await fetch('/api/user/progress')
        if (res.ok) {
          const data = await res.json()
          setTotalQuestionsCompleted(data.overall?.totalAnswered || 0)

          // Convert category progress to CategoryPerformance format
          if (data.byCategory && Array.isArray(data.byCategory)) {
            const performance: CategoryPerformance[] = data.byCategory.map((cat: {
              id: string
              name: string
              slug: string
              total: number
              correct: number
              accuracy: number
            }) => ({
              categoryId: cat.id,
              categoryName: cat.name,
              categorySlug: cat.slug,
              totalAttempted: cat.total,
              totalCorrect: cat.correct,
              accuracy: cat.accuracy,
              lastAttemptedAt: null,
              averageTimeSeconds: 0
            }))
            setCategoryPerformance(performance)

            // Generate smart practice recommendation
            const recommendation = getSmartPracticeRecommendation(
              performance,
              data.overall?.accuracy || 0,
              data.overall?.totalAnswered || 0
            )
            setSmartPracticeRecommendation(recommendation)
          }
        }
      } catch (err) {
        console.error('Error fetching user progress:', err)
      }
    }

    async function fetchDueQuestions() {
      try {
        const res = await fetch('/api/sba/due')
        if (res.ok) {
          const data = await res.json()
          setDueForReviewCount(data.dueCount || 0)
        }
      } catch (err) {
        console.error('Error fetching due questions:', err)
      }
    }

    fetchCategories()
    fetchBookmarks()
    fetchUserProgress()
    fetchDueQuestions()
  }, [])

  // Calculate total questions based on filters
  const getFilteredQuestionCount = () => {
    const categoriesToCount = selectedCategories.length > 0
      ? categories.filter(c => selectedCategories.includes(c.id))
      : categories

    let total = 0
    categoriesToCount.forEach(cat => {
      if (selectedDifficulties.length === 0) {
        total += cat.question_count
      } else {
        selectedDifficulties.forEach(diff => {
          total += cat.difficulty_counts?.[diff as keyof typeof cat.difficulty_counts] || 0
        })
      }
    })

    return total
  }

  const totalQuestions = getFilteredQuestionCount()

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

    const params = new URLSearchParams()

    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','))
    }
    if (selectedDifficulties.length > 0) {
      params.set('difficulties', selectedDifficulties.join(','))
    }
    if (showBookmarkedOnly && bookmarkedQuestionIds.length > 0) {
      params.set('bookmarked', 'true')
      params.set('question_ids', bookmarkedQuestionIds.join(','))
    }

    router.push(`/dashboard/sba/practice?${params.toString()}`)
  }

  const handleStartSmartPractice = () => {
    if (!hasAccess) {
      setShowUpgradePrompt(true)
      return
    }

    const params = new URLSearchParams()
    params.set('smart', 'true')
    params.set('random', 'true')

    const weakCats = getWeakCategories(categoryPerformance)
    if (weakCats.length > 0) {
      params.set('categories', weakCats.slice(0, 3).map(c => c.categoryId).join(','))
    }

    const limit = smartPracticeRecommendation?.recommendedQuestionCount || 20
    params.set('limit', limit.toString())

    router.push(`/dashboard/sba/practice?${params.toString()}`)
  }

  const handleStartDueReview = () => {
    if (!hasAccess) {
      setShowUpgradePrompt(true)
      return
    }

    const params = new URLSearchParams()
    params.set('due', 'true')
    params.set('limit', '20')

    router.push(`/dashboard/sba/practice?${params.toString()}`)
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to access SBA questions</h2>
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
      <DashboardLayout
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'SBA Questions' }
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filter Sidebar - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Practice Filters</h2>

              {/* Due for Review Filter */}
              {dueForReviewCount > 0 && (
                <div className="mb-4">
                  <button
                    onClick={handleStartDueReview}
                    className="w-full flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-orange-800">Due for Review</span>
                        <span className="text-xs px-2 py-0.5 bg-orange-200 text-orange-800 rounded-full">{dueForReviewCount}</span>
                      </div>
                      <p className="text-xs text-orange-700 mt-0.5">Questions ready for spaced repetition review</p>
                    </div>
                    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Bookmarked Filter */}
              {bookmarkCount > 0 && (
                <div className="mb-6">
                  <label className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={showBookmarkedOnly}
                      onChange={(e) => setShowBookmarkedOnly(e.target.checked)}
                      className="w-4 h-4 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span className="text-sm font-medium text-yellow-800">Bookmarked Only</span>
                      </div>
                      <p className="text-xs text-yellow-700 mt-0.5">{bookmarkCount} bookmarked questions</p>
                    </div>
                  </label>
                </div>
              )}

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

                {loadingCategories ? (
                  <div className="text-center py-4">
                    <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-black rounded-full mx-auto"></div>
                  </div>
                ) : categoryError ? (
                  <div className="text-red-500 text-sm py-2">{categoryError}</div>
                ) : (
                  <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
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
                            <span className="text-xs text-gray-500">{category.question_count} questions</span>
                          </div>
                          {category.description && (
                            <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

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
              </div>

            </div>
          </div>

          {/* Main Content - Right Side */}
          <div className="lg:col-span-2">
            {/* Practice Summary - Top of page for easy access */}
            <div className="bg-black text-white rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <span className="text-xs text-gray-400 uppercase">Questions</span>
                    <p className="text-lg font-bold">{totalQuestions}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase">Type</span>
                    <p className="text-lg font-bold">SBA</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase">Categories</span>
                    <p className="text-lg font-bold">{selectedCategories.length || categories.length}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase">Est. Time</span>
                    <p className="text-lg font-bold">{Math.ceil(totalQuestions * 1.5)}m</p>
                  </div>
                </div>
                <button
                  onClick={handleStartPractice}
                  disabled={totalQuestions === 0}
                  className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {!hasAccess && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Practice
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                MRCP PACES SBA Questions
              </h1>
              <p className="text-gray-600 mb-6">
                Practice Single Best Answer questions covering all MRCP PACES clinical examination topics.
              </p>

              {/* Category Overview */}
              {loadingCategories ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full"></div>
                </div>
              ) : categoryError ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{categoryError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Try again
                  </button>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No questions available yet.</p>
                  <p className="text-sm text-gray-400 mt-2">Check back soon for new practice questions.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  {categories
                    .filter(cat => {
                      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(cat.id)
                      const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(cat.difficulty_default)
                      return categoryMatch && difficultyMatch
                    })
                    .map((category) => (
                      <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            category.difficulty_default === 'Easy' ? 'bg-green-100 text-green-800' :
                            category.difficulty_default === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {category.difficulty_default}
                          </span>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{category.question_count} questions</span>
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
              )}

              {/* Smart Practice Section */}
              {totalQuestionsCompleted > 0 && smartPracticeRecommendation && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Practice</h3>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-gray-900">Personalized for You</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {smartPracticeRecommendation.focusMessage}
                        </p>
                        {smartPracticeRecommendation.focusCategory && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              smartPracticeRecommendation.focusCategory.accuracy < 50
                                ? 'bg-red-100 text-red-700'
                                : smartPracticeRecommendation.focusCategory.accuracy < 70
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {smartPracticeRecommendation.focusCategory.categoryName}: {smartPracticeRecommendation.focusCategory.accuracy}%
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          {smartPracticeRecommendation.recommendedQuestionCount} questions tailored to your weak areas
                        </p>
                      </div>
                      <button
                        onClick={handleStartSmartPractice}
                        className="ml-4 px-6 py-2.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Start Smart Practice
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Start Options */}
              {categories.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Options</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <button
                      onClick={() => {
                        setSelectedCategories([])
                        setSelectedDifficulties(['Easy'])
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">Easy Practice</h4>
                      <p className="text-sm text-gray-600">Start with easier questions</p>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCategories([])
                        setSelectedDifficulties(['Medium', 'Hard'])
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">Challenge Mode</h4>
                      <p className="text-sm text-gray-600">Medium and hard questions</p>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCategories(categories.map(cat => cat.id))
                        setSelectedDifficulties([])
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">Full Review</h4>
                      <p className="text-sm text-gray-600">All categories and difficulties</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
