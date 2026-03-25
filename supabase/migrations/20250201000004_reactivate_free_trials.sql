-- ================================================
-- Reactivate Free Trials for New Signups
-- ================================================
-- New users will get a 7-day trial with 100 questions
-- This reverts the changes from 20250201000002_disable_new_trials.sql

CREATE OR REPLACE FUNCTION handle_new_user_trial()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert active trial record for new user
    INSERT INTO public.user_trials (
        user_id,
        status,
        trial_started_at,
        trial_expires_at,
        questions_used,
        questions_limit
    )
    VALUES (
        NEW.id,
        'active',                           -- Start as active
        NOW(),
        NOW() + INTERVAL '7 days',          -- 7-day trial
        0,
        100                                 -- 100 free questions
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Don't fail user signup if trial creation fails
        RAISE WARNING 'Could not create trial for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;
