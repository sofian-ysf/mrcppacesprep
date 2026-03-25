-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Question Categories Table
CREATE TABLE IF NOT EXISTS public.question_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    question_type TEXT NOT NULL CHECK (question_type IN ('clinical', 'calculation')),
    difficulty_default TEXT DEFAULT 'Medium' CHECK (difficulty_default IN ('Easy', 'Medium', 'Hard')),
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Category Resources Table (for RAG documents)
CREATE TABLE IF NOT EXISTS public.category_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.question_categories(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT CHECK (file_type IN ('pdf', 'docx', 'txt', 'md')),
    file_size_bytes INTEGER,
    content_text TEXT,
    chunk_index INTEGER DEFAULT 0,
    embedding VECTOR(1536),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    uploaded_by UUID REFERENCES auth.users(id)
);

-- Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.question_categories(id),
    question_type TEXT NOT NULL CHECK (question_type IN ('sba', 'emq', 'calculation')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    source_references TEXT[],
    metadata JSONB DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'archived')),
    generation_job_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id)
);

-- Generation Jobs Table (for async question generation)
CREATE TABLE IF NOT EXISTS public.generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.question_categories(id),
    question_type TEXT NOT NULL CHECK (question_type IN ('sba', 'emq', 'calculation')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 50),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    questions_generated INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- User Answers Table (for tracking user responses)
CREATE TABLE IF NOT EXISTS public.user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, question_id, created_at)
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category_id);
CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_category_resources_category ON public.category_resources(category_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_user ON public.user_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_question ON public.user_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON public.generation_jobs(status);

-- Enable RLS
ALTER TABLE public.question_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for question_categories (public read, admin write)
CREATE POLICY "Anyone can view categories"
ON public.question_categories FOR SELECT
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.question_categories FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for category_resources (admin only)
CREATE POLICY "Admins can manage resources"
ON public.category_resources FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for questions
CREATE POLICY "Anyone can view approved questions"
ON public.questions FOR SELECT
USING (status = 'approved');

CREATE POLICY "Admins can manage all questions"
ON public.questions FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for generation_jobs (admin only)
CREATE POLICY "Admins can manage generation jobs"
ON public.generation_jobs FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for user_answers
CREATE POLICY "Users can view own answers"
ON public.user_answers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
ON public.user_answers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin list"
ON public.admin_users FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Super admins can manage admins"
ON public.admin_users FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_questions_updated_at
    BEFORE UPDATE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_categories_updated_at
    BEFORE UPDATE ON public.question_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Insert default categories
INSERT INTO public.question_categories (slug, name, description, question_type, sort_order) VALUES
    ('clinical-pharmacy', 'Clinical Pharmacy & Therapeutics', 'Drug therapy, patient care, and therapeutic decision-making', 'clinical', 1),
    ('pharmacology', 'Pharmacology', 'Drug mechanisms, interactions, and pharmacokinetics', 'clinical', 2),
    ('law-ethics', 'Pharmacy Law & Ethics', 'Legal requirements, professional standards, and ethical practice', 'clinical', 3),
    ('pharmaceutics', 'Pharmaceutics', 'Drug formulation, stability, and pharmaceutical science', 'clinical', 4),
    ('public-health', 'Public Health & Prevention', 'Health promotion, disease prevention, and population health', 'clinical', 5),
    ('cardiovascular', 'Cardiovascular System', 'Heart and circulatory system conditions and treatments', 'clinical', 6),
    ('respiratory', 'Respiratory System', 'Lung conditions, asthma, COPD, and respiratory treatments', 'clinical', 7),
    ('endocrine', 'Endocrine & Metabolic', 'Diabetes, thyroid, and metabolic disorders', 'clinical', 8),
    ('infection', 'Infection', 'Antibiotics, antivirals, and infectious disease management', 'clinical', 9),
    ('mental-health', 'Mental Health', 'Psychiatric conditions and psychotropic medications', 'clinical', 10),
    ('gastrointestinal', 'Gastrointestinal', 'GI conditions and treatments', 'clinical', 11),
    ('pain-management', 'Pain Management', 'Analgesics, pain assessment, and pain management strategies', 'clinical', 12),
    ('dosage', 'Dosage Calculations', 'Weight-based dosing, pediatric dosing, and dose adjustments', 'calculation', 13),
    ('concentrations', 'Concentrations & Dilutions', 'Percentage solutions, dilutions, and concentration calculations', 'calculation', 14),
    ('iv-flows', 'IV Flow Rates & Infusions', 'Drip rates, infusion times, and IV calculations', 'calculation', 15),
    ('pharmacokinetics', 'Pharmacokinetics', 'Half-life, clearance, and PK parameter calculations', 'calculation', 16),
    ('unit-conversions', 'Unit Conversions', 'Metric conversions and unit transformations', 'calculation', 17)
ON CONFLICT (slug) DO NOTHING;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = check_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
