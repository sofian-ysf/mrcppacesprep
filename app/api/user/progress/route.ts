import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all user answers with question and category info
    const { data: answers, error: answersError } = await supabase
      .from('user_answers')
      .select(`
        id,
        is_correct,
        time_taken_seconds,
        created_at,
        questions (
          id,
          question_type,
          difficulty,
          category_id,
          question_categories (
            id,
            name,
            slug,
            question_type
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (answersError) {
      console.error('Error fetching answers:', answersError)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    // Calculate overall stats
    const totalAnswered = answers?.length || 0
    const correctAnswers = answers?.filter(a => a.is_correct).length || 0
    const overallAccuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0
    const totalTimeSeconds = answers?.reduce((sum, a) => sum + (a.time_taken_seconds || 0), 0) || 0

    // Calculate stats by category
    const categoryStats: Record<string, {
      name: string
      slug: string
      type: string
      total: number
      correct: number
      accuracy: number
    }> = {}

    answers?.forEach(answer => {
      const category = (answer.questions as any)?.question_categories
      if (category) {
        if (!categoryStats[category.id]) {
          categoryStats[category.id] = {
            name: category.name,
            slug: category.slug,
            type: category.question_type,
            total: 0,
            correct: 0,
            accuracy: 0
          }
        }
        categoryStats[category.id].total++
        if (answer.is_correct) {
          categoryStats[category.id].correct++
        }
      }
    })

    // Calculate accuracy for each category
    Object.values(categoryStats).forEach(stat => {
      stat.accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
    })

    // Calculate stats by difficulty
    const difficultyStats: Record<string, { total: number; correct: number; accuracy: number }> = {
      'Easy': { total: 0, correct: 0, accuracy: 0 },
      'Medium': { total: 0, correct: 0, accuracy: 0 },
      'Hard': { total: 0, correct: 0, accuracy: 0 }
    }

    answers?.forEach(answer => {
      const difficulty = (answer.questions as any)?.difficulty
      if (difficulty && difficultyStats[difficulty]) {
        difficultyStats[difficulty].total++
        if (answer.is_correct) {
          difficultyStats[difficulty].correct++
        }
      }
    })

    Object.values(difficultyStats).forEach(stat => {
      stat.accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
    })

    // Calculate stats by question type
    const typeStats: Record<string, { total: number; correct: number; accuracy: number }> = {
      'sba': { total: 0, correct: 0, accuracy: 0 },
      'emq': { total: 0, correct: 0, accuracy: 0 },
      'calculation': { total: 0, correct: 0, accuracy: 0 }
    }

    answers?.forEach(answer => {
      const type = (answer.questions as any)?.question_type
      if (type && typeStats[type]) {
        typeStats[type].total++
        if (answer.is_correct) {
          typeStats[type].correct++
        }
      }
    })

    Object.values(typeStats).forEach(stat => {
      stat.accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
    })

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentAnswers = answers?.filter(a => new Date(a.created_at) >= sevenDaysAgo) || []
    const recentTotal = recentAnswers.length
    const recentCorrect = recentAnswers.filter(a => a.is_correct).length
    const recentAccuracy = recentTotal > 0 ? Math.round((recentCorrect / recentTotal) * 100) : 0

    // Daily activity for the last 7 days
    const dailyActivity: { date: string; total: number; correct: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const dayAnswers = answers?.filter(a =>
        a.created_at.split('T')[0] === dateStr
      ) || []

      dailyActivity.push({
        date: dateStr,
        total: dayAnswers.length,
        correct: dayAnswers.filter(a => a.is_correct).length
      })
    }

    return NextResponse.json({
      overall: {
        totalAnswered,
        correctAnswers,
        accuracy: overallAccuracy,
        totalTimeSeconds
      },
      recent: {
        totalAnswered: recentTotal,
        correctAnswers: recentCorrect,
        accuracy: recentAccuracy
      },
      byCategory: Object.values(categoryStats).sort((a, b) => b.total - a.total),
      byDifficulty: difficultyStats,
      byType: typeStats,
      dailyActivity
    })
  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
