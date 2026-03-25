# FAQ Schema Optimization Design

**Date:** 2026-03-11
**Status:** Approved
**Goal:** Add structured FAQs with clean schema markup to all core pages to increase SEO impressions by 15-25%

---

## Problem

- 7 pages have FAQPage schema, but 7 high-traffic pages have none
- `/help` page has 20+ Q&As but missing schema markup
- Missing FAQ coverage on homepage, try-free, and exam guide pages
- Losing potential rich snippet SERP real estate

## Solution

Create a reusable FAQ component with automatic schema generation and add high-intent FAQs to all missing pages.

---

## Component Design

### FAQSection Component

**Location:** `/app/components/FAQSection.tsx`

**Props:**
```typescript
interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  title?: string
  faqs: FAQItem[]
  className?: string
}
```

**Features:**
- Accordion-style expandable questions
- Auto-generates FAQPage JSON-LD schema
- Matches existing site styling
- Accessible (keyboard navigation, ARIA)

**Schema Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text"
      }
    }
  ]
}
```

---

## FAQ Content Plan

| Page | New FAQs | Focus |
|------|----------|-------|
| Homepage `/` | 6 | Beginner: "What is GPhC?", "How to start?", "What's included?" |
| Try Free `/try-free` | 5 | Trial: "Is it free?", "Credit card?", "What's included?" |
| GPhC Exam Guide `/gphc-exam-guide` | 8 | Exam: "2026 dates?", "Pass mark?", "Question types?" |
| GPhC Practice Questions `/gphc-practice-questions` | 6 | Practice: "How similar?", "How many?", "Difficulty?" |
| Testimonials `/testimonials` | 5 | Success: "Do students pass?", "Worth the money?" |
| Resources `/resources` | 5 | Resources: "Free downloads?", "What formats?" |
| Help `/help` | 0 (schema only) | Add schema to existing 20+ Q&As |

**Total: 35 new FAQs + 20 existing = 55 FAQs with proper schema**

---

## Implementation Order

1. **Create FAQSection component** - Reusable with auto schema
2. **Add schema to /help** - Quick win, existing content
3. **Homepage** - Highest traffic
4. **Try Free** - Conversion page
5. **GPhC Exam Guide** - High search intent
6. **GPhC Practice Questions** - Product page
7. **Testimonials** - Trust signals
8. **Resources** - Support page

---

## Expected Outcomes

| Metric | Before | After |
|--------|--------|-------|
| Pages with FAQPage schema | 7 | 14 |
| Total FAQ entries with schema | ~50 | ~105 |
| Rich snippet eligibility | Partial | All core pages |
| SEO impressions | Baseline | +15-25% expected |

---

## Verification

- Test all pages with Google Rich Results Test
- Submit updated sitemap to Search Console
- Request indexing for updated pages
- Monitor impressions in GSC over 2-4 weeks

---

## Files to Create/Modify

**Create:**
- `/app/components/FAQSection.tsx` - Reusable component
- `/app/components/FAQSection.css` - Component styles

**Modify:**
- `/app/page.tsx` - Add homepage FAQs
- `/app/try-free/page.tsx` - Add trial FAQs
- `/app/gphc-exam-guide/page.tsx` - Add exam guide FAQs
- `/app/gphc-practice-questions/page.tsx` - Add practice FAQs
- `/app/testimonials/page.tsx` - Add testimonial FAQs
- `/app/resources/page.tsx` - Add resource FAQs
- `/app/help/page.tsx` - Add schema to existing FAQs
