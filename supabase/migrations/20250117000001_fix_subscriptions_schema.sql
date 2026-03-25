-- Fix subscriptions schema to support monthly subscriptions and Stripe subscription tracking
-- This resolves webhook failures caused by schema mismatch

-- Add missing columns for subscription support
ALTER TABLE public.user_subscriptions
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

ALTER TABLE public.user_subscriptions
ADD COLUMN IF NOT EXISTS stripe_subscription_status TEXT;

-- Update the package_type constraint to allow 'monthly'
ALTER TABLE public.user_subscriptions
DROP CONSTRAINT IF EXISTS user_subscriptions_package_type_check;

ALTER TABLE public.user_subscriptions
ADD CONSTRAINT user_subscriptions_package_type_check
CHECK (package_type IN ('standard', 'premium', 'ultimate', 'monthly'));

-- Add unique constraint on user_id for upsert operations
ALTER TABLE public.user_subscriptions
DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_key;

ALTER TABLE public.user_subscriptions
ADD CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id);
