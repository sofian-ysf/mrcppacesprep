# Mock Exams CTA Optimization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize mock-exams page CTAs for direct conversions with action-oriented text and subtle value props.

**Architecture:** Text-only changes to a single React page component. No structural changes, no new components.

**Tech Stack:** Next.js, React, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-15-mock-exams-cta-optimization-design.md`

---

## Chunk 1: CTA Text and Microcopy Updates

### Task 1: Update Hero Section CTAs

**Files:**
- Modify: `app/mock-exams/page.tsx:73, 83-85`

- [ ] **Step 1: Update primary CTA text**

Change line 73:
```
Old: View Pricing Plans
New: Get Started — From £25
```

- [ ] **Step 2: Update hero microcopy**

Change lines 83-85 from:
```tsx
              <p className="mt-4 text-sm text-gray-500">
                No signup required for free demo
              </p>
```
to:
```tsx
              <p className="mt-4 text-sm text-gray-500">
                Join 8,500+ students • 94% pass rate
              </p>
```

- [ ] **Step 3: Verify changes render correctly**

Run: `npm run dev`
Navigate to: `http://localhost:3000/mock-exams`
Expected: Hero shows "Get Started — From £25" button and "Join 8,500+ students • 94% pass rate" text

---

### Task 2: Update Exam Type Card CTAs (×3)

**Files:**
- Modify: `app/mock-exams/page.tsx:162-167, 187-192, 212-217`

- [ ] **Step 1: Update Full-Length Practice Exams card (lines 162-167)**

Change from:
```tsx
                <Link href="/pricing" className="pill-btn pill-btn-primary w-full min-h-[48px] text-base">
                  Get Full Access
                </Link>
                <Link href="/try-free" className="flex items-center justify-center gap-1 mt-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Try free demo first <ArrowRight className="h-4 w-4" />
                </Link>
```
to:
```tsx
                <Link href="/pricing" className="pill-btn pill-btn-primary w-full min-h-[48px] text-base">
                  Start Practicing Today
                </Link>
                <p className="mt-4 py-2 text-sm text-gray-500 text-center">
                  7-day money-back guarantee
                </p>
```

- [ ] **Step 2: Update Topic-Specific Mini Exams card (lines 187-192)**

Change from:
```tsx
                <Link href="/pricing" className="pill-btn pill-btn-primary w-full min-h-[48px] text-base">
                  Get Full Access
                </Link>
                <Link href="/try-free" className="flex items-center justify-center gap-1 mt-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Try free demo first <ArrowRight className="h-4 w-4" />
                </Link>
```
to:
```tsx
                <Link href="/pricing" className="pill-btn pill-btn-primary w-full min-h-[48px] text-base">
                  Start Practicing Today
                </Link>
                <p className="mt-4 py-2 text-sm text-gray-500 text-center">
                  7-day money-back guarantee
                </p>
```

- [ ] **Step 3: Update Rapid-Fire Calculation Sessions card (lines 212-217)**

Change from:
```tsx
                <Link href="/pricing" className="pill-btn pill-btn-primary w-full min-h-[48px] text-base">
                  Get Full Access
                </Link>
                <Link href="/try-free" className="flex items-center justify-center gap-1 mt-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Try free demo first <ArrowRight className="h-4 w-4" />
                </Link>
```
to:
```tsx
                <Link href="/pricing" className="pill-btn pill-btn-primary w-full min-h-[48px] text-base">
                  Start Practicing Today
                </Link>
                <p className="mt-4 py-2 text-sm text-gray-500 text-center">
                  7-day money-back guarantee
                </p>
```

- [ ] **Step 4: Remove unused ArrowRight import (line 18)**

Change lines 5-19 from:
```tsx
import {
  Clock,
  ChartBar,
  Lightning,
  TrendUp,
  FileText,
  Stack,
  Calculator,
  Timer,
  ChartLine,
  Users,
  Target,
  CheckCircle,
  ArrowRight
} from '@phosphor-icons/react/dist/ssr'
```
to:
```tsx
import {
  Clock,
  ChartBar,
  Lightning,
  TrendUp,
  FileText,
  Stack,
  Calculator,
  Timer,
  ChartLine,
  Users,
  Target,
  CheckCircle
} from '@phosphor-icons/react/dist/ssr'
```

- [ ] **Step 5: Verify all three cards render correctly**

Run: `npm run dev`
Navigate to: `http://localhost:3000/mock-exams`
Expected: All three exam type cards show "Start Practicing Today" buttons with "7-day money-back guarantee" text below

---

### Task 3: Update Final CTA Section

**Files:**
- Modify: `app/mock-exams/page.tsx:440-442, 449, 459-461`

- [ ] **Step 1: Update subheading text (lines 440-442)**

Change from:
```tsx
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
              Take a mock exam and get detailed feedback on your preparation progress.
            </p>
```
to:
```tsx
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
              Join 8,500+ students who passed with our mock exams.
            </p>
```

- [ ] **Step 2: Update primary CTA text (line 449)**

Change:
```
Old: View Pricing
New: Get Started Now
```

- [ ] **Step 3: Update final microcopy (lines 459-461)**

Change from:
```tsx
            <p className="mt-4 text-sm text-gray-500">
              No signup required for free demo
            </p>
```
to:
```tsx
            <p className="mt-4 text-sm text-gray-500">
              94% pass rate • 7-day money-back guarantee
            </p>
```

- [ ] **Step 4: Verify final section renders correctly**

Run: `npm run dev`
Navigate to: `http://localhost:3000/mock-exams`
Scroll to bottom
Expected: Final CTA shows "Get Started Now" button with "94% pass rate • 7-day money-back guarantee" text

---

### Task 4: Final Verification and Commit

- [ ] **Step 1: Run build to check for errors**

Run: `npm run build`
Expected: Build completes successfully with no errors

- [ ] **Step 2: Run lint to check for warnings**

Run: `npm run lint`
Expected: No unused import warnings (ArrowRight should be removed)

- [ ] **Step 3: Visual review of all changes**

Navigate to: `http://localhost:3000/mock-exams`
Verify:
- Hero: "Get Started — From £25" + "Join 8,500+ students • 94% pass rate"
- 3 cards: "Start Practicing Today" + "7-day money-back guarantee"
- Final section: "Get Started Now" + "94% pass rate • 7-day money-back guarantee"

- [ ] **Step 4: Commit changes**

```bash
git add app/mock-exams/page.tsx
git commit -m "feat(mock-exams): optimize CTAs for conversions

- Update hero CTA to 'Get Started — From £25' with social proof
- Change exam card CTAs to 'Start Practicing Today' with guarantee
- Update final CTA to 'Get Started Now' with pass rate + guarantee
- Remove unused ArrowRight import

Spec: docs/superpowers/specs/2026-03-15-mock-exams-cta-optimization-design.md"
```
