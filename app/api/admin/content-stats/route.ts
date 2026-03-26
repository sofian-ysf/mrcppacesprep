import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch counts for all content types in parallel
    const [
      spotDiagnosesResult,
      stationsResult,
      differentialsResult,
      sbaQuestionsResult,
      checklistsResult
    ] = await Promise.all([
      supabase.from('spot_diagnoses').select('id', { count: 'exact', head: true }),
      supabase.from('paces_stations').select('id', { count: 'exact', head: true }),
      supabase.from('differentials').select('id', { count: 'exact', head: true }),
      supabase.from('sba_questions').select('id', { count: 'exact', head: true }),
      supabase.from('exam_checklists').select('id', { count: 'exact', head: true })
    ])

    return NextResponse.json({
      spotDiagnoses: spotDiagnosesResult.count || 0,
      stations: stationsResult.count || 0,
      differentials: differentialsResult.count || 0,
      sbaQuestions: sbaQuestionsResult.count || 0,
      checklists: checklistsResult.count || 0
    })
  } catch (error) {
    console.error('Error fetching content stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
