# PreRegExamPrep Flutter App Design

**Date:** 2026-03-03
**Status:** Approved

## Overview

Native iOS Flutter app for PreRegExamPrep, providing full offline access to the GPhC exam preparation platform for paying subscribers.

## Requirements

- **Users:** Paying subscribers only (active subscription required)
- **Features:** Full web parity (Questions, Calculations, Mock Exams, Flashcards, Progress, Achievements, Notes, Settings)
- **Offline:** Full download capability for offline study
- **Platform:** iOS only (initial release)
- **Auth:** Supabase email/password (existing accounts) + Apple Sign-In (new accounts)
- **Onboarding:** Full onboarding with exam date, daily goals, starting category
- **State Management:** Riverpod

## Architecture

**Approach:** Feature-First with Drift (SQLite)

Feature-based folder organization where each feature contains its own models, providers, services, and UI. Drift provides type-safe SQLite for offline storage, mirroring the Supabase schema.

## Project Structure

```
flutter_app/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   │
│   ├── core/
│   │   ├── constants/
│   │   ├── theme/
│   │   ├── router/
│   │   ├── database/
│   │   ├── network/
│   │   └── utils/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── dashboard/
│   │   ├── questions/
│   │   ├── calculations/
│   │   ├── mock_exams/
│   │   ├── flashcards/
│   │   ├── progress/
│   │   ├── achievements/
│   │   ├── bookmarks/
│   │   ├── notes/
│   │   ├── settings/
│   │   └── sync/
│   │
│   └── shared/
│       ├── widgets/
│       └── providers/
│
├── assets/
│   └── fonts/
│       └── Poppins/
│
└── pubspec.yaml
```

Each feature folder contains:
```
feature_name/
├── data/
│   ├── models/
│   ├── repositories/
│   └── datasources/
├── providers/
├── screens/
└── widgets/
```

## Navigation

**Router:** GoRouter with bottom navigation

**Bottom Navigation Tabs (5):**
1. **Home** - Dashboard with today's progress, streak, quick actions
2. **Questions** - Question Bank + Calculations + Bookmarks
3. **Study** - Flashcards + Mock Exams + Notes
4. **Progress** - Analytics charts + Achievements
5. **Settings** - Profile, goals, sync, logout

**App Flow:**
```
Splash → Auth Check
  ├── Not logged in → Onboarding → Login/Signup → Goal Setup → Dashboard
  └── Logged in → Subscription Check
        ├── Active → Dashboard
        └── Inactive → Paywall (link to web)
```

## Database Schema (Drift/SQLite)

### Content Tables (Downloaded)

**questions**
- id, category_id, question_type, difficulty
- question_text, options (JSON), correct_answer
- explanation, explanation_structured (JSON)
- source_references (JSON), synced_at

**question_categories**
- id, slug, name, description
- question_type, icon, sort_order

**flashcard_decks**
- id, name, slug, description, card_count, is_active

**flashcards**
- id, deck_id, front, back, media_files (JSON), sort_order

**achievements**
- id, slug, name, description, icon
- category, rarity, requirement_type, requirement_value

### User Progress Tables (Bidirectional Sync)

All user tables include `is_synced` boolean for tracking sync status:

- user_answers
- user_question_progress
- user_flashcard_progress
- user_bookmarks
- user_notes
- user_achievements
- user_daily_activity
- mock_exam_results

### Sync Metadata

**sync_status**
- table_name, last_synced_at, total_records, pending_uploads

## UI Theme

### Colors
- Primary Purple: #5E2373
- Background: #FBFAF4
- Surface: #FFFFFF
- Text Primary: #171717
- Text Secondary: #6B7280
- Success: #22C55E
- Warning: #F59E0B
- Error: #EF4444

### Typography
- Font: Poppins (all weights 100-900)
- Display: 32px, weight 600
- Headline: 24px, weight 600
- Title: 20px, weight 600
- Body: 16px, weight 400
- Caption: 14px, weight 400

### Shared Components
- **PillButton** - Fully rounded, variants: primary/secondary/ghost/outline
- **GlassCard** - White 80% opacity, backdrop blur, 16px radius
- **PillTextField** - Fully rounded, frosted glass background
- **PillBadge** - Small rounded pill for tags
- **ProgressRing** - Circular progress with purple gradient
- **QuestionCard** - GlassCard with options A-E
- **FlashcardWidget** - Flip animation with swipe gestures

## Authentication

### Providers
1. **Supabase Email/Password** - Existing web users
2. **Apple Sign-In** - Native iOS, creates/links Supabase account

### Post-Auth Flow
1. Check `user_subscriptions` for active subscription
2. If active: check if onboarding complete → Dashboard or Goal Setup
3. If inactive: show Paywall with link to web

### Session Management
- Secure token storage via flutter_secure_storage
- Auto-refresh on app launch
- Graceful token expiry handling

## Offline Sync System

### Initial Download (~8-10 MB)
1. Categories (17 records)
2. Questions (2,324 records)
3. Flashcard decks (1 record)
4. Flashcards (4,672 records)
5. Achievements (28 records)
6. User's existing progress

### Sync Triggers
**Automatic:**
- App launch (if online)
- App foreground (if >5 min since last sync)
- After answering questions (debounced 30s)
- After reviewing flashcards (debounced)
- Pull-to-refresh

**Manual:**
- Settings → "Sync Now" button

### Conflict Resolution
- Server wins (latest updated_at timestamp)
- User answers merged (both attempts kept)

### Connectivity Handling
- Monitor via connectivity_plus
- Subtle offline banner
- Auto-sync on reconnection

## Dependencies

```yaml
# Core
flutter_riverpod: ^2.5.1
go_router: ^14.0.0

# Supabase
supabase_flutter: ^2.5.0

# Apple Sign-In
sign_in_with_apple: ^6.1.0

# Local Database
drift: ^2.16.0
sqlite3_flutter_libs: ^0.5.0

# Offline & Sync
connectivity_plus: ^6.0.0
flutter_secure_storage: ^9.0.0

# UI Components
flutter_svg: ^2.0.0
cached_network_image: ^3.3.0
shimmer: ^3.0.0
fl_chart: ^0.68.0
flutter_animate: ^4.5.0

# Utilities
intl: ^0.19.0
uuid: ^4.4.0
equatable: ^2.0.5
freezed: ^2.5.0
json_annotation: ^4.9.0
```

## Platform Requirements

- **Flutter SDK:** 3.19+
- **Dart SDK:** 3.3+
- **iOS Minimum:** 14.0
- **Xcode:** 15.0+
