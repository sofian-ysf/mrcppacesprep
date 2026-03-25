-- ================================================
-- CRM System Schema for Nurture Pathways
-- ================================================
-- Segments trial users into two mutually exclusive groups:
-- Group 1 (Active Trials): Users currently on active trial
-- Group 2 (Expired Trials): Users whose trial expired/exhausted and never subscribed
-- Excludes: Users who ever had a subscription (churned users)

-- ================================================
-- View: Active Trial Users (Group 1)
-- ================================================
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
  AND NOT EXISTS (SELECT 1 FROM user_subscriptions s WHERE s.user_id = u.id);

-- ================================================
-- View: Expired Trial Users (Group 2)
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
  AND NOT EXISTS (SELECT 1 FROM user_subscriptions s WHERE s.user_id = u.id);

-- ================================================
-- Table: CRM Email History
-- ================================================
-- Tracks all emails sent to users for nurture campaigns
CREATE TABLE IF NOT EXISTS crm_email_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email_type TEXT NOT NULL CHECK (email_type IN ('trial_reminder', 'trial_expiring', 'win_back', 'custom')),
    subject TEXT NOT NULL,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_by UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for email history
CREATE INDEX IF NOT EXISTS idx_crm_email_history_user_id ON crm_email_history(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_email_history_sent_at ON crm_email_history(sent_at);
CREATE INDEX IF NOT EXISTS idx_crm_email_history_email_type ON crm_email_history(email_type);

-- Enable RLS on email history
ALTER TABLE crm_email_history ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can access email history (via service role)
CREATE POLICY "Service role can manage email history"
    ON crm_email_history
    FOR ALL
    USING (auth.role() = 'service_role');

-- ================================================
-- Helper Functions for CRM Stats
-- ================================================

-- Function to get active trial count
CREATE OR REPLACE FUNCTION crm_get_active_trial_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM crm_active_trial_users);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get expired trial count
CREATE OR REPLACE FUNCTION crm_get_expired_trial_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM crm_expired_trial_users);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get emails sent today
CREATE OR REPLACE FUNCTION crm_get_emails_sent_today()
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM crm_email_history
        WHERE sent_at >= CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get emails sent this week
CREATE OR REPLACE FUNCTION crm_get_emails_sent_this_week()
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM crm_email_history
        WHERE sent_at >= DATE_TRUNC('week', CURRENT_DATE)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users (admins will be checked at API level)
GRANT EXECUTE ON FUNCTION crm_get_active_trial_count() TO authenticated;
GRANT EXECUTE ON FUNCTION crm_get_expired_trial_count() TO authenticated;
GRANT EXECUTE ON FUNCTION crm_get_emails_sent_today() TO authenticated;
GRANT EXECUTE ON FUNCTION crm_get_emails_sent_this_week() TO authenticated;
