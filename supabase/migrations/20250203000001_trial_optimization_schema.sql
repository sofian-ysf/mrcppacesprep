-- ================================================
-- Trial Experience Optimization Schema
-- ================================================
-- Adds structured explanations, trial curation, and enhanced engagement tracking

-- ================================================
-- PHASE 1.1: Enhanced Explanation Fields
-- ================================================

-- Structured explanation format for rich educational content
-- Structure: {
--   "summary": "Brief 1-2 sentence answer summary",
--   "key_points": ["Learning point 1", "Learning point 2", "Learning point 3"],
--   "clinical_pearl": "Important clinical insight for practice",
--   "why_wrong": {"A": "Why A is incorrect", "B": "Why B is incorrect"...},
--   "exam_tip": "Specific tip for the GPhC exam",
--   "related_topics": ["topic-slug-1", "topic-slug-2"]
-- }
ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation_structured JSONB DEFAULT NULL;

-- Trial question curation fields
ALTER TABLE questions ADD COLUMN IF NOT EXISTS is_trial_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS trial_display_order INTEGER DEFAULT NULL;

-- Index for fast trial question lookups
CREATE INDEX IF NOT EXISTS idx_questions_trial_featured ON questions(is_trial_featured) WHERE is_trial_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_questions_trial_order ON questions(trial_display_order) WHERE trial_display_order IS NOT NULL;

-- ================================================
-- PHASE 1.2: Enhanced Trial Engagement Tracking
-- ================================================

-- Enhanced trial tracking fields
ALTER TABLE user_trials ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE user_trials ADD COLUMN IF NOT EXISTS exam_date DATE DEFAULT NULL;
ALTER TABLE user_trials ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 15;
ALTER TABLE user_trials ADD COLUMN IF NOT EXISTS starting_category_slug TEXT DEFAULT NULL;

-- Trial achievements table for trial-specific milestones
-- Achievement types: 'first_question', 'day_1_complete', 'streak_3', 'halfway',
--                    'accuracy_80', 'all_categories', 'trial_complete'
CREATE TABLE IF NOT EXISTS trial_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achieved_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    UNIQUE(user_id, achievement_type)
);

-- Index for efficient user achievement lookups
CREATE INDEX IF NOT EXISTS idx_trial_achievements_user ON trial_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_trial_achievements_type ON trial_achievements(achievement_type);

-- Enable RLS on trial_achievements
ALTER TABLE trial_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only view their own achievements
CREATE POLICY "Users can view own trial achievements"
    ON trial_achievements
    FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can manage achievements
CREATE POLICY "Service role can manage trial achievements"
    ON trial_achievements
    FOR ALL
    USING (auth.role() = 'service_role');

-- ================================================
-- PHASE 1.3: Trial Activity Tracking
-- ================================================

-- Track daily trial activity for engagement features
CREATE TABLE IF NOT EXISTS trial_daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    questions_answered INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    categories_tried TEXT[] DEFAULT '{}',
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, activity_date)
);

-- Index for efficient daily activity lookups
CREATE INDEX IF NOT EXISTS idx_trial_daily_activity_user ON trial_daily_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_trial_daily_activity_date ON trial_daily_activity(activity_date);

-- Enable RLS
ALTER TABLE trial_daily_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own trial activity"
    ON trial_daily_activity
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage trial activity"
    ON trial_daily_activity
    FOR ALL
    USING (auth.role() = 'service_role');

-- ================================================
-- Helper Functions
-- ================================================

-- Function to unlock a trial achievement
CREATE OR REPLACE FUNCTION unlock_trial_achievement(
    p_user_id UUID,
    p_achievement_type TEXT,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_inserted BOOLEAN;
BEGIN
    INSERT INTO trial_achievements (user_id, achievement_type, metadata)
    VALUES (p_user_id, p_achievement_type, p_metadata)
    ON CONFLICT (user_id, achievement_type) DO NOTHING;

    GET DIAGNOSTICS v_inserted = ROW_COUNT;
    RETURN v_inserted > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trial achievements for a user
CREATE OR REPLACE FUNCTION get_trial_achievements(p_user_id UUID)
RETURNS TABLE (
    achievement_type TEXT,
    achieved_at TIMESTAMPTZ,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT ta.achievement_type, ta.achieved_at, ta.metadata
    FROM trial_achievements ta
    WHERE ta.user_id = p_user_id
    ORDER BY ta.achieved_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record daily trial activity
CREATE OR REPLACE FUNCTION record_trial_activity(
    p_user_id UUID,
    p_questions_answered INTEGER DEFAULT 0,
    p_questions_correct INTEGER DEFAULT 0,
    p_category_slug TEXT DEFAULT NULL,
    p_time_spent INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO trial_daily_activity (
        user_id,
        activity_date,
        questions_answered,
        questions_correct,
        categories_tried,
        time_spent_seconds
    )
    VALUES (
        p_user_id,
        CURRENT_DATE,
        p_questions_answered,
        p_questions_correct,
        CASE WHEN p_category_slug IS NOT NULL THEN ARRAY[p_category_slug] ELSE '{}' END,
        p_time_spent
    )
    ON CONFLICT (user_id, activity_date) DO UPDATE SET
        questions_answered = trial_daily_activity.questions_answered + EXCLUDED.questions_answered,
        questions_correct = trial_daily_activity.questions_correct + EXCLUDED.questions_correct,
        categories_tried = (
            SELECT array_agg(DISTINCT elem)
            FROM unnest(trial_daily_activity.categories_tried || EXCLUDED.categories_tried) AS elem
            WHERE elem IS NOT NULL AND elem != ''
        ),
        time_spent_seconds = trial_daily_activity.time_spent_seconds + EXCLUDED.time_spent_seconds,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trial daily streak
CREATE OR REPLACE FUNCTION get_trial_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_streak INTEGER := 0;
    v_current_date DATE := CURRENT_DATE;
    v_activity_exists BOOLEAN;
BEGIN
    LOOP
        SELECT EXISTS(
            SELECT 1 FROM trial_daily_activity
            WHERE user_id = p_user_id
            AND activity_date = v_current_date
            AND questions_answered > 0
        ) INTO v_activity_exists;

        IF v_activity_exists THEN
            v_streak := v_streak + 1;
            v_current_date := v_current_date - INTERVAL '1 day';
        ELSE
            EXIT;
        END IF;

        -- Safety limit
        IF v_streak > 100 THEN
            EXIT;
        END IF;
    END LOOP;

    RETURN v_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update onboarding status
CREATE OR REPLACE FUNCTION complete_trial_onboarding(
    p_user_id UUID,
    p_exam_date DATE DEFAULT NULL,
    p_daily_goal INTEGER DEFAULT 15,
    p_starting_category TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE user_trials
    SET
        onboarding_completed = TRUE,
        exam_date = COALESCE(p_exam_date, exam_date),
        daily_goal = COALESCE(p_daily_goal, daily_goal),
        starting_category_slug = COALESCE(p_starting_category, starting_category_slug),
        updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trial stats summary
CREATE OR REPLACE FUNCTION get_trial_stats(p_user_id UUID)
RETURNS TABLE (
    questions_used INTEGER,
    questions_remaining INTEGER,
    days_remaining INTEGER,
    total_correct INTEGER,
    accuracy_percentage NUMERIC,
    categories_tried INTEGER,
    current_streak INTEGER,
    achievements_count INTEGER
) AS $$
DECLARE
    v_trial user_trials%ROWTYPE;
BEGIN
    -- Get trial info
    SELECT * INTO v_trial
    FROM user_trials
    WHERE user_id = p_user_id;

    IF v_trial IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        v_trial.questions_used,
        GREATEST(0, v_trial.questions_limit - v_trial.questions_used)::INTEGER,
        GREATEST(0, EXTRACT(DAY FROM (v_trial.trial_expires_at - NOW())))::INTEGER,
        COALESCE((
            SELECT SUM(questions_correct)::INTEGER
            FROM trial_daily_activity
            WHERE user_id = p_user_id
        ), 0),
        CASE
            WHEN v_trial.questions_used > 0 THEN
                ROUND((
                    SELECT SUM(questions_correct)::NUMERIC / NULLIF(SUM(questions_answered), 0) * 100
                    FROM trial_daily_activity
                    WHERE user_id = p_user_id
                ), 1)
            ELSE 0
        END,
        COALESCE((
            SELECT COUNT(DISTINCT elem)::INTEGER
            FROM trial_daily_activity, unnest(categories_tried) AS elem
            WHERE user_id = p_user_id AND elem IS NOT NULL AND elem != ''
        ), 0),
        get_trial_streak(p_user_id),
        (SELECT COUNT(*)::INTEGER FROM trial_achievements WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION unlock_trial_achievement(UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_trial_achievements(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION record_trial_activity(UUID, INTEGER, INTEGER, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_trial_streak(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_trial_onboarding(UUID, DATE, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_trial_stats(UUID) TO authenticated;
