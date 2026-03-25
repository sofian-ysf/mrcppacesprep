-- ================================================
-- Free Trial System Schema
-- ================================================
-- Provides 7-day free trial with 100 question limit
-- Auto-creates trial record on user signup

-- Create user_trials table
CREATE TABLE IF NOT EXISTS user_trials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trial_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    trial_expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    questions_used INTEGER NOT NULL DEFAULT 0,
    questions_limit INTEGER NOT NULL DEFAULT 100,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'converted', 'exhausted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_trials_user_id_unique UNIQUE (user_id)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_trials_user_id ON user_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trials_status ON user_trials(status);

-- Enable RLS
ALTER TABLE user_trials ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only read their own trial
CREATE POLICY "Users can view own trial"
    ON user_trials
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only the system (via service role) can insert/update trials
CREATE POLICY "Service role can manage trials"
    ON user_trials
    FOR ALL
    USING (auth.role() = 'service_role');

-- ================================================
-- Helper function: increment_trial_usage
-- ================================================
-- Atomically increments questions_used with row locking
-- Returns the updated trial record with status

CREATE OR REPLACE FUNCTION increment_trial_usage(p_user_id UUID)
RETURNS TABLE (
    success BOOLEAN,
    questions_used INTEGER,
    questions_remaining INTEGER,
    status TEXT,
    is_exhausted BOOLEAN
) AS $$
DECLARE
    v_trial user_trials%ROWTYPE;
    v_new_count INTEGER;
    v_new_status TEXT;
BEGIN
    -- Lock the row to prevent race conditions
    SELECT * INTO v_trial
    FROM user_trials
    WHERE user_id = p_user_id
    FOR UPDATE;

    -- If no trial exists, return failure
    IF v_trial IS NULL THEN
        RETURN QUERY SELECT
            FALSE::BOOLEAN,
            0::INTEGER,
            0::INTEGER,
            'none'::TEXT,
            TRUE::BOOLEAN;
        RETURN;
    END IF;

    -- Check if trial is already expired/exhausted/converted
    IF v_trial.status != 'active' THEN
        RETURN QUERY SELECT
            FALSE::BOOLEAN,
            v_trial.questions_used,
            GREATEST(0, v_trial.questions_limit - v_trial.questions_used)::INTEGER,
            v_trial.status,
            TRUE::BOOLEAN;
        RETURN;
    END IF;

    -- Increment the usage count
    v_new_count := v_trial.questions_used + 1;
    v_new_status := v_trial.status;

    -- Check if this exhausts the trial
    IF v_new_count >= v_trial.questions_limit THEN
        v_new_status := 'exhausted';
    END IF;

    -- Update the trial record
    UPDATE user_trials
    SET
        questions_used = v_new_count,
        status = v_new_status,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN QUERY SELECT
        TRUE::BOOLEAN,
        v_new_count,
        GREATEST(0, v_trial.questions_limit - v_new_count)::INTEGER,
        v_new_status,
        (v_new_status = 'exhausted')::BOOLEAN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- Helper function: check_and_update_trial_status
-- ================================================
-- Checks if trial has expired and updates status

CREATE OR REPLACE FUNCTION check_and_update_trial_status(p_user_id UUID)
RETURNS TABLE (
    has_active_trial BOOLEAN,
    questions_used INTEGER,
    questions_remaining INTEGER,
    days_remaining INTEGER,
    status TEXT,
    trial_expires_at TIMESTAMPTZ
) AS $$
DECLARE
    v_trial user_trials%ROWTYPE;
    v_days_remaining INTEGER;
    v_new_status TEXT;
BEGIN
    -- Get trial with lock for potential update
    SELECT * INTO v_trial
    FROM user_trials
    WHERE user_id = p_user_id
    FOR UPDATE;

    -- If no trial exists
    IF v_trial IS NULL THEN
        RETURN QUERY SELECT
            FALSE::BOOLEAN,
            0::INTEGER,
            0::INTEGER,
            0::INTEGER,
            'none'::TEXT,
            NULL::TIMESTAMPTZ;
        RETURN;
    END IF;

    -- Calculate days remaining
    v_days_remaining := GREATEST(0, EXTRACT(DAY FROM (v_trial.trial_expires_at - NOW()))::INTEGER);

    -- Check if trial should be marked as expired (only if currently active)
    IF v_trial.status = 'active' AND NOW() > v_trial.trial_expires_at THEN
        v_new_status := 'expired';

        UPDATE user_trials
        SET status = v_new_status, updated_at = NOW()
        WHERE user_id = p_user_id;
    ELSE
        v_new_status := v_trial.status;
    END IF;

    RETURN QUERY SELECT
        (v_new_status = 'active')::BOOLEAN,
        v_trial.questions_used,
        GREATEST(0, v_trial.questions_limit - v_trial.questions_used)::INTEGER,
        v_days_remaining,
        v_new_status,
        v_trial.trial_expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- Trigger: Auto-create trial on user signup
-- ================================================

CREATE OR REPLACE FUNCTION handle_new_user_trial()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert trial record for new user
    INSERT INTO public.user_trials (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Don't fail user signup if trial creation fails
        RAISE WARNING 'Could not create trial for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created_trial ON auth.users;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created_trial
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user_trial();

-- ================================================
-- Backfill: Create expired trials for existing users
-- ================================================
-- Users who already exist get an expired trial so they
-- must subscribe to access content

INSERT INTO user_trials (user_id, status, trial_started_at, trial_expires_at, questions_used, questions_limit)
SELECT
    id,
    'expired',
    created_at,
    created_at + INTERVAL '7 days',
    100,
    100
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_trials)
ON CONFLICT (user_id) DO NOTHING;

-- ================================================
-- Function: Mark trial as converted (for subscriptions)
-- ================================================

CREATE OR REPLACE FUNCTION convert_trial_to_subscription(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE user_trials
    SET status = 'converted', updated_at = NOW()
    WHERE user_id = p_user_id AND status IN ('active', 'expired', 'exhausted');

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_trial_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION check_and_update_trial_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION convert_trial_to_subscription(UUID) TO service_role;
