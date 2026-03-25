import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateEnhancedBlogPost, suggestBlogTopics } from '@/app/lib/openai'
import { buildBlogContext } from '@/app/lib/blog-rag'
import { pingAllSearchEngines } from '@/app/lib/indexnow'

// Create Supabase client lazily to avoid build-time errors
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(url, key)
}

// Verify cron secret for security
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.warn('CRON_SECRET not set - cron jobs disabled')
    return false
  }

  return authHeader === `Bearer ${cronSecret}`
}

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('Starting automated blog generation...')

    const supabase = getSupabaseClient()

    // 1. Get categories that have resources
    const { data: categories, error: catError } = await supabase
      .from('blog_categories')
      .select(`
        id,
        slug,
        name,
        blog_resources(id)
      `)

    if (catError || !categories?.length) {
      throw new Error('Failed to fetch categories or no categories found')
    }

    // Filter to categories with resources
    const categoriesWithResources = categories.filter(
      cat => cat.blog_resources && cat.blog_resources.length > 0
    )

    if (categoriesWithResources.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No categories with resources available'
      })
    }

    // 2. Pick a random category
    const randomCategory = categoriesWithResources[
      Math.floor(Math.random() * categoriesWithResources.length)
    ]

    console.log(`Selected category: ${randomCategory.name}`)

    // 3. Get existing post titles to avoid duplicates
    const { data: existingPosts } = await supabase
      .from('blog_posts')
      .select('title')
      .eq('category_id', randomCategory.id)

    const existingTopics = existingPosts?.map(p => p.title) || []

    // 4. Build context from resources
    const context = await buildBlogContext(supabase, randomCategory.id, '')

    if (!context || context.length < 100) {
      return NextResponse.json({
        success: false,
        message: `Insufficient context for category: ${randomCategory.name}`
      })
    }

    // 5. Suggest a new topic
    console.log('Suggesting topic...')
    const suggestions = await suggestBlogTopics(
      randomCategory.name,
      context,
      existingTopics
    )

    if (!suggestions.topics?.length) {
      throw new Error('Failed to generate topic suggestions')
    }

    // Pick the first suggested topic
    const selectedTopic = suggestions.topics[0]
    console.log(`Selected topic: ${selectedTopic.title}`)

    // 6. Create a generation job record
    const { data: job, error: jobError } = await supabase
      .from('blog_generation_jobs')
      .insert({
        category_id: randomCategory.id,
        topic: selectedTopic.title,
        target_keywords: selectedTopic.keywords,
        word_count_target: 1500,
        include_faq: true,
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (jobError) {
      throw new Error(`Failed to create generation job: ${jobError.message}`)
    }

    // 7. Generate the enhanced blog post
    console.log('Generating enhanced blog post...')
    const blogPost = await generateEnhancedBlogPost(
      context,
      randomCategory.name,
      selectedTopic.title,
      selectedTopic.keywords,
      1500,  // word count target
      true,  // include FAQ
      true   // enhance content (multi-pass)
    )

    // 8. Save the blog post for review (not auto-published for quality control)
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        category_id: randomCategory.id,
        slug: blogPost.slug,
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        meta_title: blogPost.meta_title,
        meta_description: blogPost.meta_description,
        meta_keywords: blogPost.meta_keywords,
        tags: blogPost.tags,
        read_time_minutes: blogPost.read_time_minutes,
        faq_items: blogPost.faq_items,
        internal_links: blogPost.internal_linking_suggestions,
        schema_json: blogPost.schema_json,
        status: 'review',
        generation_job_id: job.id,
        author_name: 'Alex Jensing, MPharm'
      })
      .select()
      .single()

    if (postError) {
      // Update job status to failed
      await supabase
        .from('blog_generation_jobs')
        .update({
          status: 'failed',
          error_message: postError.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id)

      throw new Error(`Failed to save blog post: ${postError.message}`)
    }

    // 9. Update job status to completed
    await supabase
      .from('blog_generation_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', job.id)

    console.log(`Successfully generated blog post for review: ${post.title}`)

    // Note: Search engine pinging moved to publish action
    // Posts are saved as 'review' status for quality control before publishing

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: randomCategory.name,
        status: post.status,
        wordCount: blogPost.content.split(/\s+/).length,
        readTime: post.read_time_minutes
      }
    })

  } catch (error) {
    console.error('Cron blog generation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Also allow POST for manual triggering (with same auth)
export async function POST(request: NextRequest) {
  return GET(request)
}
