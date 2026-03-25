'use client'

import { useState, useMemo, ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { useSubscription } from '@/app/hooks/useSubscription'
import { getStoredGclid } from '@/app/components/GclidCapture'

interface Breadcrumb {
  label: string
  href?: string
}

interface Tab {
  label: string
  value: string
  onClick: () => void
  badge?: string
  locked?: boolean
}

interface DashboardLayoutProps {
  children: ReactNode
  breadcrumbs?: Breadcrumb[]
  tabs?: Tab[]
  activeTab?: string
  statsBar?: ReactNode
}

export default function DashboardLayout({
  children,
  breadcrumbs,
  tabs,
  activeTab,
  statsBar
}: DashboardLayoutProps) {
  const { user, signOut } = useAuth()
  const { accessType } = useSubscription()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  // Calculate the appropriate content class based on fixed elements
  const contentClassName = useMemo(() => {
    if (statsBar) return 'dashboard-content-stats'
    if (tabs) return 'dashboard-content-tabs'
    if (breadcrumbs && breadcrumbs.length > 0) return 'dashboard-content-breadcrumb'
    return 'dashboard-content'
  }, [statsBar, tabs, breadcrumbs])

  const handleSubscribe = async () => {
    setSubscribing(true)
    try {
      const gclid = getStoredGclid()
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gclid })
      })
      const data = await response.json()
      if (data.url) window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setSubscribing(false)
    }
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', active: pathname === '/dashboard' },
    { href: '/dashboard/progress', label: 'Progress', active: pathname === '/dashboard/progress' },
    { href: '/dashboard/question-bank', label: 'Questions', active: pathname?.startsWith('/dashboard/question-bank') },
    { href: '/dashboard/flashcards', label: 'Flashcards', active: pathname?.startsWith('/dashboard/flashcards') },
    { href: '/blog', label: 'Blog', active: pathname?.startsWith('/blog') }
  ]

  return (
    <div className="min-h-screen bg-[#fbfaf4]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        {/* Main Navigation - 56px (h-14) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left - Logo & Nav */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/logo.png" alt="MRCPPACESPREP" width={28} height={28} className="rounded" />
                <span className="font-semibold text-gray-900">MRCPPACESPREP</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      link.active
                        ? 'font-medium text-gray-900 bg-gray-100'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right - User (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              {accessType !== 'subscription' && (
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="text-sm font-medium text-white bg-black px-4 py-1.5 rounded-full hover:bg-gray-800 disabled:opacity-50"
                >
                  {subscribing ? 'Loading...' : 'Subscribe'}
                </button>
              )}
              <span className="text-sm text-gray-600">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 text-sm rounded-lg ${
                    link.active
                      ? 'font-medium text-gray-900 bg-gray-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="px-3 py-2 text-sm text-gray-600">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </div>
                {accessType !== 'subscription' && (
                  <button
                    onClick={() => { handleSubscribe(); setMobileMenuOpen(false) }}
                    disabled={subscribing}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg mb-2 disabled:opacity-50"
                  >
                    {subscribing ? 'Loading...' : 'Subscribe'}
                  </button>
                )}
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false) }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb - 36px */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {breadcrumbs.map((crumb, index) => (
                  <span key={index} className="flex items-center space-x-2">
                    {index > 0 && <span>/</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:text-gray-900">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-gray-900">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabs - 44px */}
        {tabs && (
          <div className="border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex gap-8">
                {tabs.map(tab => (
                  <button
                    key={tab.value}
                    onClick={tab.onClick}
                    disabled={tab.locked}
                    className={`py-3 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                      activeTab === tab.value
                        ? 'border-black text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    } ${tab.locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {tab.locked && (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    {tab.label}
                    {tab.badge && (
                      <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar - Fixed below header */}
      {statsBar && (
        <div
          className="fixed left-0 right-0 z-30 bg-white border-b border-gray-200"
          style={{
            top: `calc(var(--dashboard-navbar-height) + ${breadcrumbs && breadcrumbs.length > 0 ? 'var(--dashboard-breadcrumb-height)' : '0px'})`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {statsBar}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${contentClassName} pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
        {children}
      </div>
    </div>
  )
}
