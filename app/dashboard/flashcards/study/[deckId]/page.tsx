'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import { FlashcardWithProgress, FlashcardDeck, ReviewRating, StudySession } from '@/app/types/flashcards'
import { getInitialSM2State } from '@/app/lib/flashcards/sm2'
import FlashcardDisplay from '@/app/components/flashcards/FlashcardDisplay'
import ReviewButtons from '@/app/components/flashcards/ReviewButtons'

export default function StudySessionPage() {
  const params = useParams()
  const deckId = params.deckId as string
  const { user, loading: authLoading, signOut } = useAuth()

  const [deck, setDeck] = useState<FlashcardDeck | null>(null)
  const [session, setSession] = useState<StudySession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Track if we've already fetched to prevent refetch on tab switch
  const hasFetched = useRef(false)

  // Refs for keyboard handler to avoid constant re-registration
  const showAnswerRef = useRef(showAnswer)
  const submittingRef = useRef(submitting)
  const sessionRef = useRef(session)
  const currentCardRef = useRef<FlashcardWithProgress | undefined>(undefined)

  // Keep refs in sync
  showAnswerRef.current = showAnswer
  submittingRef.current = submitting
  sessionRef.current = session

  useEffect(() => {
    if (!authLoading && user && deckId && !hasFetched.current && !session) {
      hasFetched.current = true
      fetchStudyCards()
    }
  }, [user, authLoading, deckId, session])

  async function fetchStudyCards(forceRefresh = false) {
    try {
      if (!forceRefresh && session) return // Don't refetch if we have data

      setLoading(true)
      setSessionComplete(false)
      setShowAnswer(false)
      const res = await fetch(`/api/flashcards/decks/${deckId}/study?limit=20`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch cards')
      }

      setDeck(data.deck)

      if (data.cards.length === 0) {
        setSessionComplete(true)
        setSession(null)
      } else {
        setSession({
          deckId,
          cards: data.cards,
          currentIndex: 0,
          completedCount: 0,
          totalCount: data.cards.length,
          sessionStats: {
            again: 0,
            hard: 0,
            good: 0,
            easy: 0,
          },
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const currentCard = session?.cards[session.currentIndex]
  currentCardRef.current = currentCard

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true)
  }, [])

  const handleReview = useCallback(async (rating: ReviewRating) => {
    if (!session || !currentCard || submitting) return

    setSubmitting(true)

    try {
      const res = await fetch('/api/flashcards/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flashcardId: currentCard.id,
          rating,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit review')
      }

      const newStats = { ...session.sessionStats }
      newStats[rating]++

      const nextIndex = session.currentIndex + 1

      if (nextIndex >= session.cards.length) {
        setSession({
          ...session,
          completedCount: session.completedCount + 1,
          sessionStats: newStats,
        })
        setSessionComplete(true)
      } else {
        setSession({
          ...session,
          currentIndex: nextIndex,
          completedCount: session.completedCount + 1,
          sessionStats: newStats,
        })
        setShowAnswer(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }, [session, currentCard, submitting])

  // Keyboard shortcuts - uses refs to avoid constant re-registration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.code === 'Space' && !showAnswerRef.current) {
        e.preventDefault()
        setShowAnswer(true)
      } else if (showAnswerRef.current && !submittingRef.current) {
        const session = sessionRef.current
        const currentCard = currentCardRef.current
        if (!session || !currentCard) return

        const submitReview = async (rating: ReviewRating) => {
          if (submittingRef.current) return
          setSubmitting(true)

          try {
            const res = await fetch('/api/flashcards/review', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ flashcardId: currentCard.id, rating }),
            })

            if (!res.ok) {
              const data = await res.json()
              throw new Error(data.error || 'Failed to submit review')
            }

            const newStats = { ...session.sessionStats }
            newStats[rating]++
            const nextIndex = session.currentIndex + 1

            if (nextIndex >= session.cards.length) {
              setSession({ ...session, completedCount: session.completedCount + 1, sessionStats: newStats })
              setSessionComplete(true)
            } else {
              setSession({ ...session, currentIndex: nextIndex, completedCount: session.completedCount + 1, sessionStats: newStats })
              setShowAnswer(false)
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
          } finally {
            setSubmitting(false)
          }
        }

        if (e.key === '1') submitReview('again')
        else if (e.key === '2') submitReview('hard')
        else if (e.key === '3') submitReview('good')
        else if (e.key === '4') submitReview('easy')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, []) // Empty deps - uses refs for current values

  // Only show loading if we don't have any data yet
  if (authLoading || (loading && !session && !sessionComplete)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cards...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to study</h2>
          <Link href="/login" className="pill-btn pill-btn-primary">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/dashboard/flashcards"
            className="pill-btn pill-btn-primary"
          >
            Back to Decks
          </Link>
        </div>
      </div>
    )
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-[#fbfaf4] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Session Complete!</h2>
            <p className="text-gray-500 mb-6">{deck?.name}</p>

            {session && session.completedCount > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-6">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-lg font-bold text-red-600">{session.sessionStats.again}</p>
                  <p className="text-xs text-gray-500">Again</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-lg font-bold text-orange-600">{session.sessionStats.hard}</p>
                  <p className="text-xs text-gray-500">Hard</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">{session.sessionStats.good}</p>
                  <p className="text-xs text-gray-500">Good</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{session.sessionStats.easy}</p>
                  <p className="text-xs text-gray-500">Easy</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => fetchStudyCards(true)}
                className="w-full pill-btn pill-btn-primary"
              >
                Study More Cards
              </button>
              <Link
                href="/dashboard/flashcards"
                className="block w-full pill-btn pill-btn-ghost"
              >
                Back to Decks
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session || !currentCard) {
    return null
  }

  const progress = currentCard.progress || {
    ease_factor: getInitialSM2State().easeFactor,
    interval_days: getInitialSM2State().interval,
    repetitions: getInitialSM2State().repetitions,
  }

  return (
    <div className="min-h-screen bg-[#fbfaf4]">
      {/* Fixed Header with Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left - Logo & Nav */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/logo.png" alt="MRCPPACESPREP" width={28} height={28} className="rounded" />
                <span className="font-semibold text-gray-900">MRCPPACESPREP</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-1">
                <Link href="/dashboard" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link href="/dashboard/progress" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                  Progress
                </Link>
                <Link href="/dashboard/sba" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                  Questions
                </Link>
                <Link href="/dashboard/flashcards" className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-full">
                  Flashcards
                </Link>
                <Link href="/blog" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                  Blog
                </Link>
              </nav>
            </div>
            {/* Right - User (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-sm text-gray-600">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
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
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/progress"
                className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Progress
              </Link>
              <Link
                href="/dashboard/sba"
                className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Questions
              </Link>
              <Link
                href="/dashboard/flashcards"
                className="block px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Flashcards
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="px-3 py-2 text-sm text-gray-600">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </div>
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Breadcrumb */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
              <span>/</span>
              <Link href="/dashboard/flashcards" className="hover:text-gray-900">Flashcards</Link>
              <span>/</span>
              <span className="text-gray-900">{deck?.name || 'Study'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - with padding for fixed header */}
      <div style={{ marginTop: '8px', paddingTop: '16px' }} className="pb-6">
        {/* Study Progress Bar */}
        <div className="max-w-3xl mx-auto px-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{deck?.name}</span>
            <span className="text-sm text-gray-500">
              {session.currentIndex + 1} of {session.totalCount}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-gray-900 rounded-full transition-all duration-300"
              style={{ width: `${((session.currentIndex + 1) / session.totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Area */}
        <div className="max-w-3xl mx-auto px-4">
          <FlashcardDisplay
            card={currentCard}
            onShowAnswer={handleShowAnswer}
            showAnswer={showAnswer}
          />

          {/* Review Buttons or Show Answer */}
          <div className="mt-8">
            {showAnswer ? (
              <ReviewButtons
                onReview={handleReview}
                disabled={submitting}
                repetitions={progress.repetitions}
                easeFactor={parseFloat(String(progress.ease_factor))}
                interval={progress.interval_days}
              />
            ) : (
              <div className="text-center">
                <button
                  onClick={handleShowAnswer}
                  className="pill-btn pill-btn-primary pill-btn-lg"
                >
                  Show Answer
                </button>
                <p className="text-sm text-gray-400 mt-3">
                  Press Space to reveal
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
