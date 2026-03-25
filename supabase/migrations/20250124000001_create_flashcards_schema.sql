-- Flashcard Decks Table
CREATE TABLE public.flashcard_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    card_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards Table
CREATE TABLE public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    media_files JSONB DEFAULT '[]',
    anki_note_id BIGINT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Flashcard Progress (SM-2 State)
CREATE TABLE public.user_flashcard_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
    ease_factor DECIMAL(4,2) DEFAULT 2.50,
    interval_days INTEGER DEFAULT 0,
    repetitions INTEGER DEFAULT 0,
    due_date TIMESTAMPTZ DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, flashcard_id)
);

-- Flashcard Review History
CREATE TABLE public.flashcard_review_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
    quality INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
    ease_factor_before DECIMAL(4,2),
    ease_factor_after DECIMAL(4,2),
    interval_before INTEGER,
    interval_after INTEGER,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_flashcards_deck ON public.flashcards(deck_id);
CREATE INDEX idx_flashcards_sort ON public.flashcards(deck_id, sort_order);
CREATE INDEX idx_user_progress_user ON public.user_flashcard_progress(user_id);
CREATE INDEX idx_user_progress_due ON public.user_flashcard_progress(user_id, due_date);
CREATE INDEX idx_user_progress_flashcard ON public.user_flashcard_progress(flashcard_id);
CREATE INDEX idx_review_history_user ON public.flashcard_review_history(user_id);
CREATE INDEX idx_review_history_flashcard ON public.flashcard_review_history(flashcard_id);

-- Enable RLS
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_review_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flashcard_decks
-- Anyone can view active decks
CREATE POLICY "Anyone can view active decks"
ON public.flashcard_decks FOR SELECT
USING (is_active = true);

-- Admins can manage all decks
CREATE POLICY "Admins can manage decks"
ON public.flashcard_decks FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for flashcards
-- Anyone can view cards from active decks
CREATE POLICY "Anyone can view cards from active decks"
ON public.flashcards FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.flashcard_decks
        WHERE id = deck_id AND is_active = true
    )
);

-- Admins can manage all cards
CREATE POLICY "Admins can manage flashcards"
ON public.flashcards FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for user_flashcard_progress
-- Users can view their own progress
CREATE POLICY "Users can view own progress"
ON public.user_flashcard_progress FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
ON public.user_flashcard_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
ON public.user_flashcard_progress FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for flashcard_review_history
-- Users can view their own review history
CREATE POLICY "Users can view own review history"
ON public.flashcard_review_history FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own review history
CREATE POLICY "Users can insert own review history"
ON public.flashcard_review_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to update card_count on deck
CREATE OR REPLACE FUNCTION update_deck_card_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.flashcard_decks
        SET card_count = card_count + 1,
            updated_at = NOW()
        WHERE id = NEW.deck_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.flashcard_decks
        SET card_count = card_count - 1,
            updated_at = NOW()
        WHERE id = OLD.deck_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for card count
CREATE TRIGGER flashcard_count_trigger
AFTER INSERT OR DELETE ON public.flashcards
FOR EACH ROW EXECUTE FUNCTION update_deck_card_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_flashcard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER flashcard_decks_updated_at
BEFORE UPDATE ON public.flashcard_decks
FOR EACH ROW EXECUTE FUNCTION update_flashcard_updated_at();

CREATE TRIGGER flashcards_updated_at
BEFORE UPDATE ON public.flashcards
FOR EACH ROW EXECUTE FUNCTION update_flashcard_updated_at();

CREATE TRIGGER user_flashcard_progress_updated_at
BEFORE UPDATE ON public.user_flashcard_progress
FOR EACH ROW EXECUTE FUNCTION update_flashcard_updated_at();
