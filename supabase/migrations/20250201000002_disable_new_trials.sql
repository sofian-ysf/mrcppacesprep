-- ================================================
-- Disable Free Trials for New Signups
-- ================================================
-- New users will get an immediately expired trial (no free access)
-- Existing users with active trials are NOT affected

CREATE OR REPLACE FUNCTION handle_new_user_trial()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Create an expired trial for new users (no free trial)
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
        'expired',           -- Start as expired (no free trial)
        NOW(),
        NOW(),               -- Already expired
        0,
        0                    -- No free questions
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Could not create trial for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;
