/**
 * Adaptive Learning Prioritizer
 *
 * Prioritizes questions based on user performance to create
 * personalized "Smart Practice" sessions.
 */

export interface CategoryPerformance {
  categoryId: string
  categoryName: string
  categorySlug: string
  totalAttempted: number
  totalCorrect: number
  accuracy: number
  lastAttemptedAt: Date | null
  averageTimeSeconds: number
}

export interface QuestionPerformance {
  questionId: string
  categoryId: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timesAttempted: number
  timesCorrect: number
  timesIncorrect: number
  lastAttemptedAt: Date | null
}

export interface AdaptivePriority {
  questionId: string
  priority: number // Higher = should be studied first
  reason: string
  categorySlug: string
}

export interface SmartPracticeConfig {
  // What percentage of questions should be from weak categories
  weakCategoryWeight: number // 0-1, default 0.5
  // How much to prioritize recently failed questions
  recentFailurePriority: number // 0-1, default 0.3
  // How much to prioritize questions not seen recently
  freshnessWeight: number // 0-1, default 0.2
  // Target difficulty based on user level
  targetDifficulty: 'Easy' | 'Medium' | 'Hard' | 'adaptive'
}

const DEFAULT_CONFIG: SmartPracticeConfig = {
  weakCategoryWeight: 0.5,
  recentFailurePriority: 0.3,
  freshnessWeight: 0.2,
  targetDifficulty: 'adaptive'
}

/**
 * Calculate priority score for a question
 */
export function calculateQuestionPriority(
  question: QuestionPerformance,
  categoryPerformance: CategoryPerformance | undefined,
  userOverallAccuracy: number,
  config: SmartPracticeConfig = DEFAULT_CONFIG
): { priority: number; reason: string } {
  let priority = 50 // Base priority
  let reasons: string[] = []

  // 1. Category weakness priority (0-30 points)
  if (categoryPerformance) {
    const categoryAccuracy = categoryPerformance.accuracy
    if (categoryAccuracy < 50) {
      priority += 30
      reasons.push('Weak category')
    } else if (categoryAccuracy < 70) {
      priority += 20
      reasons.push('Needs improvement')
    } else if (categoryAccuracy < 85) {
      priority += 10
    }
  } else {
    // Never attempted this category - high priority
    priority += 25
    reasons.push('New category')
  }

  // 2. Question-specific failure rate (0-25 points)
  if (question.timesAttempted > 0) {
    const questionAccuracy = question.timesCorrect / question.timesAttempted
    if (questionAccuracy < 0.5) {
      priority += 25
      reasons.push('Frequently missed')
    } else if (questionAccuracy < 0.7) {
      priority += 15
    }
  } else {
    // Never attempted - moderate priority
    priority += 15
    reasons.push('New question')
  }

  // 3. Time since last attempt (0-20 points)
  if (question.lastAttemptedAt) {
    const daysSinceAttempt = Math.floor(
      (Date.now() - new Date(question.lastAttemptedAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceAttempt > 30) {
      priority += 20
      reasons.push('Not reviewed recently')
    } else if (daysSinceAttempt > 14) {
      priority += 15
    } else if (daysSinceAttempt > 7) {
      priority += 10
    } else if (daysSinceAttempt > 3) {
      priority += 5
    }
  }

  // 4. Difficulty matching (0-15 points)
  const targetDifficulty = config.targetDifficulty === 'adaptive'
    ? getAdaptiveDifficulty(userOverallAccuracy)
    : config.targetDifficulty

  if (question.difficulty === targetDifficulty) {
    priority += 15
  } else if (
    (targetDifficulty === 'Medium' && question.difficulty !== 'Medium') ||
    (targetDifficulty === 'Hard' && question.difficulty === 'Medium') ||
    (targetDifficulty === 'Easy' && question.difficulty === 'Medium')
  ) {
    priority += 8
  }

  // 5. Consecutive failures boost
  if (question.timesIncorrect >= 3 && question.timesCorrect === 0) {
    priority += 10
    reasons.push('Struggled with this')
  }

  const primaryReason = reasons.length > 0 ? reasons[0] : 'General practice'

  return { priority: Math.min(100, priority), reason: primaryReason }
}

/**
 * Determine appropriate difficulty based on user accuracy
 */
export function getAdaptiveDifficulty(accuracy: number): 'Easy' | 'Medium' | 'Hard' {
  if (accuracy >= 80) return 'Hard'
  if (accuracy >= 60) return 'Medium'
  return 'Easy'
}

/**
 * Get weakest categories that need attention
 */
export function getWeakCategories(
  categories: CategoryPerformance[],
  threshold: number = 70,
  minAttempts: number = 5
): CategoryPerformance[] {
  return categories
    .filter(cat => cat.accuracy < threshold || cat.totalAttempted < minAttempts)
    .sort((a, b) => {
      // Sort by accuracy (lowest first), then by attempts (lowest first)
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy
      return a.totalAttempted - b.totalAttempted
    })
}

/**
 * Generate smart practice recommendations
 */
export interface SmartPracticeRecommendation {
  focusCategory: CategoryPerformance | null
  focusMessage: string
  recommendedQuestionCount: number
  difficultyMix: {
    easy: number
    medium: number
    hard: number
  }
}

export function getSmartPracticeRecommendation(
  categories: CategoryPerformance[],
  userOverallAccuracy: number,
  totalQuestionsCompleted: number
): SmartPracticeRecommendation {
  const weakCategories = getWeakCategories(categories)

  // Determine focus category
  let focusCategory: CategoryPerformance | null = null
  let focusMessage = 'General practice across all topics'

  if (weakCategories.length > 0) {
    focusCategory = weakCategories[0]
    if (focusCategory.totalAttempted < 5) {
      focusMessage = `Start practicing: ${focusCategory.categoryName}`
    } else if (focusCategory.accuracy < 50) {
      focusMessage = `Focus needed: ${focusCategory.categoryName} (${focusCategory.accuracy}% accuracy)`
    } else {
      focusMessage = `Improving: ${focusCategory.categoryName} (${focusCategory.accuracy}% accuracy)`
    }
  }

  // Determine difficulty mix based on overall accuracy
  let difficultyMix = { easy: 20, medium: 50, hard: 30 }

  if (userOverallAccuracy < 50) {
    difficultyMix = { easy: 50, medium: 40, hard: 10 }
  } else if (userOverallAccuracy < 70) {
    difficultyMix = { easy: 30, medium: 50, hard: 20 }
  } else if (userOverallAccuracy >= 85) {
    difficultyMix = { easy: 10, medium: 40, hard: 50 }
  }

  // Recommend question count based on experience
  let recommendedQuestionCount = 20
  if (totalQuestionsCompleted < 50) {
    recommendedQuestionCount = 10
  } else if (totalQuestionsCompleted > 500) {
    recommendedQuestionCount = 30
  }

  return {
    focusCategory,
    focusMessage,
    recommendedQuestionCount,
    difficultyMix
  }
}

/**
 * Build query parameters for smart practice API call
 */
export function buildSmartPracticeParams(
  recommendation: SmartPracticeRecommendation,
  weakCategories: CategoryPerformance[]
): URLSearchParams {
  const params = new URLSearchParams()

  // Add focus categories (top 3 weak ones)
  const categoryIds = weakCategories
    .slice(0, 3)
    .map(c => c.categoryId)

  if (categoryIds.length > 0) {
    params.set('categories', categoryIds.join(','))
  }

  // Add difficulty distribution
  const difficulties: string[] = []
  if (recommendation.difficultyMix.easy > 0) difficulties.push('Easy')
  if (recommendation.difficultyMix.medium > 0) difficulties.push('Medium')
  if (recommendation.difficultyMix.hard > 0) difficulties.push('Hard')
  if (difficulties.length > 0) {
    params.set('difficulties', difficulties.join(','))
  }

  params.set('limit', recommendation.recommendedQuestionCount.toString())
  params.set('random', 'true')
  params.set('smart', 'true')

  return params
}
