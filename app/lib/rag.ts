import { generateEmbedding } from './openai'
import { SupabaseClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>

// Chunk text into smaller pieces for embedding
export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = []
  let start = 0

  // Clean up the text
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  while (start < cleanedText.length) {
    let end = start + chunkSize

    // Try to break at a paragraph or sentence boundary
    if (end < cleanedText.length) {
      // Look for paragraph break
      const paragraphBreak = cleanedText.lastIndexOf('\n\n', end)
      if (paragraphBreak > start + chunkSize / 2) {
        end = paragraphBreak
      } else {
        // Look for sentence break
        const sentenceBreak = cleanedText.lastIndexOf('. ', end)
        if (sentenceBreak > start + chunkSize / 2) {
          end = sentenceBreak + 1
        }
      }
    }

    const chunk = cleanedText.slice(start, end).trim()
    if (chunk.length > 0) {
      chunks.push(chunk)
    }

    start = end - overlap
    if (start < 0) start = 0
  }

  return chunks
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Search for relevant chunks using semantic similarity
export async function searchRelevantChunks(
  supabase: AnySupabaseClient,
  categoryId: string,
  query: string,
  limit: number = 5
): Promise<{ content: string; similarity: number }[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query)

  // Search using pgvector similarity
  const { data, error } = await supabase.rpc('match_category_resources', {
    query_embedding: queryEmbedding,
    match_category_id: categoryId,
    match_count: limit,
    match_threshold: 0.5
  })

  if (error) {
    console.error('Error searching chunks:', error)
    // Fallback: get all content for the category
    const { data: fallbackData } = await supabase
      .from('category_resources')
      .select('content_text')
      .eq('category_id', categoryId)
      .not('content_text', 'is', null)
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

// Get all content for a category (for smaller datasets)
export async function getCategoryContent(
  supabase: AnySupabaseClient,
  categoryId: string,
  maxChunks: number = 10
): Promise<string> {
  const { data, error } = await supabase
    .from('category_resources')
    .select('content_text')
    .eq('category_id', categoryId)
    .not('content_text', 'is', null)
    .order('chunk_index', { ascending: true })
    .limit(maxChunks)

  if (error) {
    console.error('Error fetching category content:', error)
    return ''
  }

  return data?.map(d => d.content_text).join('\n\n---\n\n') || ''
}

// Build context for question generation
export async function buildGenerationContext(
  supabase: AnySupabaseClient,
  categoryId: string,
  categoryName: string,
  questionType: string,
  maxTokens: number = 8000
): Promise<string> {
  // Try to get content directly first (works well for smaller document sets)
  let content = await getCategoryContent(supabase, categoryId, 20)

  if (!content) {
    // If no content, try semantic search with a general query
    const searchQuery = `${categoryName} ${questionType} pharmacy exam questions`
    const chunks = await searchRelevantChunks(supabase, categoryId, searchQuery, 10)
    content = chunks.map(c => c.content).join('\n\n---\n\n')
  }

  // Truncate to approximate token limit (rough: 4 chars per token)
  const maxChars = maxTokens * 4
  if (content.length > maxChars) {
    content = content.slice(0, maxChars) + '...'
  }

  return content
}

// Store document chunks with embeddings
export async function storeDocumentChunks(
  supabase: AnySupabaseClient,
  categoryId: string,
  fileName: string,
  filePath: string,
  text: string,
  uploadedBy: string
): Promise<void> {
  const chunks = chunkText(text, 1500, 200)

  // Process chunks in batches to avoid rate limits
  const batchSize = 5
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)

    // Generate embeddings for this batch
    const embeddings = await Promise.all(
      batch.map(chunk => generateEmbedding(chunk))
    )

    // Insert chunks with embeddings
    const records = batch.map((chunk, idx) => ({
      category_id: categoryId,
      file_name: fileName,
      file_path: filePath,
      file_type: 'pdf',
      content_text: chunk,
      chunk_index: i + idx,
      embedding: embeddings[idx],
      processed_at: new Date().toISOString(),
      uploaded_by: uploadedBy
    }))

    const { error } = await supabase
      .from('category_resources')
      .insert(records)

    if (error) {
      console.error('Error storing chunks:', error)
      throw error
    }

    // Small delay to avoid rate limits
    if (i + batchSize < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
}
