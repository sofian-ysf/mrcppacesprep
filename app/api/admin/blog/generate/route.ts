import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { buildBlogContext } from '@/app/lib/blog-rag'
import { generateBlogPost, generateEnhancedBlogPost } from '@/app/lib/openai'

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

    const {
      categoryId,
      topic,
      targetKeywords,
      wordCountTarget,
      includeFaq,
      enhanceContent = true  // Default to enhanced generation
    } = await request.json()

    // Validate inputs
    if (!categoryId || !topic) {
      return NextResponse.json({
        error: 'categoryId and topic are required'
      }, { status: 400 })
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

    // Create generation job
    const { data: job, error: jobError } = await supabase
      .from('blog_generation_jobs')
      .insert({
        category_id: categoryId,
        topic,
        target_keywords: targetKeywords || [],
        word_count_target: wordCountTarget || 1500,
        include_faq: includeFaq !== false,
        status: 'processing',
        started_at: new Date().toISOString(),
        created_by: user.id,
      })
      .select()
      .single()

    if (jobError) {
      console.error('Job creation error:', jobError)
      throw new Error('Failed to create generation job')
    }

    try {
      // Build RAG context from uploaded resources
      const context = await buildBlogContext(supabase, categoryId, topic)

      if (!context || context.length < 100) {
        throw new Error('Insufficient reference material. Please upload resources for this category first.')
      }

      // Generate the blog post (with optional content enhancement)
      const generatedPost = enhanceContent
        ? await generateEnhancedBlogPost(
            context,
            category.name,
            topic,
            targetKeywords || [],
            wordCountTarget || 1500,
            includeFaq !== false,
            true  // Enable multi-pass enhancement
          )
        : await generateBlogPost(
            context,
            category.name,
            topic,
            targetKeywords || [],
            wordCountTarget || 1500,
            includeFaq !== false
          )

      // Check for duplicate slug and make unique if needed
      let finalSlug = generatedPost.slug
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('slug', finalSlug)
        .single()

      if (existingPost) {
        finalSlug = `${generatedPost.slug}-${Date.now()}`
      }

      // Insert blog post
      const { data: post, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          category_id: categoryId,
          slug: finalSlug,
          title: generatedPost.title,
          excerpt: generatedPost.excerpt,
          content: generatedPost.content,
          meta_title: generatedPost.meta_title,
          meta_description: generatedPost.meta_description,
          meta_keywords: generatedPost.meta_keywords,
          tags: generatedPost.tags,
          read_time_minutes: generatedPost.read_time_minutes,
          faq_items: generatedPost.faq_items,
          internal_links: generatedPost.internal_linking_suggestions,
          schema_json: generatedPost.schema_json,
          status: 'draft',
          generation_job_id: job.id,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Post insert error:', insertError)
        throw new Error('Failed to save blog post')
      }

      // Update job as completed
      await supabase
        .from('blog_generation_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', job.id)

      return NextResponse.json({
        success: true,
        jobId: job.id,
        postId: post.id,
        slug: post.slug,
      })
    } catch (genError) {
      // Update job as failed
      await supabase
        .from('blog_generation_jobs')
        .update({
          status: 'failed',
          error_message: (genError as Error).message,
          completed_at: new Date().toISOString(),
        })
        .eq('id', job.id)

      throw genError
    }
  } catch (error) {
    console.error('Blog generation error:', error)
    return NextResponse.json({
      error: (error as Error).message || 'Failed to generate blog post'
    }, { status: 500 })
  }
}

// GET - List recent generation jobs
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

    const { data: jobs, error } = await supabase
      .from('blog_generation_jobs')
      .select(`
        *,
        blog_categories (name)
      `)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Get blog jobs error:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}
