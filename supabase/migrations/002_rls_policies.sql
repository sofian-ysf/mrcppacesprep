-- Enable RLS on all tables
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE paces_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE differentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE sba_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for content
CREATE POLICY "Public read content_categories" ON content_categories FOR SELECT USING (true);
CREATE POLICY "Public read spot_diagnoses" ON spot_diagnoses FOR SELECT USING (true);
CREATE POLICY "Public read paces_stations" ON paces_stations FOR SELECT USING (true);
CREATE POLICY "Public read differentials" ON differentials FOR SELECT USING (true);
CREATE POLICY "Public read sba_questions" ON sba_questions FOR SELECT USING (true);
CREATE POLICY "Public read exam_checklists" ON exam_checklists FOR SELECT USING (true);
CREATE POLICY "Public read published blog_posts" ON blog_posts FOR SELECT USING (published = true);

-- User can only see their own subscription
CREATE POLICY "Users read own subscription" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- User can only see/update their own progress
CREATE POLICY "Users read own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User can only see/insert their own activity
CREATE POLICY "Users read own activity" ON user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own activity" ON user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
