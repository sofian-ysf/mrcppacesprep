import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { buildBlogContext } from '@/app/lib/blog-rag'
import { suggestBlogTopics } from '@/app/lib/openai'

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

    const { categoryId } = await request.json()

    if (!categoryId) {
      return NextResponse.json({ error: 'categoryId is required' }, { status: 400 })
    }

    // Get category
    const { data: category, error: categoryError } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('id', categoryId)
      .single()

    if (categoryError || !category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Get existing post titles to avoid duplicates
    const { data: existingPosts } = await supabase
      .from('blog_posts')
      .select('title')
      .eq('category_id', categoryId)

    const existingTopics = existingPosts?.map(p => p.title) || []

    // Build context from resources
    const context = await buildBlogContext(supabase, categoryId, '')

    if (!context || context.length < 50) {
      return NextResponse.json({
        error: 'Insufficient reference material. Please upload resources for this category first.'
      }, { status: 400 })
    }

    // Get topic suggestions
    const suggestions = await suggestBlogTopics(category.name, context, existingTopics)

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Topic suggestion error:', error)
    return NextResponse.json({
      error: (error as Error).message || 'Failed to suggest topics'
    }, { status: 500 })
  }
}
