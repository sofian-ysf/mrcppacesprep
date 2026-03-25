import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { PacesStation } from '@/app/types/stations'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: station, error } = await supabase
      .from('paces_stations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Station not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching station:', error)
      return NextResponse.json(
        { error: 'Failed to fetch station' },
        { status: 500 }
      )
    }

    // Parse JSON fields if stored as strings
    const parsedStation: PacesStation = {
      ...station,
      marking_criteria: typeof station.marking_criteria === 'string'
        ? JSON.parse(station.marking_criteria)
        : station.marking_criteria || [],
      examiner_questions: typeof station.examiner_questions === 'string'
        ? JSON.parse(station.examiner_questions)
        : station.examiner_questions || []
    }

    return NextResponse.json({ station: parsedStation })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
