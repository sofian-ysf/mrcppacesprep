import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { DeckWithStats } from '@/app/types/flashcards'
import { isCardDue } from '@/app/lib/flashcards/sm2'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch all active decks
    const { data: decks, error: decksError } = await supabase
      .from('flashcard_decks')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (decksError) {
      console.error('Error fetching decks:', decksError)
      return NextResponse.json({ error: 'Failed to fetch decks' }, { status: 500 })
    }

    if (!decks || decks.length === 0) {
      return NextResponse.json({ decks: [] })
    }

    const deckIds = decks.map(d => d.id)

    // Get all flashcards for all decks in one query
    const { data: allFlashcards } = await supabase
      .from('flashcards')
      .select('id, deck_id')
      .in('deck_id', deckIds)

    // Group flashcards by deck
    const flashcardsByDeck = new Map<string, string[]>()
    for (const card of allFlashcards || []) {
      const existing = flashcardsByDeck.get(card.deck_id) || []
      existing.push(card.id)
      flashcardsByDeck.set(card.deck_id, existing)
    }

    // Get all user progress in one query (if logged in)
    let progressByCard = new Map<string, { repetitions: number; interval_days: number; due_date: string }>()

    if (user && allFlashcards && allFlashcards.length > 0) {
      const allCardIds = allFlashcards.map(f => f.id)
      const { data: progress } = await supabase
        .from('user_flashcard_progress')
        .select('flashcard_id, repetitions, interval_days, due_date')
        .eq('user_id', user.id)
        .in('flashcard_id', allCardIds)

      progressByCard = new Map(progress?.map(p => [p.flashcard_id, p]) || [])
    }

    // Build stats for each deck
    const decksWithStats: DeckWithStats[] = decks.map(deck => {
      const cardIds = flashcardsByDeck.get(deck.id) || []
      const total = cardIds.length

      if (!user || total === 0) {
        return {
          ...deck,
          stats: {
            total,
            new: total,
            learning: 0,
            due: 0,
            mastered: 0,
            masteryPercentage: 0,
          },
        }
      }

      let newCount = 0
      let dueCount = 0
      let masteredCount = 0

      for (const cardId of cardIds) {
        const cardProgress = progressByCard.get(cardId)

        if (!cardProgress || cardProgress.repetitions === 0) {
          newCount++
        } else if (cardProgress.due_date && isCardDue(cardProgress.due_date)) {
          dueCount++
        } else if (cardProgress.interval_days >= 21) {
          masteredCount++
        }
      }

      const learningCount = total - newCount - dueCount - masteredCount

      return {
        ...deck,
        stats: {
          total,
          new: newCount,
          learning: Math.max(0, learningCount),
          due: dueCount,
          mastered: masteredCount,
          masteryPercentage: total > 0 ? Math.round((masteredCount / total) * 100) : 0,
        },
      }
    })

    return NextResponse.json({ decks: decksWithStats })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
