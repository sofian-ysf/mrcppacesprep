const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper to escape CSV fields
function escapeCSV(str) {
  if (str === null || str === undefined) return '';
  str = String(str);
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

async function main() {
  // First get the dosage category ID
  const { data: category, error: catError } = await supabase
    .from('question_categories')
    .select('id, name')
    .eq('slug', 'dosage')
    .single();

  if (catError) {
    console.error('Error finding category:', catError);
    process.exit(1);
  }

  console.log('Found category:', category.name);

  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      id,
      question_type,
      difficulty,
      question_text,
      options,
      correct_answer,
      explanation,
      status
    `)
    .eq('question_type', 'calculation')
    .eq('category_id', category.id)
    .order('created_at');

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log('Total dosage calculation questions:', questions.length);

  // Build CSV
  const headers = ['ID', 'Difficulty', 'Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Option E', 'Correct Answer', 'Explanation', 'Status'];
  const rows = [headers.join(',')];

  for (const q of questions) {
    const options = q.options || [];
    const optionA = options.find(o => o.letter === 'A')?.text || '';
    const optionB = options.find(o => o.letter === 'B')?.text || '';
    const optionC = options.find(o => o.letter === 'C')?.text || '';
    const optionD = options.find(o => o.letter === 'D')?.text || '';
    const optionE = options.find(o => o.letter === 'E')?.text || '';

    const row = [
      escapeCSV(q.id),
      escapeCSV(q.difficulty),
      escapeCSV(q.question_text),
      escapeCSV(optionA),
      escapeCSV(optionB),
      escapeCSV(optionC),
      escapeCSV(optionD),
      escapeCSV(optionE),
      escapeCSV(q.correct_answer),
      escapeCSV(q.explanation),
      escapeCSV(q.status)
    ];
    rows.push(row.join(','));
  }

  const csv = rows.join('\n');
  const outputPath = path.join(__dirname, '..', 'dosage-calculations.csv');
  fs.writeFileSync(outputPath, csv, 'utf8');
  console.log('Exported to:', outputPath);
}

main();
