'use client'

import { formatBoldText } from '@/app/lib/formatText'

interface ClinicalPearlBoxProps {
  pearl: string | undefined
}

export default function ClinicalPearlBox({ pearl }: ClinicalPearlBoxProps) {
  if (!pearl) return null

  return (
    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-800 mb-1">Clinical Pearl</h4>
          <p className="text-sm text-gray-700">{formatBoldText(pearl)}</p>
        </div>
      </div>
    </div>
  )
}
