'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TrialStats {
  questions_used: number
  questions_remaining: number
  days_remaining: number
  total_correct: number
  accuracy_percentage: number
  categories_tried: number
  current_streak: number
  achievements_count: number
}

interface TrialProgressCardProps {
  className?: string
}

export default function TrialProgressCard({ className = '' }: TrialProgressCardProps) {
  const [stats, setStats] = useState<TrialStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/trial/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching trial stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`animate-pulse bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    )
  }

  if (!stats) return null

  const questionsProgress = (stats.questions_used / 100) * 100
  const isLow = stats.questions_remaining <= 20
  const isCritical = stats.questions_remaining <= 10

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trial Progress</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isCritical ? 'bg-red-100 text-red-700' :
          isLow ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
        }`}>
          {stats.days_remaining} days left
        </div>
      </div>

      {/* Questions Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Questions Used</span>
          <span className="font-medium text-gray-900">{stats.questions_used} / 100</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              isCritical ? 'bg-red-500' :
              isLow ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${questionsProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {stats.questions_remaining} questions remaining
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Accuracy</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.accuracy_percentage || 0}%
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Streak</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">{stats.current_streak}</p>
            {stats.current_streak >= 3 && (
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Categories</p>
          <p className="text-2xl font-bold text-gray-900">{stats.categories_tried}/12</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Achievements</p>
          <p className="text-2xl font-bold text-gray-900">{stats.achievements_count}/7</p>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/dashboard/question-bank"
        className="block w-full py-3 bg-black text-white text-center rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Continue Practicing
      </Link>

      {isCritical && (
        <Link
          href="/pricing"
          className="block mt-3 text-center text-sm text-gray-600 hover:text-gray-900"
        >
          Unlock 2000+ more questions
        </Link>
      )}
    </div>
  )
}
