'use client'

import { ProgressStatsResponse } from '@/app/types/flashcards'

interface ProgressStatsProps {
  stats: ProgressStatsResponse
}

export default function ProgressStats({ stats }: ProgressStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-1">Due Today</p>
        <p className="text-2xl font-bold text-orange-600">{stats.cardsDueToday}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-1">New Cards</p>
        <p className="text-2xl font-bold text-blue-600">{stats.newCards}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-1">Streak</p>
        <p className="text-2xl font-bold text-green-600">{stats.streakDays}d</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-1">Today</p>
        <p className="text-2xl font-bold text-gray-800">{stats.reviewsToday}</p>
      </div>
    </div>
  )
}
