'use client'

import { memo, useMemo } from 'react'
import { ReviewRating } from '@/app/types/flashcards'
import { formatInterval, getEstimatedIntervals } from '@/app/lib/flashcards/sm2'

interface ReviewButtonsProps {
  onReview: (rating: ReviewRating) => void
  disabled?: boolean
  repetitions: number
  easeFactor: number
  interval: number
}

const ReviewButtons = memo(function ReviewButtons({
  onReview,
  disabled = false,
  repetitions,
  easeFactor,
  interval,
}: ReviewButtonsProps) {
  const intervals = useMemo(
    () => getEstimatedIntervals(repetitions, easeFactor, interval),
    [repetitions, easeFactor, interval]
  )

  const buttons = useMemo(() => [
    {
      rating: 'again' as ReviewRating,
      label: 'Again',
      sublabel: formatInterval(intervals.again),
      className: 'bg-red-500 hover:bg-red-600 text-white',
    },
    {
      rating: 'hard' as ReviewRating,
      label: 'Hard',
      sublabel: formatInterval(intervals.hard),
      className: 'bg-orange-500 hover:bg-orange-600 text-white',
    },
    {
      rating: 'good' as ReviewRating,
      label: 'Good',
      sublabel: formatInterval(intervals.good),
      className: 'bg-green-500 hover:bg-green-600 text-white',
    },
    {
      rating: 'easy' as ReviewRating,
      label: 'Easy',
      sublabel: formatInterval(intervals.easy),
      className: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
  ], [intervals])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-center text-sm text-gray-600 mb-4">
        How well did you know this?
      </p>

      <div className="grid grid-cols-4 gap-3">
        {buttons.map((button, index) => (
          <button
            key={button.rating}
            onClick={() => onReview(button.rating)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl font-medium transition-all ${
              button.className
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
          >
            <span className="text-base">{button.label}</span>
            <span className="text-xs opacity-80 mt-1">{button.sublabel}</span>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        Keyboard: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy
      </p>
    </div>
  )
})

export default ReviewButtons
