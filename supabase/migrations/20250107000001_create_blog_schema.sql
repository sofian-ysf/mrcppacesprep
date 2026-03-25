-- Blog Categories Table
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Resources Table (for RAG documents)
CREATE TABLE IF NOT EXISTS public.blog_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.blog_categories(id) ON DELETE CASCADE,
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

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.blog_categories(id),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_name TEXT NOT NULL DEFAULT 'PreRegExamPrep Team',
    author_title TEXT,
    read_time_minutes INTEGER DEFAULT 5,
    tags TEXT[] DEFAULT '{}',

    -- SEO Fields
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[] DEFAULT '{}',
    canonical_url TEXT,
    og_image TEXT,

    -- JSON-LD Schema
    schema_json JSONB DEFAULT '{}',

    -- FAQ Section (for FAQ Schema)
    faq_items JSONB DEFAULT '[]',

    -- Internal Linking
    related_post_ids UUID[] DEFAULT '{}',
    internal_links JSONB DEFAULT '[]',

    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,

    -- Generation tracking
    generation_job_id UUID,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    published_by UUID REFERENCES auth.users(id)
);

-- Blog Generation Jobs Table
CREATE TABLE IF NOT EXISTS public.blog_generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.blog_categories(id),
    topic TEXT NOT NULL,
    target_keywords TEXT[] DEFAULT '{}',
    tone TEXT DEFAULT 'professional',
    word_count_target INTEGER DEFAULT 1500,
    include_faq BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_resources_category ON public.blog_resources(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_resources_chunk ON public.blog_resources(category_id, chunk_index);

-- Enable RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_generation_jobs ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view blog categories"
ON public.blog_categories FOR SELECT
USING (true);

CREATE POLICY "Anyone can view published posts"
ON public.blog_posts FOR SELECT
USING (status = 'published');

-- Admin policies for blog_categories
CREATE POLICY "Admins can insert blog categories"
ON public.blog_categories FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update blog categories"
ON public.blog_categories FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete blog categories"
ON public.blog_categories FOR DELETE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Admin policies for blog_resources
CREATE POLICY "Admins can view blog resources"
ON public.blog_resources FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can insert blog resources"
ON public.blog_resources FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update blog resources"
ON public.blog_resources FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete blog resources"
ON public.blog_resources FOR DELETE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Admin policies for blog_posts (full access)
CREATE POLICY "Admins can view all blog posts"
ON public.blog_posts FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts FOR DELETE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Admin policies for blog_generation_jobs
CREATE POLICY "Admins can view blog generation jobs"
ON public.blog_generation_jobs FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can insert blog generation jobs"
ON public.blog_generation_jobs FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update blog generation jobs"
ON public.blog_generation_jobs FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER set_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_blog_categories_updated_at
    BEFORE UPDATE ON public.blog_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Insert default blog categories
INSERT INTO public.blog_categories (slug, name, description, sort_order) VALUES
    ('study-tips', 'Study Tips', 'Effective study strategies and exam preparation techniques for pharmacy students', 1),
    ('career-guidance', 'Career Guidance', 'Career advice and professional development for pharmacy professionals', 2),
    ('pharmacy-news', 'Pharmacy News', 'Latest updates and developments in the UK pharmacy industry', 3),
    ('exam-updates', 'Exam Updates', 'GPhC exam format changes, updates, and important announcements', 4),
    ('success-stories', 'Success Stories', 'Inspiring stories from students who passed their pre-reg exams', 5),
    ('clinical-insights', 'Clinical Insights', 'Clinical pharmacy knowledge, drug interactions, and therapeutic updates', 6)
ON CONFLICT (slug) DO NOTHING;

-- Function for semantic search on blog resources
CREATE OR REPLACE FUNCTION match_blog_resources(
    query_embedding VECTOR(1536),
    match_category_id UUID,
    match_count INT DEFAULT 10,
    match_threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE (
    id UUID,
    content_text TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        br.id,
        br.content_text,
        1 - (br.embedding <=> query_embedding) as similarity
    FROM public.blog_resources br
    WHERE br.category_id = match_category_id
      AND br.embedding IS NOT NULL
      AND br.content_text IS NOT NULL
      AND 1 - (br.embedding <=> query_embedding) > match_threshold
    ORDER BY br.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
