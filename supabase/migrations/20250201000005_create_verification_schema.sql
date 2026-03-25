-- ================================================
-- Question Verification Schema
-- ================================================
-- Tracks AI verification of calculation questions

-- Table to store verification results
CREATE TABLE IF NOT EXISTS question_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_by UUID REFERENCES auth.users(id),

    -- Verification results
    is_correct BOOLEAN NOT NULL,
    ai_answer TEXT,                    -- The answer AI calculated
    ai_explanation TEXT,               -- AI's step-by-step working
    discrepancy_notes TEXT,            -- What's wrong if incorrect
    confidence_score DECIMAL(3,2),     -- 0.00 to 1.00

    -- Model info
    model_used TEXT NOT NULL DEFAULT 'gemini-2.0-flash',

    -- Status tracking
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'needs_review', 'fixed')),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_question_verification UNIQUE (question_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_verifications_question ON question_verifications(question_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON question_verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_is_correct ON question_verifications(is_correct);

-- Enable RLS
ALTER TABLE question_verifications ENABLE ROW LEVEL SECURITY;

-- Only admins can access verification data
CREATE POLICY "Admins can manage verifications"
    ON question_verifications
    FOR ALL
    USING (
        EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
    );
