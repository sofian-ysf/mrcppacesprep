'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import { DeckWithStats, ProgressStatsResponse } from '@/app/types/flashcards'
import ProgressStats from '@/app/components/flashcards/ProgressStats'
import { DashboardLayout } from '@/app/components/dashboard'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function FlashcardsPage() {
  const { user, loading: authLoading } = useAuth()

  // Use SWR for caching - data persists when switching tabs
  const { data: decksData, error: decksError, isLoading: decksLoading } = useSWR(
    user ? '/api/flashcards/decks' : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  const { data: statsData } = useSWR(
    user ? '/api/flashcards/progress' : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  const decks: DeckWithStats[] = decksData?.decks || []
  const stats: ProgressStatsResponse | null = statsData || null
  const error = decksError?.message || decksData?.error

  if (authLoading || decksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to access flashcards</h2>
          <Link href="/login" className="pill-btn pill-btn-primary">
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
        { label: 'Flashcards' }
      ]}
      statsBar={stats ? <ProgressStats stats={stats} /> : undefined}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Flashcards</h1>
        <p className="text-sm text-gray-500">Spaced repetition study</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Decks */}
      {decks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No decks available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {decks.map((deck) => (
            <Link
              key={deck.id}
              href={`/dashboard/flashcards/study/${deck.id}`}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate pr-2">{deck.name}</h3>
                <span className="text-xs text-gray-400">{deck.stats.total}</span>
              </div>

              {/* Compact stats row */}
              <div className="flex items-center gap-3 text-xs mb-3">
                <span className="text-orange-600 font-medium">
                  {deck.stats.due + deck.stats.new} to study
                </span>
                <span className="text-green-600">
                  {deck.stats.masteryPercentage}% mastery
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${deck.stats.masteryPercentage}%` }}
                />
              </div>

              {/* Study button indicator */}
              <div className={`text-xs font-medium text-center py-1.5 rounded ${
                deck.stats.due + deck.stats.new > 0
                  ? 'bg-gray-900 text-white group-hover:bg-gray-800'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {deck.stats.due + deck.stats.new > 0 ? 'Study Now' : 'All caught up'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
