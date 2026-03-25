'use client'

import { formatBoldText } from '@/app/lib/formatText'

interface ExamTipBannerProps {
  tip: string | undefined
}

export default function ExamTipBanner({ tip }: ExamTipBannerProps) {
  if (!tip) return null

  return (
    <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-purple-800 mb-1">Exam Tip</h4>
          <p className="text-sm text-gray-700">{formatBoldText(tip)}</p>
        </div>
      </div>
    </div>
  )
}
