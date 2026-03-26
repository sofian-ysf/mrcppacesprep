import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

async function checkAdminAccess() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { isAdmin: false, supabase }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return { isAdmin: !!adminUser, supabase }
}

export async function GET(request: NextRequest) {
  try {
    const { isAdmin, supabase } = await checkAdminAccess()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const stationNumber = searchParams.get('station_number')
    const offset = (page - 1) * limit

    let query = supabase
      .from('paces_stations')
      .select('*', { count: 'exact' })
      .order('station_number', { ascending: true })
      .order('title', { ascending: true })

    if (stationNumber) {
      query = query.eq('station_number', parseInt(stationNumber))
    }

    const { data: stations, count, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      stations,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Error fetching stations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isAdmin, supabase } = await checkAdminAccess()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      station_number,
      station_type,
      title,
      scenario_text,
      patient_info,
      task_instructions,
      time_limit_seconds,
      model_answer,
      marking_criteria,
      examiner_questions,
      difficulty
    } = body

    if (!station_number || !station_type || !title || !scenario_text || !task_instructions) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('paces_stations')
      .insert({
        station_number,
        station_type,
        title,
        scenario_text,
        patient_info: patient_info || null,
        task_instructions,
        time_limit_seconds: time_limit_seconds || 420,
        model_answer: model_answer || null,
        marking_criteria: marking_criteria || [],
        examiner_questions: examiner_questions || [],
        difficulty: difficulty || 'Medium'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ station: data })
  } catch (error) {
    console.error('Error creating station:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isAdmin, supabase } = await checkAdminAccess()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateFields } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const allowedFields = [
      'station_number', 'station_type', 'title', 'scenario_text',
      'patient_info', 'task_instructions', 'time_limit_seconds',
      'model_answer', 'marking_criteria', 'examiner_questions', 'difficulty'
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (updateFields[field] !== undefined) {
        updateData[field] = updateFields[field]
      }
    }

    const { data, error } = await supabase
      .from('paces_stations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ station: data })
  } catch (error) {
    console.error('Error updating station:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { isAdmin, supabase } = await checkAdminAccess()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('paces_stations')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting station:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
