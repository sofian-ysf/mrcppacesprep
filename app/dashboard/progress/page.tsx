'use client'

import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/app/components/dashboard'

interface ModuleStats {
  viewed: number
  completed: number
  answered?: number
  correct?: number
  accuracy?: number
}

interface WeakArea {
  category: string
  accuracy: number
  total: number
}

interface ProgressData {
  overall: {
    totalStudyTimeSeconds: number
    currentStreak: number
    contentCompleted: number
    lastActivityAt: string | null
  }
  modules: {
    spotDiagnosis: ModuleStats
    stations: ModuleStats
    differentials: ModuleStats
    sba: ModuleStats & { answered: number; correct: number; accuracy: number }
    checklists: ModuleStats
  }
  weakAreas: WeakArea[]
  recommendations: string[]
  dailyActivity: { date: string; total: number }[]
}

export default function ProgressPage() {
  const { user, loading: authLoading } = useAuth()
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch('/api/progress')
        if (!res.ok) throw new Error('Failed to fetch progress')
        const data = await res.json()
        setProgress(data)
      } catch (err) {
        console.error('Error fetching progress:', err)
        setError('Failed to load progress data')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProgress()
    }
  }, [user])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hrs > 0) {
      return `${hrs}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to view progress</h2>
          <Link href="/login" className="pill-btn pill-btn-primary">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="pill-btn pill-btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const maxDaily = Math.max(...(progress?.dailyActivity.map(d => d.total) || [1]), 1)

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Progress' }
      ]}
    >
      {/* Page Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Progress</h1>
          <p className="text-gray-600 mt-1">Track your MRCP PACES preparation</p>
        </div>
        <Link
          href="/dashboard/sba"
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Continue Studying
        </Link>
      </div>

      {/* Overall Stats Card */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Study Time</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatTime(progress?.overall.totalStudyTimeSeconds || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Current Streak</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-900">{progress?.overall.currentStreak || 0}</p>
            <span className="text-xl">days</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Content Completed</p>
          <p className="text-3xl font-bold text-gray-900">{progress?.overall.contentCompleted || 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">SBA Accuracy</p>
          <p className="text-3xl font-bold text-gray-900">{progress?.modules.sba.accuracy || 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Last 7 Days Activity</h2>
          {progress?.dailyActivity && progress.dailyActivity.some(d => d.total > 0) ? (
            <div className="flex items-end justify-between h-40 gap-2">
              {progress.dailyActivity.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end h-32">
                    {day.total > 0 ? (
                      <div
                        className="w-full max-w-[40px] bg-black rounded-t transition-all"
                        style={{ height: `${(day.total / maxDaily) * 100}%`, minHeight: '8px' }}
                        title={`${day.total} activities`}
                      ></div>
                    ) : (
                      <div className="w-full max-w-[40px] bg-gray-100 rounded h-2"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(day.date)}</p>
                  <p className="text-xs font-medium text-gray-900">{day.total}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              <p>No activity in the last 7 days</p>
            </div>
          )}
        </div>

        {/* Study Recommendations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
          {progress?.recommendations && progress.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {progress.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Start studying to get personalized recommendations!</p>
            </div>
          )}
        </div>
      </div>

      {/* Per-Module Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Module Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Spot Diagnosis */}
          <Link href="/dashboard/spot-diagnosis" className="block border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Spot Diagnosis</h3>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {progress?.modules.spotDiagnosis.viewed || 0}
            </p>
            <p className="text-xs text-gray-500">cards reviewed</p>
          </Link>

          {/* Stations */}
          <Link href="/dashboard/stations" className="block border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Stations</h3>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {progress?.modules.stations.completed || 0}
            </p>
            <p className="text-xs text-gray-500">scenarios practiced</p>
          </Link>

          {/* Differentials */}
          <Link href="/dashboard/differentials" className="block border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Differentials</h3>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {progress?.modules.differentials.viewed || 0}
            </p>
            <p className="text-xs text-gray-500">flashcards reviewed</p>
          </Link>

          {/* SBAs */}
          <Link href="/dashboard/sba" className="block border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">SBAs</h3>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">
                {progress?.modules.sba.answered || 0}
              </p>
              <p className="text-sm text-gray-600">answered</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    (progress?.modules.sba.accuracy || 0) >= 70 ? 'bg-green-500' :
                    (progress?.modules.sba.accuracy || 0) >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${progress?.modules.sba.accuracy || 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {progress?.modules.sba.accuracy || 0}%
              </span>
            </div>
          </Link>

          {/* Checklists */}
          <Link href="/dashboard/checklists" className="block border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Checklists</h3>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {progress?.modules.checklists.completed || 0}
            </p>
            <p className="text-xs text-gray-500">completed</p>
          </Link>
        </div>
      </div>

      {/* Weak Areas */}
      {progress?.weakAreas && progress.weakAreas.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Areas to Improve</h2>
          <p className="text-sm text-gray-600 mb-4">Categories with less than 70% accuracy in SBAs</p>
          <div className="space-y-3">
            {progress.weakAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    area.accuracy < 40 ? 'bg-red-500' :
                    area.accuracy < 60 ? 'bg-orange-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm text-gray-900">{area.category}</span>
                  <span className="text-xs text-gray-500">({area.total} questions)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        area.accuracy < 40 ? 'bg-red-500' :
                        area.accuracy < 60 ? 'bg-orange-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${area.accuracy}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {area.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/dashboard/sba"
          className="pill-btn pill-btn-primary text-center"
        >
          Practice SBAs
        </Link>
        <Link
          href="/dashboard/stations"
          className="pill-btn pill-btn-outline text-center"
        >
          Practice Stations
        </Link>
        <Link
          href="/dashboard"
          className="pill-btn pill-btn-outline text-center"
        >
          Back to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  )
}
