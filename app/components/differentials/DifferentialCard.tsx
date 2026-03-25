'use client'

import { memo, useCallback } from 'react'
import { Differential } from '@/app/types/differentials'

interface DifferentialCardProps {
  differential: Differential
  isFlipped: boolean
  onFlip: () => void
}

const DifferentialCard = memo(function DifferentialCard({
  differential,
  isFlipped,
  onFlip,
}: DifferentialCardProps) {
  const handleCardClick = useCallback(() => {
    onFlip()
  }, [onFlip])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault()
      onFlip()
    }
  }, [onFlip])

  const { common, less_common, rare_but_important } = differential.differentials_list

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000">
      <div
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={isFlipped ? 'Click to see sign' : 'Click to see differentials'}
        className={`relative w-full min-h-[300px] cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of card - Sign name */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 flex-1 flex flex-col items-center justify-center">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                Clinical Sign
              </span>
              {differential.category && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mb-4">
                  {differential.category}
                </span>
              )}
              <h2 className="text-2xl font-semibold text-gray-900 text-center">
                {differential.sign_name}
              </h2>
              {differential.exam_relevance && (
                <p className="text-sm text-gray-500 mt-4 text-center max-w-md">
                  {differential.exam_relevance}
                </p>
              )}
            </div>
            <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Tap to see differentials
              </p>
            </div>
          </div>
        </div>

        {/* Back of card - Differentials list */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Differentials for {differential.sign_name}
                </span>
              </div>

              {/* Common causes - Green */}
              {common.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Common
                  </h3>
                  <ul className="space-y-1 ml-4">
                    {common.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Less common causes - Yellow */}
              {less_common.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-yellow-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    Less Common
                  </h3>
                  <ul className="space-y-1 ml-4">
                    {less_common.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rare but important - Red */}
              {rare_but_important.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Rare but Important
                  </h3>
                  <ul className="space-y-1 ml-4">
                    {rare_but_important.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Memory aid */}
              {differential.memory_aid && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <h3 className="text-sm font-medium text-purple-700 mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Memory Aid
                  </h3>
                  <p className="text-sm text-purple-800">{differential.memory_aid}</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Tap to flip back
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default DifferentialCard
