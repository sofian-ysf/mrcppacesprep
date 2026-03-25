import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

// GET - List all blog posts with filtering
export async function GET(request: NextRequest) {
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

    // Get query params for filtering
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const categoryId = searchParams.get('category')

    // Build query
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories (id, name, slug)
      `, { count: 'exact' })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    // Pagination
    const offset = (page - 1) * limit
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: posts, count, error } = await query

    if (error) throw error

    return NextResponse.json({
      posts: posts || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Get blog posts error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// POST - Create new blog post manually
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

    const postData = await request.json()

    // Validate required fields
    if (!postData.title || !postData.slug || !postData.category_id || !postData.content) {
      return NextResponse.json({
        error: 'title, slug, category_id, and content are required'
      }, { status: 400 })
    }

    // Check for duplicate slug
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', postData.slug)
      .single()

    if (existingPost) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Create the post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        category_id: postData.category_id,
        slug: postData.slug,
        title: postData.title,
        excerpt: postData.excerpt || '',
        content: postData.content,
        featured_image: postData.featured_image,
        author_name: postData.author_name || 'PreRegExamPrep Team',
        author_title: postData.author_title,
        read_time_minutes: postData.read_time_minutes || 5,
        tags: postData.tags || [],
        meta_title: postData.meta_title,
        meta_description: postData.meta_description,
        meta_keywords: postData.meta_keywords || [],
        faq_items: postData.faq_items || [],
        status: 'draft',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Create blog post error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
