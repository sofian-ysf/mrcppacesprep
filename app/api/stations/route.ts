import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { PacesStation } from '@/app/types/stations'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Get filter parameters
    const stationNumber = searchParams.get('station_number')
    const stationType = searchParams.get('station_type')
    const difficulty = searchParams.get('difficulty')

    // Build query
    let query = supabase
      .from('paces_stations')
      .select('*')
      .order('station_number', { ascending: true })
      .order('title', { ascending: true })

    // Apply filters
    if (stationNumber) {
      const num = parseInt(stationNumber, 10)
      if (num >= 1 && num <= 5) {
        query = query.eq('station_number', num)
      }
    }

    if (stationType) {
      query = query.eq('station_type', stationType)
    }

    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      query = query.eq('difficulty', difficulty)
    }

    const { data: stations, error } = await query

    if (error) {
      console.error('Error fetching stations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch stations' },
        { status: 500 }
      )
    }

    // Parse JSON fields if stored as strings
    const parsedStations: PacesStation[] = (stations || []).map(station => ({
      ...station,
      marking_criteria: typeof station.marking_criteria === 'string'
        ? JSON.parse(station.marking_criteria)
        : station.marking_criteria || [],
      examiner_questions: typeof station.examiner_questions === 'string'
        ? JSON.parse(station.examiner_questions)
        : station.examiner_questions || []
    }))

    return NextResponse.json({
      stations: parsedStations,
      total: parsedStations.length
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
