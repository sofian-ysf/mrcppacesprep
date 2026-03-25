-- =============================================
-- UX & Learning Experience Improvements Schema
-- =============================================

-- 1. User Settings Table
-- Stores user preferences including exam date and daily goals
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_date DATE,
    daily_question_goal INTEGER DEFAULT 20,
    daily_flashcard_goal INTEGER DEFAULT 50,
    weekly_mock_exam_goal INTEGER DEFAULT 2,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Bookmarks Table
-- Allows users to bookmark questions for later review
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- 3. User Question Progress Table (SM-2 for questions)
-- Tracks spaced repetition state for each question
CREATE TABLE IF NOT EXISTS user_question_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    ease_factor DECIMAL(4,2) DEFAULT 2.50,
    interval_days INTEGER DEFAULT 0,
    repetitions INTEGER DEFAULT 0,
    due_date TIMESTAMPTZ DEFAULT NOW(),
    times_correct INTEGER DEFAULT 0,
    times_incorrect INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- 4. User Notes Table
-- Personal notes on questions and flashcards
CREATE TABLE IF NOT EXISTS user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT notes_target_check CHECK (
        (question_id IS NOT NULL AND flashcard_id IS NULL) OR
        (question_id IS NULL AND flashcard_id IS NOT NULL)
    )
);

-- 5. Achievements Definition Table
-- Defines all possible achievements
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL, -- 'streak', 'volume', 'mastery', 'mock_exam', 'consistency', 'speed'
    requirement_type TEXT NOT NULL, -- 'count', 'percentage', 'streak', 'score'
    requirement_value INTEGER NOT NULL,
    rarity TEXT DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. User Achievements Table
-- Tracks achievements earned by users
CREATE TABLE IF NOT EXISTS user_achievements (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    notified BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(user_id, achievement_id)
);

-- 7. Daily Activity Table
-- Tracks daily study activity for goals and streaks
CREATE TABLE IF NOT EXISTS user_daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    questions_answered INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    flashcards_reviewed INTEGER DEFAULT 0,
    mock_exams_completed INTEGER DEFAULT 0,
    study_time_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, activity_date)
);

-- =============================================
-- Indexes for Performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_question ON user_bookmarks(question_id);
CREATE INDEX IF NOT EXISTS idx_user_question_progress_user ON user_question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_question_progress_due ON user_question_progress(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_user_notes_user ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_question ON user_notes(question_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_flashcard ON user_notes(flashcard_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_activity_user_date ON user_daily_activity(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

-- =============================================
-- Row Level Security Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_activity ENABLE ROW LEVEL SECURITY;

-- User Settings policies
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- User Bookmarks policies
CREATE POLICY "Users can view own bookmarks" ON user_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON user_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON user_bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- User Question Progress policies
CREATE POLICY "Users can view own question progress" ON user_question_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own question progress" ON user_question_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own question progress" ON user_question_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- User Notes policies
CREATE POLICY "Users can view own notes" ON user_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON user_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON user_notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON user_notes
    FOR DELETE USING (auth.uid() = user_id);

-- Achievements policies (everyone can view definitions)
CREATE POLICY "Anyone can view achievements" ON achievements
    FOR SELECT USING (true);

-- User Achievements policies
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements" ON user_achievements
    FOR UPDATE USING (auth.uid() = user_id);

-- User Daily Activity policies
CREATE POLICY "Users can view own daily activity" ON user_daily_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily activity" ON user_daily_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily activity" ON user_daily_activity
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- Seed Achievements Data
-- =============================================

INSERT INTO achievements (slug, name, description, icon, category, requirement_type, requirement_value, rarity, sort_order) VALUES
-- Streak achievements
('streak_7', 'Week Warrior', 'Maintain a 7-day study streak', 'fire', 'streak', 'streak', 7, 'common', 1),
('streak_30', 'Month Master', 'Maintain a 30-day study streak', 'fire', 'streak', 'streak', 30, 'rare', 2),
('streak_100', 'Century Scholar', 'Maintain a 100-day study streak', 'fire', 'streak', 'streak', 100, 'legendary', 3),

-- Volume achievements (questions)
('questions_100', 'Getting Started', 'Answer 100 questions', 'target', 'volume', 'count', 100, 'common', 10),
('questions_500', 'Dedicated Learner', 'Answer 500 questions', 'target', 'volume', 'count', 500, 'rare', 11),
('questions_1000', 'Question Master', 'Answer 1,000 questions', 'target', 'volume', 'count', 1000, 'epic', 12),
('questions_2500', 'Knowledge Seeker', 'Answer 2,500 questions', 'target', 'volume', 'count', 2500, 'legendary', 13),

-- Mastery achievements (accuracy)
('accuracy_category_70', 'Category Competent', 'Achieve 70%+ accuracy in any category', 'check-circle', 'mastery', 'percentage', 70, 'common', 20),
('accuracy_category_80', 'Category Expert', 'Achieve 80%+ accuracy in any category', 'check-circle', 'mastery', 'percentage', 80, 'rare', 21),
('accuracy_category_90', 'Category Master', 'Achieve 90%+ accuracy in any category', 'check-circle', 'mastery', 'percentage', 90, 'epic', 22),
('accuracy_overall_70', 'Passing Grade', 'Achieve 70%+ overall accuracy', 'award', 'mastery', 'percentage', 70, 'common', 25),
('accuracy_overall_80', 'High Achiever', 'Achieve 80%+ overall accuracy', 'award', 'mastery', 'percentage', 80, 'rare', 26),
('accuracy_overall_90', 'Excellence', 'Achieve 90%+ overall accuracy', 'award', 'mastery', 'percentage', 90, 'legendary', 27),

-- Mock exam achievements
('mock_first', 'First Attempt', 'Complete your first mock exam', 'clipboard', 'mock_exam', 'count', 1, 'common', 30),
('mock_5', 'Practice Makes Perfect', 'Complete 5 mock exams', 'clipboard', 'mock_exam', 'count', 5, 'rare', 31),
('mock_10', 'Exam Ready', 'Complete 10 mock exams', 'clipboard', 'mock_exam', 'count', 10, 'epic', 32),
('mock_pass_70', 'Passing Score', 'Score 70%+ on a mock exam', 'star', 'mock_exam', 'score', 70, 'common', 35),
('mock_pass_80', 'Strong Performance', 'Score 80%+ on a mock exam', 'star', 'mock_exam', 'score', 80, 'rare', 36),
('mock_pass_90', 'Outstanding', 'Score 90%+ on a mock exam', 'star', 'mock_exam', 'score', 90, 'epic', 37),

-- Consistency achievements
('daily_goal_first', 'Goal Getter', 'Complete your daily study goal', 'flag', 'consistency', 'count', 1, 'common', 40),
('daily_goal_7', 'Week of Goals', 'Complete daily goals for 7 days', 'flag', 'consistency', 'count', 7, 'rare', 41),
('daily_goal_30', 'Monthly Commitment', 'Complete daily goals for 30 days', 'flag', 'consistency', 'count', 30, 'epic', 42),

-- Flashcard achievements
('flashcards_100', 'Card Collector', 'Review 100 flashcards', 'layers', 'volume', 'count', 100, 'common', 50),
('flashcards_500', 'Flash Expert', 'Review 500 flashcards', 'layers', 'volume', 'count', 500, 'rare', 51),
('flashcards_1000', 'Memory Master', 'Review 1,000 flashcards', 'layers', 'volume', 'count', 1000, 'epic', 52),
('flashcard_mastery_50', 'Half Mastered', 'Master 50% of all flashcards', 'brain', 'mastery', 'percentage', 50, 'rare', 55),
('flashcard_mastery_80', 'Nearly There', 'Master 80% of all flashcards', 'brain', 'mastery', 'percentage', 80, 'epic', 56),
('flashcard_mastery_100', 'Complete Mastery', 'Master 100% of all flashcards', 'brain', 'mastery', 'percentage', 100, 'legendary', 57)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- Functions for Updating Timestamps
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_question_progress_updated_at ON user_question_progress;
CREATE TRIGGER update_user_question_progress_updated_at
    BEFORE UPDATE ON user_question_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_notes_updated_at ON user_notes;
CREATE TRIGGER update_user_notes_updated_at
    BEFORE UPDATE ON user_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_daily_activity_updated_at ON user_daily_activity;
CREATE TRIGGER update_user_daily_activity_updated_at
    BEFORE UPDATE ON user_daily_activity
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
