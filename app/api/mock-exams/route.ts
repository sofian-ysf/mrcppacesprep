import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

// Mock exam configurations
const EXAM_CONFIGS = {
  'full': {
    name: 'Full-Length Practice Exam',
    questionCount: 110,
    duration: 150, // minutes
    // Mix of clinical questions (SBA + EMQ)
    composition: {
      sba: 90,
      emq: 20
    }
  },
  'mini': {
    name: 'Mini Practice Exam',
    questionCount: 25,
    duration: 30,
    composition: {
      sba: 20,
      emq: 5
    }
  },
  'calculation': {
    name: 'Calculation Practice Exam',
    questionCount: 15,
    duration: 20,
    composition: {
      calculation: 15
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const examType = searchParams.get('type') as keyof typeof EXAM_CONFIGS

    if (!examType || !EXAM_CONFIGS[examType]) {
      return NextResponse.json({ error: 'Invalid exam type' }, { status: 400 })
    }

    const config = EXAM_CONFIGS[examType]
    const questions: any[] = []

    // Fetch questions based on composition
    for (const [questionType, count] of Object.entries(config.composition)) {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          question_type,
          difficulty,
          question_text,
          options,
          correct_answer,
          explanation,
          category_id,
          question_categories (
            id,
            name,
            slug
          )
        `)
        .eq('status', 'approved')
        .eq('question_type', questionType)
        .limit(count * 2) // Fetch more to allow for randomization

      if (error) {
        console.error(`Error fetching ${questionType} questions:`, error)
        continue
      }

      if (data && data.length > 0) {
        // Shuffle and take the required count
        const shuffled = data.sort(() => Math.random() - 0.5)
        questions.push(...shuffled.slice(0, count))
      }
    }

    // If we don't have enough questions, try to fill with any available
    if (questions.length < config.questionCount) {
      const needed = config.questionCount - questions.length
      const existingIds = questions.map(q => q.id)

      const { data: additionalQuestions } = await supabase
        .from('questions')
        .select(`
          id,
          question_type,
          difficulty,
          question_text,
          options,
          correct_answer,
          explanation,
          category_id,
          question_categories (
            id,
            name,
            slug
          )
        `)
        .eq('status', 'approved')
        .not('id', 'in', `(${existingIds.join(',')})`)
        .limit(needed)

      if (additionalQuestions) {
        questions.push(...additionalQuestions)
      }
    }

    // Final shuffle of all questions
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5)

    return NextResponse.json({
      exam: {
        type: examType,
        name: config.name,
        duration: config.duration,
        questionCount: shuffledQuestions.length
      },
      questions: shuffledQuestions
    })
  } catch (error) {
    console.error('Mock exam fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch mock exam' }, { status: 500 })
  }
}
