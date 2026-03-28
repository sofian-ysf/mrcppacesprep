import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set - question generation will not work')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Generate embeddings for text
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

// Generate embeddings for multiple texts
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  })
  return response.data.map(d => d.embedding)
}

// Question generation types
export interface GeneratedSBAQuestion {
  question_text: string
  options: { letter: string; text: string }[]
  correct_answer: string
  explanation: string
  references?: string[]
}

export interface GeneratedCalculationQuestion {
  question_text: string
  correct_answer: string
  explanation: string
  formula?: string
  step_by_step?: string
  references?: string[]
}

export interface GeneratedEMQQuestion {
  title: string
  options: { letter: string; text: string }[]
  scenarios: { stem: string; correct_answer: string }[]
  explanation: string
  references?: string[]
}

// Generate a batch of SBA questions (max 10 at a time for reliability)
export async function generateSBABatch(
  context: string,
  categoryName: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  quantity: number,
  batchNumber: number
): Promise<GeneratedSBAQuestion[]> {
  const difficultyGuide = {
    Easy: 'straightforward questions testing basic recall and understanding',
    Medium: 'questions requiring application of knowledge and some clinical reasoning',
    Hard: 'complex scenarios requiring deep understanding, multiple concepts, and advanced clinical reasoning'
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert MRCP PACES (Practical Assessment of Clinical Examination Skills) exam question writer for UK MRCP membership exams.

Your task is to create high-quality Single Best Answer (SBA) questions that:
- Are clinically relevant and reflect real pharmacy practice in the UK
- Have exactly 5 options (A-E) with one clearly correct answer
- Include plausible distractors that test genuine understanding
- Have detailed explanations that teach the concept
- Reference relevant guidelines (BNF, NICE, etc.) where appropriate

Format each question as valid JSON.`
      },
      {
        role: 'user',
        content: `Using the following reference material about "${categoryName}", generate ${quantity} unique ${difficulty}-level SBA questions (batch ${batchNumber}).

Difficulty level: ${difficultyGuide[difficulty]}

Reference Material:
${context}

Return a JSON array of questions in this exact format:
[
  {
    "question_text": "The full question stem",
    "options": [
      {"letter": "A", "text": "First option"},
      {"letter": "B", "text": "Second option"},
      {"letter": "C", "text": "Third option"},
      {"letter": "D", "text": "Fourth option"},
      {"letter": "E", "text": "Fifth option"}
    ],
    "correct_answer": "A",
    "explanation": "Detailed explanation of why the correct answer is correct and why other options are incorrect",
    "references": ["BNF", "NICE guideline reference if applicable"]
  }
]

Generate exactly ${quantity} questions. Return ONLY the JSON array, no other text.`
      }
    ],
    temperature: 0.8,
    max_tokens: 4096,
  })

  const content = response.choices[0]?.message?.content || '[]'

  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No JSON array found in response')
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to parse GPT response:', content)
    throw new Error('Failed to parse question generation response')
  }
}

// Generate SBA questions with batching for large quantities
export async function generateSBAQuestions(
  context: string,
  categoryName: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  quantity: number
): Promise<GeneratedSBAQuestion[]> {
  const BATCH_SIZE = 10
  const allQuestions: GeneratedSBAQuestion[] = []
  const batches = Math.ceil(quantity / BATCH_SIZE)

  for (let i = 0; i < batches; i++) {
    const batchQuantity = Math.min(BATCH_SIZE, quantity - allQuestions.length)
    const batchQuestions = await generateSBABatch(
      context,
      categoryName,
      difficulty,
      batchQuantity,
      i + 1
    )
    allQuestions.push(...batchQuestions)

    // Small delay between batches to avoid rate limiting
    if (i < batches - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return allQuestions
}

// Generate a batch of Calculation questions
export async function generateCalculationBatch(
  context: string,
  categoryName: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  quantity: number,
  batchNumber: number
): Promise<GeneratedCalculationQuestion[]> {
  const difficultyGuide = {
    Easy: 'single-step calculations with straightforward numbers',
    Medium: 'multi-step calculations requiring 2-3 operations',
    Hard: 'complex calculations with multiple conversions, tricky numbers, or clinical context'
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert MRCP PACES exam question writer specializing in pharmaceutical calculations.

Your task is to create realistic calculation questions that:
- Use clinically relevant scenarios (real drug names, realistic doses)
- Require the type of calculations physicians do in practice
- Have clear, unambiguous correct answers
- Include step-by-step solutions in the explanation
- Use appropriate units and conversions

Format each question as valid JSON.`
      },
      {
        role: 'user',
        content: `Using the following reference material about "${categoryName}", generate ${quantity} unique ${difficulty}-level calculation questions (batch ${batchNumber}).

Difficulty level: ${difficultyGuide[difficulty]}

Reference Material:
${context}

Return a JSON array of questions in this exact format:
[
  {
    "question_text": "The full calculation problem with all necessary information",
    "correct_answer": "The numerical answer with units (e.g., '250 mg' or '2.5 mL')",
    "explanation": "Detailed step-by-step solution showing all working",
    "formula": "The main formula used (if applicable)",
    "step_by_step": "1. First step\\n2. Second step\\n3. etc.",
    "references": ["Source references if applicable"]
  }
]

Generate exactly ${quantity} questions. Return ONLY the JSON array, no other text.`
      }
    ],
    temperature: 0.8,
    max_tokens: 4096,
  })

  const content = response.choices[0]?.message?.content || '[]'

  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No JSON array found in response')
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to parse GPT response:', content)
    throw new Error('Failed to parse calculation question response')
  }
}

// Generate Calculation questions with batching
export async function generateCalculationQuestions(
  context: string,
  categoryName: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  quantity: number
): Promise<GeneratedCalculationQuestion[]> {
  const BATCH_SIZE = 10
  const allQuestions: GeneratedCalculationQuestion[] = []
  const batches = Math.ceil(quantity / BATCH_SIZE)

  for (let i = 0; i < batches; i++) {
    const batchQuantity = Math.min(BATCH_SIZE, quantity - allQuestions.length)
    const batchQuestions = await generateCalculationBatch(
      context,
      categoryName,
      difficulty,
      batchQuantity,
      i + 1
    )
    allQuestions.push(...batchQuestions)

    if (i < batches - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return allQuestions
}

// Generate a batch of EMQ questions
export async function generateEMQBatch(
  context: string,
  categoryName: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  quantity: number,
  batchNumber: number
): Promise<GeneratedEMQQuestion[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert MRCP PACES exam question writer specializing in Extended Matching Questions (EMQs).

EMQ format:
- A theme/title describing the topic
- A list of 8-10 options (drugs, conditions, or answers)
- 3-5 clinical scenarios where the candidate must match each scenario to the best option
- Each option can be used once, more than once, or not at all

Create realistic, clinically relevant EMQs.`
      },
      {
        role: 'user',
        content: `Using the following reference material about "${categoryName}", generate ${quantity} unique EMQ question sets at ${difficulty} difficulty (batch ${batchNumber}).

Reference Material:
${context}

Return a JSON array in this exact format:
[
  {
    "title": "Theme of the EMQ (e.g., 'Antihypertensive drugs')",
    "options": [
      {"letter": "A", "text": "First option"},
      {"letter": "B", "text": "Second option"},
      // ... 8-10 options total
    ],
    "scenarios": [
      {"stem": "Clinical scenario 1 description", "correct_answer": "A"},
      {"stem": "Clinical scenario 2 description", "correct_answer": "C"},
      {"stem": "Clinical scenario 3 description", "correct_answer": "B"}
      // 3-5 scenarios per EMQ
    ],
    "explanation": "Explanation of correct answers for each scenario",
    "references": ["Relevant references"]
  }
]

Generate exactly ${quantity} EMQ sets. Return ONLY the JSON array, no other text.`
      }
    ],
    temperature: 0.8,
    max_tokens: 4096,
  })

  const content = response.choices[0]?.message?.content || '[]'

  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No JSON array found in response')
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to parse GPT response:', content)
    throw new Error('Failed to parse EMQ question response')
  }
}

// Generate EMQ questions with batching
export async function generateEMQQuestions(
  context: string,
  categoryName: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  quantity: number
): Promise<GeneratedEMQQuestion[]> {
  const BATCH_SIZE = 5 // EMQs are larger, so smaller batches
  const allQuestions: GeneratedEMQQuestion[] = []
  const batches = Math.ceil(quantity / BATCH_SIZE)

  for (let i = 0; i < batches; i++) {
    const batchQuantity = Math.min(BATCH_SIZE, quantity - allQuestions.length)
    const batchQuestions = await generateEMQBatch(
      context,
      categoryName,
      difficulty,
      batchQuantity,
      i + 1
    )
    allQuestions.push(...batchQuestions)

    if (i < batches - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return allQuestions
}

// Structured explanation type
export interface GeneratedStructuredExplanation {
  summary: string
  key_points: string[]
  clinical_pearl: string
  why_wrong: Record<string, string>
  exam_tip: string
  related_topics: string[]
}

// Generate structured explanation for a question
export async function generateStructuredExplanation(
  questionText: string,
  options: { letter: string; text: string }[] | null,
  correctAnswer: string,
  currentExplanation: string,
  categoryName: string
): Promise<GeneratedStructuredExplanation> {
  const optionsText = options
    ? options.map(o => `${o.letter}: ${o.text}`).join('\n')
    : 'N/A (calculation question)'

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert pharmacy educator creating detailed, structured explanations for MRCP PACES exam questions.

Your explanations should be:
- Educational and memorable
- Include practical clinical insights that help with real pharmacy practice
- Focused on exam success with specific tips
- Clear about why each incorrect option is wrong

IMPORTANT: Always return valid JSON without any markdown code blocks.`
      },
      {
        role: 'user',
        content: `Given this pharmacy MRCP PACES exam question in the "${categoryName}" category:

Question: ${questionText}

Options:
${optionsText}

Correct Answer: ${correctAnswer}

Current Explanation: ${currentExplanation}

Generate a structured educational explanation with:
1. summary: 1-2 sentence direct answer explanation that clearly states why the correct answer is correct
2. key_points: 3-4 bullet points of critical learning concepts related to this question
3. clinical_pearl: One memorable clinical insight for real pharmacy practice (something they'll remember)
4. why_wrong: For each incorrect option (${options ? options.filter(o => o.letter !== correctAnswer).map(o => o.letter).join(', ') : 'N/A'}), explain why it's wrong (2-3 sentences each). Use the option letters as keys.
5. exam_tip: A specific tip for remembering or approaching this type of question in the exam
6. related_topics: 2-3 related pharmacy topic slugs to study (use lowercase-with-hyphens format like "drug-interactions", "renal-impairment", etc.)

Return ONLY a valid JSON object in this exact format, no markdown:
{
  "summary": "Brief summary here...",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "clinical_pearl": "Clinical insight here...",
  "why_wrong": {"A": "Why A is wrong", "B": "Why B is wrong"...},
  "exam_tip": "Exam tip here...",
  "related_topics": ["topic-slug-1", "topic-slug-2"]
}`
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })

  const content = response.choices[0]?.message?.content || '{}'

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON object found in response')
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to parse structured explanation response:', content)
    throw new Error('Failed to parse structured explanation response')
  }
}

// Generate structured explanations in batch
export async function generateStructuredExplanationsBatch(
  questions: Array<{
    id: string
    question_text: string
    options: { letter: string; text: string }[] | null
    correct_answer: string
    explanation: string
    category_name: string
  }>
): Promise<Map<string, GeneratedStructuredExplanation>> {
  const results = new Map<string, GeneratedStructuredExplanation>()

  for (const q of questions) {
    try {
      const structured = await generateStructuredExplanation(
        q.question_text,
        q.options,
        q.correct_answer,
        q.explanation,
        q.category_name
      )
      results.set(q.id, structured)

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`Failed to generate structured explanation for question ${q.id}:`, error)
    }
  }

  return results
}

// Blog post generation types
export interface GeneratedBlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  meta_title: string
  meta_description: string
  meta_keywords: string[]
  tags: string[]
  read_time_minutes: number
  faq_items: { question: string; answer: string }[]
  internal_linking_suggestions: string[]
  schema_json: object
}

// Generate SEO-optimized blog post
export async function generateBlogPost(
  context: string,
  categoryName: string,
  topic: string,
  targetKeywords: string[],
  wordCountTarget: number = 1500,
  includeFaq: boolean = true
): Promise<GeneratedBlogPost> {
  const keywordsStr = targetKeywords.length > 0
    ? targetKeywords.join(', ')
    : `${topic}, MRCP PACES exam, pharmacy MRCP PACES, UK pharmacy`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are Alex Jensing, MPharm, a MRCP PACES-registered physician with 8+ years of experience including hospital, community, and education roles. You write authoritative, deeply practical content for UK pharmacy MRCP PACES students preparing for the MRCP PACES assessment.

CRITICAL CONTENT QUALITY REQUIREMENTS:

1. DEMONSTRATE REAL EXPERTISE:
   - Include SPECIFIC drug names, dosages, and clinical scenarios (e.g., "When dispensing methotrexate 2.5mg tablets, always verify...")
   - Reference EXACT BNF sections, NICE guidelines by code (e.g., "NICE NG28"), MRCP PACES standards
   - Share realistic pharmacy scenarios you'd encounter in practice
   - Include common student mistakes and how to avoid them

2. PROVIDE UNIQUE, ORIGINAL VALUE:
   - Add insights that generic AI content wouldn't know (exam patterns, common pitfalls, real-world tips)
   - Include specific memory techniques, mnemonics, or study strategies
   - Reference current 2025-2026 MRCP PACES assessment format changes where relevant
   - Add "Pro Tips" boxes with insider advice

3. WRITE LIKE A HUMAN EXPERT, NOT AI:
   - Vary sentence structure and length naturally
   - Use first-person occasionally ("In my experience..." "I always tell my students...")
   - Include rhetorical questions to engage readers
   - Avoid generic phrases like "In conclusion", "It's important to note", "Furthermore"
   - Write with confidence and authority, not hedging language

4. STRUCTURE FOR FEATURED SNIPPETS:
   - Answer the main question directly in the first 40-60 words
   - Use numbered steps for processes
   - Include comparison tables where relevant
   - Make H2s answer specific questions people search

5. FAQ REQUIREMENTS:
   - Each answer must be 80-150 words with specific details
   - Include at least one specific example, drug name, or statistic per answer
   - Answer questions students ACTUALLY ask, not generic ones

Format in Markdown with ## for H2, ### for H3. Include bold (**text**) for key terms.`
      },
      {
        role: 'user',
        content: `Create an expert-level blog post for the "${categoryName}" category that will RANK and CONVERT.

Topic: ${topic}
Target Keywords: ${keywordsStr}
Target Word Count: ${wordCountTarget}+ words (go longer if needed for depth)
Include FAQ Section: ${includeFaq ? 'Yes - 5 FAQs with 80-150 word answers each' : 'No'}

Reference Material:
${context}

CONTENT STRUCTURE REQUIREMENTS:
1. Opening paragraph (40-60 words) - Answer the main search query directly
2. 4-6 H2 sections with 2-3 H3 subsections each
3. Include at least ONE of: comparison table, numbered list, "Pro Tip" callout
4. Every section must have a specific example with drug names/dosages/scenarios
5. End with actionable next steps (not generic "good luck")

Return a JSON object in this EXACT format:
{
  "title": "Question-format or How-to title that matches search intent (50-60 chars)",
  "slug": "keyword-rich-url-slug",
  "excerpt": "Hook with primary keyword + what reader will learn (150-160 chars)",
  "content": "Full markdown with ## H2, ### H3, **bold terms**, numbered lists, and specific examples throughout",
  "meta_title": "Primary Keyword | Secondary Keyword | MRCPPACESPREP (50-60 chars)",
  "meta_description": "Action verb + benefit + keyword. End with CTA like 'Start practicing today.' (150-155 chars)",
  "meta_keywords": ["exact match keyword", "long-tail variation 1", "long-tail variation 2", "related term", "question keyword"],
  "tags": ["specific topic tag", "exam section tag", "difficulty tag"],
  "read_time_minutes": ${Math.ceil(wordCountTarget / 200)},
  "faq_items": [
    {"question": "Specific question students Google (use 'how', 'what', 'why')?", "answer": "80-150 word answer with specific drug/dosage example and actionable advice..."},
    {"question": "Another real student question?", "answer": "Detailed answer with BNF reference or clinical scenario..."}
  ],
  "internal_linking_suggestions": [
    {"topic": "Related MRCP PACES topic", "targetPage": "/question-bank"},
    {"topic": "Calculation practice area", "targetPage": "/calculations"},
    {"topic": "Mock exam section", "targetPage": "/mock-exams"}
  ],
  "schema_json": {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Same as title",
    "description": "Same as meta_description",
    "author": {
      "@type": "Person",
      "name": "Alex Jensing, MPharm",
      "jobTitle": "MRCP PACES Registered Pharmacist"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MRCPPACESPREP",
      "url": "https://www.mrcppacesprep.com"
    },
    "mainEntityOfPage": {
      "@type": "WebPage"
    },
    "keywords": "comma, separated, keywords"
  }
}

Return ONLY valid JSON, no markdown blocks or extra text.`
      }
    ],
    temperature: 0.7,
    max_tokens: 4096,
  })

  const content = response.choices[0]?.message?.content || '{}'

  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON object found in response')
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to parse blog generation response:', content)
    throw new Error('Failed to parse blog generation response')
  }
}

// Enhance blog content section by section using GPT-4o-mini (cost-effective)
export async function enhanceBlogSection(
  sectionContent: string,
  sectionTitle: string,
  topic: string,
  targetKeywords: string[]
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert content enhancer for pharmacy education articles. Your task is to expand and enrich content sections while maintaining accuracy and SEO optimization.

Guidelines:
- Add more detailed explanations, examples, and practical tips
- Include relevant statistics, facts, or case examples where appropriate
- Maintain a professional but approachable tone
- Use UK English spelling and conventions
- Keep the markdown formatting (headings, lists, bold text)
- Naturally incorporate keywords without stuffing
- Add bullet points or numbered lists where they improve readability
- Include actionable advice pharmacy students can use`
      },
      {
        role: 'user',
        content: `Enhance and expand this section from a blog post about "${topic}".

Section Title: ${sectionTitle}
Target Keywords: ${targetKeywords.join(', ')}

Original Content:
${sectionContent}

Please expand this section to be 2-3x more detailed with:
- More specific examples and explanations
- Practical tips or actionable advice
- Relevant facts or statistics if applicable
- Better structured information (lists, subpoints if needed)

Return ONLY the enhanced markdown content for this section (including the heading).`
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })

  return response.choices[0]?.message?.content || sectionContent
}

// Enhance entire blog content by processing each major section
export async function enhanceBlogContent(
  content: string,
  topic: string,
  targetKeywords: string[]
): Promise<string> {
  // Split content by H2 headings (## )
  const sections = content.split(/(?=^## )/m).filter(s => s.trim())

  const enhancedSections: string[] = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]

    // Extract section title from the heading
    const titleMatch = section.match(/^## (.+)$/m)
    const sectionTitle = titleMatch ? titleMatch[1] : `Section ${i + 1}`

    // Skip very short sections or conclusions (they don't need much enhancement)
    if (section.length < 200 || sectionTitle.toLowerCase().includes('conclusion')) {
      enhancedSections.push(section)
      continue
    }

    try {
      const enhanced = await enhanceBlogSection(section, sectionTitle, topic, targetKeywords)
      enhancedSections.push(enhanced)

      // Small delay between API calls to avoid rate limiting
      if (i < sections.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } catch (error) {
      console.error(`Failed to enhance section "${sectionTitle}":`, error)
      enhancedSections.push(section) // Use original if enhancement fails
    }
  }

  return enhancedSections.join('\n\n')
}

// Generate SEO-optimized blog post with optional content enhancement
export async function generateEnhancedBlogPost(
  context: string,
  categoryName: string,
  topic: string,
  targetKeywords: string[],
  wordCountTarget: number = 1500,
  includeFaq: boolean = true,
  enhanceContent: boolean = true
): Promise<GeneratedBlogPost> {
  // First pass: Generate the initial blog post structure
  const initialPost = await generateBlogPost(
    context,
    categoryName,
    topic,
    targetKeywords,
    wordCountTarget,
    includeFaq
  )

  // Second pass: Enhance content sections if enabled
  if (enhanceContent && initialPost.content) {
    try {
      initialPost.content = await enhanceBlogContent(
        initialPost.content,
        topic,
        targetKeywords
      )

      // Update read time based on enhanced content
      const wordCount = initialPost.content.split(/\s+/).length
      initialPost.read_time_minutes = Math.ceil(wordCount / 200)
    } catch (error) {
      console.error('Content enhancement failed, using original:', error)
      // Continue with original content if enhancement fails
    }
  }

  return initialPost
}

// Suggest blog topics using GPT-4o-mini
export async function suggestBlogTopics(
  categoryName: string,
  context: string,
  existingTopics: string[] = []
): Promise<{ topics: { title: string; description: string; keywords: string[] }[] }> {
  const existingStr = existingTopics.length > 0
    ? `\n\nExisting topics to avoid (don't suggest similar ones):\n${existingTopics.join('\n')}`
    : ''

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an SEO content strategist specializing in pharmacy education and MRCP PACES exam preparation for UK pharmacy students.

Your task is to suggest compelling, SEO-friendly blog topics that:
- Target long-tail keywords pharmacy students search for
- Address real pain points and questions students have
- Have good search volume potential
- Are unique and not commonly covered by competitors
- Are relevant to the MRCP PACES exam`
      },
      {
        role: 'user',
        content: `Based on the following reference material for the "${categoryName}" category, suggest 5 unique blog post topics.
${existingStr}

Reference Material:
${context.slice(0, 3000)}

Return a JSON object in this exact format:
{
  "topics": [
    {
      "title": "Suggested blog post title",
      "description": "Brief description of what the post would cover",
      "keywords": ["primary keyword", "secondary keyword", "related term"]
    }
  ]
}

Return ONLY the JSON object.`
      }
    ],
    temperature: 0.8,
    max_tokens: 1500,
  })

  const content = response.choices[0]?.message?.content || '{}'

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON object found in response')
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to parse topic suggestions:', content)
    throw new Error('Failed to parse topic suggestions')
  }
}

// Difficulty evaluation types
export interface DifficultyEvaluation {
  currentDifficulty: 'Easy' | 'Medium' | 'Hard'
  suggestedDifficulty: 'Easy' | 'Medium' | 'Hard'
  shouldChange: boolean
  reasoning: string
  complexityFactors: {
    calculationSteps: number
    requiresConversion: boolean
    clinicalReasoning: boolean
    multipleConceptsNeeded: boolean
    commonlyTested: boolean
  }
  confidenceScore: number
}

// Evaluate and suggest correct difficulty for a question
export async function evaluateQuestionDifficulty(
  questionText: string,
  questionType: 'sba' | 'emq' | 'calculation',
  currentDifficulty: 'Easy' | 'Medium' | 'Hard',
  options?: { letter: string; text: string }[] | null,
  correctAnswer?: string,
  explanation?: string
): Promise<DifficultyEvaluation> {
  const optionsText = options
    ? options.map(o => `${o.letter}: ${o.text}`).join('\n')
    : 'N/A'

  const typeSpecificCriteria = {
    calculation: `
CALCULATION DIFFICULTY CRITERIA (UK MRCP PACES Pre-reg Exam):
- EASY: Single-step calculations with no conversions. Examples:
  * "Take 200mg daily for 14 days" = 14 tablets (just counting)
  * Simple multiplication or division with whole numbers
  * No unit conversions needed

- MEDIUM: 2-3 step calculations OR one unit conversion. Examples:
  * Dose per kg calculations requiring weight-based multiplication then volume
  * Converting between units (mg to g, mL to L)
  * Infusion rate calculations with basic setup

- HARD: Multi-step (4+) calculations with conversions AND clinical reasoning. Examples:
  * Creatinine clearance affecting dosing
  * Dilution series with multiple steps
  * Complex infusion calculations with loading doses
  * Calculations requiring clinical judgment about rounding`,

    sba: `
SBA DIFFICULTY CRITERIA (UK MRCP PACES Pre-reg Exam):
- EASY: Direct recall of well-known facts. Examples:
  * "What is the mechanism of action of metformin?"
  * Basic drug classifications
  * Common side effects of frequently used drugs

- MEDIUM: Application of knowledge to clinical scenarios. Examples:
  * Selecting appropriate treatment for a patient with comorbidities
  * Drug interactions requiring understanding of mechanisms
  * Counselling points for specific medications

- HARD: Complex clinical scenarios requiring synthesis. Examples:
  * Multiple competing factors in patient care
  * Rare but important drug interactions
  * Scenarios requiring knowledge of multiple guidelines`,

    emq: `
EMQ DIFFICULTY CRITERIA (UK MRCP PACES Pre-reg Exam):
- EASY: Clear-cut scenarios with obvious answer mapping
- MEDIUM: Scenarios requiring differentiation between similar options
- HARD: Complex scenarios where multiple options could seem correct`
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert MRCP PACES exam assessor evaluating question difficulty.
Your task is to objectively assess whether a question's difficulty rating is accurate.
Be STRICT - many questions are incorrectly rated as harder than they actually are.

${typeSpecificCriteria[questionType]}

IMPORTANT: A question that can be solved in one or two trivial mental steps is EASY, not Medium.`
      },
      {
        role: 'user',
        content: `Evaluate this ${questionType.toUpperCase()} question's difficulty:

QUESTION:
${questionText}

${options ? `OPTIONS:\n${optionsText}\n` : ''}
${correctAnswer ? `CORRECT ANSWER: ${correctAnswer}\n` : ''}
${explanation ? `EXPLANATION: ${explanation}\n` : ''}

CURRENT DIFFICULTY: ${currentDifficulty}

Analyze the question and return a JSON object:
{
  "currentDifficulty": "${currentDifficulty}",
  "suggestedDifficulty": "Easy|Medium|Hard",
  "shouldChange": true/false,
  "reasoning": "Brief explanation of why this difficulty is appropriate or needs changing",
  "complexityFactors": {
    "calculationSteps": 1-5 (for calculations) or 0 (for non-calculations),
    "requiresConversion": true/false,
    "clinicalReasoning": true/false,
    "multipleConceptsNeeded": true/false,
    "commonlyTested": true/false
  },
  "confidenceScore": 0.0-1.0
}

Return ONLY the JSON object.`
      }
    ],
    temperature: 0.3, // Lower temperature for more consistent evaluation
    max_tokens: 1000,
  })

  const content = response.choices[0]?.message?.content || '{}'

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON object found in response')
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Failed to parse difficulty evaluation:', content)
    throw new Error('Failed to parse difficulty evaluation')
  }
}
