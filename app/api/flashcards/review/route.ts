import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { calculateSM2, ratingToQuality, getInitialSM2State } from '@/app/lib/flashcards/sm2'
import { ReviewRating, ReviewResponse } from '@/app/types/flashcards'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { flashcardId, rating } = body as { flashcardId: string; rating: ReviewRating }

    if (!flashcardId || !rating) {
      return NextResponse.json({ error: 'Missing flashcardId or rating' }, { status: 400 })
    }

    const validRatings: ReviewRating[] = ['again', 'hard', 'good', 'easy']
    if (!validRatings.includes(rating)) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
    }

    // Verify the flashcard exists
    const { data: flashcard, error: flashcardError } = await supabase
      .from('flashcards')
      .select('id, deck_id')
      .eq('id', flashcardId)
      .single()

    if (flashcardError || !flashcard) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 })
    }

    // Get current progress or create initial state
    const { data: existingProgress } = await supabase
      .from('user_flashcard_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('flashcard_id', flashcardId)
      .single()

    const currentState = existingProgress
      ? {
          easeFactor: parseFloat(existingProgress.ease_factor),
          interval: existingProgress.interval_days,
          repetitions: existingProgress.repetitions,
        }
      : getInitialSM2State()

    // Calculate new SM-2 state
    const quality = ratingToQuality(rating)
    const newState = calculateSM2({
      quality,
      repetitions: currentState.repetitions,
      easeFactor: currentState.easeFactor,
      interval: currentState.interval,
    })

    // Update or insert progress
    const progressData = {
      user_id: user.id,
      flashcard_id: flashcardId,
      ease_factor: newState.easeFactor,
      interval_days: newState.interval,
      repetitions: newState.repetitions,
      due_date: newState.nextDueDate.toISOString(),
      last_reviewed_at: new Date().toISOString(),
    }

    let updatedProgress

    if (existingProgress) {
      const { data, error } = await supabase
        .from('user_flashcard_progress')
        .update(progressData)
        .eq('id', existingProgress.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating progress:', error)
        return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
      }
      updatedProgress = data
    } else {
      const { data, error } = await supabase
        .from('user_flashcard_progress')
        .insert(progressData)
        .select()
        .single()

      if (error) {
        console.error('Error inserting progress:', error)
        return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
      }
      updatedProgress = data
    }

    // Record review history
    const { error: historyError } = await supabase
      .from('flashcard_review_history')
      .insert({
        user_id: user.id,
        flashcard_id: flashcardId,
        quality,
        ease_factor_before: currentState.easeFactor,
        ease_factor_after: newState.easeFactor,
        interval_before: currentState.interval,
        interval_after: newState.interval,
      })

    if (historyError) {
      console.error('Error recording history:', historyError)
      // Don't fail the request for history errors
    }

    const response: ReviewResponse = {
      success: true,
      nextDueDate: newState.nextDueDate.toISOString(),
      updatedProgress,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
