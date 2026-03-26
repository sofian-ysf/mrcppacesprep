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
    const category = searchParams.get('category')
    const offset = (page - 1) * limit

    let query = supabase
      .from('differentials')
      .select('*', { count: 'exact' })
      .order('sign_name', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data: differentials, count, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get unique categories
    const { data: categoriesData } = await supabase
      .from('differentials')
      .select('category')
      .not('category', 'is', null)

    const categories = [...new Set(categoriesData?.map(c => c.category).filter(Boolean))]

    return NextResponse.json({
      differentials,
      categories,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Error fetching differentials:', error)
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
    const { sign_name, category, differentials_list, memory_aid, exam_relevance } = body

    if (!sign_name) {
      return NextResponse.json({ error: 'Sign name is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('differentials')
      .insert({
        sign_name,
        category: category || null,
        differentials_list: differentials_list || { common: [], less_common: [], rare_but_important: [] },
        memory_aid: memory_aid || null,
        exam_relevance: exam_relevance || null
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ differential: data })
  } catch (error) {
    console.error('Error creating differential:', error)
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
    const { id, sign_name, category, differentials_list, memory_aid, exam_relevance } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (sign_name !== undefined) updateData.sign_name = sign_name
    if (category !== undefined) updateData.category = category
    if (differentials_list !== undefined) updateData.differentials_list = differentials_list
    if (memory_aid !== undefined) updateData.memory_aid = memory_aid
    if (exam_relevance !== undefined) updateData.exam_relevance = exam_relevance

    const { data, error } = await supabase
      .from('differentials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ differential: data })
  } catch (error) {
    console.error('Error updating differential:', error)
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
      .from('differentials')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting differential:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
