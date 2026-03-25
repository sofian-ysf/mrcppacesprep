# FAQ Schema Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add structured FAQs with FAQPage schema to 7 pages, adding 55 total FAQ entries to increase SEO impressions by 15-25%.

**Architecture:** Create a reusable `FAQSection` component with automatic JSON-LD schema generation, then add it to each target page with page-specific FAQ content.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, JSON-LD structured data

**Security Note:** JSON-LD schema content is hardcoded FAQ strings (not user input), so XSS risk is mitigated. The pattern follows existing SEO components in the codebase.

---

## Task 1: Create FAQSection Component

**Files:**
- Create: `/app/components/FAQSection.tsx`

**Step 1: Create the component file with accordion UI and auto-generated FAQPage schema**

The component should:
- Accept `faqs` array of `{question, answer}` objects
- Accept optional `title` and `className` props
- Generate FAQPage JSON-LD schema automatically
- Render accordion-style expandable Q&As
- Use Next.js Script component for schema injection

**Step 2: Verify file was created**

Run: `ls -la app/components/FAQSection.tsx`
Expected: File exists

**Step 3: Commit**

```bash
git add app/components/FAQSection.tsx
git commit -m "feat: add reusable FAQSection component with auto schema"
```

---

## Task 2: Add FAQPage Schema to Help Page

**Files:**
- Modify: `/app/help/page.tsx`

The help page already has 22 FAQs across 6 topics in `helpTopics` array. Add FAQPage schema without changing UI.

**Step 1: Add Script import**
**Step 2: Generate schema from existing helpTopics data**
**Step 3: Render schema Script tag inside component**
**Step 4: Test page loads at http://localhost:3000/help**
**Step 5: Commit**

```bash
git add app/help/page.tsx
git commit -m "feat: add FAQPage schema to help page (22 FAQs)"
```

---

## Task 3: Add FAQs to Homepage

**Files:**
- Modify: `/app/page.tsx`

**FAQ Content (6 questions):**
1. What is the MRCP PACES pre-registration exam?
2. How many questions are on the MRCP PACES exam?
3. What is the MRCP PACES exam pass rate?
4. How long should I study for the MRCP PACES exam?
5. Is MRCPPACESPREP worth it?
6. Can I try MRCPPACESPREP for free?

**Steps:**
1. Import FAQSection component
2. Add homepageFAQs array with 6 Q&As
3. Add FAQSection to page layout
4. Test at http://localhost:3000
5. Commit

```bash
git commit -m "feat: add FAQ section to homepage (6 FAQs)"
```

---

## Task 4: Add FAQs to Try Free Page

**Files:**
- Modify: `/app/try-free/page.tsx`

**FAQ Content (5 questions):**
1. Is the free trial really free?
2. Do I need a credit card to try free questions?
3. What's included in the free questions?
4. How are free questions different from paid?
5. What happens after I finish the free questions?

**Steps:** Import, add data, add component, test, commit

```bash
git commit -m "feat: add FAQ section to try-free page (5 FAQs)"
```

---

## Task 5: Add FAQs to MRCP PACES Exam Guide Page

**Files:**
- Modify: `/app/gphc-exam-guide/page.tsx`

**FAQ Content (8 questions):**
1. When is the MRCP PACES exam in 2026?
2. What is the MRCP PACES exam pass mark?
3. What question types are on the MRCP PACES exam?
4. How do I register for the MRCP PACES exam?
5. Can I use a calculator in the MRCP PACES exam?
6. What happens if I fail the MRCP PACES exam?
7. How long are MRCP PACES exam results valid?
8. What ID do I need for the MRCP PACES exam?

**Steps:** Import, add data, add component, test, commit

```bash
git commit -m "feat: add FAQ section to MRCP PACES exam guide (8 FAQs)"
```

---

## Task 6: Add FAQs to MRCP PACES Practice Questions Page

**Files:**
- Modify: `/app/gphc-practice-questions/page.tsx`

**FAQ Content (6 questions):**
1. How similar are your questions to the real MRCP PACES exam?
2. How many practice questions do you have?
3. What difficulty levels are the questions?
4. Do practice questions have explanations?
5. How many questions should I practice daily?
6. Can I practice specific topics?

**Steps:** Import, add data, add component, test, commit

```bash
git commit -m "feat: add FAQ section to practice questions page (6 FAQs)"
```

---

## Task 7: Add FAQs to Testimonials Page

**Files:**
- Modify: `/app/testimonials/page.tsx`

**FAQ Content (5 questions):**
1. Do students actually pass using MRCPPACESPREP?
2. How long do successful students study?
3. Is MRCPPACESPREP worth the money?
4. What do students say about the questions?
5. Can international graduates use MRCPPACESPREP?

**Steps:** Import, add data, add component, test, commit

```bash
git commit -m "feat: add FAQ section to testimonials page (5 FAQs)"
```

---

## Task 8: Add FAQs to Resources Page

**Files:**
- Modify: `/app/resources/page.tsx`

**FAQ Content (5 questions):**
1. Are the study resources free to download?
2. What formats are resources available in?
3. Are resources updated for 2026?
4. What topics do study guides cover?
5. Can I print the study resources?

**Steps:** Import, add data, add component, test, commit

```bash
git commit -m "feat: add FAQ section to resources page (5 FAQs)"
```

---

## Task 9: Build and Verify

**Step 1: Run production build**

```bash
NODE_OPTIONS="--max-old-space-size=8192" npx next build
```

Expected: Build completes without errors

**Step 2: Test schema with Google Rich Results Test**

After deployment, test pages at: https://search.google.com/test/rich-results

**Step 3: Submit updated sitemap to Google Search Console**

---

## Summary

| Task | Page | FAQs | Status |
|------|------|------|--------|
| 1 | Component | N/A | Create |
| 2 | /help | 22 existing | Add schema |
| 3 | / | 6 new | Add section |
| 4 | /try-free | 5 new | Add section |
| 5 | /gphc-exam-guide | 8 new | Add section |
| 6 | /gphc-practice-questions | 6 new | Add section |
| 7 | /testimonials | 5 new | Add section |
| 8 | /resources | 5 new | Add section |
| 9 | Build | N/A | Verify |

**Total: 35 new FAQs + 22 existing = 57 FAQs with FAQPage schema**
