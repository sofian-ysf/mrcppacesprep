export interface Differential {
  id: string
  sign_name: string
  category: string | null
  differentials_list: {
    common: string[]
    less_common: string[]
    rare_but_important: string[]
  }
  memory_aid: string | null
  exam_relevance: string | null
  created_at: string
}
