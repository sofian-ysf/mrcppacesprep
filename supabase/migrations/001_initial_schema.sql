-- Content Categories
CREATE TABLE content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL CHECK (content_type IN ('spot_diagnosis', 'station', 'differential', 'sba', 'checklist')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spot Diagnoses
CREATE TABLE spot_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES content_categories(id),
  image_url TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  description TEXT,
  key_features JSONB DEFAULT '[]',
  exam_tips TEXT,
  difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PACES Stations
CREATE TABLE paces_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_number INT NOT NULL CHECK (station_number BETWEEN 1 AND 5),
  station_type TEXT NOT NULL,
  title TEXT NOT NULL,
  scenario_text TEXT NOT NULL,
  patient_info TEXT,
  task_instructions TEXT NOT NULL,
  time_limit_seconds INT DEFAULT 420,
  model_answer TEXT,
  marking_criteria JSONB DEFAULT '[]',
  examiner_questions JSONB DEFAULT '[]',
  difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Differentials
CREATE TABLE differentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sign_name TEXT NOT NULL,
  category TEXT,
  differentials_list JSONB NOT NULL DEFAULT '{"common": [], "less_common": [], "rare_but_important": []}',
  memory_aid TEXT,
  exam_relevance TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SBA Questions
CREATE TABLE sba_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES content_categories(id),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  key_points JSONB DEFAULT '[]',
  clinical_pearl TEXT,
  exam_tip TEXT,
  difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Examination Checklists
CREATE TABLE exam_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]',
  tips TEXT,
  common_findings JSONB DEFAULT '[]',
  presentation_template TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Subscriptions
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('3month', '6month', '12month')),
  amount_paid INT NOT NULL,
  access_granted_at TIMESTAMPTZ DEFAULT NOW(),
  access_expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress
CREATE TABLE user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_study_time_seconds INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Activity Log
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_type TEXT NOT NULL CHECK (module_type IN ('spot_diagnosis', 'station', 'differential', 'sba', 'checklist')),
  content_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('viewed', 'answered', 'completed')),
  result TEXT CHECK (result IN ('correct', 'incorrect')),
  time_spent_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_spot_diagnoses_category ON spot_diagnoses(category_id);
CREATE INDEX idx_spot_diagnoses_difficulty ON spot_diagnoses(difficulty);
CREATE INDEX idx_paces_stations_type ON paces_stations(station_type);
CREATE INDEX idx_paces_stations_number ON paces_stations(station_number);
CREATE INDEX idx_sba_questions_category ON sba_questions(category_id);
CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_activity_user ON user_activity(user_id);
CREATE INDEX idx_user_activity_module ON user_activity(module_type);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
