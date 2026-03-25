import { SM2Input, SM2Output, ReviewQuality, ReviewRating, REVIEW_QUALITY_MAP } from '@/app/types/flashcards'

/**
 * SM-2 Spaced Repetition Algorithm Implementation
 *
 * Based on the SuperMemo SM-2 algorithm by Piotr Wozniak
 * https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 *
 * Key concepts:
 * - Quality (q): Rating 0-5 for how well the user remembered the card
 * - Ease Factor (EF): Multiplier for interval calculation (minimum 1.3)
 * - Interval: Number of days until next review
 * - Repetitions: Count of successful reviews (quality >= 3)
 */

const MIN_EASE_FACTOR = 1.3
const DEFAULT_EASE_FACTOR = 2.5

/**
 * Calculate the new SM-2 state after a review
 */
export function calculateSM2(input: SM2Input): SM2Output {
  const { quality, repetitions, easeFactor, interval } = input

  let newRepetitions: number
  let newEaseFactor: number
  let newInterval: number

  if (quality === 1) {
    // "Again" - Failed review, reset to beginning
    newRepetitions = 0
    newInterval = 1
    newEaseFactor = easeFactor
  } else if (quality === 2) {
    // "Hard" - Partial success, keep progress but shorter interval
    newRepetitions = repetitions // Don't reset
    newEaseFactor = Math.max(easeFactor - 0.15, MIN_EASE_FACTOR) // Slight penalty

    if (repetitions === 0) {
      newInterval = 1
    } else {
      // Give a shorter interval than "good" would give
      newInterval = Math.max(1, Math.round(interval * 1.2))
    }
  } else {
    // "Good" (3) or "Easy" (5) - Successful review
    newRepetitions = repetitions + 1

    // Calculate new ease factor
    // EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
    newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

    // Ensure minimum ease factor
    if (newEaseFactor < MIN_EASE_FACTOR) {
      newEaseFactor = MIN_EASE_FACTOR
    }

    // Calculate new interval
    if (quality === 5) {
      // "Easy" - bonus interval to graduate faster
      if (newRepetitions === 1) {
        newInterval = 4 // Skip ahead on first review
      } else if (newRepetitions === 2) {
        newInterval = 10
      } else {
        newInterval = Math.round(interval * newEaseFactor * 1.3) // 30% bonus
      }
    } else {
      // "Good" - standard SM-2 intervals
      if (newRepetitions === 1) {
        newInterval = 2 // First successful review
      } else if (newRepetitions === 2) {
        newInterval = 6
      } else {
        newInterval = Math.round(interval * newEaseFactor)
      }
    }
  }

  // Calculate next due date
  const nextDueDate = new Date()
  nextDueDate.setDate(nextDueDate.getDate() + newInterval)
  nextDueDate.setHours(0, 0, 0, 0) // Set to start of day

  return {
    repetitions: newRepetitions,
    easeFactor: Math.round(newEaseFactor * 100) / 100, // Round to 2 decimal places
    interval: newInterval,
    nextDueDate,
  }
}

/**
 * Convert a review rating (again/hard/good/easy) to SM-2 quality score
 */
export function ratingToQuality(rating: ReviewRating): ReviewQuality {
  return REVIEW_QUALITY_MAP[rating]
}

/**
 * Get the initial SM-2 state for a new card
 */
export function getInitialSM2State(): { easeFactor: number; interval: number; repetitions: number } {
  return {
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
  }
}

/**
 * Calculate estimated intervals for all rating options
 * Useful for showing users what will happen with each choice
 */
export function getEstimatedIntervals(
  repetitions: number,
  easeFactor: number,
  interval: number
): Record<ReviewRating, number> {
  const ratings: ReviewRating[] = ['again', 'hard', 'good', 'easy']
  const result: Record<ReviewRating, number> = {
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  }

  for (const rating of ratings) {
    const quality = ratingToQuality(rating)
    const sm2Result = calculateSM2({
      quality,
      repetitions,
      easeFactor,
      interval,
    })
    result[rating] = sm2Result.interval
  }

  return result
}

/**
 * Format interval for display
 */
export function formatInterval(days: number): string {
  if (days === 0) {
    return 'Now'
  } else if (days === 1) {
    return '1 day'
  } else if (days < 7) {
    return `${days} days`
  } else if (days < 30) {
    const weeks = Math.round(days / 7)
    return weeks === 1 ? '1 week' : `${weeks} weeks`
  } else if (days < 365) {
    const months = Math.round(days / 30)
    return months === 1 ? '1 month' : `${months} months`
  } else {
    const years = Math.round(days / 365 * 10) / 10
    return years === 1 ? '1 year' : `${years} years`
  }
}

/**
 * Check if a card is due for review
 */
export function isCardDue(dueDate: Date | string): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return due <= now
}

/**
 * Calculate mastery level based on repetitions and ease factor
 * Returns a value from 0-100
 */
export function calculateMasteryLevel(repetitions: number, easeFactor: number): number {
  // A card is considered "mastered" when it has been reviewed successfully
  // multiple times with a good ease factor

  if (repetitions === 0) return 0

  // Weight repetitions (more reviews = higher mastery)
  const repetitionScore = Math.min(repetitions / 5, 1) * 50

  // Weight ease factor (higher EF = easier card = higher mastery)
  // EF ranges from 1.3 to ~3.0, normalize to 0-50
  const efNormalized = (easeFactor - MIN_EASE_FACTOR) / (3.0 - MIN_EASE_FACTOR)
  const efScore = Math.min(efNormalized, 1) * 50

  return Math.round(repetitionScore + efScore)
}

/**
 * Determine card status based on progress
 */
export function getCardStatus(
  repetitions: number,
  interval: number,
  dueDate: Date | string | null
): 'new' | 'learning' | 'due' | 'mastered' {
  if (repetitions === 0) {
    return 'new'
  }

  if (dueDate && isCardDue(dueDate)) {
    return 'due'
  }

  // Consider a card mastered if interval is >= 21 days
  if (interval >= 21) {
    return 'mastered'
  }

  return 'learning'
}
