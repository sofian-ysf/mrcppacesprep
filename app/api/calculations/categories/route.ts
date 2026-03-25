import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all calculation categories with question counts
    const { data: categories, error: categoriesError } = await supabase
      .from('question_categories')
      .select('id, slug, name, description')
      .eq('question_type', 'calculation')
      .order('sort_order', { ascending: true })

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    // Get question counts for each category
    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (category) => {
        // Get total count
        const { count: totalCount } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'approved')
          .eq('question_type', 'calculation')

        // Get count by difficulty
        const { data: difficultyData } = await supabase
          .from('questions')
          .select('difficulty')
          .eq('category_id', category.id)
          .eq('status', 'approved')
          .eq('question_type', 'calculation')

        const difficultyCounts = {
          Easy: 0,
          Medium: 0,
          Hard: 0
        }

        difficultyData?.forEach(q => {
          if (q.difficulty in difficultyCounts) {
            difficultyCounts[q.difficulty as keyof typeof difficultyCounts]++
          }
        })

        // Determine primary difficulty based on majority
        let primaryDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'
        const maxCount = Math.max(difficultyCounts.Easy, difficultyCounts.Medium, difficultyCounts.Hard)
        if (maxCount > 0) {
          if (difficultyCounts.Hard === maxCount) primaryDifficulty = 'Hard'
          else if (difficultyCounts.Easy === maxCount) primaryDifficulty = 'Easy'
        }

        return {
          id: category.slug,
          dbId: category.id,
          name: category.name,
          description: category.description || '',
          questionCount: totalCount || 0,
          difficulty: primaryDifficulty,
          difficultyCounts
        }
      })
    )

    // Get total calculation questions count
    const { count: totalQuestions } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .eq('question_type', 'calculation')

    return NextResponse.json({
      categories: categoriesWithCounts.filter(c => c.questionCount > 0),
      totalQuestions: totalQuestions || 0
    })
  } catch (error) {
    console.error('Error fetching calculation categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
