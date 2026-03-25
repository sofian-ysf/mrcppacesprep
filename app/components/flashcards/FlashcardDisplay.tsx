'use client'

import { memo, useCallback } from 'react'
import { FlashcardWithProgress } from '@/app/types/flashcards'

interface FlashcardDisplayProps {
  card: FlashcardWithProgress
  onShowAnswer: () => void
  showAnswer: boolean
}

const FlashcardDisplay = memo(function FlashcardDisplay({
  card,
  onShowAnswer,
  showAnswer,
}: FlashcardDisplayProps) {
  const handleCardClick = useCallback(() => {
    if (!showAnswer) {
      onShowAnswer()
    }
  }, [showAnswer, onShowAnswer])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.code === 'Space' && !showAnswer) {
      e.preventDefault()
      onShowAnswer()
    }
  }, [showAnswer, onShowAnswer])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={showAnswer ? 'Answer shown' : 'Click to show answer'}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow min-h-[200px]"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {showAnswer ? 'Back' : 'Front'}
            </span>
            {card.isNew && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                New
              </span>
            )}
          </div>

          {/* Show front or back based on state */}
          <div
            className="prose prose-sm prose-gray max-w-none [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded"
            dangerouslySetInnerHTML={{ __html: showAnswer ? card.back : card.front }}
          />
        </div>

        {/* Click prompt when answer hidden */}
        {!showAnswer && (
          <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Tap to flip
            </p>
          </div>
        )}
      </div>
    </div>
  )
})

export default FlashcardDisplay
