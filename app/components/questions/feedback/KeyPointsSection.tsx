'use client'

import { formatBoldText } from '@/app/lib/formatText'

interface KeyPointsSectionProps {
  points: string[] | undefined
}

export default function KeyPointsSection({ points }: KeyPointsSectionProps) {
  if (!points || points.length === 0) return null

  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h4 className="text-sm font-semibold text-blue-800">Key Learning Points</h4>
      </div>
      <ul className="space-y-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-200 text-blue-700 text-xs font-semibold flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <span className="text-sm text-gray-700">{formatBoldText(point)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
