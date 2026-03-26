'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    const willOpen = !isMobileMenuOpen
    setIsMobileMenuOpen(willOpen)

    if (willOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
  }

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      toggleMobileMenu()
    }
  }

  const handleSignOut = async () => {
    closeMobileMenu()
    await signOut()
  }

  const navStateClass = isScrolled || isHovered || isMobileMenuOpen ? 'scrolled' : ''

  // Show skeleton while loading
  if (loading) {
    return (
      <nav className="pill-nav">
        <div className="pill-nav-container">
          <div className="pill-nav-left">
            <Link href="/" className="pill-nav-logo">
              <Image src="/logo.png" alt="MRCPPACESPREP" width={28} height={28} className="rounded" />
              <span>MRCPPACESPREP</span>
            </Link>
          </div>
          <div className="pill-nav-right">
            <div className="animate-pulse h-8 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav
        className={`pill-nav ${navStateClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="pill-nav-container">
          {/* Left Pill - Logo + Nav Items */}
          <div className={`pill-nav-left ${isScrolled ? 'frosted' : ''}`}>
            <Link href="/" className="pill-nav-logo">
              <Image src="/logo.png" alt="MRCPPACESPREP" width={28} height={28} className="rounded" />
              <span>MRCPPACESPREP</span>
            </Link>

            {user ? (
              // Authenticated navigation
              <>
                <Link href="/dashboard" className={`pill-nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>
                  Dashboard
                </Link>
                <Link href="/dashboard/progress" className={`pill-nav-item ${pathname === '/dashboard/progress' ? 'active' : ''}`}>
                  Progress
                </Link>
                <Link href="/dashboard/sba" className={`pill-nav-item ${pathname?.startsWith('/dashboard/sba') ? 'active' : ''}`}>
                  SBA
                </Link>
                <Link href="/dashboard/flashcards" className={`pill-nav-item ${pathname?.startsWith('/dashboard/flashcards') ? 'active' : ''}`}>
                  Flashcards
                </Link>
                <Link href="/blog" className={`pill-nav-item ${pathname?.startsWith('/blog') ? 'active' : ''}`}>
                  Blog
                </Link>
              </>
            ) : (
              // Public navigation
              <>
                <Link href="/#features" className="pill-nav-item">
                  Features
                </Link>
                <Link href="/pricing" className={`pill-nav-item ${pathname === '/pricing' ? 'active' : ''}`}>
                  Pricing
                </Link>
                <Link href="/login?redirect=/dashboard/flashcards" className="pill-nav-item">
                  Flashcards
                </Link>
                <Link href="/blog" className={`pill-nav-item ${pathname?.startsWith('/blog') ? 'active' : ''}`}>
                  Blog
                </Link>
                <Link href="/about" className={`pill-nav-item ${pathname === '/about' ? 'active' : ''}`}>
                  About
                </Link>
              </>
            )}
          </div>

          {/* Right Pill - CTA */}
          <div className={`pill-nav-right ${isScrolled ? 'frosted' : ''}`}>
            {user ? (
              <>
                <span className="pill-nav-user">{user.email?.split('@')[0]}</span>
                <button onClick={handleSignOut} className="pill-nav-signout">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="pill-nav-item">
                  Login
                </Link>
                <Link href="/signup" className="pill-nav-cta">
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Hamburger */}
            <button
              className={`pill-nav-hamburger ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`pill-mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
      ></div>

      {/* Mobile Menu */}
      <div className={`pill-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="pill-mobile-header">
          <Link href="/" className="pill-mobile-logo" onClick={closeMobileMenu}>
            <Image src="/logo.png" alt="MRCPPACESPREP" width={28} height={28} className="rounded" />
            <span>MRCPPACESPREP</span>
          </Link>
          <button className="pill-mobile-close" onClick={toggleMobileMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="pill-mobile-content">
          <div className="pill-mobile-nav-links">
            {user ? (
              // Authenticated mobile menu
              <>
                <div className="pill-mobile-user-info">
                  <span>{user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'}</span>
                </div>
                <Link href="/dashboard" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  Dashboard
                </Link>
                <Link href="/dashboard/progress" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  Progress
                </Link>
                <Link href="/dashboard/sba" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  SBA
                </Link>
                <Link href="/dashboard/mock-exams" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  Mock Exams
                </Link>
                <Link href="/dashboard/flashcards" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  Flashcards
                </Link>
                <Link href="/blog" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  Blog
                </Link>
              </>
            ) : (
              // Public mobile menu
              <>
                <Link href="/#features" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  Features
                </Link>
                <Link href="/pricing" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  Pricing
                </Link>
                <Link href="/login?redirect=/dashboard/flashcards" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  Flashcards
                </Link>
                <Link href="/blog" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  Blog
                </Link>
                <Link href="/about" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  About
                </Link>
                <Link href="/contact" className="pill-mobile-nav-link" onClick={closeMobileMenu}>
                  Contact
                </Link>
              </>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="pill-mobile-bottom">
            {user ? (
              <button onClick={handleSignOut} className="pill-mobile-cta-btn secondary">
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/login" className="pill-mobile-cta-btn secondary" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link href="/signup" className="pill-mobile-cta-btn" onClick={closeMobileMenu}>
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
