-- Mock Exam Results Table
CREATE TABLE IF NOT EXISTS public.mock_exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('full', 'mini', 'calculation')),
    exam_name TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    answered_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    score_percentage INTEGER NOT NULL,
    time_taken_seconds INTEGER NOT NULL,
    time_limit_seconds INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_mock_exam_results_user ON public.mock_exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_exam_results_completed ON public.mock_exam_results(completed_at DESC);

-- Enable RLS
ALTER TABLE public.mock_exam_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own exam results"
ON public.mock_exam_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exam results"
ON public.mock_exam_results FOR INSERT
WITH CHECK (auth.uid() = user_id);
