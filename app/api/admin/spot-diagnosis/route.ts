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
    const offset = (page - 1) * limit

    const { data: spotDiagnoses, count, error } = await supabase
      .from('spot_diagnoses')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      spotDiagnoses,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Error fetching spot diagnoses:', error)
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
    const { image_url, youtube_id, media_type, diagnosis, description, key_features, exam_tips, difficulty, category_id } = body

    if (!diagnosis) {
      return NextResponse.json({ error: 'Diagnosis is required' }, { status: 400 })
    }

    const effectiveMediaType = media_type || 'image'

    // Validate media based on type
    if (effectiveMediaType === 'image' && !image_url) {
      return NextResponse.json({ error: 'Image URL is required for image type' }, { status: 400 })
    }
    if (effectiveMediaType === 'video' && !youtube_id) {
      return NextResponse.json({ error: 'YouTube ID is required for video type' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('spot_diagnoses')
      .insert({
        image_url: effectiveMediaType === 'image' ? image_url : null,
        youtube_id: effectiveMediaType === 'video' ? youtube_id : null,
        media_type: effectiveMediaType,
        diagnosis,
        description: description || null,
        key_features: key_features || [],
        exam_tips: exam_tips || null,
        difficulty: difficulty || 'Medium',
        category_id: category_id || null
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ spotDiagnosis: data })
  } catch (error) {
    console.error('Error creating spot diagnosis:', error)
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
    const { id, image_url, youtube_id, media_type, diagnosis, description, key_features, exam_tips, difficulty, category_id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (media_type !== undefined) {
      updateData.media_type = media_type
      // When switching media type, clear the other field
      if (media_type === 'image') {
        updateData.youtube_id = null
        if (image_url !== undefined) updateData.image_url = image_url
      } else if (media_type === 'video') {
        updateData.image_url = null
        if (youtube_id !== undefined) updateData.youtube_id = youtube_id
      }
    } else {
      if (image_url !== undefined) updateData.image_url = image_url
      if (youtube_id !== undefined) updateData.youtube_id = youtube_id
    }
    if (diagnosis !== undefined) updateData.diagnosis = diagnosis
    if (description !== undefined) updateData.description = description
    if (key_features !== undefined) updateData.key_features = key_features
    if (exam_tips !== undefined) updateData.exam_tips = exam_tips
    if (difficulty !== undefined) updateData.difficulty = difficulty
    if (category_id !== undefined) updateData.category_id = category_id

    const { data, error } = await supabase
      .from('spot_diagnoses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ spotDiagnosis: data })
  } catch (error) {
    console.error('Error updating spot diagnosis:', error)
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
      .from('spot_diagnoses')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting spot diagnosis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
