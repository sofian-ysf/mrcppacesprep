'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DailyCheckinProps {
  className?: string
}

interface CheckinData {
  yesterday_questions: number
  today_questions: number
  daily_goal: number
  current_streak: number
  accuracy_trend: 'improving' | 'stable' | 'declining' | null
  improving_category: string | null
}

export default function DailyCheckin({ className = '' }: DailyCheckinProps) {
  const [checkinData, setCheckinData] = useState<CheckinData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetchCheckinData()
  }, [])

  const fetchCheckinData = async () => {
    try {
      const res = await fetch('/api/trial/daily-checkin')
      if (res.ok) {
        const data = await res.json()
        setCheckinData(data)
      }
    } catch (error) {
      console.error('Error fetching checkin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || dismissed || !checkinData) return null

  const progressPercentage = Math.min(100, (checkinData.today_questions / checkinData.daily_goal) * 100)
  const questionsLeft = Math.max(0, checkinData.daily_goal - checkinData.today_questions)

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl border border-blue-200 p-6 ${className}`}>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Welcome Back!
          </h3>

          {/* Yesterday's summary */}
          {checkinData.yesterday_questions > 0 && (
            <p className="text-sm text-gray-600 mb-3">
              You answered <span className="font-medium text-gray-900">{checkinData.yesterday_questions} questions</span> yesterday.
              {checkinData.improving_category && (
                <span className="block text-green-600 mt-1">
                  Your accuracy is improving in {checkinData.improving_category}!
                </span>
              )}
            </p>
          )}

          {/* Today's goal */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Today&apos;s Goal</span>
              <span className="font-medium text-gray-900">
                {checkinData.today_questions} / {checkinData.daily_goal}
              </span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {questionsLeft > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {questionsLeft} more to reach your goal
              </p>
            )}
            {questionsLeft === 0 && (
              <p className="text-xs text-green-600 mt-1">
                Goal reached! Keep going for extra practice.
              </p>
            )}
          </div>

          {/* Streak indicator */}
          {checkinData.current_streak >= 2 && (
            <div className="flex items-center gap-2 mb-4 p-2 bg-orange-50 rounded-lg">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-orange-700">
                {checkinData.current_streak} day streak!
              </span>
            </div>
          )}

          <Link
            href="/dashboard/question-bank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Practicing
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
