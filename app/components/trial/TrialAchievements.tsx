'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  type: string
  title: string
  description: string
  icon: React.ReactNode
  achieved: boolean
  achieved_at?: string
}

const ACHIEVEMENT_CONFIG: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
  first_question: {
    title: 'First Step',
    description: 'Answer your first question',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  day_1_complete: {
    title: 'Day 1 Champion',
    description: 'Complete 15+ questions on day 1',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
      </svg>
    )
  },
  streak_3: {
    title: 'Building Habits',
    description: 'Practice 3 days in a row',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    )
  },
  halfway: {
    title: 'Halfway There',
    description: 'Complete 50 questions',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  accuracy_80: {
    title: 'Sharp Mind',
    description: 'Achieve 80%+ accuracy (10+ questions)',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  all_categories: {
    title: 'Explorer',
    description: 'Try 5+ different categories',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  trial_complete: {
    title: 'Trial Master',
    description: 'Complete all 100 trial questions',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  }
}

interface TrialAchievementsProps {
  className?: string
  compact?: boolean
}

export default function TrialAchievements({ className = '', compact = false }: TrialAchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/trial/achievements')
      if (res.ok) {
        const data = await res.json()
        const achievedTypes = new Set(data.achievements?.map((a: { achievement_type: string }) => a.achievement_type) || [])

        const allAchievements: Achievement[] = Object.entries(ACHIEVEMENT_CONFIG).map(([type, config]) => ({
          type,
          ...config,
          achieved: achievedTypes.has(type),
          achieved_at: data.achievements?.find((a: { achievement_type: string; achieved_at: string }) => a.achievement_type === type)?.achieved_at
        }))

        setAchievements(allAchievements)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-24 bg-gray-200 rounded-lg" />
      </div>
    )
  }

  const achievedCount = achievements.filter(a => a.achieved).length

  if (compact) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Achievements</h3>
          <span className="text-sm text-gray-500">{achievedCount}/{achievements.length}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {achievements.map((achievement) => (
            <div
              key={achievement.type}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                achievement.achieved
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-300'
              }`}
              title={`${achievement.title}: ${achievement.description}`}
            >
              {achievement.icon}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trial Achievements</h3>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
          {achievedCount}/{achievements.length}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.type}
            className={`p-4 rounded-lg border transition-all ${
              achievement.achieved
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-gray-200 bg-gray-50 opacity-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
              achievement.achieved
                ? 'bg-yellow-200 text-yellow-700'
                : 'bg-gray-200 text-gray-400'
            }`}>
              {achievement.icon}
            </div>
            <h4 className={`font-medium text-sm mb-1 ${
              achievement.achieved ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {achievement.title}
            </h4>
            <p className="text-xs text-gray-500">{achievement.description}</p>
            {achievement.achieved && achievement.achieved_at && (
              <p className="text-xs text-yellow-600 mt-2">
                {new Date(achievement.achieved_at).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
