-- ================================================
-- CRM: Add "No Trial" Users View
-- ================================================
-- Separates users who signed up after trials were disabled
-- from users who had a real trial that expired

-- ================================================
-- View: No Trial Users (New Signups - No Free Trial)
-- ================================================
CREATE OR REPLACE VIEW crm_no_trial_users AS
SELECT
    u.id,
    u.email,
    u.created_at as signup_date,
    'no_trial' as nurture_group
FROM auth.users u
JOIN user_trials t ON u.id = t.user_id
WHERE t.status = 'expired'
  AND t.questions_limit = 0  -- Never had a trial (signed up after trials disabled)
  AND NOT EXISTS (SELECT 1 FROM user_subscriptions s WHERE s.user_id = u.id);

-- ================================================
-- Update: Expired Trial Users (Only Real Expired Trials)
-- ================================================
CREATE OR REPLACE VIEW crm_expired_trial_users AS
SELECT
    u.id,
    u.email,
    u.created_at as signup_date,
    t.trial_started_at,
    t.trial_expires_at,
    t.questions_used,
    t.questions_limit,
    t.status as trial_status,
    GREATEST(0, EXTRACT(DAY FROM (NOW() - t.trial_expires_at))::INTEGER) as days_since_expiry,
    'expired_trial' as nurture_group
FROM auth.users u
JOIN user_trials t ON u.id = t.user_id
WHERE t.status IN ('expired', 'exhausted')
  AND t.questions_limit > 0  -- Had a real trial with questions
  AND NOT EXISTS (SELECT 1 FROM user_subscriptions s WHERE s.user_id = u.id);

-- ================================================
-- Function: Get No Trial User Count
-- ================================================
CREATE OR REPLACE FUNCTION crm_get_no_trial_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM crm_no_trial_users);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION crm_get_no_trial_count() TO authenticated;
