'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function FloatingCTA() {
  const pathname = usePathname()

  // Hide on auth pages, dashboard, admin, and other non-landing pages
  const hideOnRoutes = [
    '/login',
    '/signup',
    '/checkout-success',
    '/admin',
    '/dashboard',
    '/try-free',
    '/pricing', // Already on pricing page, no need to show CTA
  ]

  const shouldHide = hideOnRoutes.some(route =>
    pathname === route || pathname?.startsWith(`${route}/`)
  )

  if (shouldHide) {
    return null
  }

  return (
    <div className="floating-cta-container">
      <Link href="/pricing" className="floating-cta">
        Get Started
      </Link>
    </div>
  )
}
