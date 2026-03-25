import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

// GET - List all blog categories with counts
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    // Get resource counts (unique files only, not chunks)
    const { data: resourceCounts } = await supabase
      .from('blog_resources')
      .select('category_id')
      .eq('chunk_index', 0)

    // Get post counts by status
    const { data: postCounts } = await supabase
      .from('blog_posts')
      .select('category_id, status')

    const resourceCountMap = new Map<string, number>()
    resourceCounts?.forEach(r => {
      resourceCountMap.set(r.category_id, (resourceCountMap.get(r.category_id) || 0) + 1)
    })

    const postCountMap = new Map<string, { total: number; published: number; draft: number }>()
    postCounts?.forEach(p => {
      const current = postCountMap.get(p.category_id) || { total: 0, published: 0, draft: 0 }
      current.total++
      if (p.status === 'published') current.published++
      if (p.status === 'draft') current.draft++
      postCountMap.set(p.category_id, current)
    })

    const categoriesWithCounts = categories?.map(cat => ({
      ...cat,
      resource_count: resourceCountMap.get(cat.id) || 0,
      post_count: postCountMap.get(cat.id)?.total || 0,
      published_count: postCountMap.get(cat.id)?.published || 0,
      draft_count: postCountMap.get(cat.id)?.draft || 0,
    })) || []

    return NextResponse.json({ categories: categoriesWithCounts })
  } catch (error) {
    console.error('Blog categories error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST - Create new blog category
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const { name, slug, description, icon } = await request.json()

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Get max sort_order
    const { data: maxOrder } = await supabase
      .from('blog_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const { data: category, error } = await supabase
      .from('blog_categories')
      .insert({
        name,
        slug,
        description,
        icon,
        sort_order: (maxOrder?.sort_order || 0) + 1,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Create blog category error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
