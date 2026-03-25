import JSZip from 'jszip'
import initSqlJs, { Database, SqlJsStatic } from 'sql.js'
import { ParsedAnkiCard, ParsedAnkiDeck } from '@/app/types/flashcards'

// Field separator used in Anki notes (ASCII 31)
const FIELD_SEPARATOR = '\x1f'

// Cache the SQL.js instance
let SQL: SqlJsStatic | null = null

async function getSqlJs(): Promise<SqlJsStatic> {
  if (SQL) return SQL

  // Fetch the WASM binary from CDN
  const wasmBinary = await fetch('https://sql.js.org/dist/sql-wasm.wasm')
    .then(res => res.arrayBuffer())

  SQL = await initSqlJs({
    wasmBinary,
  })

  return SQL
}

interface AnkiNote {
  id: number
  flds: string
  mid: number
}

interface AnkiCard {
  id: number
  nid: number      // Note ID
  ord: number      // Template ordinal or cloze number
}

interface AnkiFieldDef {
  name: string
  ord: number
}

interface AnkiTemplate {
  name: string
  ord: number
  qfmt: string    // Question format (front)
  afmt: string    // Answer format (back)
}

interface AnkiModel {
  id: string
  name: string
  type: number    // 0 = standard, 1 = cloze
  flds: AnkiFieldDef[]
  tmpls: AnkiTemplate[]
  css?: string
}

interface AnkiCollection {
  models: Record<string, AnkiModel>
  decks: Record<string, { name: string }>
}

/**
 * Parse an Anki .apkg file and extract cards
 */
export async function parseApkgFile(fileBuffer: ArrayBuffer): Promise<ParsedAnkiDeck> {
  // Load the zip file
  const zip = await JSZip.loadAsync(fileBuffer)

  // Find the database file (collection.anki21 or collection.anki2)
  let dbFile = zip.file('collection.anki21')
  if (!dbFile) {
    dbFile = zip.file('collection.anki2')
  }
  if (!dbFile) {
    throw new Error('Invalid .apkg file: No collection database found')
  }

  // Load the SQLite database
  const SqlJs = await getSqlJs()

  const dbBuffer = await dbFile.async('arraybuffer')
  const db = new SqlJs.Database(new Uint8Array(dbBuffer))

  try {
    // Parse the collection data (models and decks)
    const collection = parseCollection(db)

    // Parse notes
    const notes = parseNotes(db)

    // Parse cards - this is crucial for getting the correct template/cloze number
    const cards = parseCards(db)

    // Parse media mapping
    const mediaMapping = await parseMediaMapping(zip)

    // Extract deck name
    const deckName = extractDeckName(collection, notes)

    // Convert notes and cards to parsed cards
    const parsedCards = convertToCards(notes, cards, collection, mediaMapping)

    return {
      name: deckName,
      cards: parsedCards,
      mediaMapping,
    }
  } finally {
    db.close()
  }
}

/**
 * Parse the collection table to get models (note types) and decks
 */
function parseCollection(db: Database): AnkiCollection {
  const result = db.exec('SELECT models, decks FROM col')

  if (!result.length || !result[0].values.length) {
    throw new Error('Invalid database: No collection data found')
  }

  const modelsJson = result[0].values[0][0] as string
  const decksJson = result[0].values[0][1] as string

  const models = JSON.parse(modelsJson) as Record<string, AnkiModel>
  const decks = JSON.parse(decksJson) as Record<string, { name: string }>

  return { models, decks }
}

/**
 * Parse notes from the database
 */
function parseNotes(db: Database): AnkiNote[] {
  const result = db.exec('SELECT id, flds, mid FROM notes')

  if (!result.length) {
    return []
  }

  return result[0].values.map((row) => ({
    id: row[0] as number,
    flds: row[1] as string,
    mid: row[2] as number,
  }))
}

/**
 * Parse cards from the database - crucial for template selection
 */
function parseCards(db: Database): AnkiCard[] {
  const result = db.exec('SELECT id, nid, ord FROM cards')

  if (!result.length) {
    return []
  }

  return result[0].values.map((row) => ({
    id: row[0] as number,
    nid: row[1] as number,
    ord: row[2] as number,
  }))
}

/**
 * Parse media mapping from the zip file
 */
async function parseMediaMapping(zip: JSZip): Promise<Record<string, string>> {
  const mediaFile = zip.file('media')

  if (!mediaFile) {
    return {}
  }

  try {
    const mediaJson = await mediaFile.async('string')
    return JSON.parse(mediaJson) as Record<string, string>
  } catch {
    return {}
  }
}

/**
 * Extract deck name from collection data
 */
function extractDeckName(collection: AnkiCollection, notes: AnkiNote[]): string {
  // Try to get deck name from decks (skip the default deck with id "1")
  const deckEntries = Object.entries(collection.decks)
  for (const [id, deck] of deckEntries) {
    if (id !== '1' && deck.name && deck.name !== 'Default') {
      return deck.name
    }
  }

  // Try to get the name from the first model
  const modelIds = Object.keys(collection.models)
  if (modelIds.length > 0) {
    const firstModel = collection.models[modelIds[0]]
    if (firstModel.name) {
      return firstModel.name
    }
  }

  // Fallback to a generic name
  return `Imported Deck (${notes.length} cards)`
}

/**
 * Convert Anki notes and cards to parsed cards
 */
function convertToCards(
  notes: AnkiNote[],
  cards: AnkiCard[],
  collection: AnkiCollection,
  mediaMapping: Record<string, string>
): ParsedAnkiCard[] {
  const parsedCards: ParsedAnkiCard[] = []

  // Create a map of note ID to note for quick lookup
  const notesById = new Map(notes.map(n => [n.id, n]))

  // Process each card (not each note!)
  for (const card of cards) {
    const note = notesById.get(card.nid)
    if (!note) continue

    const model = collection.models[note.mid.toString()]
    if (!model) continue

    // Split note fields
    const fieldValues = note.flds.split(FIELD_SEPARATOR)

    // Create field name to value mapping
    const fieldMap: Record<string, string> = {}
    model.flds.forEach((fieldDef, index) => {
      fieldMap[fieldDef.name] = fieldValues[index] || ''
    })

    let front: string
    let back: string

    if (model.type === 1) {
      // Cloze model - card.ord is the cloze number (0-indexed, so ord=0 means {{c1::}})
      const clozeNum = card.ord + 1
      front = renderClozeTemplate(model.tmpls[0]?.qfmt || '', fieldMap, clozeNum, true)
      back = renderClozeTemplate(model.tmpls[0]?.afmt || '', fieldMap, clozeNum, false)
      // Replace FrontSide in back
      back = back.replace(/\{\{FrontSide\}\}/gi, front)
    } else {
      // Standard model - card.ord indexes into templates array
      const template = model.tmpls[card.ord]
      if (!template) continue

      front = renderStandardTemplate(template.qfmt, fieldMap)
      back = renderStandardTemplate(template.afmt, fieldMap)
      // Replace FrontSide in back
      back = back.replace(/\{\{FrontSide\}\}/gi, front)
    }

    // Extract media file references
    const mediaFiles = extractMediaReferences(front + back, mediaMapping)

    // Clean up HTML
    front = cleanHtml(front)
    back = cleanHtml(back)

    // Only add if we have valid content
    if (front.trim() || back.trim()) {
      parsedCards.push({
        noteId: note.id,
        front,
        back,
        mediaFiles,
      })
    }
  }

  return parsedCards
}

/**
 * Render a standard (non-cloze) template
 */
function renderStandardTemplate(template: string, fields: Record<string, string>): string {
  let result = template

  // Process conditional blocks - multiple passes for nested conditionals
  for (let i = 0; i < 5; i++) {
    const before = result

    // Handle positive conditionals: {{#FieldName}}...{{/FieldName}}
    result = result.replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, fieldName, content) => {
      const trimmedName = fieldName.trim()
      const value = fields[trimmedName]
      return value && value.trim() ? content : ''
    })

    // Handle negative conditionals: {{^FieldName}}...{{/FieldName}}
    result = result.replace(/\{\{\^([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, fieldName, content) => {
      const trimmedName = fieldName.trim()
      const value = fields[trimmedName]
      return !value || !value.trim() ? content : ''
    })

    if (before === result) break
  }

  // Replace field references with their values
  result = result.replace(/\{\{([^#/^}]+?)\}\}/g, (match, fieldName) => {
    const trimmedName = fieldName.trim()

    // Skip FrontSide - it's handled separately
    if (trimmedName === 'FrontSide') {
      return match
    }

    // Handle filter prefixes
    if (trimmedName.includes(':')) {
      const parts = trimmedName.split(':')
      const filter = parts[0]
      const actualField = parts.slice(1).join(':')

      switch (filter) {
        case 'text':
          return stripHtml(fields[actualField] || '')
        case 'hint':
          const hintValue = fields[actualField] || ''
          if (!hintValue) return ''
          return `<span class="hint-link">[Show ${actualField}]</span>`
        case 'type':
          return fields[actualField] || ''
        case 'cloze':
          // For standard templates, cloze filter just returns the field value
          return fields[actualField] || ''
        default:
          // Unknown filter, try using it as a field name
          return fields[trimmedName] || ''
      }
    }

    return fields[trimmedName] || ''
  })

  // Remove any orphaned closing tags
  result = result.replace(/\{\{\/[^}]+\}\}/g, '')
  // Remove any orphaned opening conditional tags
  result = result.replace(/\{\{[#^][^}]+\}\}/g, '')

  return result
}

/**
 * Render a cloze template
 * @param template The template string
 * @param fields Field name to value mapping
 * @param clozeNum The cloze number for this card (1-indexed)
 * @param isQuestion Whether this is the question (front) side
 */
function renderClozeTemplate(
  template: string,
  fields: Record<string, string>,
  clozeNum: number,
  isQuestion: boolean
): string {
  let result = template

  // Process conditional blocks for cloze cards ({{#c1}}, {{#c2}}, etc.)
  for (let i = 0; i < 5; i++) {
    const before = result

    // Handle cloze number conditionals: {{#c1}}...{{/c1}}
    result = result.replace(/\{\{#c(\d+)\}\}([\s\S]*?)\{\{\/c\1\}\}/g, (match, num, content) => {
      return parseInt(num) === clozeNum ? content : ''
    })

    // Handle negative cloze conditionals: {{^c1}}...{{/c1}}
    result = result.replace(/\{\{\^c(\d+)\}\}([\s\S]*?)\{\{\/c\1\}\}/g, (match, num, content) => {
      return parseInt(num) !== clozeNum ? content : ''
    })

    // Handle positive conditionals: {{#FieldName}}...{{/FieldName}}
    result = result.replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, fieldName, content) => {
      const trimmedName = fieldName.trim()
      if (trimmedName.startsWith('c') && /^c\d+$/.test(trimmedName)) {
        return match // Already handled above
      }
      const value = fields[trimmedName]
      return value && value.trim() ? content : ''
    })

    // Handle negative conditionals: {{^FieldName}}...{{/FieldName}}
    result = result.replace(/\{\{\^([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, fieldName, content) => {
      const trimmedName = fieldName.trim()
      if (trimmedName.startsWith('c') && /^c\d+$/.test(trimmedName)) {
        return match // Already handled above
      }
      const value = fields[trimmedName]
      return !value || !value.trim() ? content : ''
    })

    if (before === result) break
  }

  // Replace cloze:FieldName with processed cloze content
  result = result.replace(/\{\{cloze:([^}]+)\}\}/g, (match, fieldName) => {
    const trimmedField = fieldName.trim()
    const fieldValue = fields[trimmedField] || ''
    return processClozeField(fieldValue, clozeNum, isQuestion)
  })

  // Replace regular field references
  result = result.replace(/\{\{([^#/^}]+?)\}\}/g, (match, fieldName) => {
    const trimmedName = fieldName.trim()

    if (trimmedName === 'FrontSide') {
      return match
    }

    if (trimmedName.includes(':')) {
      const parts = trimmedName.split(':')
      const filter = parts[0]
      const actualField = parts.slice(1).join(':')

      switch (filter) {
        case 'text':
          return stripHtml(fields[actualField] || '')
        case 'hint':
          const hintValue = fields[actualField] || ''
          if (!hintValue) return ''
          return `<span class="hint-link">[Show ${actualField}]</span>`
        case 'type':
          return fields[actualField] || ''
        default:
          return fields[trimmedName] || ''
      }
    }

    return fields[trimmedName] || ''
  })

  // Remove orphaned tags
  result = result.replace(/\{\{\/[^}]+\}\}/g, '')
  result = result.replace(/\{\{[#^][^}]+\}\}/g, '')

  return result
}

/**
 * Process cloze deletions in a field value
 * @param fieldValue The field value containing cloze deletions
 * @param clozeNum The active cloze number for this card
 * @param isQuestion Whether to show blanks (question) or answers (answer)
 */
function processClozeField(fieldValue: string, clozeNum: number, isQuestion: boolean): string {
  // Regex to match cloze deletions: {{c1::answer}} or {{c1::answer::hint}}
  return fieldValue.replace(
    /\{\{c(\d+)::([^:}]+?)(?:::([^}]+))?\}\}/g,
    (match, num, answer, hint) => {
      const thisNum = parseInt(num)

      if (thisNum === clozeNum) {
        // This is the active cloze for this card
        if (isQuestion) {
          // Show blank with optional hint
          if (hint) {
            return `<span class="cloze-blank">[${hint}]</span>`
          }
          return '<span class="cloze-blank">[...]</span>'
        } else {
          // Show the answer (highlighted)
          return `<span class="cloze-answer">${answer}</span>`
        }
      } else {
        // Not the active cloze - show the answer normally
        return answer
      }
    }
  )
}

/**
 * Strip HTML tags from text
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Extract media file references from HTML content
 */
function extractMediaReferences(html: string, mediaMapping: Record<string, string>): string[] {
  const mediaFiles: string[] = []

  // Find image references: <img src="filename">
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi
  let match

  while ((match = imgRegex.exec(html)) !== null) {
    const filename = match[1]
    if (!filename.startsWith('http')) {
      mediaFiles.push(filename)
    }
  }

  // Find sound references: [sound:filename]
  const soundRegex = /\[sound:([^\]]+)\]/gi

  while ((match = soundRegex.exec(html)) !== null) {
    mediaFiles.push(match[1])
  }

  return [...new Set(mediaFiles)]
}

/**
 * Clean up HTML content
 */
function cleanHtml(html: string): string {
  let result = html

  // Remove specific unwanted content (e.g., Bible verses added by deck creator)
  result = result.replace(/Trust in the Lord with all your heart and lean not on your own understanding;?\s*in all your ways acknowledge Him and He will make your path straight/gi, '')

  // Remove empty divs and spans
  result = result.replace(/<(div|span)[^>]*>\s*<\/\1>/gi, '')

  // Remove Anki-specific classes that won't work outside Anki
  result = result.replace(/class="[^"]*"/gi, '')

  // Remove sound tags (convert to text indicator)
  result = result.replace(/\[sound:([^\]]+)\]/gi, '<span class="audio-indicator">🔊 Audio: $1</span>')

  // Clean up excessive whitespace
  result = result.replace(/\n{3,}/g, '\n\n')

  // Remove <hr id=answer> which is a common Anki convention
  result = result.replace(/<hr[^>]*id=["']?answer["']?[^>]*>/gi, '<hr class="answer-divider">')

  return result.trim()
}

/**
 * Extract media files from the .apkg zip
 */
export async function extractMediaFiles(
  fileBuffer: ArrayBuffer
): Promise<Map<string, { data: Uint8Array; filename: string }>> {
  const zip = await JSZip.loadAsync(fileBuffer)
  const mediaMap = new Map<string, { data: Uint8Array; filename: string }>()

  // Parse media mapping
  const mediaFile = zip.file('media')
  if (!mediaFile) {
    return mediaMap
  }

  let mediaMapping: Record<string, string>
  try {
    const mediaJson = await mediaFile.async('string')
    mediaMapping = JSON.parse(mediaJson)
  } catch {
    return mediaMap
  }

  // Extract each media file
  for (const [numberedName, originalName] of Object.entries(mediaMapping)) {
    const file = zip.file(numberedName)
    if (file) {
      const data = await file.async('uint8array')
      mediaMap.set(originalName, { data, filename: originalName })
    }
  }

  return mediaMap
}

/**
 * Generate a URL-safe slug from a deck name
 */
export function generateDeckSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}
