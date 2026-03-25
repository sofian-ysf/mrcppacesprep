/**
 * Confetti and Celebration Effects
 *
 * Provides celebration animations for achievements and milestones
 */

interface ConfettiOptions {
  particleCount?: number
  spread?: number
  origin?: { x: number; y: number }
  colors?: string[]
  duration?: number
}

const defaultColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

/**
 * Create a single confetti particle
 */
function createParticle(container: HTMLElement, color: string, origin: { x: number; y: number }) {
  const particle = document.createElement('div')
  particle.style.cssText = `
    position: fixed;
    width: 10px;
    height: 10px;
    background-color: ${color};
    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    pointer-events: none;
    left: ${origin.x}px;
    top: ${origin.y}px;
    z-index: 9999;
  `

  container.appendChild(particle)

  // Animate the particle
  const angle = Math.random() * Math.PI * 2
  const velocity = 3 + Math.random() * 5
  const spin = (Math.random() - 0.5) * 10
  let vx = Math.cos(angle) * velocity * 2
  let vy = Math.sin(angle) * velocity - 5
  let rotation = 0
  let opacity = 1
  let x = origin.x
  let y = origin.y

  const animate = () => {
    vy += 0.1 // gravity
    x += vx
    y += vy
    rotation += spin
    opacity -= 0.02

    particle.style.transform = `translate(${x - origin.x}px, ${y - origin.y}px) rotate(${rotation}deg)`
    particle.style.opacity = String(opacity)

    if (opacity > 0) {
      requestAnimationFrame(animate)
    } else {
      particle.remove()
    }
  }

  requestAnimationFrame(animate)
}

/**
 * Fire confetti effect
 */
export function fireConfetti(options: ConfettiOptions = {}) {
  const {
    particleCount = 50,
    origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    colors = defaultColors,
    duration = 3000
  } = options

  // Create a container for particles
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `
  document.body.appendChild(container)

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)]
    setTimeout(() => {
      createParticle(container, color, origin)
    }, Math.random() * 200)
  }

  // Cleanup container after duration
  setTimeout(() => {
    container.remove()
  }, duration)
}

/**
 * Fire celebration for completing a goal
 */
export function celebrateGoalComplete() {
  fireConfetti({
    particleCount: 30,
    origin: { x: window.innerWidth / 2, y: window.innerHeight / 3 },
    colors: ['#22c55e', '#16a34a', '#15803d']
  })
}

/**
 * Fire celebration for passing a mock exam
 */
export function celebrateMockExamPass() {
  // Multiple bursts
  const positions = [
    { x: window.innerWidth * 0.25, y: window.innerHeight * 0.5 },
    { x: window.innerWidth * 0.75, y: window.innerHeight * 0.5 },
    { x: window.innerWidth * 0.5, y: window.innerHeight * 0.3 }
  ]

  positions.forEach((pos, i) => {
    setTimeout(() => {
      fireConfetti({
        particleCount: 40,
        origin: pos,
        colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#22c55e']
      })
    }, i * 200)
  })
}

/**
 * Fire celebration for achievement unlock
 */
export function celebrateAchievement(rarity: string) {
  const colors = {
    legendary: ['#f59e0b', '#fbbf24', '#fcd34d', '#ffffff'],
    epic: ['#8b5cf6', '#a855f7', '#c084fc', '#ffffff'],
    rare: ['#3b82f6', '#60a5fa', '#93c5fd', '#ffffff'],
    common: ['#6b7280', '#9ca3af', '#d1d5db', '#ffffff']
  }

  fireConfetti({
    particleCount: rarity === 'legendary' ? 100 : rarity === 'epic' ? 70 : 40,
    origin: { x: window.innerWidth / 2, y: window.innerHeight / 3 },
    colors: colors[rarity as keyof typeof colors] || colors.common
  })
}

/**
 * Fire celebration for streak milestone
 */
export function celebrateStreakMilestone(days: number) {
  const intensity = days >= 100 ? 100 : days >= 30 ? 70 : 40
  fireConfetti({
    particleCount: intensity,
    origin: { x: window.innerWidth / 2, y: window.innerHeight / 3 },
    colors: ['#f97316', '#fb923c', '#fdba74', '#fed7aa']
  })
}
