export interface SpotDiagnosis {
  id: string
  category_id: string | null
  image_url: string
  diagnosis: string
  description: string | null
  key_features: string[]
  exam_tips: string | null
  difficulty: 'Easy' | 'Medium' | 'Hard'
  created_at: string
}

export type StudyMode = 'classic' | 'mcq' | 'timed'
