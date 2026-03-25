import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { parseApkgFile, extractMediaFiles, generateDeckSlug } from '@/app/lib/flashcards/apkg-parser'
import { DeckUploadResult } from '@/app/types/flashcards'

export async function POST(request: NextRequest) {
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

    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const customName = formData.get('name') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.endsWith('.apkg')) {
      return NextResponse.json({ error: 'File must be a .apkg file' }, { status: 400 })
    }

    // Read the file buffer
    const fileBuffer = await file.arrayBuffer()

    // Parse the .apkg file
    const parsedDeck = await parseApkgFile(fileBuffer)

    // Use custom name if provided, otherwise use parsed name
    const deckName = customName || parsedDeck.name

    // Generate a unique slug
    let baseSlug = generateDeckSlug(deckName)
    let slug = baseSlug
    let slugCounter = 1

    // Check for existing slugs and make unique if necessary
    while (true) {
      const { data: existingDeck } = await supabase
        .from('flashcard_decks')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existingDeck) break

      slugCounter++
      slug = `${baseSlug}-${slugCounter}`
    }

    // Create the deck
    const { data: deck, error: deckError } = await supabase
      .from('flashcard_decks')
      .insert({
        name: deckName,
        slug,
        description: `Imported from ${file.name}`,
        card_count: 0, // Will be updated by trigger
        is_active: true,
      })
      .select()
      .single()

    if (deckError) {
      console.error('Error creating deck:', deckError)
      return NextResponse.json({ error: 'Failed to create deck' }, { status: 500 })
    }

    // Extract and upload media files
    const mediaFiles = await extractMediaFiles(fileBuffer)
    const mediaUrlMap: Record<string, string> = {}

    for (const [filename, fileData] of mediaFiles) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('flashcard-media')
          .upload(`${deck.id}/${filename}`, fileData.data, {
            contentType: getContentType(filename),
            upsert: true,
          })

        if (!uploadError && uploadData) {
          const { data: publicUrl } = supabase.storage
            .from('flashcard-media')
            .getPublicUrl(`${deck.id}/${filename}`)

          mediaUrlMap[filename] = publicUrl.publicUrl
        }
      } catch (err) {
        console.error(`Error uploading media file ${filename}:`, err)
      }
    }

    // Insert cards in batches
    const batchSize = 100
    const errors: string[] = []
    let cardsImported = 0

    for (let i = 0; i < parsedDeck.cards.length; i += batchSize) {
      const batch = parsedDeck.cards.slice(i, i + batchSize)

      const cardsToInsert = batch.map((card, index) => {
        // Replace media references with URLs
        let front = card.front
        let back = card.back

        for (const [filename, url] of Object.entries(mediaUrlMap)) {
          const escapedFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp(`src=["']${escapedFilename}["']`, 'gi')
          front = front.replace(regex, `src="${url}"`)
          back = back.replace(regex, `src="${url}"`)
        }

        return {
          deck_id: deck.id,
          front,
          back,
          media_files: card.mediaFiles.map(name => ({
            name,
            type: getContentType(name),
            url: mediaUrlMap[name] || null,
          })),
          anki_note_id: card.noteId,
          sort_order: i + index,
        }
      })

      const { error: insertError } = await supabase
        .from('flashcards')
        .insert(cardsToInsert)

      if (insertError) {
        console.error('Error inserting cards batch:', insertError)
        errors.push(`Failed to insert cards ${i + 1} to ${i + batch.length}`)
      } else {
        cardsImported += batch.length
      }
    }

    const result: DeckUploadResult = {
      success: true,
      deck: {
        ...deck,
        card_count: cardsImported,
      },
      cardsImported,
      errors: errors.length > 0 ? errors : undefined,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process file' },
      { status: 500 }
    )
  }
}

function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop()
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
  }
  return types[ext || ''] || 'application/octet-stream'
}
