# Stripe Payment Integration Setup

## Overview
This app uses Stripe for one-time payments with time-based access control stored in Supabase.

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Service Role Key (for webhook access)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_2MONTH=price_xxx   # £95 / 2 months
STRIPE_PRICE_6MONTH=price_xxx   # £155 / 6 months
STRIPE_PRICE_12MONTH=price_xxx  # £215 / 12 months
```

## Setup Steps

### 1. Run Database Migration

Execute the SQL migration in Supabase:
```bash
# The migration file is located at:
# supabase/migrations/20250101000000_create_subscriptions.sql
```

Or manually run the SQL in the Supabase SQL editor.

### 2. Get Supabase Service Role Key

1. Go to Supabase Dashboard → Project Settings → API
2. Copy the `service_role` key (NOT the anon key)
3. Add to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

### 3. Create Stripe Products

1. Go to Stripe Dashboard → Products
2. Create 3 products with one-time prices:

**Standard Package (2 months):**
- Name: Standard - 2 Months Access
- Price: £95 GBP
- Type: One-time
- Copy the Price ID → Add to `.env.local` as `STRIPE_PRICE_2MONTH`

**Plus Package (6 months):**
- Name: Plus - 6 Months Access
- Price: £155 GBP
- Type: One-time
- Copy the Price ID → Add to `.env.local` as `STRIPE_PRICE_6MONTH`

**Complete Package (12 months):**
- Name: Complete - 12 Months Access
- Price: £215 GBP
- Type: One-time
- Copy the Price ID → Add to `.env.local` as `STRIPE_PRICE_12MONTH`

### 4. Configure Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy the webhook signing secret → Already in `.env.local` as `STRIPE_WEBHOOK_SECRET`

**For local testing:**
1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Use the webhook secret from the CLI output

## Testing

### Test the flow:
1. Visit the homepage
2. Click "Get Started" on any package
3. User will be redirected to login/signup if not authenticated
4. After login, they'll be redirected to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`
6. After payment, they'll be redirected to `/checkout-success`
7. Verify subscription in Supabase `user_subscriptions` table
8. Try accessing `/dashboard/question-bank` or `/dashboard/mock-exams`

## Access Control

The `AccessControl` component checks if a user has an active subscription:
- Checks `user_subscriptions` table
- Verifies `status = 'active'`
- Checks if `access_expires_at > NOW()` OR `access_expires_at IS NULL` (lifetime)

Protected pages:
- `/dashboard/question-bank`
- `/dashboard/mock-exams`

## Database Schema

The `user_subscriptions` table tracks:
- User ID (links to auth.users)
- Stripe customer ID
- Stripe payment intent ID
- Package type (standard, premium, ultimate)
- Amount paid
- Access granted date
- Access expiry date (NULL for lifetime)
- Status (active, expired, cancelled)

## Webhook Events

When a payment succeeds:
1. Stripe sends `checkout.session.completed` event
2. `/api/stripe/webhook` receives the event
3. Creates record in `user_subscriptions` table
4. Calculates expiry date based on package:
   - Standard: +2 months
   - Plus: +6 months
   - Complete: +12 months
5. Sends Discord notification (optional)

## API Endpoints

- `POST /api/stripe/create-checkout` - Creates checkout session
- `POST /api/stripe/webhook` - Handles Stripe webhooks
- `GET /api/stripe/check-access` - Checks if user has active access
