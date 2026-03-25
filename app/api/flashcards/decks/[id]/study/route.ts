import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

// Simplified types for the API response - only include what we need
interface StudyCard {
  id: string
  deck_id: string
  front: string
  back: string
  media_files: unknown[]
  sort_order: number
  isNew: boolean
  isDue: boolean
  progress?: {
    ease_factor: number
    interval_days: number
    repetitions: number
    due_date: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: deckId } = await params
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const includeNew = searchParams.get('includeNew') !== 'false'

    // Verify deck exists and is active
    const { data: deck, error: deckError } = await supabase
      .from('flashcard_decks')
      .select('id, name, slug, card_count')
      .eq('id', deckId)
      .eq('is_active', true)
      .single()

    if (deckError || !deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    const now = new Date().toISOString()
    const studyCards: StudyCard[] = []

    // Get due cards (cards with progress where due_date <= now)
    const { data: dueCards, error: dueError } = await supabase
      .from('flashcards')
      .select(`
        id, front, back, media_files, sort_order,
        user_flashcard_progress!inner (
          ease_factor, interval_days, repetitions, due_date
        )
      `)
      .eq('deck_id', deckId)
      .eq('user_flashcard_progress.user_id', user.id)
      .gt('user_flashcard_progress.repetitions', 0)
      .lte('user_flashcard_progress.due_date', now)
      .limit(limit)

    if (dueError) {
      console.error('Error fetching due cards:', dueError)
    }

    // Add due cards to study list
    if (dueCards) {
      for (const card of dueCards) {
        const progress = Array.isArray(card.user_flashcard_progress)
          ? card.user_flashcard_progress[0]
          : card.user_flashcard_progress

        studyCards.push({
          id: card.id,
          deck_id: deckId,
          front: card.front,
          back: card.back,
          media_files: card.media_files || [],
          sort_order: card.sort_order,
          isNew: false,
          isDue: true,
          progress: progress ? {
            ease_factor: progress.ease_factor,
            interval_days: progress.interval_days,
            repetitions: progress.repetitions,
            due_date: progress.due_date,
          } : undefined,
        })
      }
    }

    // Get new cards if we have remaining slots
    const remainingSlots = limit - studyCards.length
    let newCardsCount = 0

    if (includeNew && remainingSlots > 0) {
      // Get IDs of cards that already have progress with repetitions > 0
      const { data: progressCardIds } = await supabase
        .from('user_flashcard_progress')
        .select('flashcard_id')
        .eq('user_id', user.id)
        .gt('repetitions', 0)

      const excludeIds = progressCardIds?.map(p => p.flashcard_id) || []

      // Build query for new cards
      let query = supabase
        .from('flashcards')
        .select('id, front, back, media_files, sort_order')
        .eq('deck_id', deckId)
        .order('sort_order', { ascending: true })
        .limit(remainingSlots)

      // Exclude cards that have progress
      if (excludeIds.length > 0) {
        query = query.not('id', 'in', `(${excludeIds.join(',')})`)
      }

      const { data: newCards, error: newError } = await query

      if (newError) {
        console.error('Error fetching new cards:', newError)
      } else if (newCards) {
        newCardsCount = newCards.length
        for (const card of newCards) {
          studyCards.push({
            id: card.id,
            deck_id: deckId,
            front: card.front,
            back: card.back,
            media_files: card.media_files || [],
            sort_order: card.sort_order,
            isNew: true,
            isDue: true,
          })
        }
      }
    }

    // Shuffle the cards for variety
    const shuffledCards = shuffleArray(studyCards)

    return NextResponse.json({
      cards: shuffledCards,
      deck,
      stats: {
        totalInDeck: deck.card_count || 0,
        dueCount: dueCards?.length || 0,
        newCount: newCardsCount,
        studyingCount: shuffledCards.length,
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
