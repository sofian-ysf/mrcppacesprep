-- ================================================
-- Email Unsubscribe List
-- ================================================

CREATE TABLE IF NOT EXISTS email_unsubscribes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    unsubscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_email_unsubscribes_email ON email_unsubscribes(email);

-- Enable RLS
ALTER TABLE email_unsubscribes ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (for unsubscribe form)
CREATE POLICY "Anyone can unsubscribe"
    ON email_unsubscribes
    FOR INSERT
    WITH CHECK (true);

-- Only service role can read/update/delete
CREATE POLICY "Service role can manage unsubscribes"
    ON email_unsubscribes
    FOR ALL
    USING (auth.role() = 'service_role');
