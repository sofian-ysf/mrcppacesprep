import { generateEmbedding } from './openai'
import { chunkText } from './rag'
import { SupabaseClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>

// Search for relevant blog resource chunks using semantic similarity
export async function searchBlogResources(
  supabase: AnySupabaseClient,
  categoryId: string,
  query: string,
  limit: number = 10
): Promise<{ content: string; similarity: number }[]> {
  const queryEmbedding = await generateEmbedding(query)

  const { data, error } = await supabase.rpc('match_blog_resources', {
    query_embedding: queryEmbedding,
    match_category_id: categoryId,
    match_count: limit,
    match_threshold: 0.5
  })

  if (error) {
    console.error('Error searching blog resources:', error)
    // Fallback: get all content for the category
    const { data: fallbackData } = await supabase
      .from('blog_resources')
      .select('content_text')
      .eq('category_id', categoryId)
      .not('content_text', 'is', null)
      .order('chunk_index', { ascending: true })
      .limit(limit)

    return fallbackData?.map(d => ({
      content: d.content_text,
      similarity: 1
    })) || []
  }

  return data?.map((d: { content_text: string; similarity: number }) => ({
    content: d.content_text,
    similarity: d.similarity
  })) || []
}

// Get all content for a blog category (for smaller datasets)
export async function getBlogCategoryContent(
  supabase: AnySupabaseClient,
  categoryId: string,
  maxChunks: number = 20
): Promise<string> {
  const { data, error } = await supabase
    .from('blog_resources')
    .select('content_text')
    .eq('category_id', categoryId)
    .not('content_text', 'is', null)
    .order('chunk_index', { ascending: true })
    .limit(maxChunks)

  if (error) {
    console.error('Error fetching blog category content:', error)
    return ''
  }

  return data?.map(d => d.content_text).join('\n\n---\n\n') || ''
}

// Build context for blog generation
export async function buildBlogContext(
  supabase: AnySupabaseClient,
  categoryId: string,
  topic: string,
  maxTokens: number = 12000
): Promise<string> {
  // Try to get content directly first (works well for smaller document sets)
  let content = await getBlogCategoryContent(supabase, categoryId, 30)

  if (!content) {
    // If no content, try semantic search with the topic
    const searchQuery = `${topic} pharmacy MRCP PACES exam preparation UK`
    const chunks = await searchBlogResources(supabase, categoryId, searchQuery, 15)
    content = chunks.map(c => c.content).join('\n\n---\n\n')
  }

  // Truncate to approximate token limit (rough: 4 chars per token)
  const maxChars = maxTokens * 4
  if (content.length > maxChars) {
    content = content.slice(0, maxChars) + '...'
  }

  return content
}

// Store blog document chunks with embeddings
export async function storeBlogDocumentChunks(
  supabase: AnySupabaseClient,
  categoryId: string,
  fileName: string,
  filePath: string,
  text: string,
  uploadedBy: string
): Promise<number> {
  const chunks = chunkText(text, 1500, 200)

  // Process chunks in batches to avoid rate limits
  const batchSize = 5
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)

    // Generate embeddings for this batch
    const embeddings = await Promise.all(
      batch.map(chunk => generateEmbedding(chunk))
    )

    // Get file extension for file_type
    const fileType = fileName.split('.').pop()?.toLowerCase() || 'txt'

    // Insert chunks with embeddings
    const records = batch.map((chunk, idx) => ({
      category_id: categoryId,
      file_name: fileName,
      file_path: filePath,
      file_type: fileType,
      content_text: chunk,
      chunk_index: i + idx,
      embedding: embeddings[idx],
      processed_at: new Date().toISOString(),
      uploaded_by: uploadedBy
    }))

    const { error } = await supabase
      .from('blog_resources')
      .insert(records)

    if (error) {
      console.error('Error storing blog chunks:', error)
      throw error
    }

    // Small delay to avoid rate limits
    if (i + batchSize < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  return chunks.length
}
