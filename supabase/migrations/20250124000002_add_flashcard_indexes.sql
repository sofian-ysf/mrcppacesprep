-- Add indexes to improve flashcard query performance

-- Index on flashcards.deck_id for filtering by deck
CREATE INDEX IF NOT EXISTS idx_flashcards_deck_id ON flashcards(deck_id);

-- Index on flashcards for deck + sort order
CREATE INDEX IF NOT EXISTS idx_flashcards_deck_sort ON flashcards(deck_id, sort_order);

-- Index on user_flashcard_progress for user lookups
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_user_id ON user_flashcard_progress(user_id);

-- Index on user_flashcard_progress for due date filtering
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_due ON user_flashcard_progress(user_id, due_date);

-- Composite index for the main study query pattern
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_study
ON user_flashcard_progress(user_id, flashcard_id, repetitions, due_date);
