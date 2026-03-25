-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_payment_intent_id TEXT,
    package_type TEXT NOT NULL CHECK (package_type IN ('standard', 'premium', 'ultimate')),
    amount_paid NUMERIC(10, 2) NOT NULL,
    access_granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    access_expires_at TIMESTAMPTZ, -- NULL means lifetime access
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);

-- Enable Row Level Security
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions"
ON public.user_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Service role can insert subscriptions (for webhooks)
CREATE POLICY "Service role can insert subscriptions"
ON public.user_subscriptions
FOR INSERT
WITH CHECK (true);

-- Policy: Service role can update subscriptions
CREATE POLICY "Service role can update subscriptions"
ON public.user_subscriptions
FOR UPDATE
USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on every update
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to check if user has active access
CREATE OR REPLACE FUNCTION public.has_active_access(check_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_access BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM public.user_subscriptions
        WHERE user_id = check_user_id
        AND status = 'active'
        AND (access_expires_at IS NULL OR access_expires_at > NOW())
    ) INTO has_access;

    RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
