const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { parse } = require('csv-parse/sync');

// Load env
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('Usage: node import-calculations-csv.js <path-to-csv>');
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  console.log(`Found ${records.length} questions to import`);

  let updated = 0;
  let errors = 0;

  for (const record of records) {
    const options = [
      { letter: 'A', text: record['Option A'] || '' },
      { letter: 'B', text: record['Option B'] || '' },
      { letter: 'C', text: record['Option C'] || '' },
      { letter: 'D', text: record['Option D'] || '' },
      { letter: 'E', text: record['Option E'] || '' },
    ].filter(o => o.text.trim() !== '');

    const updateData = {
      difficulty: record['Difficulty'],
      question_text: record['Question'],
      options: options,
      correct_answer: record['Correct Answer'],
      explanation: record['Explanation'],
      status: record['Status'] || 'approved',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('questions')
      .update(updateData)
      .eq('id', record['ID']);

    if (error) {
      console.error(`Error updating ${record['ID']}:`, error.message);
      errors++;
    } else {
      updated++;
      if (updated % 50 === 0) {
        console.log(`Updated ${updated}/${records.length}...`);
      }
    }
  }

  console.log(`\nDone! Updated: ${updated}, Errors: ${errors}`);
}

main();
