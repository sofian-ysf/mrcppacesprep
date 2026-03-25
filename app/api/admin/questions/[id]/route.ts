import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const { data: question, error } = await supabase
      .from('questions')
      .select(`
        *,
        question_categories (id, name, slug)
      `)
      .eq('id', id)
      .single()

    if (error || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    return NextResponse.json({ question })
  } catch (error) {
    console.error('Single question error:', error)
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 })
  }
}
