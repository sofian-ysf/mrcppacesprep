/**
 * Achievement Checker
 *
 * Checks user progress against achievement criteria
 * and awards achievements when conditions are met.
 */

export interface Achievement {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  category: string
  requirement_type: string
  requirement_value: number
  rarity: string
  sort_order: number
}

export interface UserStats {
  questionsAnswered: number
  questionsCorrect: number
  overallAccuracy: number
  categoryAccuracies: { categorySlug: string; accuracy: number }[]
  flashcardsReviewed: number
  flashcardsMastered: number
  totalFlashcards: number
  mockExamsCompleted: number
  latestMockScore: number | null
  highestMockScore: number | null
  streakDays: number
  dailyGoalsCompleted: number
}

export interface AchievementCheck {
  achievement: Achievement
  isEarned: boolean
  progress: number // 0-100
  progressText: string
}

/**
 * Check if a specific achievement has been earned
 */
export function checkAchievement(achievement: Achievement, stats: UserStats): AchievementCheck {
  const { requirement_type, requirement_value, category } = achievement
  let isEarned = false
  let progress = 0
  let progressText = ''

  switch (category) {
    case 'streak':
      isEarned = stats.streakDays >= requirement_value
      progress = Math.min(100, (stats.streakDays / requirement_value) * 100)
      progressText = `${stats.streakDays}/${requirement_value} days`
      break

    case 'volume':
      if (achievement.slug.startsWith('questions_')) {
        isEarned = stats.questionsAnswered >= requirement_value
        progress = Math.min(100, (stats.questionsAnswered / requirement_value) * 100)
        progressText = `${stats.questionsAnswered}/${requirement_value} questions`
      } else if (achievement.slug.startsWith('flashcards_')) {
        isEarned = stats.flashcardsReviewed >= requirement_value
        progress = Math.min(100, (stats.flashcardsReviewed / requirement_value) * 100)
        progressText = `${stats.flashcardsReviewed}/${requirement_value} cards`
      }
      break

    case 'mastery':
      if (achievement.slug.startsWith('accuracy_category_')) {
        // Check if any category has reached the accuracy threshold
        const bestCategory = stats.categoryAccuracies.reduce(
          (best, curr) => (curr.accuracy > best.accuracy ? curr : best),
          { categorySlug: '', accuracy: 0 }
        )
        isEarned = bestCategory.accuracy >= requirement_value
        progress = Math.min(100, (bestCategory.accuracy / requirement_value) * 100)
        progressText = `${Math.round(bestCategory.accuracy)}%/${requirement_value}%`
      } else if (achievement.slug.startsWith('accuracy_overall_')) {
        isEarned = stats.overallAccuracy >= requirement_value
        progress = Math.min(100, (stats.overallAccuracy / requirement_value) * 100)
        progressText = `${Math.round(stats.overallAccuracy)}%/${requirement_value}%`
      } else if (achievement.slug.startsWith('flashcard_mastery_')) {
        const masteryPercentage = stats.totalFlashcards > 0
          ? (stats.flashcardsMastered / stats.totalFlashcards) * 100
          : 0
        isEarned = masteryPercentage >= requirement_value
        progress = Math.min(100, (masteryPercentage / requirement_value) * 100)
        progressText = `${Math.round(masteryPercentage)}%/${requirement_value}%`
      }
      break

    case 'mock_exam':
      if (achievement.slug.startsWith('mock_pass_')) {
        isEarned = (stats.highestMockScore || 0) >= requirement_value
        progress = Math.min(100, ((stats.highestMockScore || 0) / requirement_value) * 100)
        progressText = `${Math.round(stats.highestMockScore || 0)}%/${requirement_value}%`
      } else {
        isEarned = stats.mockExamsCompleted >= requirement_value
        progress = Math.min(100, (stats.mockExamsCompleted / requirement_value) * 100)
        progressText = `${stats.mockExamsCompleted}/${requirement_value} exams`
      }
      break

    case 'consistency':
      isEarned = stats.dailyGoalsCompleted >= requirement_value
      progress = Math.min(100, (stats.dailyGoalsCompleted / requirement_value) * 100)
      progressText = `${stats.dailyGoalsCompleted}/${requirement_value} days`
      break

    default:
      break
  }

  return {
    achievement,
    isEarned,
    progress: Math.round(progress),
    progressText
  }
}

/**
 * Check all achievements for a user
 */
export function checkAllAchievements(
  achievements: Achievement[],
  stats: UserStats,
  earnedAchievementIds: string[]
): AchievementCheck[] {
  return achievements.map(achievement => {
    const check = checkAchievement(achievement, stats)

    // If already earned, mark as 100% complete
    if (earnedAchievementIds.includes(achievement.id)) {
      return {
        ...check,
        isEarned: true,
        progress: 100
      }
    }

    return check
  })
}

/**
 * Get newly earned achievements
 */
export function getNewlyEarnedAchievements(
  achievements: Achievement[],
  stats: UserStats,
  previouslyEarnedIds: string[]
): Achievement[] {
  return achievements.filter(achievement => {
    if (previouslyEarnedIds.includes(achievement.id)) {
      return false
    }

    const check = checkAchievement(achievement, stats)
    return check.isEarned
  })
}

/**
 * Get icon component name based on achievement icon string
 */
export function getAchievementIconColor(rarity: string): string {
  switch (rarity) {
    case 'legendary':
      return 'text-yellow-500'
    case 'epic':
      return 'text-gray-700'
    case 'rare':
      return 'text-blue-500'
    default:
      return 'text-gray-500'
  }
}

/**
 * Get background color for achievement card based on rarity
 */
export function getAchievementBgColor(rarity: string): string {
  switch (rarity) {
    case 'legendary':
      return 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
    case 'epic':
      return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
    case 'rare':
      return 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
}

/**
 * Sort achievements by earned status and rarity
 */
export function sortAchievements(checks: AchievementCheck[]): AchievementCheck[] {
  const rarityOrder: Record<string, number> = {
    legendary: 0,
    epic: 1,
    rare: 2,
    common: 3
  }

  return [...checks].sort((a, b) => {
    // Earned achievements first
    if (a.isEarned !== b.isEarned) {
      return a.isEarned ? -1 : 1
    }

    // Within same earned status, sort by rarity
    const aRarity = rarityOrder[a.achievement.rarity] ?? 4
    const bRarity = rarityOrder[b.achievement.rarity] ?? 4
    if (aRarity !== bRarity) {
      return aRarity - bRarity
    }

    // Within same rarity, sort by progress (highest first for unearned)
    if (!a.isEarned && !b.isEarned) {
      return b.progress - a.progress
    }

    // Finally by sort_order
    return a.achievement.sort_order - b.achievement.sort_order
  })
}
