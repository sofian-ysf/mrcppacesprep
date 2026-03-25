import React from 'react'

/**
 * Converts markdown bold syntax (**text**) to React elements with <strong> tags
 */
export function formatBoldText(text: string): React.ReactNode {
  if (!text) return text

  // Split by **text** pattern, keeping the matches
  const parts = text.split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    // Check if this part is a bold segment
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2)
      return <strong key={index}>{boldText}</strong>
    }
    return part
  })
}
