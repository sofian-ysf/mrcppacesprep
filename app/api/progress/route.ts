import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

interface ModuleStats {
  viewed: number
  completed: number
  answered?: number
  correct?: number
  accuracy?: number
}

interface WeakArea {
  category: string
  accuracy: number
  total: number
}

interface ProgressResponse {
  overall: {
    totalStudyTimeSeconds: number
    currentStreak: number
    contentCompleted: number
    lastActivityAt: string | null
  }
  modules: {
    spotDiagnosis: ModuleStats
    stations: ModuleStats
    differentials: ModuleStats
    sba: ModuleStats & { answered: number; correct: number; accuracy: number }
    checklists: ModuleStats
  }
  weakAreas: WeakArea[]
  recommendations: string[]
  dailyActivity: { date: string; total: number }[]
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's progress summary
    const { data: userProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Fetch all user activity
    const { data: activities, error: activitiesError } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError)
    }

    // Fetch SBA answers for accuracy calculation
    const { data: sbaAnswers, error: sbaError } = await supabase
      .from('user_answers')
      .select(`
        id,
        is_correct,
        time_taken_seconds,
        created_at,
        question_id,
        sba_questions (
          id,
          category_id,
          sba_categories (
            id,
            name,
            slug
          )
        )
      `)
      .eq('user_id', user.id)

    if (sbaError) {
      console.error('Error fetching SBA answers:', sbaError)
    }

    // Initialize module stats
    const moduleStats: ProgressResponse['modules'] = {
      spotDiagnosis: { viewed: 0, completed: 0 },
      stations: { viewed: 0, completed: 0 },
      differentials: { viewed: 0, completed: 0 },
      sba: { viewed: 0, completed: 0, answered: 0, correct: 0, accuracy: 0 },
      checklists: { viewed: 0, completed: 0 }
    }

    // Process activity data
    const contentIds = new Set<string>()

    activities?.forEach(activity => {
      const moduleType = activity.module_type
      const action = activity.action
      const contentId = activity.content_id

      // Track unique content
      contentIds.add(contentId)

      // Map module types to our stats object
      const moduleMap: Record<string, keyof typeof moduleStats> = {
        'spot_diagnosis': 'spotDiagnosis',
        'station': 'stations',
        'differential': 'differentials',
        'sba': 'sba',
        'checklist': 'checklists'
      }

      const moduleKey = moduleMap[moduleType]
      if (moduleKey) {
        if (action === 'viewed') {
          moduleStats[moduleKey].viewed++
        }
        if (action === 'completed') {
          moduleStats[moduleKey].completed++
        }
        if (action === 'answered' && moduleKey === 'sba') {
          moduleStats.sba.answered = (moduleStats.sba.answered || 0) + 1
          if (activity.result === 'correct') {
            moduleStats.sba.correct = (moduleStats.sba.correct || 0) + 1
          }
        }
      }
    })

    // Use SBA answers for more accurate SBA stats
    if (sbaAnswers && sbaAnswers.length > 0) {
      const totalAnswered = sbaAnswers.length
      const correctAnswers = sbaAnswers.filter(a => a.is_correct).length
      moduleStats.sba.answered = totalAnswered
      moduleStats.sba.correct = correctAnswers
      moduleStats.sba.accuracy = totalAnswered > 0
        ? Math.round((correctAnswers / totalAnswered) * 100)
        : 0
    }

    // Calculate weak areas (categories with <70% accuracy)
    const categoryStats: Record<string, { name: string; total: number; correct: number }> = {}

    sbaAnswers?.forEach(answer => {
      const question = answer.sba_questions as any
      const category = question?.sba_categories
      if (category) {
        const categoryId = category.id
        if (!categoryStats[categoryId]) {
          categoryStats[categoryId] = {
            name: category.name,
            total: 0,
            correct: 0
          }
        }
        categoryStats[categoryId].total++
        if (answer.is_correct) {
          categoryStats[categoryId].correct++
        }
      }
    })

    const weakAreas: WeakArea[] = Object.values(categoryStats)
      .map(cat => ({
        category: cat.name,
        accuracy: cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0,
        total: cat.total
      }))
      .filter(cat => cat.accuracy < 70 && cat.total >= 3) // Only show if attempted at least 3 questions
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5)

    // Generate recommendations based on activity
    const recommendations: string[] = []

    // Check station activity by station number
    const stationActivities = activities?.filter(a => a.module_type === 'station') || []
    const stationNumbers = new Set(stationActivities.map(a => {
      // We'd need to join with stations table to get station_number
      // For now, make general recommendations
      return a.content_id
    }))

    // Low activity recommendations
    if (moduleStats.spotDiagnosis.viewed < 10) {
      recommendations.push('Practice more Spot Diagnoses - essential for Station 5')
    }
    if (moduleStats.stations.completed < 5) {
      recommendations.push('Complete more Station practice scenarios')
    }
    if (moduleStats.differentials.viewed < 20) {
      recommendations.push('Review differential diagnosis flashcards')
    }
    if (moduleStats.checklists.completed < 3) {
      recommendations.push('Work through examination checklists for Station 1 & 3')
    }

    // Weak area recommendations
    weakAreas.forEach(area => {
      recommendations.push(`Focus on ${area.category} - ${area.accuracy}% accuracy`)
    })

    // Limit recommendations
    const limitedRecommendations = recommendations.slice(0, 4)

    // Calculate daily activity for the last 7 days
    const dailyActivity: { date: string; total: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const dayActivities = activities?.filter(a =>
        a.created_at?.split('T')[0] === dateStr
      ) || []

      // Also count SBA answers for that day
      const daySbaAnswers = sbaAnswers?.filter(a =>
        a.created_at?.split('T')[0] === dateStr
      ) || []

      dailyActivity.push({
        date: dateStr,
        total: dayActivities.length + daySbaAnswers.length
      })
    }

    // Calculate streak
    let currentStreak = userProgress?.current_streak || 0

    // Simple streak calculation: check consecutive days of activity
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const todayActivity = dailyActivity.find(d => d.date === today)?.total || 0
    const yesterdayActivity = dailyActivity.find(d => d.date === yesterday)?.total || 0

    if (todayActivity > 0 || yesterdayActivity > 0) {
      // User is maintaining streak
      if (!userProgress?.current_streak) {
        currentStreak = todayActivity > 0 ? 1 : 0
      }
    } else {
      // Streak broken
      currentStreak = 0
    }

    // Calculate total content completed
    const totalCompleted =
      moduleStats.spotDiagnosis.completed +
      moduleStats.stations.completed +
      moduleStats.differentials.completed +
      moduleStats.checklists.completed +
      moduleStats.sba.answered

    // Calculate total study time from activities
    const totalTimeFromActivities = activities?.reduce((sum, a) =>
      sum + (a.time_spent_seconds || 0), 0) || 0
    const totalTimeFromSba = sbaAnswers?.reduce((sum, a) =>
      sum + (a.time_taken_seconds || 0), 0) || 0
    const totalStudyTime = userProgress?.total_study_time_seconds ||
      (totalTimeFromActivities + totalTimeFromSba)

    const response: ProgressResponse = {
      overall: {
        totalStudyTimeSeconds: totalStudyTime,
        currentStreak: currentStreak,
        contentCompleted: totalCompleted,
        lastActivityAt: userProgress?.last_activity_at || null
      },
      modules: moduleStats,
      weakAreas,
      recommendations: limitedRecommendations,
      dailyActivity
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
