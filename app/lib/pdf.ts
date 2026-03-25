export interface PDFExtractionResult {
  text: string
  numPages: number
  info: {
    title?: string
    author?: string
    subject?: string
  }
}

// Extract text from a PDF buffer
export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractionResult> {
  try {
    // Dynamic import for pdf-parse (CommonJS module)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParse = await import('pdf-parse') as any
    const pdf = pdfParse.default || pdfParse

    const data = await pdf(buffer)

    return {
      text: data.text,
      numPages: data.numpages,
      info: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
      }
    }
  } catch (error) {
    console.error('Error extracting PDF text:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

// Clean extracted text
export function cleanExtractedText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/[ \t]+/g, ' ')
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    // Remove excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Remove page numbers and headers (common patterns)
    .replace(/^\d+\s*$/gm, '')
    .replace(/^Page \d+ of \d+$/gim, '')
    // Trim lines
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Final trim
    .trim()
}
