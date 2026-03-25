export interface FlashcardDeck {
  id: string
  name: string
  slug: string
  description: string | null
  card_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Flashcard {
  id: string
  deck_id: string
  front: string
  back: string
  media_files: MediaFile[]
  anki_note_id: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MediaFile {
  name: string
  type: string
  url?: string
}

export interface UserFlashcardProgress {
  id: string
  user_id: string
  flashcard_id: string
  ease_factor: number
  interval_days: number
  repetitions: number
  due_date: string
  last_reviewed_at: string | null
  created_at: string
  updated_at: string
}

export interface FlashcardReviewHistory {
  id: string
  user_id: string
  flashcard_id: string
  quality: number
  ease_factor_before: number
  ease_factor_after: number
  interval_before: number
  interval_after: number
  reviewed_at: string
}

// SM-2 Algorithm Types
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5

export interface SM2Input {
  quality: ReviewQuality
  repetitions: number
  easeFactor: number
  interval: number
}

export interface SM2Output {
  repetitions: number
  easeFactor: number
  interval: number
  nextDueDate: Date
}

// Review button mappings
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy'

export const REVIEW_QUALITY_MAP: Record<ReviewRating, ReviewQuality> = {
  again: 1,
  hard: 2,
  good: 3,
  easy: 5,
}

// Deck with user stats
export interface DeckWithStats extends FlashcardDeck {
  stats: {
    total: number
    new: number
    learning: number
    due: number
    mastered: number
    masteryPercentage: number
  }
}

// Flashcard with progress for study sessions
export interface FlashcardWithProgress extends Flashcard {
  progress?: UserFlashcardProgress
  isNew: boolean
  isDue: boolean
}

// Study session state
export interface StudySession {
  deckId: string
  cards: FlashcardWithProgress[]
  currentIndex: number
  completedCount: number
  totalCount: number
  sessionStats: {
    again: number
    hard: number
    good: number
    easy: number
  }
}

// API Response types
export interface DeckListResponse {
  decks: DeckWithStats[]
}

export interface StudyCardsResponse {
  cards: FlashcardWithProgress[]
  deck: FlashcardDeck
}

export interface ReviewResponse {
  success: boolean
  nextDueDate: string
  updatedProgress: UserFlashcardProgress
}

export interface ProgressStatsResponse {
  totalCards: number
  cardsStudied: number
  cardsDueToday: number
  newCards: number
  averageEaseFactor: number
  streakDays: number
  reviewsToday: number
  reviewsThisWeek: number
}

// Admin types
export interface DeckUploadResult {
  success: boolean
  deck: FlashcardDeck
  cardsImported: number
  errors?: string[]
}

export interface ParsedAnkiCard {
  noteId: number
  front: string
  back: string
  mediaFiles: string[]
}

export interface ParsedAnkiDeck {
  name: string
  cards: ParsedAnkiCard[]
  mediaMapping: Record<string, string>
}
