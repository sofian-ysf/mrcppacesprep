'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function TopBanner() {
  const pathname = usePathname()
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Determine if banner should be hidden on this route
  const shouldHide = pathname?.startsWith('/try-free') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/signup'

  useEffect(() => {
    setMounted(true)
    // Check if banner was dismissed in this session
    const isDismissed = sessionStorage.getItem('tryFreeBannerDismissed')
    if (isDismissed) setDismissed(true)
  }, [])

  // Manage body class for CSS variable coordination
  useEffect(() => {
    if (!mounted) return

    const shouldShowBanner = !shouldHide && !dismissed

    if (shouldShowBanner) {
      document.body.classList.add('has-top-banner')
    } else {
      document.body.classList.remove('has-top-banner')
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('has-top-banner')
    }
  }, [mounted, shouldHide, dismissed])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('tryFreeBannerDismissed', 'true')
  }

  // Don't render on hidden routes
  if (shouldHide) return null

  // Don't render until mounted or if dismissed
  if (!mounted || dismissed) return null

  return (
    <div className="top-banner">
      <div className="flex items-center justify-center gap-2 px-10">
        <span className="hidden sm:inline">Try 15 free MRCP PACES practice questions with detailed explanations</span>
        <span className="sm:hidden">Try 15 free questions</span>
        <Link
          href="/try-free"
          className="inline-flex items-center gap-1 bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-100 transition-colors"
        >
          Try Free
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
        aria-label="Dismiss banner"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
