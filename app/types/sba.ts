export interface SBAQuestion {
  id: string
  category_id: string | null
  question_text: string
  options: { letter: string; text: string }[]
  correct_answer: string
  explanation: string | null
  key_points: string[]
  clinical_pearl: string | null
  exam_tip: string | null
  difficulty: 'Easy' | 'Medium' | 'Hard'
  created_at: string
}

export interface SBACategory {
  id: string
  slug: string
  name: string
  description: string | null
  difficulty_default: 'Easy' | 'Medium' | 'Hard'
  question_count: number
  difficulty_counts: {
    Easy: number
    Medium: number
    Hard: number
  }
  icon: string | null
}

export interface SBAUserAnswer {
  question_id: string
  selected_answer: string
  is_correct: boolean
  time_taken_seconds: number
}

export interface SBAPracticeSession {
  questions: SBAQuestion[]
  currentIndex: number
  answers: SBAUserAnswer[]
  startTime: Date
}

export interface SBAAnswerSubmission {
  question_id: string
  selected_answer: string
  time_taken_seconds: number
}

export interface SBAAnswerResponse {
  is_correct: boolean
  correct_answer: string
  explanation: string
  key_points?: string[]
  clinical_pearl?: string | null
  exam_tip?: string | null
  nextReview?: string
}
