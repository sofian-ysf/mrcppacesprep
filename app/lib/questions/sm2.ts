/**
 * SM-2 Spaced Repetition Algorithm for Questions
 *
 * Adapted from the flashcard SM-2 implementation.
 * Tracks when questions should be reviewed based on performance.
 */

export interface QuestionSM2Input {
  isCorrect: boolean
  repetitions: number
  easeFactor: number
  interval: number
}

export interface QuestionSM2Output {
  repetitions: number
  easeFactor: number
  interval: number
  nextDueDate: Date
}

const MIN_EASE_FACTOR = 1.3
const DEFAULT_EASE_FACTOR = 2.5

/**
 * Calculate the new SM-2 state after answering a question
 */
export function calculateQuestionSM2(input: QuestionSM2Input): QuestionSM2Output {
  const { isCorrect, repetitions, easeFactor, interval } = input

  let newRepetitions: number
  let newEaseFactor: number
  let newInterval: number

  if (!isCorrect) {
    // Incorrect answer - reset to beginning but keep ease factor
    newRepetitions = 0
    newInterval = 1
    // Reduce ease factor slightly on failure
    newEaseFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2)
  } else {
    // Correct answer
    newRepetitions = repetitions + 1

    // Increase ease factor for correct answers
    // Quality is assumed to be 4 (good) for correct answers
    const quality = 4
    newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

    // Ensure minimum ease factor
    if (newEaseFactor < MIN_EASE_FACTOR) {
      newEaseFactor = MIN_EASE_FACTOR
    }

    // Calculate new interval
    if (newRepetitions === 1) {
      newInterval = 1
    } else if (newRepetitions === 2) {
      newInterval = 3 // Shorter than flashcards since questions take longer
    } else {
      newInterval = Math.round(interval * newEaseFactor)
    }
  }

  // Calculate next due date
  const nextDueDate = new Date()
  nextDueDate.setDate(nextDueDate.getDate() + newInterval)
  nextDueDate.setHours(0, 0, 0, 0)

  return {
    repetitions: newRepetitions,
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    interval: newInterval,
    nextDueDate,
  }
}

/**
 * Get the initial SM-2 state for a new question
 */
export function getInitialQuestionSM2State(): {
  easeFactor: number
  intervalDays: number
  repetitions: number
  dueDate: Date
} {
  return {
    easeFactor: DEFAULT_EASE_FACTOR,
    intervalDays: 0,
    repetitions: 0,
    dueDate: new Date(),
  }
}

/**
 * Check if a question is due for review
 */
export function isQuestionDue(dueDate: Date | string): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return due <= now
}

/**
 * Determine question review status
 */
export function getQuestionReviewStatus(
  repetitions: number,
  interval: number,
  dueDate: Date | string | null
): 'new' | 'learning' | 'due' | 'mastered' {
  if (repetitions === 0) {
    return 'new'
  }

  if (dueDate && isQuestionDue(dueDate)) {
    return 'due'
  }

  // Consider a question mastered if interval is >= 30 days
  if (interval >= 30) {
    return 'mastered'
  }

  return 'learning'
}

/**
 * Format interval for display
 */
export function formatQuestionInterval(days: number): string {
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
