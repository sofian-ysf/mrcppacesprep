export interface ExamChecklist {
  id: string
  system_name: string
  steps: ChecklistStep[]
  tips: string | null
  common_findings: string[]
  presentation_template: string | null
  created_at: string
}

export interface ChecklistStep {
  step: string
  details?: string
}
