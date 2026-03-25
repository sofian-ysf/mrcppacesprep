import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import {
  checkAllAchievements,
  getNewlyEarnedAchievements,
  type Achievement,
  type UserStats
} from '@/app/lib/achievements/checker'

// GET - Fetch all achievements with user progress
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all achievement definitions
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .order('sort_order', { ascending: true })

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError)
      return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
    }

    // Fetch user's earned achievements
    const { data: earnedAchievements, error: earnedError } = await supabase
      .from('user_achievements')
      .select('achievement_id, earned_at, notified')
      .eq('user_id', user.id)

    if (earnedError && earnedError.code !== 'PGRST116') {
      console.error('Error fetching earned achievements:', earnedError)
    }

    const earnedIds = (earnedAchievements || []).map(ea => ea.achievement_id)
    const earnedMap = new Map(
      (earnedAchievements || []).map(ea => [ea.achievement_id, ea])
    )

    // Fetch user stats to calculate progress
    const userStats = await fetchUserStats(supabase, user.id)

    // Check all achievements
    const achievementChecks = checkAllAchievements(
      achievements as Achievement[],
      userStats,
      earnedIds
    )

    // Check for newly earned achievements
    const newlyEarned = getNewlyEarnedAchievements(
      achievements as Achievement[],
      userStats,
      earnedIds
    )

    // Award newly earned achievements
    if (newlyEarned.length > 0) {
      const newAchievementRecords = newlyEarned.map(a => ({
        user_id: user.id,
        achievement_id: a.id,
        notified: false
      }))

      const { error: insertError } = await supabase
        .from('user_achievements')
        .upsert(newAchievementRecords, {
          onConflict: 'user_id,achievement_id'
        })

      if (insertError) {
        console.error('Error awarding achievements:', insertError)
      }
    }

    // Format response
    const formattedAchievements = achievementChecks.map(check => ({
      ...check.achievement,
      isEarned: check.isEarned || earnedIds.includes(check.achievement.id),
      progress: check.progress,
      progressText: check.progressText,
      earnedAt: earnedMap.get(check.achievement.id)?.earned_at || null,
      notified: earnedMap.get(check.achievement.id)?.notified ?? true
    }))

    // Get unnotified achievements
    const unnotified = formattedAchievements.filter(
      a => a.isEarned && !a.notified
    )

    return NextResponse.json({
      achievements: formattedAchievements,
      stats: {
        total: achievements?.length || 0,
        earned: earnedIds.length + newlyEarned.length,
        newlyEarned: newlyEarned.map(a => a.slug)
      },
      unnotified
    })
  } catch (error) {
    console.error('Achievements error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Mark achievements as notified
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { achievement_ids } = await request.json()

    if (!achievement_ids || !Array.isArray(achievement_ids)) {
      return NextResponse.json({ error: 'achievement_ids array required' }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from('user_achievements')
      .update({ notified: true })
      .eq('user_id', user.id)
      .in('achievement_id', achievement_ids)

    if (updateError) {
      console.error('Error marking achievements as notified:', updateError)
      return NextResponse.json({ error: 'Failed to update achievements' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Achievements POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to fetch all stats needed for achievement checking
async function fetchUserStats(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<UserStats> {
  // Fetch question stats
  const { data: answers } = await supabase
    .from('user_answers')
    .select('is_correct, questions(category_id, question_categories(slug))')
    .eq('user_id', userId)

  const questionsAnswered = answers?.length || 0
  const questionsCorrect = answers?.filter(a => a.is_correct).length || 0
  const overallAccuracy = questionsAnswered > 0
    ? (questionsCorrect / questionsAnswered) * 100
    : 0

  // Calculate category accuracies
  const categoryStats = new Map<string, { correct: number; total: number }>()
  answers?.forEach(answer => {
    const categorySlug = (answer.questions as { question_categories?: { slug: string } })?.question_categories?.slug
    if (categorySlug) {
      const current = categoryStats.get(categorySlug) || { correct: 0, total: 0 }
      current.total++
      if (answer.is_correct) current.correct++
      categoryStats.set(categorySlug, current)
    }
  })

  const categoryAccuracies = Array.from(categoryStats.entries()).map(([slug, stats]) => ({
    categorySlug: slug,
    accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
  }))

  // Fetch flashcard stats
  const { data: flashcardProgress } = await supabase
    .from('user_flashcard_progress')
    .select('interval_days')
    .eq('user_id', userId)

  const { count: totalFlashcards } = await supabase
    .from('flashcards')
    .select('*', { count: 'exact', head: true })

  const flashcardsReviewed = flashcardProgress?.length || 0
  const flashcardsMastered = flashcardProgress?.filter(p => p.interval_days >= 21).length || 0

  // Fetch review history count
  const { count: reviewCount } = await supabase
    .from('flashcard_review_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Fetch mock exam stats
  const { data: mockExams } = await supabase
    .from('mock_exam_results')
    .select('score_percentage')
    .eq('user_id', userId)

  const mockExamsCompleted = mockExams?.length || 0
  const mockScores = mockExams?.map(m => m.score_percentage) || []
  const highestMockScore = mockScores.length > 0 ? Math.max(...mockScores) : null
  const latestMockScore = mockScores.length > 0 ? mockScores[mockScores.length - 1] : null

  // Calculate streak (from flashcard reviews)
  let streakDays = 0
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

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      streakDays = 1
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1])
        const currDate = new Date(sortedDates[i])
        const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000)

        if (diffDays === 1) {
          streakDays++
        } else {
          break
        }
      }
    }
  }

  // Count daily goals completed
  const { count: dailyGoalsCompleted } = await supabase
    .from('user_daily_activity')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('questions_answered', 10) // Assume 10+ questions = goal met

  return {
    questionsAnswered,
    questionsCorrect,
    overallAccuracy,
    categoryAccuracies,
    flashcardsReviewed: reviewCount || 0,
    flashcardsMastered,
    totalFlashcards: totalFlashcards || 0,
    mockExamsCompleted,
    latestMockScore,
    highestMockScore,
    streakDays,
    dailyGoalsCompleted: dailyGoalsCompleted || 0
  }
}
