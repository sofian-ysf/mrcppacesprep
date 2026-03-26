# MRCPPACESPREP

MRCP PACES exam preparation platform built with Next.js 16, Supabase, and Stripe.

## Content Modules

### 1. Spot Diagnosis Flashcards
Clinical image recognition training with three study modes.

**Study Modes:**
- **Classic Flip** - Image front, diagnosis + explanation back
- **MCQ Mode** - Image + 4 options, reveal correct answer
- **Timed Recognition** - 10-second timer, type/select answer

**Categories:** Dermatology, Ophthalmology, Radiology, Clinical Signs, Hands, Face, etc.

### 2. PACES Stations
Scenario-based practice for all 5 PACES stations with optional timer.

**Station Types:**
- Station 1: Respiratory, Abdominal examination
- Station 2: History taking
- Station 3: Cardiovascular, Neurological examination
- Station 4: Communication skills, Ethics
- Station 5: Brief clinical consultations (2 encounters)

**Practice Flow:**
1. Browse/filter stations by type
2. Select station → See scenario + patient info
3. Optionally start timer (6-8 min)
4. User mentally/verbally rehearses
5. Reveal model answer + marking criteria
6. Self-assess, mark complete

### 3. Differentials Flashcards
Sign-to-differential-diagnosis cards.

**Format:** Simple flip card - sign on front, categorized list on back

**Differential Categories:**
- Common causes
- Less common causes
- Rare but important causes

### 4. High Yield SBAs
Multiple choice questions (Single Best Answer) for knowledge testing.

**Categories:** Medicine, Neurology, Cardiology, Respiratory, Gastroenterology, Rheumatology, etc.

**Features:**
- Explanation with each answer
- Key learning points
- Clinical pearls
- Exam tips

### 5. Examination Checklists
Step-by-step examination routines.

**Systems:** Respiratory, Cardiovascular, Abdominal, Neurological (upper limb, lower limb, cranial nerves), Musculoskeletal, Peripheral vascular, Thyroid, etc.

**Features:**
- Ordered steps with checkboxes
- Tips for each system
- Common findings to look for
- Presentation template

---

## Database Schema

### Content Tables

```sql
-- Categories for organizing content
content_categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,  -- 'spot_diagnosis' | 'station' | 'differential' | 'sba' | 'checklist'
  description TEXT,
  created_at TIMESTAMPTZ
)

-- Spot Diagnosis Flashcards
spot_diagnoses (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES content_categories(id),
  image_url TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  description TEXT,
  key_features JSONB DEFAULT '[]',  -- Array of key visual features
  exam_tips TEXT,
  difficulty TEXT DEFAULT 'Medium',  -- 'Easy' | 'Medium' | 'Hard'
  created_at TIMESTAMPTZ
)

-- PACES Stations
paces_stations (
  id UUID PRIMARY KEY,
  station_number INT NOT NULL,  -- 1-5
  station_type TEXT NOT NULL,   -- 'respiratory' | 'abdominal' | 'history' | 'cardiovascular' | 'neurological' | 'communication' | 'ethics' | 'brief_consultation'
  title TEXT NOT NULL,
  scenario_text TEXT NOT NULL,
  patient_info TEXT,
  task_instructions TEXT NOT NULL,
  time_limit_seconds INT DEFAULT 420,  -- 7 minutes default
  model_answer TEXT,
  marking_criteria JSONB DEFAULT '[]',  -- Array of {criterion, max_marks}
  examiner_questions JSONB DEFAULT '[]',  -- Array of {question, model_answer}
  difficulty TEXT DEFAULT 'Medium',
  created_at TIMESTAMPTZ
)

-- Differentials Flashcards
differentials (
  id UUID PRIMARY KEY,
  sign_name TEXT NOT NULL,
  category TEXT,  -- System/category
  differentials_list JSONB NOT NULL,  -- {"common": [], "less_common": [], "rare_but_important": []}
  memory_aid TEXT,  -- Optional mnemonic
  exam_relevance TEXT,
  created_at TIMESTAMPTZ
)

-- SBA Questions
sba_questions (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES content_categories(id),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,  -- Array of {letter, text}
  correct_answer TEXT NOT NULL,  -- 'A' | 'B' | 'C' | 'D' | 'E'
  explanation TEXT,
  key_points JSONB DEFAULT '[]',
  clinical_pearl TEXT,
  exam_tip TEXT,
  difficulty TEXT DEFAULT 'Medium',
  created_at TIMESTAMPTZ
)

-- Examination Checklists
exam_checklists (
  id UUID PRIMARY KEY,
  system_name TEXT NOT NULL,  -- 'Respiratory' | 'Cardiovascular' | etc.
  steps JSONB NOT NULL,  -- Array of {step_number, instruction, details}
  tips TEXT,
  common_findings JSONB DEFAULT '[]',
  presentation_template TEXT,
  created_at TIMESTAMPTZ
)
```

### User Tables

```sql
-- User Subscriptions
user_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  plan_type TEXT NOT NULL,  -- '3month' | '6month' | '12month'
  amount_paid INT NOT NULL,  -- in pence
  access_granted_at TIMESTAMPTZ,
  access_expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active',  -- 'active' | 'expired' | 'cancelled'
  created_at TIMESTAMPTZ
)

-- User Progress (aggregate stats)
user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  total_study_time_seconds INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- User Activity Log (detailed tracking)
user_activity (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  module_type TEXT NOT NULL,  -- 'spot_diagnosis' | 'station' | 'differential' | 'sba' | 'checklist'
  content_id UUID NOT NULL,
  action TEXT NOT NULL,  -- 'viewed' | 'answered' | 'completed'
  result TEXT,  -- 'correct' | 'incorrect' | null
  time_spent_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ
)
```

### Blog

```sql
blog_posts (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

---

## Pricing

| Plan | Price | Duration |
|------|-------|----------|
| Standard | £75 | 3 months |
| Plus | £135 | 6 months |
| Premium | £215 | 12 months |

**No free trial** - Free demo page at `/try-free` with sample content only.

---

## Key Routes

### Public
- `/` - Landing page
- `/pricing` - Plan comparison
- `/try-free` - Free demo (no account required)
- `/login`, `/signup` - Auth

### Dashboard (requires subscription)
- `/dashboard` - Overview, stats, quick actions
- `/dashboard/spot-diagnosis` - Spot diagnosis flashcards
- `/dashboard/stations` - PACES stations browser
- `/dashboard/stations/[id]/practice` - Station practice with timer
- `/dashboard/differentials` - Differentials flashcards
- `/dashboard/sba` - SBA question bank
- `/dashboard/checklists` - Examination checklists
- `/dashboard/progress` - Analytics & tracking

### Admin
- `/admin/spot-diagnosis` - Manage spot diagnoses
- `/admin/stations` - Manage stations
- `/admin/differentials` - Manage differentials
- `/admin/sba` - Manage SBA questions
- `/admin/checklists` - Manage checklists

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe (one-time payments)
- **Email:** Resend
- **Bot Protection:** Cloudflare Turnstile
