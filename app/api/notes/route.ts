import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

// GET - Fetch notes for a specific question/flashcard or all notes
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('question_id')
    const flashcardId = searchParams.get('flashcard_id')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('user_notes')
      .select(`
        id,
        question_id,
        flashcard_id,
        content,
        created_at,
        updated_at,
        questions (
          id,
          question_text,
          question_type,
          difficulty,
          question_categories (name, slug)
        ),
        flashcards (
          id,
          front,
          back,
          flashcard_decks (name, slug)
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (questionId) {
      query = query.eq('question_id', questionId)
    }

    if (flashcardId) {
      query = query.eq('flashcard_id', flashcardId)
    }

    if (search) {
      query = query.ilike('content', `%${search}%`)
    }

    const { data: notes, error } = await query

    if (error) {
      console.error('Error fetching notes:', error)
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
    }

    return NextResponse.json({
      notes: notes || [],
      count: notes?.length || 0
    })
  } catch (error) {
    console.error('Notes GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create or update a note
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { question_id, flashcard_id, content } = await request.json()

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Note content is required' }, { status: 400 })
    }

    if (!question_id && !flashcard_id) {
      return NextResponse.json({ error: 'Either question_id or flashcard_id is required' }, { status: 400 })
    }

    // Check if a note already exists for this question/flashcard
    let existingQuery = supabase
      .from('user_notes')
      .select('id')
      .eq('user_id', user.id)

    if (question_id) {
      existingQuery = existingQuery.eq('question_id', question_id)
    } else {
      existingQuery = existingQuery.eq('flashcard_id', flashcard_id)
    }

    const { data: existingNote, error: existingError } = await existingQuery.single()

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking existing note:', existingError)
    }

    let result

    if (existingNote) {
      // Update existing note
      result = await supabase
        .from('user_notes')
        .update({
          content: content.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingNote.id)
        .select()
        .single()
    } else {
      // Create new note
      result = await supabase
        .from('user_notes')
        .insert({
          user_id: user.id,
          question_id: question_id || null,
          flashcard_id: flashcard_id || null,
          content: content.trim()
        })
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error saving note:', result.error)
      return NextResponse.json({ error: 'Failed to save note' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      note: result.data,
      action: existingNote ? 'updated' : 'created'
    })
  } catch (error) {
    console.error('Notes POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a note
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get('id')
    const questionId = searchParams.get('question_id')
    const flashcardId = searchParams.get('flashcard_id')

    if (!noteId && !questionId && !flashcardId) {
      return NextResponse.json({ error: 'Note ID or question/flashcard ID is required' }, { status: 400 })
    }

    let deleteQuery = supabase
      .from('user_notes')
      .delete()
      .eq('user_id', user.id)

    if (noteId) {
      deleteQuery = deleteQuery.eq('id', noteId)
    } else if (questionId) {
      deleteQuery = deleteQuery.eq('question_id', questionId)
    } else if (flashcardId) {
      deleteQuery = deleteQuery.eq('flashcard_id', flashcardId)
    }

    const { error: deleteError } = await deleteQuery

    if (deleteError) {
      console.error('Error deleting note:', deleteError)
      return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notes DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
