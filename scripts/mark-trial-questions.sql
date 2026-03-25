-- Mark ~100 clinical questions as trial-featured
-- Distribution: 30% Easy, 50% Medium, 20% Hard
-- Spread across all clinical categories

-- First, reset any existing trial-featured flags
UPDATE questions SET is_trial_featured = FALSE, trial_display_order = NULL;

-- Create a temporary table with selected questions
WITH clinical_categories AS (
  SELECT id, slug, name
  FROM question_categories
  WHERE question_type = 'clinical'
),
ranked_questions AS (
  SELECT
    q.id,
    q.difficulty,
    qc.slug as category_slug,
    qc.name as category_name,
    ROW_NUMBER() OVER (
      PARTITION BY q.category_id, q.difficulty
      ORDER BY RANDOM()
    ) as rn
  FROM questions q
  JOIN clinical_categories qc ON q.category_id = qc.id
  WHERE q.status = 'approved'
    AND q.question_type IN ('sba', 'emq')
),
-- Select questions with target distribution per category
-- ~8-9 questions per category (100 total / 12 categories)
-- Within each category: 3 Easy, 4-5 Medium, 1-2 Hard
selected_easy AS (
  SELECT id, category_slug, 'Easy' as difficulty
  FROM ranked_questions
  WHERE difficulty = 'Easy' AND rn <= 3
),
selected_medium AS (
  SELECT id, category_slug, 'Medium' as difficulty
  FROM ranked_questions
  WHERE difficulty = 'Medium' AND rn <= 5
),
selected_hard AS (
  SELECT id, category_slug, 'Hard' as difficulty
  FROM ranked_questions
  WHERE difficulty = 'Hard' AND rn <= 2
),
all_selected AS (
  SELECT * FROM selected_easy
  UNION ALL
  SELECT * FROM selected_medium
  UNION ALL
  SELECT * FROM selected_hard
),
-- Add display order
final_selection AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY
      CASE difficulty
        WHEN 'Easy' THEN 1
        WHEN 'Medium' THEN 2
        WHEN 'Hard' THEN 3
      END,
      category_slug,
      RANDOM()
    ) as display_order
  FROM all_selected
  LIMIT 100
)
-- Update the questions
UPDATE questions
SET
  is_trial_featured = TRUE,
  trial_display_order = fs.display_order
FROM final_selection fs
WHERE questions.id = fs.id;

-- Show summary of what was marked
SELECT
  'Summary' as info,
  COUNT(*) as total_featured,
  COUNT(*) FILTER (WHERE difficulty = 'Easy') as easy_count,
  COUNT(*) FILTER (WHERE difficulty = 'Medium') as medium_count,
  COUNT(*) FILTER (WHERE difficulty = 'Hard') as hard_count
FROM questions
WHERE is_trial_featured = TRUE;

-- Show distribution by category
SELECT
  qc.name as category,
  COUNT(*) as question_count,
  COUNT(*) FILTER (WHERE q.difficulty = 'Easy') as easy,
  COUNT(*) FILTER (WHERE q.difficulty = 'Medium') as medium,
  COUNT(*) FILTER (WHERE q.difficulty = 'Hard') as hard
FROM questions q
JOIN question_categories qc ON q.category_id = qc.id
WHERE q.is_trial_featured = TRUE
GROUP BY qc.name
ORDER BY qc.name;
