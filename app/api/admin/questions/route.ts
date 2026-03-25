import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const categoryId = searchParams.get('category')
    const questionType = searchParams.get('type')
    const difficulty = searchParams.get('difficulty')
    const trialFeatured = searchParams.get('trialFeatured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query
    let query = supabase
      .from('questions')
      .select(`
        *,
        question_categories (name, slug)
      `, { count: 'exact' })

    if (status) {
      query = query.eq('status', status)
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }
    if (questionType) {
      query = query.eq('question_type', questionType)
    }
    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }
    if (trialFeatured === 'true') {
      query = query.eq('is_trial_featured', true)
    }

    // Pagination
    const offset = (page - 1) * limit
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

    const { data: questions, count, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      questions,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Questions error:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const body = await request.json()
    const { id, ids, approveAll, filters, ...updates } = body

    // Handle "approve all" with filters
    if (approveAll && updates.status === 'approved') {
      let query = supabase
        .from('questions')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user.id
        })
        .neq('status', 'approved') // Only update non-approved questions

      // Apply filters if provided
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.category) {
        query = query.eq('category_id', filters.category)
      }
      if (filters?.type) {
        query = query.eq('question_type', filters.type)
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty)
      }

      const { data, error } = await query.select()

      if (error) {
        throw error
      }

      return NextResponse.json({
        questions: data,
        updated: data?.length || 0
      })
    }

    // Support both single ID and bulk IDs
    const questionIds = ids || (id ? [id] : [])

    if (questionIds.length === 0) {
      return NextResponse.json({ error: 'Question ID(s) required' }, { status: 400 })
    }

    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString()

    // If approving, add approval metadata
    if (updates.status === 'approved') {
      updates.approved_at = new Date().toISOString()
      updates.approved_by = user.id
    }

    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .in('id', questionIds)
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({
      questions: data,
      updated: data?.length || 0
    })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 })
  }
}
