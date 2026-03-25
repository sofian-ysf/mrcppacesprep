'use client'

// Color palettes for SVG backgrounds
const colorPalettes = [
  '#C4B5A0', // Beige
  '#A89A91', // Taupe
  '#C8B8D8', // Lavender
  '#A8C1A8', // Sage green
  '#D4A5A5', // Dusty rose
  '#9AB5D1', // Powder blue
  '#E6C9A8', // Peach
  '#B5C9C3', // Mint
  '#D1B3C4', // Blush
  '#A8B8A8', // Eucalyptus
]

// Stroke colors that contrast well with each background
const strokeColors = [
  '#7A6B4F', // Darker beige
  '#6B5D54', // Darker taupe
  '#8B7A9B', // Darker lavender
  '#5A7A5A', // Darker sage
  '#A67373', // Darker rose
  '#5A7A9A', // Darker blue
  '#C69A6A', // Darker peach
  '#7A9A8F', // Darker mint
  '#9A7A8A', // Darker blush
  '#6A7A6A', // Darker eucalyptus
]

// SVG patterns
const svgPatterns = [
  // Pattern 1: Cross with squares
  (color: string) => (
    <>
      <rect x="85" y="85" width="30" height="30" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="95" y="75" width="10" height="10" fill={color} opacity="0.6"/>
      <rect x="75" y="95" width="10" height="10" fill={color} opacity="0.6"/>
      <rect x="115" y="95" width="10" height="10" fill={color} opacity="0.6"/>
      <rect x="95" y="115" width="10" height="10" fill={color} opacity="0.6"/>
      <circle cx="100" cy="100" r="5" fill={color}/>
    </>
  ),
  // Pattern 2: Eye design
  (color: string) => (
    <>
      <ellipse cx="100" cy="100" rx="40" ry="20" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="100" cy="100" r="15" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="100" cy="100" r="8" fill={color}/>
      <path d="M60 100 Q80 80 100 100 T140 100" fill="none" stroke={color} strokeWidth="1" opacity="0.5"/>
      <path d="M60 100 Q80 120 100 100 T140 100" fill="none" stroke={color} strokeWidth="1" opacity="0.5"/>
    </>
  ),
  // Pattern 3: Dot constellation
  (color: string) => (
    <>
      <circle cx="100" cy="70" r="3" fill={color} opacity="0.8"/>
      <circle cx="80" cy="85" r="2" fill={color} opacity="0.6"/>
      <circle cx="120" cy="85" r="2" fill={color} opacity="0.6"/>
      <circle cx="100" cy="100" r="5" fill={color}/>
      <circle cx="75" cy="115" r="3" fill={color} opacity="0.7"/>
      <circle cx="125" cy="115" r="3" fill={color} opacity="0.7"/>
      <circle cx="100" cy="130" r="2" fill={color} opacity="0.5"/>
    </>
  ),
  // Pattern 4: Target/crosshair
  (color: string) => (
    <>
      <circle cx="100" cy="100" r="30" fill="none" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="100" cy="100" r="20" fill="none" stroke={color} strokeWidth="1" opacity="0.7"/>
      <circle cx="100" cy="100" r="10" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="100" cy="100" r="4" fill={color}/>
      <line x1="100" y1="60" x2="100" y2="80" stroke={color} strokeWidth="1"/>
      <line x1="100" y1="120" x2="100" y2="140" stroke={color} strokeWidth="1"/>
      <line x1="60" y1="100" x2="80" y2="100" stroke={color} strokeWidth="1"/>
      <line x1="120" y1="100" x2="140" y2="100" stroke={color} strokeWidth="1"/>
    </>
  ),
  // Pattern 5: Organic flow
  (color: string) => (
    <>
      <path d="M70 100 Q100 70 130 100 T170 100" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M30 100 Q70 130 100 100 T130 100" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="100" cy="100" r="5" fill={color}/>
      <circle cx="70" cy="100" r="3" fill={color} opacity="0.6"/>
      <circle cx="130" cy="100" r="3" fill={color} opacity="0.6"/>
    </>
  ),
  // Pattern 6: Geometric grid
  (color: string) => (
    <>
      <rect x="70" y="70" width="20" height="20" fill="none" stroke={color} strokeWidth="1" opacity="0.7"/>
      <rect x="90" y="70" width="20" height="20" fill={color} opacity="0.3"/>
      <rect x="110" y="70" width="20" height="20" fill="none" stroke={color} strokeWidth="1" opacity="0.7"/>
      <rect x="70" y="90" width="20" height="20" fill={color} opacity="0.3"/>
      <rect x="90" y="90" width="20" height="20" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="110" y="90" width="20" height="20" fill={color} opacity="0.3"/>
      <rect x="70" y="110" width="20" height="20" fill="none" stroke={color} strokeWidth="1" opacity="0.7"/>
      <rect x="90" y="110" width="20" height="20" fill={color} opacity="0.3"/>
      <rect x="110" y="110" width="20" height="20" fill="none" stroke={color} strokeWidth="1" opacity="0.7"/>
    </>
  ),
  // Pattern 7: Spiral dots
  (color: string) => (
    <>
      <circle cx="100" cy="100" r="4" fill={color}/>
      <circle cx="110" cy="95" r="3" fill={color} opacity="0.8"/>
      <circle cx="115" cy="105" r="3" fill={color} opacity="0.7"/>
      <circle cx="105" cy="115" r="3" fill={color} opacity="0.6"/>
      <circle cx="90" cy="110" r="3" fill={color} opacity="0.5"/>
      <circle cx="85" cy="95" r="3" fill={color} opacity="0.4"/>
      <circle cx="95" cy="85" r="3" fill={color} opacity="0.3"/>
    </>
  ),
  // Pattern 8: Abstract shapes
  (color: string) => (
    <>
      <path d="M80 80 L120 80 L100 110 Z" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="100" cy="90" r="8" fill={color} opacity="0.5"/>
      <rect x="90" y="100" width="20" height="20" fill="none" stroke={color} strokeWidth="1" rx="2"/>
      <line x1="85" y1="125" x2="115" y2="125" stroke={color} strokeWidth="2"/>
    </>
  ),
  // Pattern 9: Wave pattern
  (color: string) => (
    <>
      <path d="M60 90 Q80 80 100 90 T140 90" fill="none" stroke={color} strokeWidth="2"/>
      <path d="M60 100 Q80 90 100 100 T140 100" fill="none" stroke={color} strokeWidth="2" opacity="0.7"/>
      <path d="M60 110 Q80 100 100 110 T140 110" fill="none" stroke={color} strokeWidth="2" opacity="0.5"/>
      <circle cx="100" cy="100" r="3" fill={color}/>
    </>
  ),
  // Pattern 10: Star burst
  (color: string) => (
    <>
      <line x1="100" y1="70" x2="100" y2="130" stroke={color} strokeWidth="1" opacity="0.5"/>
      <line x1="70" y1="100" x2="130" y2="100" stroke={color} strokeWidth="1" opacity="0.5"/>
      <line x1="80" y1="80" x2="120" y2="120" stroke={color} strokeWidth="1" opacity="0.5"/>
      <line x1="120" y1="80" x2="80" y2="120" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="100" cy="100" r="3" fill={color}/>
    </>
  ),
]

interface ArticleSVGProps {
  index: number
}

export default function ArticleSVG({ index }: ArticleSVGProps) {
  const colorIndex = index % colorPalettes.length
  const backgroundColor = colorPalettes[colorIndex]
  const strokeColor = strokeColors[colorIndex]
  const patternIndex = index % svgPatterns.length
  const Pattern = svgPatterns[patternIndex]

  return (
    <div
      className="article-svg-wrapper"
      style={{
        backgroundColor,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px'
      }}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '50%', height: '50%' }}>
        {Pattern(strokeColor)}
      </svg>
    </div>
  )
}
