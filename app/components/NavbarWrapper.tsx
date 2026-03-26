'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function NavbarWrapper() {
  const pathname = usePathname()

  // Hide navbar on admin routes, dashboard pages, and try-free (has own header)
  if (pathname?.startsWith('/admin') ||
      pathname?.startsWith('/try-free') ||
      pathname === '/dashboard' ||
      pathname === '/dashboard/sba/practice' ||
      pathname === '/dashboard/sba' ||
      pathname === '/dashboard/progress' ||
      pathname?.startsWith('/dashboard/mock-exams') ||
      pathname?.startsWith('/dashboard/flashcards') ||
      pathname?.startsWith('/dashboard/settings') ||
      pathname?.startsWith('/dashboard/achievements') ||
      pathname?.startsWith('/dashboard/notes')) {
    return null
  }

  return <Navigation />
}
