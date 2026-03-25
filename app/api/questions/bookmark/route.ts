import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

// GET - Check if question is bookmarked or get all bookmarks
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('question_id')

    if (questionId) {
      // Check if specific question is bookmarked
      const { data: bookmark, error } = await supabase
        .from('user_bookmarks')
        .select('id, note, created_at')
        .eq('user_id', user.id)
        .eq('question_id', questionId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking bookmark:', error)
        return NextResponse.json({ error: 'Failed to check bookmark' }, { status: 500 })
      }

      return NextResponse.json({
        isBookmarked: !!bookmark,
        bookmark: bookmark || null
      })
    } else {
      // Get all bookmarked questions for the user
      const { data: bookmarks, error } = await supabase
        .from('user_bookmarks')
        .select(`
          id,
          question_id,
          note,
          created_at,
          questions (
            id,
            question_type,
            difficulty,
            question_text,
            category_id,
            question_categories (
              name,
              slug
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bookmarks:', error)
        return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
      }

      return NextResponse.json({
        bookmarks: bookmarks || [],
        count: bookmarks?.length || 0
      })
    }
  } catch (error) {
    console.error('Bookmark GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Toggle bookmark on a question
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { question_id, note } = await request.json()

    if (!question_id) {
      return NextResponse.json({ error: 'Missing question_id' }, { status: 400 })
    }

    // Check if bookmark already exists
    const { data: existingBookmark, error: checkError } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', question_id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing bookmark:', checkError)
      return NextResponse.json({ error: 'Failed to check bookmark' }, { status: 500 })
    }

    if (existingBookmark) {
      // Remove bookmark
      const { error: deleteError } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('id', existingBookmark.id)

      if (deleteError) {
        console.error('Error deleting bookmark:', deleteError)
        return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        action: 'removed',
        isBookmarked: false
      })
    } else {
      // Add bookmark
      const { data: newBookmark, error: insertError } = await supabase
        .from('user_bookmarks')
        .insert({
          user_id: user.id,
          question_id,
          note: note || null
        })
        .select('id, created_at')
        .single()

      if (insertError) {
        console.error('Error creating bookmark:', insertError)
        return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        action: 'added',
        isBookmarked: true,
        bookmark: newBookmark
      })
    }
  } catch (error) {
    console.error('Bookmark POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update bookmark note
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { question_id, note } = await request.json()

    if (!question_id) {
      return NextResponse.json({ error: 'Missing question_id' }, { status: 400 })
    }

    const { data: updatedBookmark, error: updateError } = await supabase
      .from('user_bookmarks')
      .update({ note })
      .eq('user_id', user.id)
      .eq('question_id', question_id)
      .select('id, note, created_at')
      .single()

    if (updateError) {
      console.error('Error updating bookmark:', updateError)
      return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      bookmark: updatedBookmark
    })
  } catch (error) {
    console.error('Bookmark PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
