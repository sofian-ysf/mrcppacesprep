import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { generateRecommendations, type StudyContext } from '@/app/lib/recommendations/engine'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all necessary data for recommendations
    const context = await buildStudyContext(supabase, user.id)

    // Generate recommendations
    const recommendations = generateRecommendations(context)

    return NextResponse.json({
      recommendations,
      context: {
        flashcardsDue: context.flashcardsDue,
        questionsDue: context.questionsDue,
        daysUntilExam: context.daysUntilExam,
        overallAccuracy: context.overallAccuracy
      }
    })
  } catch (error) {
    console.error('Recommendations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function buildStudyContext(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<StudyContext> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  // Fetch flashcard stats
  const { count: flashcardsDue } = await supabase
    .from('user_flashcard_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .lte('due_date', today.toISOString())

  const { data: flashcardProgress } = await supabase
    .from('user_flashcard_progress')
    .select('interval_days')
    .eq('user_id', userId)

  const { count: totalFlashcards } = await supabase
    .from('flashcards')
    .select('*', { count: 'exact', head: true })

  const flashcardsMastered = flashcardProgress?.filter(p => p.interval_days >= 21).length || 0

  // Calculate streak
  let flashcardStreakDays = 0
  const { data: reviewHistory } = await supabase
    .from('flashcard_review_history')
    .select('reviewed_at')
    .eq('user_id', userId)
    .order('reviewed_at', { ascending: false })
    .limit(365)

  if (reviewHistory && reviewHistory.length > 0) {
    const uniqueDates = new Set(
      reviewHistory.map(r => new Date(r.reviewed_at).toISOString().split('T')[0])
    )
    const sortedDates = Array.from(uniqueDates).sort().reverse()

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (sortedDates[0] === todayStr || sortedDates[0] === yesterday) {
      flashcardStreakDays = 1
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1])
        const currDate = new Date(sortedDates[i])
        const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000)

        if (diffDays === 1) {
          flashcardStreakDays++
        } else {
          break
        }
      }
    }
  }

  // Fetch question stats
  const { count: questionsDue } = await supabase
    .from('user_question_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .lte('due_date', today.toISOString())

  const { data: answers } = await supabase
    .from('user_answers')
    .select('is_correct, questions(category_id, question_categories(name, slug))')
    .eq('user_id', userId)

  const questionsAnswered = answers?.length || 0
  const questionsCorrect = answers?.filter(a => a.is_correct).length || 0
  const overallAccuracy = questionsAnswered > 0 ? (questionsCorrect / questionsAnswered) * 100 : 0

  // Calculate weak categories
  const categoryStats = new Map<string, { name: string; slug: string; correct: number; total: number }>()
  answers?.forEach(answer => {
    const category = (answer.questions as { question_categories?: { name: string; slug: string } })?.question_categories
    if (category) {
      const current = categoryStats.get(category.slug) || { name: category.name, slug: category.slug, correct: 0, total: 0 }
      current.total++
      if (answer.is_correct) current.correct++
      categoryStats.set(category.slug, current)
    }
  })

  const weakCategories = Array.from(categoryStats.values())
    .filter(cat => cat.total >= 5 && (cat.correct / cat.total) * 100 < 70)
    .map(cat => ({
      name: cat.name,
      slug: cat.slug,
      accuracy: (cat.correct / cat.total) * 100
    }))
    .sort((a, b) => a.accuracy - b.accuracy)

  // Fetch mock exam stats
  const { data: mockExams } = await supabase
    .from('mock_exam_results')
    .select('completed_at, score_percentage')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  const mockExamsCompleted = mockExams?.length || 0
  const lastMockScore = mockExams && mockExams.length > 0 ? mockExams[0].score_percentage : null
  const daysSinceLastMock = mockExams && mockExams.length > 0
    ? Math.floor((Date.now() - new Date(mockExams[0].completed_at).getTime()) / (1000 * 60 * 60 * 24))
    : null

  // Fetch user settings
  const { data: settings } = await supabase
    .from('user_settings')
    .select('exam_date, daily_question_goal, daily_flashcard_goal')
    .eq('user_id', userId)
    .single()

  const daysUntilExam = settings?.exam_date
    ? Math.ceil((new Date(settings.exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  // Fetch daily activity
  const { data: dailyActivity } = await supabase
    .from('user_daily_activity')
    .select('questions_answered')
    .eq('user_id', userId)
    .eq('activity_date', todayStr)
    .single()

  // Get today's flashcard reviews
  const { count: flashcardsToday } = await supabase
    .from('flashcard_review_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('reviewed_at', `${todayStr}T00:00:00`)
    .lt('reviewed_at', `${todayStr}T23:59:59`)

  return {
    flashcardsDue: flashcardsDue || 0,
    flashcardsMastered,
    totalFlashcards: totalFlashcards || 0,
    flashcardStreakDays,
    questionsDue: questionsDue || 0,
    questionsAnswered,
    overallAccuracy,
    weakCategories,
    mockExamsCompleted,
    daysSinceLastMock,
    lastMockScore,
    dailyQuestionsGoal: settings?.daily_question_goal || 20,
    dailyQuestionsCompleted: dailyActivity?.questions_answered || 0,
    dailyFlashcardsGoal: settings?.daily_flashcard_goal || 50,
    dailyFlashcardsCompleted: flashcardsToday || 0,
    daysUntilExam
  }
}
