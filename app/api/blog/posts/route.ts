import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

// GET - List published blog posts (public)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const searchParams = request.nextUrl.searchParams
    const categorySlug = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const featured = searchParams.get('featured') === 'true'

    let query = supabase
      .from('blog_posts')
      .select(`
        id,
        slug,
        title,
        excerpt,
        featured_image,
        author_name,
        read_time_minutes,
        tags,
        featured,
        published_at,
        blog_categories (id, slug, name)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (featured) {
      query = query.eq('featured', true)
    }

    if (categorySlug) {
      // Join with categories to filter by slug
      const { data: category } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (category) {
        query = query.eq('category_id', category.id)
      }
    }

    const { data: posts, error } = await query

    if (error) throw error

    return NextResponse.json({ posts: posts || [] })
  } catch (error) {
    console.error('Get blog posts error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
