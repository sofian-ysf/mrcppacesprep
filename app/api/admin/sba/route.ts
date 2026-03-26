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
    const categoryId = searchParams.get('category_id')
    const difficulty = searchParams.get('difficulty')
    const offset = (page - 1) * limit

    let query = supabase
      .from('sba_questions')
      .select(`
        *,
        sba_categories (id, name, slug)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    const { data: questions, count, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get categories for filtering
    const { data: categories } = await supabase
      .from('sba_categories')
      .select('id, name, slug')
      .order('name', { ascending: true })

    return NextResponse.json({
      questions,
      categories: categories || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Error fetching SBA questions:', error)
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
      category_id,
      question_text,
      options,
      correct_answer,
      explanation,
      key_points,
      clinical_pearl,
      exam_tip,
      difficulty
    } = body

    if (!question_text || !options || !correct_answer) {
      return NextResponse.json({ error: 'Question text, options, and correct answer are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('sba_questions')
      .insert({
        category_id: category_id || null,
        question_text,
        options,
        correct_answer,
        explanation: explanation || null,
        key_points: key_points || [],
        clinical_pearl: clinical_pearl || null,
        exam_tip: exam_tip || null,
        difficulty: difficulty || 'Medium'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ question: data })
  } catch (error) {
    console.error('Error creating SBA question:', error)
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
      'category_id', 'question_text', 'options', 'correct_answer',
      'explanation', 'key_points', 'clinical_pearl', 'exam_tip', 'difficulty'
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (updateFields[field] !== undefined) {
        updateData[field] = updateFields[field]
      }
    }

    const { data, error } = await supabase
      .from('sba_questions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ question: data })
  } catch (error) {
    console.error('Error updating SBA question:', error)
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
      .from('sba_questions')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting SBA question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
