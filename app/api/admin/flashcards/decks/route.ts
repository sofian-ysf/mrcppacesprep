import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (adminError || !adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // Fetch all decks (admin can see all)
    let query = supabase
      .from('flashcard_decks')
      .select('*')
      .order('created_at', { ascending: false })

    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    const { data: decks, error: decksError } = await query

    if (decksError) {
      console.error('Error fetching decks:', decksError)
      return NextResponse.json({ error: 'Failed to fetch decks' }, { status: 500 })
    }

    // Get stats for each deck
    const decksWithStats = await Promise.all(
      (decks || []).map(async (deck) => {
        // Get total users studying this deck
        const { count: usersCount } = await supabase
          .from('user_flashcard_progress')
          .select('user_id', { count: 'exact', head: true })
          .in('flashcard_id',
            (await supabase
              .from('flashcards')
              .select('id')
              .eq('deck_id', deck.id)
            ).data?.map(f => f.id) || []
          )

        // Get total reviews
        const { count: reviewsCount } = await supabase
          .from('flashcard_review_history')
          .select('id', { count: 'exact', head: true })
          .in('flashcard_id',
            (await supabase
              .from('flashcards')
              .select('id')
              .eq('deck_id', deck.id)
            ).data?.map(f => f.id) || []
          )

        return {
          ...deck,
          stats: {
            totalUsers: usersCount || 0,
            totalReviews: reviewsCount || 0,
          },
        }
      })
    )

    return NextResponse.json({ decks: decksWithStats })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (adminError || !adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { id, name, description, is_active } = body

    if (!id) {
      return NextResponse.json({ error: 'Deck ID is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (is_active !== undefined) updateData.is_active = is_active

    const { data: deck, error: updateError } = await supabase
      .from('flashcard_decks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating deck:', updateError)
      return NextResponse.json({ error: 'Failed to update deck' }, { status: 500 })
    }

    return NextResponse.json({ deck })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (adminError || !adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Deck ID is required' }, { status: 400 })
    }

    // Delete the deck (cards will be cascaded)
    const { error: deleteError } = await supabase
      .from('flashcard_decks')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting deck:', deleteError)
      return NextResponse.json({ error: 'Failed to delete deck' }, { status: 500 })
    }

    // Also delete media files from storage
    const { data: files } = await supabase.storage
      .from('flashcard-media')
      .list(id)

    if (files && files.length > 0) {
      await supabase.storage
        .from('flashcard-media')
        .remove(files.map(f => `${id}/${f.name}`))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
