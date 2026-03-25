export interface PacesStation {
  id: string
  station_number: 1 | 2 | 3 | 4 | 5
  station_type: string
  title: string
  scenario_text: string
  patient_info: string | null
  task_instructions: string
  time_limit_seconds: number
  model_answer: string | null
  marking_criteria: MarkingCriterion[]
  examiner_questions: ExaminerQuestion[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  created_at: string
}

export interface MarkingCriterion {
  criterion: string
  marks: number
}

export interface ExaminerQuestion {
  question: string
  ideal_answer: string
}

export const STATION_TYPES = {
  1: ['respiratory', 'abdominal'],
  2: ['history'],
  3: ['cardiovascular', 'neurological'],
  4: ['communication', 'ethics'],
  5: ['brief_consultation']
} as const

export type StationNumber = keyof typeof STATION_TYPES

export interface StationFilters {
  station_number?: StationNumber
  station_type?: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

export interface StationListResponse {
  stations: PacesStation[]
  total: number
}

export interface StationPracticeSession {
  station: PacesStation
  startedAt: Date | null
  completedAt: Date | null
  timerActive: boolean
  answerRevealed: boolean
}
