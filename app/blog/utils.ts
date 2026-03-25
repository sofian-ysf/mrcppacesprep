// Generate consistent index from string (for slug pages)
export function generateSVGIndex(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    const char = slug.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}
