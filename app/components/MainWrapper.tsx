'use client'

import { usePathname } from 'next/navigation'

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't add padding on admin routes (they have their own layout)
  const isAdminRoute = pathname?.startsWith('/admin')

  // Don't add padding on dashboard routes (they have their own layout)
  const isDashboardRoute = pathname?.startsWith('/dashboard')

  // Don't add padding on try-free (has its own full-screen layout)
  const isTryFreeRoute = pathname?.startsWith('/try-free')

  // Only add nav padding on public pages that show the navbar
  const needsNavPadding = !isAdminRoute && !isDashboardRoute && !isTryFreeRoute

  return (
    <main className={needsNavPadding ? 'has-pill-nav' : ''}>
      {children}
    </main>
  )
}
