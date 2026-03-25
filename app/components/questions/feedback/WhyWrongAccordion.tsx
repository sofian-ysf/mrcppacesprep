'use client'

import { useState } from 'react'
import { formatBoldText } from '@/app/lib/formatText'

interface QuestionOption {
  letter: string
  text: string
}

interface WhyWrongAccordionProps {
  options: QuestionOption[] | null | undefined
  correctAnswer: string
  whyWrong: Record<string, string> | undefined
}

export default function WhyWrongAccordion({ options, correctAnswer, whyWrong }: WhyWrongAccordionProps) {
  const [expandedOption, setExpandedOption] = useState<string | null>(null)

  if (!options || !whyWrong || Object.keys(whyWrong).length === 0) return null

  const wrongOptions = options.filter(opt => opt.letter !== correctAnswer)

  if (wrongOptions.length === 0) return null

  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Why Other Options Are Incorrect</h4>
      <div className="space-y-2">
        {wrongOptions.map((option) => {
          const isExpanded = expandedOption === option.letter
          const explanation = whyWrong[option.letter]

          if (!explanation) return null

          return (
            <div key={option.letter} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedOption(isExpanded ? null : option.letter)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 text-left">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-semibold flex items-center justify-center">
                    {option.letter}
                  </span>
                  <span className="text-sm text-gray-700 line-clamp-1">{option.text}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="p-3 bg-white border-t border-gray-200">
                  <p className="text-sm text-gray-600">{formatBoldText(explanation)}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
