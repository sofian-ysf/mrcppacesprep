/**
 * Smart Study Recommendations Engine
 *
 * Generates personalized study recommendations based on
 * user progress, weak areas, and learning patterns.
 */

export interface StudyContext {
  // Flashcards
  flashcardsDue: number
  flashcardsMastered: number
  totalFlashcards: number
  flashcardStreakDays: number

  // Questions
  questionsDue: number
  questionsAnswered: number
  overallAccuracy: number
  weakCategories: { name: string; accuracy: number; slug: string }[]

  // Mock exams
  mockExamsCompleted: number
  daysSinceLastMock: number | null
  lastMockScore: number | null

  // Goals
  dailyQuestionsGoal: number
  dailyQuestionsCompleted: number
  dailyFlashcardsGoal: number
  dailyFlashcardsCompleted: number

  // Exam
  daysUntilExam: number | null
}

export interface Recommendation {
  id: string
  type: 'flashcard' | 'question' | 'mock_exam' | 'break' | 'category'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  actionLabel: string
  actionUrl: string
  icon: string
  color: string
}

/**
 * Generate smart study recommendations
 */
export function generateRecommendations(context: StudyContext): Recommendation[] {
  const recommendations: Recommendation[] = []

  // 1. High Priority: Flashcards due for review
  if (context.flashcardsDue > 0) {
    recommendations.push({
      id: 'flashcards-due',
      type: 'flashcard',
      priority: context.flashcardsDue > 20 ? 'high' : 'medium',
      title: `${context.flashcardsDue} flashcards due`,
      description: 'Review your due cards to maintain knowledge retention',
      actionLabel: 'Review Now',
      actionUrl: '/dashboard/flashcards',
      icon: 'layers',
      color: 'blue'
    })
  }

  // 2. High Priority: Questions due for spaced repetition
  if (context.questionsDue > 0) {
    recommendations.push({
      id: 'questions-due',
      type: 'question',
      priority: context.questionsDue > 15 ? 'high' : 'medium',
      title: `${context.questionsDue} questions due for review`,
      description: 'Reinforce your learning with spaced repetition',
      actionLabel: 'Review Questions',
      actionUrl: '/dashboard/question-bank?due=true',
      icon: 'clock',
      color: 'orange'
    })
  }

  // 3. High Priority: Weak categories
  if (context.weakCategories.length > 0) {
    const weakest = context.weakCategories[0]
    recommendations.push({
      id: 'weak-category',
      type: 'category',
      priority: weakest.accuracy < 50 ? 'high' : 'medium',
      title: `Focus on ${weakest.name}`,
      description: `Your accuracy is ${Math.round(weakest.accuracy)}% - practice to improve`,
      actionLabel: 'Practice Now',
      actionUrl: `/dashboard/question-bank`,
      icon: 'target',
      color: weakest.accuracy < 50 ? 'red' : 'yellow'
    })
  }

  // 4. Medium Priority: Mock exam suggestion
  if (context.mockExamsCompleted < 3 || (context.daysSinceLastMock !== null && context.daysSinceLastMock > 7)) {
    const urgency = context.daysUntilExam !== null && context.daysUntilExam < 30 ? 'high' : 'medium'
    recommendations.push({
      id: 'mock-exam',
      type: 'mock_exam',
      priority: urgency,
      title: context.mockExamsCompleted === 0 ? 'Take your first mock exam' : 'Time for a mock exam',
      description: context.daysSinceLastMock
        ? `${context.daysSinceLastMock} days since your last exam`
        : 'Test your knowledge under exam conditions',
      actionLabel: 'Start Mock Exam',
      actionUrl: '/dashboard/mock-exams',
      icon: 'clipboard',
      color: 'purple'
    })
  }

  // 5. Daily goal progress
  const questionsProgress = context.dailyQuestionsCompleted / context.dailyQuestionsGoal
  const flashcardsProgress = context.dailyFlashcardsCompleted / context.dailyFlashcardsGoal

  if (questionsProgress < 1 && questionsProgress > 0.5) {
    recommendations.push({
      id: 'daily-questions',
      type: 'question',
      priority: 'low',
      title: `${context.dailyQuestionsGoal - context.dailyQuestionsCompleted} questions to daily goal`,
      description: 'You\'re almost there! Complete your daily target.',
      actionLabel: 'Continue Practice',
      actionUrl: '/dashboard/question-bank',
      icon: 'flag',
      color: 'green'
    })
  }

  if (flashcardsProgress < 1 && flashcardsProgress > 0.5) {
    recommendations.push({
      id: 'daily-flashcards',
      type: 'flashcard',
      priority: 'low',
      title: `${context.dailyFlashcardsGoal - context.dailyFlashcardsCompleted} flashcards to daily goal`,
      description: 'Keep going! Complete your daily flashcard target.',
      actionLabel: 'Continue Review',
      actionUrl: '/dashboard/flashcards',
      icon: 'flag',
      color: 'green'
    })
  }

  // 6. Exam urgency based recommendations
  if (context.daysUntilExam !== null) {
    if (context.daysUntilExam <= 7 && context.overallAccuracy < 70) {
      recommendations.push({
        id: 'exam-urgent',
        type: 'question',
        priority: 'high',
        title: 'Focus on weak areas',
        description: `${context.daysUntilExam} days until exam - prioritize your weakest topics`,
        actionLabel: 'Smart Practice',
        actionUrl: '/dashboard/question-bank?smart=true',
        icon: 'alert',
        color: 'red'
      })
    }
  }

  // 7. Streak maintenance
  if (context.flashcardStreakDays > 0 && context.flashcardsDue === 0 && context.flashcardsMastered < context.totalFlashcards) {
    recommendations.push({
      id: 'streak-maintain',
      type: 'flashcard',
      priority: 'low',
      title: `${context.flashcardStreakDays}-day streak`,
      description: 'Review some cards to keep your streak going!',
      actionLabel: 'Quick Review',
      actionUrl: '/dashboard/flashcards',
      icon: 'fire',
      color: 'orange'
    })
  }

  // Sort by priority
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 }
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  // Return top 4 recommendations
  return recommendations.slice(0, 4)
}

/**
 * Get the single most important recommendation
 */
export function getPrimaryRecommendation(context: StudyContext): Recommendation | null {
  const recommendations = generateRecommendations(context)
  return recommendations.length > 0 ? recommendations[0] : null
}

/**
 * Get recommendation icon color class
 */
export function getRecommendationColor(color: string): { bg: string; text: string; border: string } {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    purple: { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' }
  }
  return colors[color] || colors.blue
}
