import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { ProgressStatsResponse } from '@/app/types/flashcards'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get all user progress
    const { data: progress } = await supabase
      .from('user_flashcard_progress')
      .select('*')
      .eq('user_id', user.id)

    // Get total flashcards across all active decks
    const { count: totalCards } = await supabase
      .from('flashcards')
      .select('id', { count: 'exact', head: true })
      .in('deck_id',
        (await supabase
          .from('flashcard_decks')
          .select('id')
          .eq('is_active', true)
        ).data?.map(d => d.id) || []
      )

    // Calculate stats
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const startOfToday = new Date(now)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

    let cardsDueToday = 0
    let newCards = 0
    let totalEaseFactor = 0
    let easeFactorCount = 0

    for (const p of progress || []) {
      const dueDate = new Date(p.due_date)
      dueDate.setHours(0, 0, 0, 0)

      if (dueDate <= now) {
        cardsDueToday++
      }

      if (p.repetitions === 0) {
        newCards++
      }

      if (p.ease_factor) {
        totalEaseFactor += parseFloat(p.ease_factor)
        easeFactorCount++
      }
    }

    // Get reviews today
    const { count: reviewsToday } = await supabase
      .from('flashcard_review_history')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('reviewed_at', startOfToday.toISOString())

    // Get reviews this week
    const { count: reviewsThisWeek } = await supabase
      .from('flashcard_review_history')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('reviewed_at', startOfWeek.toISOString())

    // Calculate streak (days with at least one review)
    const { data: recentReviews } = await supabase
      .from('flashcard_review_history')
      .select('reviewed_at')
      .eq('user_id', user.id)
      .order('reviewed_at', { ascending: false })
      .limit(365)

    let streakDays = 0
    if (recentReviews && recentReviews.length > 0) {
      const reviewDates = new Set(
        recentReviews.map(r => {
          const date = new Date(r.reviewed_at)
          date.setHours(0, 0, 0, 0)
          return date.toISOString()
        })
      )

      const checkDate = new Date()
      checkDate.setHours(0, 0, 0, 0)

      // Check if user reviewed today
      if (!reviewDates.has(checkDate.toISOString())) {
        // Check yesterday instead
        checkDate.setDate(checkDate.getDate() - 1)
      }

      // Count consecutive days
      while (reviewDates.has(checkDate.toISOString())) {
        streakDays++
        checkDate.setDate(checkDate.getDate() - 1)
      }
    }

    // Calculate new cards (not yet studied at all)
    const cardsStudied = progress?.length || 0
    const actualNewCards = (totalCards || 0) - cardsStudied

    const stats: ProgressStatsResponse = {
      totalCards: totalCards || 0,
      cardsStudied,
      cardsDueToday,
      newCards: actualNewCards,
      averageEaseFactor: easeFactorCount > 0
        ? Math.round((totalEaseFactor / easeFactorCount) * 100) / 100
        : 2.5,
      streakDays,
      reviewsToday: reviewsToday || 0,
      reviewsThisWeek: reviewsThisWeek || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
