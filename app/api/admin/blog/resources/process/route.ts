import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { extractTextFromPDF, cleanExtractedText } from '@/app/lib/pdf'
import { chunkText } from '@/app/lib/rag'
import { generateEmbedding } from '@/app/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const { resourceId } = await request.json()

    if (!resourceId) {
      return NextResponse.json({ error: 'resourceId is required' }, { status: 400 })
    }

    // Get resource record
    const { data: resource, error: resourceError } = await supabase
      .from('blog_resources')
      .select('*')
      .eq('id', resourceId)
      .single()

    if (resourceError || !resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(resource.file_path)

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError)
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
    }

    // Extract text based on file type
    let extractedText = ''
    const buffer = Buffer.from(await fileData.arrayBuffer())

    if (resource.file_type === 'pdf') {
      const pdfResult = await extractTextFromPDF(buffer)
      extractedText = cleanExtractedText(pdfResult.text)
    } else {
      // Plain text or markdown
      extractedText = cleanExtractedText(buffer.toString('utf-8'))
    }

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json({
        error: 'Could not extract sufficient text from document'
      }, { status: 400 })
    }

    // Chunk the text
    const chunks = chunkText(extractedText, 1500, 200)

    // Delete any existing chunks for this resource (except the original)
    await supabase
      .from('blog_resources')
      .delete()
      .eq('file_path', resource.file_path)
      .neq('id', resourceId)

    // Process chunks and generate embeddings
    const batchSize = 5
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)

      // Generate embeddings for this batch
      const embeddings = await Promise.all(
        batch.map(chunk => generateEmbedding(chunk))
      )

      if (i === 0) {
        // Update the original resource with first chunk
        await supabase
          .from('blog_resources')
          .update({
            content_text: batch[0],
            chunk_index: 0,
            embedding: embeddings[0],
            processed_at: new Date().toISOString(),
          })
          .eq('id', resourceId)

        // Insert remaining chunks from first batch
        if (batch.length > 1) {
          const additionalRecords = batch.slice(1).map((chunk, idx) => ({
            category_id: resource.category_id,
            file_name: resource.file_name,
            file_path: resource.file_path,
            file_type: resource.file_type,
            content_text: chunk,
            chunk_index: idx + 1,
            embedding: embeddings[idx + 1],
            processed_at: new Date().toISOString(),
            uploaded_by: user.id
          }))

          await supabase.from('blog_resources').insert(additionalRecords)
        }
      } else {
        // Insert all chunks from subsequent batches
        const records = batch.map((chunk, idx) => ({
          category_id: resource.category_id,
          file_name: resource.file_name,
          file_path: resource.file_path,
          file_type: resource.file_type,
          content_text: chunk,
          chunk_index: i + idx,
          embedding: embeddings[idx],
          processed_at: new Date().toISOString(),
          uploaded_by: user.id
        }))

        await supabase.from('blog_resources').insert(records)
      }

      // Small delay to avoid rate limits
      if (i + batchSize < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    return NextResponse.json({
      success: true,
      chunksProcessed: chunks.length,
      textLength: extractedText.length
    })
  } catch (error) {
    console.error('Blog resource process error:', error)
    return NextResponse.json({
      error: (error as Error).message || 'Failed to process document'
    }, { status: 500 })
  }
}
