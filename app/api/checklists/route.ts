import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { ExamChecklist } from '@/app/types/checklists'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: checklists, error } = await supabase
      .from('exam_checklists')
      .select('*')
      .order('system_name', { ascending: true })

    if (error) {
      console.error('Error fetching checklists:', error)
      return NextResponse.json(
        { error: 'Failed to fetch checklists' },
        { status: 500 }
      )
    }

    // Parse JSON fields if stored as strings
    const parsedChecklists: ExamChecklist[] = (checklists || []).map(checklist => ({
      ...checklist,
      steps: typeof checklist.steps === 'string'
        ? JSON.parse(checklist.steps)
        : checklist.steps || [],
      common_findings: typeof checklist.common_findings === 'string'
        ? JSON.parse(checklist.common_findings)
        : checklist.common_findings || []
    }))

    return NextResponse.json({
      checklists: parsedChecklists,
      total: parsedChecklists.length
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
