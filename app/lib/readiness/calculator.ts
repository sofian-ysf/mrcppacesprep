/**
 * Readiness Calculator
 *
 * Calculates overall exam readiness based on various study metrics.
 * Returns a score from 0-100 and a status indicator.
 */

export interface ReadinessInput {
  // Question progress
  questionsCompleted: number
  totalQuestions: number
  overallAccuracy: number
  categoryAccuracies: { name: string; accuracy: number; weight?: number }[]

  // Flashcard progress
  flashcardsMastered: number
  totalFlashcards: number

  // Mock exam performance
  mockExamsCompleted: number
  latestMockScore: number | null
  averageMockScore: number | null

  // Study consistency
  currentStreak: number
  daysUntilExam: number | null
}

export interface ReadinessOutput {
  score: number // 0-100
  status: 'excellent' | 'on_track' | 'needs_attention' | 'behind_schedule'
  statusMessage: string
  breakdown: {
    questionProgress: number
    accuracy: number
    flashcardMastery: number
    mockExamReadiness: number
    consistency: number
  }
  recommendations: string[]
}

// Category weights for MRCP PACES exam (approximate importance)
const CATEGORY_WEIGHTS: Record<string, number> = {
  'clinical-pharmacy': 1.2,
  'pharmacology': 1.2,
  'law-ethics': 1.1,
  'dosage': 1.3,
  'calculations': 1.3,
  'cardiovascular': 1.0,
  'respiratory': 1.0,
  'default': 1.0
}

/**
 * Calculate the readiness score and status
 */
export function calculateReadiness(input: ReadinessInput): ReadinessOutput {
  const {
    questionsCompleted,
    totalQuestions,
    overallAccuracy,
    categoryAccuracies,
    flashcardsMastered,
    totalFlashcards,
    mockExamsCompleted,
    latestMockScore,
    averageMockScore,
    currentStreak,
    daysUntilExam
  } = input

  // 1. Question Progress Score (0-20 points)
  const questionProgressRatio = totalQuestions > 0
    ? Math.min(1, questionsCompleted / totalQuestions)
    : 0
  const questionProgressScore = questionProgressRatio * 20

  // 2. Accuracy Score (0-30 points) - weighted by category importance
  let accuracyScore = 0
  if (categoryAccuracies.length > 0) {
    let weightedSum = 0
    let totalWeight = 0

    categoryAccuracies.forEach(cat => {
      const weight = cat.weight || CATEGORY_WEIGHTS[cat.name.toLowerCase().replace(/\s+/g, '-')] || CATEGORY_WEIGHTS.default
      weightedSum += (cat.accuracy / 100) * weight
      totalWeight += weight
    })

    const weightedAccuracy = totalWeight > 0 ? weightedSum / totalWeight : 0
    accuracyScore = weightedAccuracy * 30
  } else if (overallAccuracy > 0) {
    accuracyScore = (overallAccuracy / 100) * 30
  }

  // 3. Flashcard Mastery Score (0-15 points)
  const flashcardMasteryRatio = totalFlashcards > 0
    ? Math.min(1, flashcardsMastered / totalFlashcards)
    : 0
  const flashcardMasteryScore = flashcardMasteryRatio * 15

  // 4. Mock Exam Readiness Score (0-25 points)
  let mockExamScore = 0
  if (mockExamsCompleted > 0) {
    // Base points for taking mock exams (up to 5 points)
    const examCountPoints = Math.min(5, mockExamsCompleted)

    // Score-based points (up to 20 points)
    const scoreToUse = latestMockScore ?? averageMockScore ?? 0
    const scorePoints = (scoreToUse / 100) * 20

    mockExamScore = examCountPoints + scorePoints
  }

  // 5. Consistency Score (0-10 points)
  let consistencyScore = 0
  if (currentStreak >= 30) {
    consistencyScore = 10
  } else if (currentStreak >= 14) {
    consistencyScore = 8
  } else if (currentStreak >= 7) {
    consistencyScore = 6
  } else if (currentStreak >= 3) {
    consistencyScore = 4
  } else if (currentStreak >= 1) {
    consistencyScore = 2
  }

  // Calculate total score
  const totalScore = Math.round(
    questionProgressScore +
    accuracyScore +
    flashcardMasteryScore +
    mockExamScore +
    consistencyScore
  )

  // Determine status based on score and time remaining
  let status: ReadinessOutput['status']
  let statusMessage: string

  if (daysUntilExam !== null && daysUntilExam <= 0) {
    status = 'needs_attention'
    statusMessage = 'Exam day has arrived!'
  } else if (totalScore >= 80) {
    status = 'excellent'
    statusMessage = 'You\'re very well prepared!'
  } else if (totalScore >= 60) {
    status = 'on_track'
    statusMessage = 'Good progress - keep it up!'
  } else if (totalScore >= 40) {
    status = 'needs_attention'
    statusMessage = 'Focus on weaker areas'
  } else {
    status = 'behind_schedule'
    statusMessage = 'Time to accelerate your study'
  }

  // Adjust status based on time remaining
  if (daysUntilExam !== null && daysUntilExam > 0) {
    const expectedProgress = Math.max(0, 1 - (daysUntilExam / 90)) // Assume 90 days prep time
    const actualProgress = totalScore / 100

    if (actualProgress < expectedProgress - 0.2 && status === 'on_track') {
      status = 'needs_attention'
      statusMessage = 'Behind expected pace - consider studying more'
    }
  }

  // Generate recommendations
  const recommendations: string[] = []

  if (questionProgressRatio < 0.5) {
    recommendations.push('Complete more practice questions to build your knowledge base')
  }

  if (overallAccuracy < 70) {
    recommendations.push('Focus on improving accuracy - aim for 70%+ overall')
  }

  // Find weak categories
  const weakCategories = categoryAccuracies
    .filter(cat => cat.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)

  if (weakCategories.length > 0) {
    recommendations.push(`Strengthen weak areas: ${weakCategories.map(c => c.name).join(', ')}`)
  }

  if (flashcardMasteryRatio < 0.5) {
    recommendations.push('Review flashcards daily to improve retention')
  }

  if (mockExamsCompleted < 3) {
    recommendations.push('Take more mock exams to practice under exam conditions')
  } else if (averageMockScore && averageMockScore < 70) {
    recommendations.push('Your mock exam scores are below passing - focus on weak areas')
  }

  if (currentStreak < 7) {
    recommendations.push('Build a daily study habit - consistency is key')
  }

  return {
    score: totalScore,
    status,
    statusMessage,
    breakdown: {
      questionProgress: Math.round(questionProgressScore),
      accuracy: Math.round(accuracyScore),
      flashcardMastery: Math.round(flashcardMasteryScore),
      mockExamReadiness: Math.round(mockExamScore),
      consistency: Math.round(consistencyScore)
    },
    recommendations: recommendations.slice(0, 3) // Return top 3 recommendations
  }
}

/**
 * Calculate days until exam
 */
export function getDaysUntilExam(examDate: string | Date | null): number | null {
  if (!examDate) return null

  const exam = typeof examDate === 'string' ? new Date(examDate) : examDate
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  exam.setHours(0, 0, 0, 0)

  const diffTime = exam.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * Format days until exam for display
 */
export function formatDaysUntilExam(days: number | null): string {
  if (days === null) return 'No exam date set'
  if (days < 0) return 'Exam date has passed'
  if (days === 0) return 'Exam is today!'
  if (days === 1) return '1 day remaining'
  if (days < 7) return `${days} days remaining`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} remaining`
  }
  const months = Math.floor(days / 30)
  const remainingDays = days % 30
  if (remainingDays === 0) {
    return `${months} month${months > 1 ? 's' : ''} remaining`
  }
  return `${months} month${months > 1 ? 's' : ''}, ${remainingDays} days remaining`
}

/**
 * Get urgency color based on days remaining
 */
export function getUrgencyColor(days: number | null): string {
  if (days === null) return 'gray'
  if (days <= 7) return 'red'
  if (days <= 30) return 'orange'
  if (days <= 60) return 'yellow'
  return 'green'
}
