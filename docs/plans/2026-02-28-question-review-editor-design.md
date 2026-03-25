# Question Review Editor Design

## Overview

A dedicated admin page for reviewing and editing questions by category with swipe-through navigation.

## Requirements

- Review and edit questions (question text, options, correct answer, explanation)
- Navigate with arrow buttons and keyboard shortcuts
- Filter by category, difficulty, and status
- Two-column layout with progress tracking
- Always-editable fields with explicit save

## Page Location

`/admin/questions/review` — standalone page separate from the existing table view

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Category ▼]  [Difficulty ▼]  [Status ▼]     Question 12/366   │
│  ════════════════════════════════════════════════════════════   │
├────────────────────────────────┬────────────────────────────────┤
│                                │                                │
│  QUESTION                      │  EXPLANATION                   │
│  ┌──────────────────────────┐  │  ┌──────────────────────────┐  │
│  │ [editable textarea]      │  │  │ [editable textarea]      │  │
│  └──────────────────────────┘  │  │                          │  │
│                                │  │                          │  │
│  OPTIONS                       │  │                          │  │
│  ○ A: [editable input]         │  │                          │  │
│  ○ B: [editable input]         │  │                          │  │
│  ○ C: [editable input]         │  │                          │  │
│  ○ D: [editable input]         │  │                          │  │
│  ○ E: [editable input]         │  │                          │  │
│                                │  └──────────────────────────┘  │
│  Correct Answer: [B ▼]         │                                │
│                                │                                │
├────────────────────────────────┴────────────────────────────────┤
│       [← Previous]       [Save Changes]        [Next →]         │
└─────────────────────────────────────────────────────────────────┘
```

- Filters at top
- Progress counter + bar below filters
- Left column: Question text + options + correct answer dropdown
- Right column: Explanation (larger textarea)
- Navigation + save at bottom

## Interactions

### Navigation
- Arrow buttons at bottom navigate between questions
- Left/Right arrow keys work anywhere on page (unless focused in textarea)
- Navigating away from unsaved question shows "You have unsaved changes" warning

### Filtering
- Changing any filter reloads questions matching the new criteria
- Resets to question 1 of the filtered set
- Filters persist in URL params (shareable/bookmarkable)

### Saving
- "Save Changes" button saves current question
- Button shows "Saving..." while in progress
- Success: brief green "Saved" confirmation
- Error: red error message, data stays in form

### Data Loading
- Load all question IDs matching filters upfront (lightweight)
- Fetch full question data only for current question (on demand)
- Prefetch next question in background for snappy navigation

## Components

### New Components
- `QuestionReviewPage` — main page component with filters, navigation state
- `QuestionEditor` — two-column editor with all editable fields
- `ProgressBar` — visual progress indicator

### API Changes
- **New:** `GET /api/admin/questions/ids` — returns just IDs matching filters
- **Existing:** `GET /api/admin/questions/[id]` — fetch single question details
- **Existing:** `PUT /api/admin/questions` — update question

## URL State

```
/admin/questions/review?category=dosage&difficulty=Medium&status=approved&index=12
```

Allows refreshing page and staying on same question.

## Keyboard Handling

- `useEffect` hook listens for arrow keys
- Disabled when user is typing in input/textarea (checks `document.activeElement`)
