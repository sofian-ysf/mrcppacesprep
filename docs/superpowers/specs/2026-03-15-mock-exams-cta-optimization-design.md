# Mock Exams Page CTA Optimization

## Overview

Optimize the `/mock-exams` page for direct conversions to the pricing page by updating CTA text and adding subtle value propositions near conversion points.

## Goals

- Drive users directly to pricing/signup with action-oriented CTAs
- Add subtle social proof and risk-reversal near CTAs (no hard urgency tactics)
- Maintain clean page aesthetic

## Changes

### 1. Hero Section

**File:** `app/mock-exams/page.tsx` (lines 68-86)

| Element | Current | New |
|---------|---------|-----|
| Primary CTA text | "View Pricing Plans" | "Get Started — From £25" |
| Secondary CTA text | "Try Free Demo" | "Try Free Demo" (unchanged) |
| Microcopy | "No signup required for free demo" | "Join 8,500+ students • 94% pass rate" |

### 2. Exam Type Cards (×3)

**File:** `app/mock-exams/page.tsx` (lines 162-167, 187-192, 212-217)

| Element | Current | New |
|---------|---------|-----|
| Primary CTA text | "Get Full Access" | "Start Practicing Today" |
| Secondary link | "Try free demo first →" | "7-day money-back guarantee" |

Apply to all three cards:
- Full-Length Practice Exams
- Topic-Specific Mini Exams
- Rapid-Fire Calculation Sessions

### 3. Final CTA Section

**File:** `app/mock-exams/page.tsx` (lines 431-462)

| Element | Current | New |
|---------|---------|-----|
| Subheading | "Take a mock exam and get detailed feedback on your preparation progress." | "Join 8,500+ students who passed with our mock exams." |
| Primary CTA text | "View Pricing" | "Get Started Now" |
| Secondary CTA text | "Try Free Demo" | "Try Free Demo" (unchanged) |
| Microcopy | "No signup required for free demo" | "94% pass rate • 7-day money-back guarantee" |

## Non-Goals

- No sticky CTA bars or additional CTA insertion points
- No countdown timers or hard urgency elements
- No structural layout changes

## Success Metrics

- Increased click-through rate on primary CTAs
- Higher conversion rate from mock-exams page to pricing page
- Maintained or improved bounce rate
