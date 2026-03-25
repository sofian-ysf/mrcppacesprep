'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { QuestionCategory } from '@/app/types/questions'
import { useSubscription } from '@/app/hooks/useSubscription'
import UpgradePrompt from '@/app/components/UpgradePrompt'
import TrialBanner from '@/app/components/TrialBanner'
import { getSmartPracticeRecommendation, getWeakCategories, type CategoryPerformance, type SmartPracticeRecommendation } from '@/app/lib/adaptive/prioritizer'
import { DashboardLayout } from '@/app/components/dashboard'

type BankType = 'clinical' | 'calculation'

export default function QuestionBankPracticePage() {
  const { hasAccess, loading, isLoggedIn, isOnTrial, trial } = useSubscription()
  const router = useRouter()
  const [categories, setCategories] = useState<QuestionCategory[]>([])
  const [totals, setTotals] = useState<{ all: number; clinical: number; calculation: number }>({ all: 0, clinical: 0, calculation: 0 })
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [questionType, setQuestionType] = useState<string>('all')
  const [bankType, setBankType] = useState<BankType>('clinical')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>([])
  const [smartPracticeRecommendation, setSmartPracticeRecommendation] = useState<SmartPracticeRecommendation | null>(null)
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([])
  const [userOverallAccuracy, setUserOverallAccuracy] = useState(0)
  const [totalQuestionsCompleted, setTotalQuestionsCompleted] = useState(0)
  const [dueForReviewCount, setDueForReviewCount] = useState(0)
  const [showDueForReview, setShowDueForReview] = useState(false)

  // Fetch categories and bookmarks on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/questions/categories')
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data = await res.json()
        setCategories(data.categories || [])
        setTotals(data.totals || { all: 0, clinical: 0, calculation: 0 })
      } catch (err) {
        console.error('Error fetching categories:', err)
        setCategoryError('Failed to load categories')
      } finally {
        setLoadingCategories(false)
      }
    }

    async function fetchBookmarks() {
      try {
        const res = await fetch('/api/questions/bookmark')
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
          setUserOverallAccuracy(data.overall?.accuracy || 0)
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
        const res = await fetch('/api/questions/due')
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

  // Filter categories based on bank type
  const clinicalCategories = categories.filter(cat => cat.question_type === 'clinical')
  const calculationCategories = categories.filter(cat => cat.question_type === 'calculation')
  const activeCategories = bankType === 'clinical' ? clinicalCategories : calculationCategories

  // Reset selections when switching bank type
  useEffect(() => {
    setSelectedCategories([])
    setSelectedDifficulties([])
    setQuestionType(bankType === 'calculation' ? 'calculation' : 'all')
  }, [bankType])

  // Calculate total questions based on filters with actual difficulty counts
  const getFilteredQuestionCount = () => {
    const categoriesToCount = selectedCategories.length > 0
      ? activeCategories.filter(c => selectedCategories.includes(c.id))
      : activeCategories

    let total = 0
    categoriesToCount.forEach(cat => {
      if (selectedDifficulties.length === 0) {
        // No difficulty filter - count all questions in category
        if (questionType === 'all' || bankType === 'calculation') {
          total += cat.question_count
        } else if (questionType === 'sba') {
          total += cat.type_counts?.sba || 0
        } else if (questionType === 'emq') {
          total += cat.type_counts?.emq || 0
        }
      } else {
        // Filter by selected difficulties
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
    setSelectedCategories(activeCategories.map(cat => cat.id))
  }

  const handleClearAllCategories = () => {
    setSelectedCategories([])
  }

  const handleStartPractice = () => {
    // Check if user has access
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
    if (questionType !== 'all') {
      params.set('type', questionType)
    }
    if (showBookmarkedOnly && bookmarkedQuestionIds.length > 0) {
      params.set('bookmarked', 'true')
      params.set('question_ids', bookmarkedQuestionIds.join(','))
    }

    router.push(`/dashboard/question-bank/practice?${params.toString()}`)
  }

  const handleStartSmartPractice = () => {
    if (!hasAccess) {
      setShowUpgradePrompt(true)
      return
    }

    const params = new URLSearchParams()
    params.set('smart', 'true')
    params.set('random', 'true')

    // Get weak categories for the current bank type
    const relevantPerformance = categoryPerformance.filter(cp => {
      const category = categories.find(c => c.id === cp.categoryId)
      return category?.question_type === bankType
    })

    const weakCats = getWeakCategories(relevantPerformance)
    if (weakCats.length > 0) {
      params.set('categories', weakCats.slice(0, 3).map(c => c.categoryId).join(','))
    }

    // Set appropriate limit based on recommendation
    const limit = smartPracticeRecommendation?.recommendedQuestionCount || 20
    params.set('limit', limit.toString())

    router.push(`/dashboard/question-bank/practice?${params.toString()}`)
  }

  const handleStartDueReview = () => {
    if (!hasAccess) {
      setShowUpgradePrompt(true)
      return
    }

    const params = new URLSearchParams()
    params.set('due', 'true')
    params.set('limit', '20')

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
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to access question bank</h2>
          <Link href="/login" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  // Determine upgrade reason based on context
  const getUpgradeReason = (): 'trial_exhausted' | 'trial_expired' | 'calculation_blocked' | 'general' => {
    if (trial?.isExhausted) return 'trial_exhausted'
    if (trial?.isExpired) return 'trial_expired'
    if (isOnTrial && bankType === 'calculation') return 'calculation_blocked'
    return 'general'
  }

  return (
    <>
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        isLoggedIn={isLoggedIn}
        trial={trial}
        reason={getUpgradeReason()}
      />
      <DashboardLayout
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Question Bank' }
        ]}
        tabs={[
          {
            label: `Clinical Questions`,
            value: 'clinical',
            onClick: () => setBankType('clinical'),
            badge: String(totals.clinical)
          },
          {
            label: `Calculation Questions`,
            value: 'calculation',
            onClick: () => {
              if (isOnTrial) {
                setShowUpgradePrompt(true)
              } else {
                setBankType('calculation')
              }
            },
            badge: String(totals.calculation),
            locked: isOnTrial
          }
        ]}
        activeTab={bankType}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filter Sidebar - Left Side */}
          <div className="lg:col-span-1">
            {/* Trial Status Card */}
            {isOnTrial && trial && (
              <div className="mb-6">
                <TrialBanner
                  questionsUsed={trial.questionsUsed}
                  questionsRemaining={trial.questionsRemaining}
                  daysRemaining={trial.daysRemaining}
                  onUpgrade={() => setShowUpgradePrompt(true)}
                />
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Practice Filters</h2>

              {/* Question Type Filter - Only show for clinical */}
              {bankType === 'clinical' && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Question Type</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="questionType"
                        value="all"
                        checked={questionType === 'all'}
                        onChange={(e) => setQuestionType(e.target.value)}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-900">All Question Types</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="questionType"
                        value="sba"
                        checked={questionType === 'sba'}
                        onChange={(e) => setQuestionType(e.target.value)}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-900">Single Best Answer (SBA)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="questionType"
                        value="emq"
                        checked={questionType === 'emq'}
                        onChange={(e) => setQuestionType(e.target.value)}
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-900">Extended Matching (EMQ)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Calculation type indicator */}
              {bankType === 'calculation' && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Calculation questions require you to work out numerical answers. Show your working and include units.
                  </p>
                </div>
              )}

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
                    {selectedCategories.length} of {activeCategories.length} selected
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
                    {activeCategories.map((category) => (
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
                    <p className="text-lg font-bold">{bankType === 'calculation' ? 'CALC' : questionType.toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase">Categories</span>
                    <p className="text-lg font-bold">{selectedCategories.length || activeCategories.length}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase">Est. Time</span>
                    <p className="text-lg font-bold">
                      {bankType === 'calculation'
                        ? `${Math.ceil(totalQuestions * 2.5)}m`
                        : `${Math.ceil(totalQuestions * 1.5)}m`
                      }
                    </p>
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
                {bankType === 'clinical' ? 'Clinical Knowledge Question Bank' : 'Pharmaceutical Calculations'}
              </h1>
              <p className="text-gray-600 mb-6">
                {bankType === 'clinical'
                  ? 'Practice with comprehensive questions covering all areas of clinical pharmacy and MRCP PACES framework topics.'
                  : 'Master essential pharmacy calculations including dosage, concentrations, IV flow rates, and more.'
                }
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
              ) : activeCategories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No questions available yet.</p>
                  <p className="text-sm text-gray-400 mt-2">Check back soon for new practice questions.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  {activeCategories
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
              {activeCategories.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Options</h3>
                  {bankType === 'clinical' ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      <button
                        onClick={() => {
                          const coreClinical = clinicalCategories
                            .filter(cat => ['clinical-pharmacy', 'pharmacology', 'law-ethics'].includes(cat.slug))
                            .map(cat => cat.id)
                          setSelectedCategories(coreClinical)
                          setSelectedDifficulties(['Medium', 'Hard'])
                          setQuestionType('sba')
                        }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">Core Clinical</h4>
                        <p className="text-sm text-gray-600">Essential clinical topics (SBA)</p>
                      </button>

                      <button
                        onClick={() => {
                          const systemFocus = clinicalCategories
                            .filter(cat => ['cardiovascular', 'respiratory', 'endocrine'].includes(cat.slug))
                            .map(cat => cat.id)
                          setSelectedCategories(systemFocus)
                          setSelectedDifficulties(['Easy', 'Medium'])
                          setQuestionType('all')
                        }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">System Focus</h4>
                        <p className="text-sm text-gray-600">Body systems practice</p>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCategories(clinicalCategories.map(cat => cat.id))
                          setSelectedDifficulties(['Hard'])
                          setQuestionType('emq')
                        }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">Challenge EMQs</h4>
                        <p className="text-sm text-gray-600">Advanced matching questions</p>
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                      <button
                        onClick={() => {
                          const dosage = calculationCategories
                            .filter(cat => ['dosage', 'unit-conversions'].includes(cat.slug))
                            .map(cat => cat.id)
                          setSelectedCategories(dosage)
                          setSelectedDifficulties(['Easy', 'Medium'])
                        }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">Dosage Basics</h4>
                        <p className="text-sm text-gray-600">Dosage & unit conversions</p>
                      </button>

                      <button
                        onClick={() => {
                          const ivCalcs = calculationCategories
                            .filter(cat => ['iv-flows', 'concentrations'].includes(cat.slug))
                            .map(cat => cat.id)
                          setSelectedCategories(ivCalcs)
                          setSelectedDifficulties(['Medium', 'Hard'])
                        }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">IV & Concentrations</h4>
                        <p className="text-sm text-gray-600">IV flow rates & dilutions</p>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCategories(calculationCategories.map(cat => cat.id))
                          setSelectedDifficulties(['Hard'])
                        }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">Advanced Challenge</h4>
                        <p className="text-sm text-gray-600">All hard calculation questions</p>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
