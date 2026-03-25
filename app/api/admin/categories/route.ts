import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET() {
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

    // Get all categories with resource and question counts
    const { data: categories, error } = await supabase
      .from('question_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      throw error
    }

    // Get resource counts per category (count unique files, not chunks)
    // Only count rows where chunk_index = 0 to get unique file count
    const { data: resourceCounts } = await supabase
      .from('category_resources')
      .select('category_id')
      .eq('chunk_index', 0)

    // Get question counts per category
    const { data: questionCounts } = await supabase
      .from('questions')
      .select('category_id')

    // Build counts maps
    const resourceCountMap = new Map<string, number>()
    resourceCounts?.forEach(r => {
      resourceCountMap.set(r.category_id, (resourceCountMap.get(r.category_id) || 0) + 1)
    })

    const questionCountMap = new Map<string, number>()
    questionCounts?.forEach(q => {
      questionCountMap.set(q.category_id, (questionCountMap.get(q.category_id) || 0) + 1)
    })

    // Combine data
    const categoriesWithCounts = categories?.map(cat => ({
      ...cat,
      resource_count: resourceCountMap.get(cat.id) || 0,
      question_count: questionCountMap.get(cat.id) || 0,
    })) || []

    return NextResponse.json({ categories: categoriesWithCounts })
  } catch (error) {
    console.error('Categories error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
