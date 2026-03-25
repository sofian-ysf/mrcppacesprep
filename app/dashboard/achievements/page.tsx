'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { getAchievementIconColor, getAchievementBgColor } from '@/app/lib/achievements/checker'
import { DashboardLayout } from '@/app/components/dashboard'

interface Achievement {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  category: string
  requirement_type: string
  requirement_value: number
  rarity: string
  sort_order: number
  isEarned: boolean
  progress: number
  progressText: string
  earnedAt: string | null
  notified: boolean
}

interface AchievementStats {
  total: number
  earned: number
  newlyEarned: string[]
}

const ICON_MAP: Record<string, React.ReactNode> = {
  fire: <path strokeLinecap="round" strokeLinejoin="round" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z" />,
  target: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
  'check-circle': <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  award: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  clipboard: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
  star: <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  flag: <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />,
  layers: <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
  brain: <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
}

export default function AchievementsPage() {
  const { user, loading: authLoading } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState<AchievementStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (user) {
      fetchAchievements()
    }
  }, [user])

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements')
      if (res.ok) {
        const data = await res.json()
        setAchievements(data.achievements || [])
        setStats(data.stats)

        // Mark unnotified achievements as notified
        if (data.unnotified && data.unnotified.length > 0) {
          await fetch('/api/achievements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              achievement_ids: data.unnotified.map((a: Achievement) => a.id)
            })
          })
        }
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'streak', 'volume', 'mastery', 'mock_exam', 'consistency']
  const categoryLabels: Record<string, string> = {
    all: 'All',
    streak: 'Streaks',
    volume: 'Volume',
    mastery: 'Mastery',
    mock_exam: 'Mock Exams',
    consistency: 'Consistency'
  }

  const filteredAchievements = achievements.filter(a =>
    selectedCategory === 'all' || a.category === selectedCategory
  )

  const earnedFirst = [...filteredAchievements].sort((a, b) => {
    if (a.isEarned !== b.isEarned) return a.isEarned ? -1 : 1
    return a.sort_order - b.sort_order
  })

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to view achievements</h2>
          <Link href="/login" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Achievements' }
      ]}
    >
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Achievements</h1>
          <p className="text-gray-600 mt-1">Track your milestones and unlock badges</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Achievements Unlocked</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.earned} <span className="text-lg font-normal text-gray-500">/ {stats.total}</span>
                </p>
              </div>
              <div className="w-20 h-20 relative">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle
                    cx="40" cy="40" r="35"
                    stroke="#000"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(stats.earned / stats.total) * 220} 220`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
                  {Math.round((stats.earned / stats.total) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading achievements...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earnedFirst.map(achievement => (
              <div
                key={achievement.id}
                className={`rounded-lg border p-4 transition-all ${
                  achievement.isEarned
                    ? getAchievementBgColor(achievement.rarity)
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    achievement.isEarned
                      ? achievement.rarity === 'legendary' ? 'bg-yellow-100' :
                        achievement.rarity === 'epic' ? 'bg-purple-100' :
                        achievement.rarity === 'rare' ? 'bg-blue-100' : 'bg-gray-100'
                      : 'bg-gray-200'
                  }`}>
                    <svg
                      className={`w-6 h-6 ${achievement.isEarned ? getAchievementIconColor(achievement.rarity) : 'text-gray-400'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      {ICON_MAP[achievement.icon] || ICON_MAP['star']}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${achievement.isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        achievement.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
                        achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                        achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {achievement.rarity}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 ${achievement.isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    {!achievement.isEarned && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progressText}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-black h-1.5 rounded-full transition-all"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {achievement.isEarned && achievement.earnedAt && (
                      <p className="text-xs text-gray-500">
                        Unlocked {new Date(achievement.earnedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
