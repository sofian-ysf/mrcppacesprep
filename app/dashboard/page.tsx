'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { useSubscription } from '@/app/hooks/useSubscription'
import { useEffect, useState } from 'react'
import { calculateReadiness, getDaysUntilExam, formatDaysUntilExam, getUrgencyColor } from '@/app/lib/readiness/calculator'
import { type Recommendation, getRecommendationColor } from '@/app/lib/recommendations/engine'
import { DailyCheckin, TrialProgressCard, TrialAchievements } from '@/app/components/trial'
import { DashboardLayout } from '@/app/components/dashboard'

interface UserStats {
  questionsCompleted: number
  correctAnswers: number
  averageScore: number
  studyTimeMinutes: number
  mockExamsCompleted: number
  totalQuestions: number
}

interface CategoryProgress {
  name: string
  slug: string
  attempted: number
  correct: number
  accuracy: number
}

interface PartProgress {
  questionsCompleted: number
  totalQuestions: number
  accuracy: number
  progressPercentage: number
}

interface UserSettings {
  exam_date: string | null
  daily_question_goal: number
  daily_flashcard_goal: number
  weekly_mock_exam_goal: number
}

interface DailyProgress {
  questionsToday: number
  flashcardsToday: number
  mockExamsThisWeek: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const { accessType, isOnTrial, trial } = useSubscription()
  const [managingSubscription, setManagingSubscription] = useState(false)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [trialOnboardingChecked, setTrialOnboardingChecked] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    questionsCompleted: 0,
    correctAnswers: 0,
    averageScore: 0,
    studyTimeMinutes: 0,
    mockExamsCompleted: 0,
    totalQuestions: 0
  })
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([])
  const [part1Progress, setPart1Progress] = useState<PartProgress>({
    questionsCompleted: 0,
    totalQuestions: 0,
    accuracy: 0,
    progressPercentage: 0
  })
  const [part2Progress, setPart2Progress] = useState<PartProgress>({
    questionsCompleted: 0,
    totalQuestions: 0,
    accuracy: 0,
    progressPercentage: 0
  })
  const [userSettings, setUserSettings] = useState<UserSettings>({
    exam_date: null,
    daily_question_goal: 20,
    daily_flashcard_goal: 50,
    weekly_mock_exam_goal: 2
  })
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({
    questionsToday: 0,
    flashcardsToday: 0,
    mockExamsThisWeek: 0
  })
  const [flashcardStats, setFlashcardStats] = useState({
    totalCards: 0,
    cardsMastered: 0,
    streakDays: 0,
    reviewsToday: 0
  })
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  useEffect(() => {
    if (user) {
      fetchAllData()
    }
  }, [user])

  // Check trial onboarding status and redirect if needed
  useEffect(() => {
    const checkTrialOnboarding = async () => {
      if (!isOnTrial || !user || trialOnboardingChecked) return

      try {
        const res = await fetch('/api/trial/onboarding')
        if (res.ok) {
          const data = await res.json()
          if (!data.onboarding_completed) {
            router.push('/dashboard/trial-welcome')
            return
          }
        }
      } catch (error) {
        console.error('Error checking trial onboarding:', error)
      }
      setTrialOnboardingChecked(true)
    }

    checkTrialOnboarding()
  }, [isOnTrial, user, router, trialOnboardingChecked])

  const fetchAllData = async () => {
    setStatsLoading(true)
    try {
      // Fetch all data in parallel
      const [progressRes, mockExamsRes, categoriesRes, settingsRes, flashcardProgressRes] = await Promise.all([
        fetch('/api/user/progress'),
        fetch('/api/mock-exams/results'),
        fetch('/api/questions/categories'),
        fetch('/api/user/settings'),
        fetch('/api/flashcards/progress')
      ])

      // Process user progress
      if (progressRes.ok) {
        const progressData = await progressRes.json()

        // Set overall stats
        setUserStats(prev => ({
          ...prev,
          questionsCompleted: progressData.overall?.totalAnswered || 0,
          correctAnswers: progressData.overall?.correctAnswers || 0,
          averageScore: progressData.overall?.accuracy || 0,
          studyTimeMinutes: Math.round((progressData.overall?.totalTimeSeconds || 0) / 60)
        }))

        // Set category progress
        if (progressData.byCategory) {
          setCategoryProgress(progressData.byCategory.map((cat: any) => ({
            name: cat.name,
            slug: cat.slug,
            attempted: cat.total,
            correct: cat.correct,
            accuracy: cat.accuracy
          })))
        }

        // Calculate Part 1 (calculations) and Part 2 (clinical) progress
        const calculationStats = progressData.byType?.calculation || { total: 0, correct: 0, accuracy: 0 }
        const sbaStats = progressData.byType?.sba || { total: 0, correct: 0, accuracy: 0 }
        const emqStats = progressData.byType?.emq || { total: 0, correct: 0, accuracy: 0 }

        setPart1Progress(prev => ({
          ...prev,
          questionsCompleted: calculationStats.total,
          accuracy: calculationStats.accuracy
        }))

        setPart2Progress(prev => ({
          ...prev,
          questionsCompleted: sbaStats.total + emqStats.total,
          accuracy: (sbaStats.total + emqStats.total) > 0
            ? Math.round(((sbaStats.correct + emqStats.correct) / (sbaStats.total + emqStats.total)) * 100)
            : 0
        }))
      }

      // Process mock exams
      if (mockExamsRes.ok) {
        const mockExamsData = await mockExamsRes.json()
        setUserStats(prev => ({
          ...prev,
          mockExamsCompleted: mockExamsData.summary?.totalExams || 0
        }))
      }

      // Process categories for total questions
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        const totals = categoriesData.totals || { all: 0, clinical: 0, calculation: 0 }

        setUserStats(prev => ({
          ...prev,
          totalQuestions: totals.all
        }))

        setPart1Progress(prev => ({
          ...prev,
          totalQuestions: totals.calculation,
          progressPercentage: totals.calculation > 0
            ? Math.min(100, Math.round((prev.questionsCompleted / totals.calculation) * 100))
            : 0
        }))

        setPart2Progress(prev => ({
          ...prev,
          totalQuestions: totals.clinical,
          progressPercentage: totals.clinical > 0
            ? Math.min(100, Math.round((prev.questionsCompleted / totals.clinical) * 100))
            : 0
        }))
      }

      // Process user settings
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        if (settingsData.settings) {
          setUserSettings({
            exam_date: settingsData.settings.exam_date,
            daily_question_goal: settingsData.settings.daily_question_goal || 20,
            daily_flashcard_goal: settingsData.settings.daily_flashcard_goal || 50,
            weekly_mock_exam_goal: settingsData.settings.weekly_mock_exam_goal || 2
          })
        }
      }

      // Process flashcard progress
      if (flashcardProgressRes.ok) {
        const flashcardData = await flashcardProgressRes.json()
        setFlashcardStats({
          totalCards: flashcardData.totalCards || 0,
          cardsMastered: flashcardData.cardsStudied || 0,
          streakDays: flashcardData.streakDays || 0,
          reviewsToday: flashcardData.reviewsToday || 0
        })
        setDailyProgress(prev => ({
          ...prev,
          flashcardsToday: flashcardData.reviewsToday || 0
        }))
      }

      // Fetch recommendations
      try {
        const recommendationsRes = await fetch('/api/user/recommendations')
        if (recommendationsRes.ok) {
          const recommendationsData = await recommendationsRes.json()
          setRecommendations(recommendationsData.recommendations || [])
        }
      } catch (recErr) {
        console.error('Error fetching recommendations:', recErr)
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  // Calculate readiness score
  const daysUntilExam = userSettings.exam_date ? getDaysUntilExam(userSettings.exam_date) : null

  const readinessData = calculateReadiness({
    questionsCompleted: userStats.questionsCompleted,
    totalQuestions: userStats.totalQuestions,
    overallAccuracy: userStats.averageScore,
    categoryAccuracies: categoryProgress.map(c => ({ name: c.name, accuracy: c.accuracy })),
    flashcardsMastered: flashcardStats.cardsMastered,
    totalFlashcards: flashcardStats.totalCards,
    mockExamsCompleted: userStats.mockExamsCompleted,
    latestMockScore: null,
    averageMockScore: null,
    currentStreak: flashcardStats.streakDays,
    daysUntilExam
  })

  const formatStudyTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to access your dashboard</h2>
          <Link href="/login" className="pill-btn pill-btn-primary">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      {/* Welcome Section with Start Questions CTA */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}
            </h1>
            <p className="text-gray-600">
              Track your progress and continue your MRCP PACES exam preparation.
            </p>
          </div>
          <Link
            href="/dashboard/question-bank"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Questions
          </Link>
        </div>

        {/* Trial User Section */}
        {isOnTrial && trial && (
          <div className="mb-8 space-y-4">
            {/* Daily Check-in */}
            <DailyCheckin />

            {/* Trial Progress and Achievements Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <TrialProgressCard />
              </div>
              <TrialAchievements compact />
            </div>
          </div>
        )}

        {/* Exam Countdown & Readiness Section */}
        {userSettings.exam_date ? (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Countdown Widget */}
            <div className={`rounded-lg border p-6 ${
              daysUntilExam !== null && daysUntilExam <= 7 ? 'bg-red-50 border-red-200' :
              daysUntilExam !== null && daysUntilExam <= 30 ? 'bg-orange-50 border-orange-200' :
              daysUntilExam !== null && daysUntilExam <= 60 ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Days Until Exam</p>
                  <p className={`text-4xl font-bold ${
                    daysUntilExam !== null && daysUntilExam <= 7 ? 'text-red-600' :
                    daysUntilExam !== null && daysUntilExam <= 30 ? 'text-orange-600' :
                    daysUntilExam !== null && daysUntilExam <= 60 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {daysUntilExam !== null ? (daysUntilExam <= 0 ? 'Today!' : daysUntilExam) : '--'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDaysUntilExam(daysUntilExam)}
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  daysUntilExam !== null && daysUntilExam <= 7 ? 'bg-red-100' :
                  daysUntilExam !== null && daysUntilExam <= 30 ? 'bg-orange-100' :
                  daysUntilExam !== null && daysUntilExam <= 60 ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  <svg className={`w-8 h-8 ${
                    daysUntilExam !== null && daysUntilExam <= 7 ? 'text-red-600' :
                    daysUntilExam !== null && daysUntilExam <= 30 ? 'text-orange-600' :
                    daysUntilExam !== null && daysUntilExam <= 60 ? 'text-yellow-600' :
                    'text-green-600'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Readiness Score Widget */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Readiness Score</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-4xl font-bold ${
                      readinessData.status === 'excellent' ? 'text-green-600' :
                      readinessData.status === 'on_track' ? 'text-blue-600' :
                      readinessData.status === 'needs_attention' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {readinessData.score}%
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      readinessData.status === 'excellent' ? 'bg-green-100 text-green-700' :
                      readinessData.status === 'on_track' ? 'bg-blue-100 text-blue-700' :
                      readinessData.status === 'needs_attention' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {readinessData.status === 'excellent' ? 'Excellent' :
                       readinessData.status === 'on_track' ? 'On Track' :
                       readinessData.status === 'needs_attention' ? 'Needs Attention' :
                       'Behind Schedule'}
                    </span>
                  </div>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle
                      cx="32" cy="32" r="28"
                      stroke={
                        readinessData.status === 'excellent' ? '#22c55e' :
                        readinessData.status === 'on_track' ? '#3b82f6' :
                        readinessData.status === 'needs_attention' ? '#eab308' :
                        '#ef4444'
                      }
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${readinessData.score * 1.76} 176`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-600">{readinessData.statusMessage}</p>
              {readinessData.recommendations.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Tip: {readinessData.recommendations[0]}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Set Your Exam Date</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Track your countdown and get personalized readiness insights
                </p>
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Go to Settings
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Daily Goals Progress */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Goals</h2>
            <Link href="/dashboard/settings" className="text-sm text-gray-500 hover:text-gray-700">
              Edit Goals
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Questions Progress */}
            <div className="p-4 bg-[#fbfaf4] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Questions</span>
                <span className="text-sm text-gray-500">
                  {dailyProgress.questionsToday}/{userSettings.daily_question_goal}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    dailyProgress.questionsToday >= userSettings.daily_question_goal
                      ? 'bg-green-500'
                      : 'bg-black'
                  }`}
                  style={{ width: `${Math.min(100, (dailyProgress.questionsToday / userSettings.daily_question_goal) * 100)}%` }}
                ></div>
              </div>
              {dailyProgress.questionsToday >= userSettings.daily_question_goal && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Goal complete!
                </p>
              )}
            </div>

            {/* Flashcards Progress */}
            <div className="p-4 bg-[#fbfaf4] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Flashcards</span>
                <span className="text-sm text-gray-500">
                  {dailyProgress.flashcardsToday}/{userSettings.daily_flashcard_goal}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    dailyProgress.flashcardsToday >= userSettings.daily_flashcard_goal
                      ? 'bg-green-500'
                      : 'bg-black'
                  }`}
                  style={{ width: `${Math.min(100, (dailyProgress.flashcardsToday / userSettings.daily_flashcard_goal) * 100)}%` }}
                ></div>
              </div>
              {dailyProgress.flashcardsToday >= userSettings.daily_flashcard_goal && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Goal complete!
                </p>
              )}
            </div>

            {/* Streak */}
            <div className="p-4 bg-[#fbfaf4] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Study Streak</span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  {flashcardStats.streakDays} days
                </span>
              </div>
              <div className="text-center py-2">
                <p className="text-3xl font-bold text-gray-900">{flashcardStats.streakDays}</p>
                <p className="text-xs text-gray-500">day streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">What to Study Next</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.map((rec) => {
                const colors = getRecommendationColor(rec.color)
                return (
                  <Link
                    key={rec.id}
                    href={rec.actionUrl}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md ${colors.bg} ${colors.border}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.bg}`}>
                      {rec.priority === 'high' ? (
                        <svg className={`w-5 h-5 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className={`w-5 h-5 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{rec.title}</p>
                      <p className="text-xs text-gray-500 truncate">{rec.description}</p>
                    </div>
                    <svg className={`w-5 h-5 ${colors.text} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Questions Completed */}
          <div className="pill-card">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              QUESTIONS COMPLETED
            </h3>
            <div className="flex items-baseline">
              {statsLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {userStats.questionsCompleted}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {userStats.totalQuestions > 0 ? `Out of ${userStats.totalQuestions.toLocaleString()} available` : 'Start practicing!'}
            </p>
          </div>

          {/* Average Score */}
          <div className="pill-card">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              AVERAGE SCORE
            </h3>
            <div className="flex items-baseline">
              {statsLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {userStats.averageScore}%
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {userStats.questionsCompleted === 0
                ? 'No questions answered yet'
                : userStats.averageScore >= 70
                  ? 'Above passing threshold'
                  : 'Keep practicing to improve'}
            </p>
          </div>

          {/* Study Time */}
          <div className="pill-card">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              STUDY TIME
            </h3>
            <div className="flex items-baseline">
              {statsLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {formatStudyTime(userStats.studyTimeMinutes)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Total time spent
            </p>
          </div>

          {/* Mock Exams */}
          <div className="pill-card">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              MOCK EXAMS
            </h3>
            <div className="flex items-baseline">
              {statsLoading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {userStats.mockExamsCompleted}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Completed
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories Selection - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">MRCP PACES Exam Preparation</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">

                {/* Part 1: Calculations */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Part 1: Pharmacy Calculations</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {part1Progress.totalQuestions > 0
                        ? `${part1Progress.totalQuestions} questions available`
                        : 'No questions yet'
                      } • 2 hours • Calculator permitted
                    </p>
                  </div>

                  {part1Progress.questionsCompleted > 0 ? (
                    <>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-700 font-medium">Progress</span>
                          <span className="text-gray-900 font-semibold">{part1Progress.questionsCompleted} answered</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-black h-2 rounded-full transition-all duration-500" style={{width: `${Math.min(100, part1Progress.progressPercentage)}%`}}></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{part1Progress.questionsCompleted}</div>
                          <div className="text-xs text-gray-600">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{part1Progress.accuracy}%</div>
                          <div className="text-xs text-gray-600">Accuracy</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mb-4 text-center py-8">
                      <p className="text-sm text-gray-500 mb-2">No calculations practice yet</p>
                      <p className="text-xs text-gray-400">Start practicing to track your progress</p>
                    </div>
                  )}

                  <Link
                    href="/dashboard/calculations"
                    className="block w-full pill-btn pill-btn-primary text-sm"
                  >
                    {part1Progress.questionsCompleted > 0 ? 'Continue Calculations Practice' : 'Start Calculations Practice'}
                  </Link>
                </div>

                {/* Part 2: Clinical Knowledge */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Part 2: Clinical Knowledge</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {part2Progress.totalQuestions > 0
                        ? `${part2Progress.totalQuestions} questions available`
                        : 'No questions yet'
                      } • 2.5 hours • SBA + EMQ
                    </p>
                  </div>

                  {part2Progress.questionsCompleted > 0 ? (
                    <>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-700 font-medium">Progress</span>
                          <span className="text-gray-900 font-semibold">{part2Progress.questionsCompleted} answered</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-black h-2 rounded-full transition-all duration-500" style={{width: `${Math.min(100, part2Progress.progressPercentage)}%`}}></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{part2Progress.questionsCompleted}</div>
                          <div className="text-xs text-gray-600">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{part2Progress.accuracy}%</div>
                          <div className="text-xs text-gray-600">Accuracy</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mb-4 text-center py-8">
                      <p className="text-sm text-gray-500 mb-2">No clinical practice yet</p>
                      <p className="text-xs text-gray-400">Start practicing to track your progress</p>
                    </div>
                  )}

                  <Link
                    href="/dashboard/question-bank"
                    className="block w-full pill-btn pill-btn-primary text-sm"
                  >
                    {part2Progress.questionsCompleted > 0 ? 'Continue Clinical Practice' : 'Start Clinical Practice'}
                  </Link>
                </div>

              </div>
            </div>
          </div>

          {/* Performance by Category - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h2>

              <div className="space-y-4">
                {statsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : categoryProgress.length > 0 ? (
                  categoryProgress
                    .filter(cat => cat.attempted > 0)
                    .sort((a, b) => b.accuracy - a.accuracy)
                    .slice(0, 6)
                    .map((category) => (
                      <div key={category.slug}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-900">{category.name}</span>
                          <span className="text-sm font-semibold text-gray-900">{category.accuracy}%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">{category.correct}/{category.attempted} correct</span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              category.accuracy >= 70 ? 'bg-green-500' :
                              category.accuracy >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${category.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No practice data yet. Start practicing to see your performance by category.
                  </p>
                )}
              </div>

              {categoryProgress.filter(c => c.attempted > 0).length > 6 && (
                <Link
                  href="/dashboard/progress"
                  className="block text-center text-sm text-gray-600 hover:text-gray-900 mt-4"
                >
                  View all categories →
                </Link>
              )}

              {/* Actions Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    href="/dashboard/progress"
                    className="block w-full pill-btn pill-btn-primary pill-btn-sm"
                  >
                    View Progress
                  </Link>
                  <Link
                    href="/dashboard/flashcards"
                    className="block w-full pill-btn pill-btn-ghost pill-btn-sm"
                  >
                    Study Flashcards
                  </Link>
                  <Link
                    href="/dashboard/mock-exams"
                    className="block w-full pill-btn pill-btn-ghost pill-btn-sm"
                  >
                    Take Mock Exam
                  </Link>
                  <Link
                    href="/dashboard/question-bank"
                    className="block w-full pill-btn pill-btn-ghost pill-btn-sm"
                  >
                    Practice Questions
                  </Link>
                </div>
              </div>

              {/* Subscription Management */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Subscription</h3>

                {accessType === 'subscription' ? (
                  // Subscribed users: Show manage button
                  <>
                    <button
                      onClick={async () => {
                        setManagingSubscription(true)
                        setSubscriptionError(null)
                        try {
                          const response = await fetch('/api/stripe/create-portal-session', {
                            method: 'POST',
                          })
                          const data = await response.json()
                          if (data.url) {
                            window.location.href = data.url
                          } else if (data.error) {
                            setSubscriptionError(data.error)
                          }
                        } catch (error) {
                          console.error('Failed to open portal:', error)
                          setSubscriptionError('Failed to connect to billing portal. Please try again.')
                        } finally {
                          setManagingSubscription(false)
                        }
                      }}
                      disabled={managingSubscription}
                      className="w-full pill-btn pill-btn-outline pill-btn-sm disabled:opacity-50"
                    >
                      {managingSubscription ? 'Loading...' : 'Manage Subscription'}
                    </button>
                    {subscriptionError && (
                      <p className="mt-2 text-xs text-red-600">{subscriptionError}</p>
                    )}
                  </>
                ) : (
                  // Trial/non-subscribed users: Show subscribe button
                  <>
                    <Link
                      href="/pricing"
                      className="w-full pill-btn pill-btn-primary pill-btn-sm block text-center"
                    >
                      Subscribe Now
                    </Link>
                    {isOnTrial && trial && (
                      <p className="mt-2 text-xs text-gray-500">
                        {trial.daysRemaining} days left in free trial
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
    </DashboardLayout>
  )
}
