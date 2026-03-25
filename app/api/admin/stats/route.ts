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

    // Get question counts by status
    const { data: statusCounts } = await supabase
      .from('questions')
      .select('status')

    const totalQuestions = statusCounts?.length || 0
    const approvedQuestions = statusCounts?.filter(q => q.status === 'approved').length || 0
    const pendingReview = statusCounts?.filter(q => q.status === 'review').length || 0
    const draftQuestions = statusCounts?.filter(q => q.status === 'draft').length || 0

    // Get category count
    const { count: totalCategories } = await supabase
      .from('question_categories')
      .select('*', { count: 'exact', head: true })

    // Get recent generation jobs
    const { data: recentJobs } = await supabase
      .from('generation_jobs')
      .select(`
        id,
        question_type,
        quantity,
        status,
        questions_generated,
        created_at,
        question_categories (name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get questions by category
    const { data: questionsByCategory } = await supabase
      .from('questions')
      .select('category_id, question_categories(name)')

    // Count questions per category
    const categoryCountMap = new Map<string, number>()
    questionsByCategory?.forEach(q => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const categories = q.question_categories as any
      const categoryName = categories?.name || 'Unknown'
      categoryCountMap.set(categoryName, (categoryCountMap.get(categoryName) || 0) + 1)
    })

    const questionsByCategoryArray = Array.from(categoryCountMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      totalQuestions,
      approvedQuestions,
      pendingReview,
      draftQuestions,
      totalCategories: totalCategories || 0,
      recentJobs: recentJobs?.map(job => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jobCategories = job.question_categories as any
        return {
        id: job.id,
        category_name: jobCategories?.name || 'Unknown',
        question_type: job.question_type,
        quantity: job.quantity,
        status: job.status,
        questions_generated: job.questions_generated,
        created_at: job.created_at
      }
      }) || [],
      questionsByCategory: questionsByCategoryArray
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
