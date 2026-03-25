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

    // Build query - only fetch IDs for performance
    let query = supabase
      .from('questions')
      .select('id', { count: 'exact' })

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

    query = query.order('created_at', { ascending: false })

    const { data: questions, count, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      ids: questions?.map(q => q.id) || [],
      total: count || 0
    })
  } catch (error) {
    console.error('Question IDs error:', error)
    return NextResponse.json({ error: 'Failed to fetch question IDs' }, { status: 500 })
  }
}
