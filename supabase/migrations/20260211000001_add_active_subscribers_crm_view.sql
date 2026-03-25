-- ================================================
-- Add Active Subscribers to CRM System
-- ================================================
-- Creates a new view for active paid subscribers
-- These users will have their own section in the CRM

-- ================================================
-- View: Active Subscribers (Group 4)
-- ================================================
CREATE OR REPLACE VIEW crm_active_subscribers AS
SELECT
    u.id,
    u.email,
    u.created_at as signup_date,
    s.package_type,
    s.amount_paid,
    s.access_granted_at,
    s.access_expires_at,
    s.status,
    CASE
        WHEN s.access_expires_at IS NULL THEN 'Lifetime'
        WHEN s.access_expires_at > NOW() THEN EXTRACT(DAY FROM (s.access_expires_at - NOW()))::INTEGER || ' days'
        ELSE 'Expired'
    END as access_remaining,
    'active_subscriber' as nurture_group
FROM auth.users u
JOIN user_subscriptions s ON u.id = s.user_id
WHERE s.status = 'active'
ORDER BY s.access_granted_at DESC;

-- ================================================
-- Update existing views to exclude active subscribers
-- ================================================
-- These are already excluded, but making it explicit for clarity

-- Active Trial Users - exclude paid subscribers
CREATE OR REPLACE VIEW crm_active_trial_users AS
SELECT
    u.id,
    u.email,
    u.created_at as signup_date,
    t.trial_started_at,
    t.trial_expires_at,
    t.questions_used,
    t.questions_limit,
    GREATEST(0, EXTRACT(DAY FROM (t.trial_expires_at - NOW()))::INTEGER) as days_remaining,
    'active_trial' as nurture_group
FROM auth.users u
JOIN user_trials t ON u.id = t.user_id
WHERE t.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM user_subscriptions s
    WHERE s.user_id = u.id
    AND s.status = 'active'
  );

-- Expired Trial Users - exclude paid subscribers
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
  AND NOT EXISTS (
    SELECT 1 FROM user_subscriptions s
    WHERE s.user_id = u.id
    AND s.status = 'active'
  );

-- ================================================
-- Helper Function for Active Subscribers Count
-- ================================================
CREATE OR REPLACE FUNCTION crm_get_active_subscribers_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM crm_active_subscribers);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION crm_get_active_subscribers_count() TO authenticated;
