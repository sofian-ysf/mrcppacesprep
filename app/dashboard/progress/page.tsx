'use client'

import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/app/components/dashboard'

interface ProgressData {
  overall: {
    totalAnswered: number
    correctAnswers: number
    accuracy: number
    totalTimeSeconds: number
  }
  recent: {
    totalAnswered: number
    correctAnswers: number
    accuracy: number
  }
  byCategory: {
    name: string
    slug: string
    type: string
    total: number
    correct: number
    accuracy: number
  }[]
  byDifficulty: Record<string, { total: number; correct: number; accuracy: number }>
  byType: Record<string, { total: number; correct: number; accuracy: number }>
  dailyActivity: { date: string; total: number; correct: number }[]
}

export default function ProgressPage() {
  const { user, loading: authLoading } = useAuth()
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch('/api/user/progress')
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
      {/* Page Title with Start Questions CTA */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Progress</h1>
          <p className="text-gray-600 mt-1">Track your performance and identify areas for improvement</p>
        </div>
        <Link
          href="/dashboard/sba"
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start Questions
        </Link>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Questions</p>
          <p className="text-3xl font-bold text-gray-900">{progress?.overall.totalAnswered || 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Overall Accuracy</p>
          <p className="text-3xl font-bold text-gray-900">{progress?.overall.accuracy || 0}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
          <p className="text-3xl font-bold text-gray-900">{progress?.overall.correctAnswers || 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Time Spent</p>
          <p className="text-3xl font-bold text-gray-900">{formatTime(progress?.overall.totalTimeSeconds || 0)}</p>
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
                        title={`${day.total} questions, ${day.correct} correct`}
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

        {/* This Week Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Questions</span>
                <span className="font-medium text-gray-900">{progress?.recent.totalAnswered || 0}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Correct</span>
                <span className="font-medium text-gray-900">{progress?.recent.correctAnswers || 0}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-medium text-gray-900">{progress?.recent.accuracy || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full transition-all"
                  style={{ width: `${progress?.recent.accuracy || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* By Difficulty */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">By Difficulty</h2>
          <div className="space-y-4">
            {['Easy', 'Medium', 'Hard'].map((difficulty) => {
              const stats = progress?.byDifficulty[difficulty]
              return (
                <div key={difficulty}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {difficulty}
                      </span>
                      <span className="text-sm text-gray-600">
                        {stats?.correct || 0}/{stats?.total || 0} correct
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats?.accuracy || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        difficulty === 'Easy' ? 'bg-green-500' :
                        difficulty === 'Medium' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${stats?.accuracy || 0}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* By Question Type */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">By Question Type</h2>
          <div className="space-y-4">
            {[
              { key: 'sba', label: 'Single Best Answer' },
              { key: 'emq', label: 'Extended Matching' },
              { key: 'calculation', label: 'Calculations' }
            ].map(({ key, label }) => {
              const stats = progress?.byType[key]
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{label}</span>
                      <span className="text-xs text-gray-500">
                        ({stats?.correct || 0}/{stats?.total || 0})
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats?.accuracy || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all"
                      style={{ width: `${stats?.accuracy || 0}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* By Category */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">By Category</h2>
        {progress?.byCategory && progress.byCategory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progress.byCategory.map((category) => (
              <div key={category.slug} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500">
                      {category.correct}/{category.total} correct
                    </p>
                  </div>
                  <div className={`text-lg font-bold ${
                    category.accuracy >= 70 ? 'text-green-600' :
                    category.accuracy >= 50 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {category.accuracy}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      category.accuracy >= 70 ? 'bg-green-500' :
                      category.accuracy >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${category.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No category data yet. Start practicing to see your progress by category.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/dashboard/sba"
          className="pill-btn pill-btn-primary text-center"
        >
          Continue Practicing
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
