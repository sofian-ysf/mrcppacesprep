# Spot Diagnosis Admin Redesign

**Date:** 2026-03-29
**Status:** Approved

## Problem

The current spot diagnosis admin uses a table view with modals. Adding images to cards requires clicking each row, waiting for a modal, uploading, closing, and repeating. This is slow when enriching many cards with media.

## Solution

Replace the table+modal pattern with a keyboard-first card editor. Users navigate through cards horizontally using A/D keys, see full card context, and upload media via drag/drop, paste, or URL input. Auto-saves on navigation.

## User Workflow

1. Open spot diagnosis admin → lands in card editor view
2. Use filter dropdown to show "Missing Media" cards
3. View current card: diagnosis, description, key features, exam tips
4. Upload image via:
   - Drag and drop onto drop zone
   - Paste with ⌘V (Ctrl+V on Windows)
   - Enter URL and click Add
5. Press D to move to next card (auto-saves current)
6. Press A to go back if needed
7. Press Esc to return to dashboard

## UI Components

### Header Bar
- Back to Dashboard link (left)
- Filter dropdown (right): All Cards, Missing Media, Has Image, Has Video

### Progress Section
- Previous button with keyboard hint (A)
- Center: "Card X of Y" with count of missing media below
- Next button with keyboard hint (D)

### Main Content Area (two columns)

**Left Column - Card Details:**
- Difficulty badge (Easy/Medium/Hard)
- Diagnosis title (h2)
- Description paragraph
- Key Features box (bulleted list, gray background)
- Exam Tips box (blue background with lightbulb icon)

**Right Column - Media Upload:**
- Image/Video toggle buttons
- Drop zone (dashed border, accepts drag/drop and paste)
- URL input field with Add button
- Auto-save indicator

### Footer
- Keyboard shortcuts reminder: A (Prev), D (Next), ⌘V (Paste), Esc (Back)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| A | Previous card |
| D | Next card |
| ⌘V / Ctrl+V | Paste image from clipboard |
| Esc | Return to dashboard |

## Technical Implementation

### State Management
- `currentIndex`: Current card position (0-based)
- `cards`: Array of spot diagnoses (fetched with pagination or all at once)
- `filter`: Current filter value
- `isDirty`: Whether current card has unsaved changes
- `mediaType`: 'image' or 'video' for current card

### API Changes
None required. Existing endpoints support all operations:
- `GET /api/admin/spot-diagnosis` - Fetch cards
- `PUT /api/admin/spot-diagnosis` - Update card
- `POST /api/admin/upload` - Upload image

### Filter Implementation
Filter is client-side on loaded cards:
- "All Cards": No filter
- "Missing Media": `!image_url && !youtube_id`
- "Has Image": `media_type === 'image' && image_url`
- "Has Video": `media_type === 'video' && youtube_id`

### Auto-Save Behavior
1. User makes changes (uploads image, changes media type)
2. User presses A or D to navigate
3. Before navigating, save current card via PUT
4. On success, move to next/prev card
5. On failure, show error toast, stay on current card

### Paste Handler
```typescript
useEffect(() => {
  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    for (const item of items || []) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) await uploadFile(file)
      }
    }
  }
  document.addEventListener('paste', handlePaste)
  return () => document.removeEventListener('paste', handlePaste)
}, [])
```

### Keyboard Handler
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return // Don't capture when typing
    if (e.key === 'a' || e.key === 'A') navigatePrev()
    if (e.key === 'd' || e.key === 'D') navigateNext()
    if (e.key === 'Escape') router.push('/admin')
  }
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [currentIndex])
```

## File Changes

| File | Change |
|------|--------|
| `app/admin/spot-diagnosis/page.tsx` | Complete rewrite to card editor UI |

## Out of Scope

- Bulk upload (multiple images at once)
- Reordering cards
- Creating new cards (use existing flow)
- Deleting cards (use existing flow)

## Success Criteria

- Can navigate 280 cards in under 5 minutes when adding images
- Keyboard shortcuts work without clicking
- Paste from clipboard works for images
- Filter reduces visible cards to only those needing work
- No data loss on navigation
