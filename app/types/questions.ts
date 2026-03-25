export interface QuestionCategory {
  id: string
  slug: string
  name: string
  description: string | null
  question_type: 'clinical' | 'calculation'
  difficulty_default: 'Easy' | 'Medium' | 'Hard'
  question_count: number
  difficulty_counts: {
    Easy: number
    Medium: number
    Hard: number
  }
  type_counts: {
    sba: number
    emq: number
    calculation: number
  }
  icon: string | null
}

// Structured explanation format for rich educational content
export interface StructuredExplanation {
  summary: string
  key_points: string[]
  clinical_pearl: string
  why_wrong: Record<string, string>
  exam_tip: string
  related_topics: string[]
}

// Trial achievement types
export type TrialAchievementType =
  | 'first_question'
  | 'day_1_complete'
  | 'streak_3'
  | 'halfway'
  | 'accuracy_80'
  | 'all_categories'
  | 'trial_complete'

export interface TrialAchievement {
  achievement_type: TrialAchievementType
  achieved_at: string
  metadata?: Record<string, unknown>
}

// Trial statistics
export interface TrialStats {
  questions_used: number
  questions_remaining: number
  days_remaining: number
  total_correct: number
  accuracy_percentage: number
  categories_tried: number
  current_streak: number
  achievements_count: number
}

// Trial daily activity
export interface TrialDailyActivity {
  activity_date: string
  questions_answered: number
  questions_correct: number
  categories_tried: string[]
  time_spent_seconds: number
}

// Extended trial info with engagement features
export interface ExtendedTrialInfo {
  status: 'active' | 'expired' | 'exhausted' | 'converted' | 'none'
  questions_used: number
  questions_remaining: number
  days_remaining: number
  trial_expires_at: string
  onboarding_completed: boolean
  exam_date: string | null
  daily_goal: number
  starting_category_slug: string | null
}

export interface QuestionOption {
  letter: string
  text: string
}

export interface EMQScenario {
  stem: string
  correct_answer: string
}

export interface Question {
  id: string
  category_id: string
  question_type: 'sba' | 'emq' | 'calculation'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  question_text: string
  options: QuestionOption[] | null
  correct_answer: string
  explanation: string
  explanation_structured?: StructuredExplanation | null
  is_trial_featured?: boolean
  trial_display_order?: number | null
  question_categories?: {
    name: string
    slug: string
  }
}

export interface UserAnswer {
  question_id: string
  selected_answer: string
  is_correct: boolean
  time_taken_seconds: number
}

export interface PracticeSession {
  questions: Question[]
  currentIndex: number
  answers: UserAnswer[]
  startTime: Date
}

export interface AnswerSubmission {
  question_id: string
  selected_answer: string
  time_taken_seconds: number
}

export interface AnswerResponse {
  is_correct: boolean
  correct_answer: string
  explanation: string
  explanation_structured?: StructuredExplanation | null
  question_type?: string
  nextReview?: string
  trial?: {
    questions_remaining: number
    status: string
    is_exhausted?: boolean
  }
}
