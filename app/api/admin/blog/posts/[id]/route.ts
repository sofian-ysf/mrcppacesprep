import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { pingAllSearchEngines } from '@/app/lib/indexnow'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET - Get single post
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
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

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories (id, name, slug)
      `)
      .eq('id', id)
      .single()

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Get blog post error:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

// PUT - Update post
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
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

    const updates = await request.json()

    // If changing slug, check for duplicates
    if (updates.slug) {
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', updates.slug)
        .neq('id', id)
        .single()

      if (existingPost) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }
    }

    // If publishing, set published_at and published_by
    if (updates.status === 'published') {
      const { data: currentPost } = await supabase
        .from('blog_posts')
        .select('status, published_at')
        .eq('id', id)
        .single()

      if (currentPost?.status !== 'published') {
        updates.published_at = new Date().toISOString()
        updates.published_by = user.id
      }
    }

    // Update the post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        blog_categories (id, name, slug)
      `)
      .single()

    if (error) {
      console.error('Update error:', error)
      throw error
    }

    // Ping all search engines when a post is published
    if (updates.status === 'published' && post?.slug) {
      console.log(`[SEO] Blog published, pinging search engines: /blog/${post.slug}`)
      pingAllSearchEngines(post.slug).catch(err => {
        console.error('Search engine ping failed:', err)
      })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Update blog post error:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

// DELETE - Delete post
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
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

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete blog post error:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
