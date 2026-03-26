'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { useSubscription } from '@/app/hooks/useSubscription'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/app/components/dashboard'

interface UserStats {
  cardsReviewed: number
  stationsPracticed: number
  sbaAccuracy: number
  studyStreak: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const { hasAccess } = useSubscription()
  const [managingSubscription, setManagingSubscription] = useState(false)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [userStats, setUserStats] = useState<UserStats>({
    cardsReviewed: 0,
    stationsPracticed: 0,
    sbaAccuracy: 0,
    studyStreak: 0
  })

  useEffect(() => {
    if (user) {
      fetchAllData()
    }
  }, [user])

  const fetchAllData = async () => {
    setStatsLoading(true)
    try {
      // Fetch progress data for MRCP PACES stats
      const [progressRes, flashcardProgressRes] = await Promise.all([
        fetch('/api/user/progress'),
        fetch('/api/flashcards/progress')
      ])

      let cardsReviewed = 0
      let stationsPracticed = 0
      let sbaAccuracy = 0
      let studyStreak = 0

      // Process user progress for SBA accuracy and stations
      if (progressRes.ok) {
        const progressData = await progressRes.json()
        sbaAccuracy = progressData.overall?.accuracy || 0
        // Count stations practiced from progress data
        stationsPracticed = progressData.overall?.totalAnswered || 0
      }

      // Process flashcard progress for cards reviewed and streak
      if (flashcardProgressRes.ok) {
        const flashcardData = await flashcardProgressRes.json()
        cardsReviewed = (flashcardData.cardsStudied || 0) + (flashcardData.reviewsToday || 0)
        studyStreak = flashcardData.streakDays || 0
      }

      setUserStats({
        cardsReviewed,
        stationsPracticed,
        sbaAccuracy,
        studyStreak
      })
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setStatsLoading(false)
    }
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

  // MRCP PACES modules configuration
  const pacesModules = [
    {
      title: 'Spot Diagnosis',
      description: 'Practice clinical image recognition',
      href: '/dashboard/spot-diagnosis',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'PACES Stations',
      description: 'Practice with exam scenarios',
      href: '/dashboard/stations',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: 'bg-purple-50',
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Differentials',
      description: 'Learn causes of clinical signs',
      href: '/dashboard/differentials',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'High Yield SBAs',
      description: 'Test your knowledge',
      href: '/dashboard/sba',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-orange-50',
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Examination Checklists',
      description: 'Step-by-step examination routines',
      href: '/dashboard/checklists',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      bgColor: 'bg-teal-50',
      iconBgColor: 'bg-teal-100',
      iconColor: 'text-teal-600'
    }
  ]

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}
        </h1>
        <p className="text-gray-600">
          Track your progress and continue your MRCP PACES exam preparation.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Cards Reviewed */}
        <div className="pill-card">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            CARDS REVIEWED
          </h3>
          <div className="flex items-baseline">
            {statsLoading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {userStats.cardsReviewed}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Spot diagnosis + differentials
          </p>
        </div>

        {/* Stations Practiced */}
        <div className="pill-card">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            STATIONS PRACTICED
          </h3>
          <div className="flex items-baseline">
            {statsLoading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {userStats.stationsPracticed}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            PACES scenarios completed
          </p>
        </div>

        {/* SBA Accuracy */}
        <div className="pill-card">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            SBA ACCURACY
          </h3>
          <div className="flex items-baseline">
            {statsLoading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {userStats.sbaAccuracy}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {userStats.sbaAccuracy >= 70 ? 'Above passing threshold' : 'Keep practicing'}
          </p>
        </div>

        {/* Study Streak */}
        <div className="pill-card">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            STUDY STREAK
          </h3>
          <div className="flex items-baseline">
            {statsLoading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
            ) : (
              <>
                <span className="text-3xl font-bold text-gray-900">
                  {userStats.studyStreak}
                </span>
                <svg className="w-5 h-5 text-orange-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {userStats.studyStreak === 1 ? 'day' : 'days'} in a row
          </p>
        </div>
      </div>

      {/* MRCP PACES Modules */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">MRCP PACES Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pacesModules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className={`${module.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all group`}
            >
              <div className="flex items-start gap-4">
                <div className={`${module.iconBgColor} ${module.iconColor} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {module.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {module.description}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/spot-diagnosis"
              className="flex items-center gap-3 p-3 bg-[#fbfaf4] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Practice Spot Diagnosis</p>
                <p className="text-sm text-gray-500">Test your clinical image recognition</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/dashboard/stations"
              className="flex items-center gap-3 p-3 bg-[#fbfaf4] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">PACES Station Practice</p>
                <p className="text-sm text-gray-500">Practice exam scenarios</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/dashboard/sba"
              className="flex items-center gap-3 p-3 bg-[#fbfaf4] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">High Yield SBAs</p>
                <p className="text-sm text-gray-500">Test your clinical knowledge</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Subscription & Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>

          <div className="space-y-4">
            {/* Subscription Status */}
            <div className="p-4 bg-[#fbfaf4] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Subscription Status</span>
                <span className={`text-xs px-2 py-1 rounded-full ${hasAccess ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {hasAccess ? 'Active' : 'Free'}
                </span>
              </div>

              {hasAccess ? (
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
                  className="w-full pill-btn pill-btn-outline pill-btn-sm disabled:opacity-50 mt-2"
                >
                  {managingSubscription ? 'Loading...' : 'Manage Subscription'}
                </button>
              ) : (
                <Link
                  href="/pricing"
                  className="w-full pill-btn pill-btn-primary pill-btn-sm block text-center mt-2"
                >
                  Subscribe Now
                </Link>
              )}
              {subscriptionError && (
                <p className="mt-2 text-xs text-red-600">{subscriptionError}</p>
              )}
            </div>

            {/* Settings Link */}
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 p-3 bg-[#fbfaf4] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Settings</p>
                <p className="text-sm text-gray-500">Manage your account preferences</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Progress Link */}
            <Link
              href="/dashboard/progress"
              className="flex items-center gap-3 p-3 bg-[#fbfaf4] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">View Progress</p>
                <p className="text-sm text-gray-500">Track your learning journey</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
