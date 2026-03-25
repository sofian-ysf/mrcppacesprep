'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { useSubscription } from '@/app/hooks/useSubscription'
import { useEffect, useState, Suspense } from 'react'
import AccessControl from '@/app/components/AccessControl'
import { Question, UserAnswer } from '@/app/types/questions'
import SBAQuestion from '@/app/components/questions/SBAQuestion'
import EMQQuestion from '@/app/components/questions/EMQQuestion'
import CalculationQuestion from '@/app/components/questions/CalculationQuestion'
import QuestionFeedback from '@/app/components/questions/QuestionFeedback'
import { CalculationToolsDrawer } from '@/app/components/calculation-tools'
import { getStoredGclid } from '@/app/components/GclidCapture'

function PracticeContent() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { accessType, trial } = useSubscription()
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

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
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setSubscribing(false)
    }
  }

  // Answer state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [emqAnswers, setEmqAnswers] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [enhancedExplanation, setEnhancedExplanation] = useState<string | null>(null)
  const [explanationStructured, setExplanationStructured] = useState<{
    summary: string
    key_points: string[]
    clinical_pearl: string
    why_wrong: Record<string, string>
    exam_tip: string
    related_topics: string[]
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Session tracking
  const [answers, setAnswers] = useState<UserAnswer[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [sessionComplete, setSessionComplete] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [correctAnswer, setCorrectAnswer] = useState<string>('')

  // Exit confirmation modal
  const [showExitModal, setShowExitModal] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (!sessionComplete) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime, sessionComplete])

  // Handle browser close/refresh - warn user about leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!sessionComplete && questions.length > 0) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [sessionComplete, questions.length])

  // Handle navigation attempt
  const handleNavigationAttempt = (href: string) => {
    if (!sessionComplete && questions.length > 0) {
      setPendingNavigation(href)
      setShowExitModal(true)
    } else {
      router.push(href)
    }
  }

  // Confirm exit and navigate
  const confirmExit = () => {
    setShowExitModal(false)
    if (pendingNavigation) {
      // Clear the session and navigate
      const sessionKey = getSessionKey()
      sessionStorage.removeItem(sessionKey)
      router.push(pendingNavigation)
    } else {
      // Just end the session (show results)
      setSessionComplete(true)
    }
  }

  // Cancel exit
  const cancelExit = () => {
    setShowExitModal(false)
    setPendingNavigation(null)
  }

  // Format time as MM:SS or HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Generate a session key based on URL params
  const getSessionKey = () => {
    const categories = searchParams.get('categories') || ''
    const difficulties = searchParams.get('difficulties') || ''
    const type = searchParams.get('type') || ''
    return `practice_session_${categories}_${difficulties}_${type}`
  }

  // Fetch questions on mount or restore from session
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const sessionKey = getSessionKey()

        // Try to restore session from sessionStorage
        const savedSession = sessionStorage.getItem(sessionKey)
        if (savedSession) {
          try {
            const session = JSON.parse(savedSession)
            setQuestions(session.questions)
            setAnswers(session.answers || [])
            setCurrentIndex(session.currentIndex || 0)
            setStartTime(session.startTime || Date.now())
            setElapsedTime(Math.floor((Date.now() - (session.startTime || Date.now())) / 1000))
            setQuestionStartTime(Date.now())
            setLoading(false)
            return
          } catch {
            // Invalid session data, fetch fresh
            sessionStorage.removeItem(sessionKey)
          }
        }

        const categories = searchParams.get('categories')
        const difficulties = searchParams.get('difficulties')
        const type = searchParams.get('type')
        const isDue = searchParams.get('due') === 'true'
        const limit = searchParams.get('limit') || '50'
        const questionIds = searchParams.get('question_ids')

        let res: Response

        if (isDue) {
          // Fetch questions due for review
          res = await fetch(`/api/questions/due?details=true&limit=${limit}`)
        } else {
          const params = new URLSearchParams()
          if (categories) params.set('categories', categories)
          if (difficulties) params.set('difficulties', difficulties)
          if (type) params.set('type', type)
          if (questionIds) params.set('question_ids', questionIds)
          params.set('random', 'true')
          params.set('limit', limit)
          res = await fetch(`/api/questions?${params.toString()}`)
        }
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Please log in to practice questions')
          }
          throw new Error('Failed to fetch questions')
        }

        const data = await res.json()

        // Handle both regular questions API and due questions API response formats
        const fetchedQuestions = data.questions || []
        if (fetchedQuestions.length === 0) {
          throw new Error(isDue
            ? 'No questions due for review'
            : 'No questions found matching your criteria'
          )
        }

        const now = Date.now()
        setQuestions(fetchedQuestions)
        setStartTime(now)
        setQuestionStartTime(now)

        // Save new session to sessionStorage
        sessionStorage.setItem(sessionKey, JSON.stringify({
          questions: fetchedQuestions,
          answers: [],
          currentIndex: 0,
          startTime: now
        }))
      } catch (err) {
        console.error('Error fetching questions:', err)
        setError(err instanceof Error ? err.message : 'Failed to load questions')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchQuestions()
    }
  }, [user, searchParams])

  const currentQuestion = questions[currentIndex]

  // Save session state to sessionStorage whenever it changes
  useEffect(() => {
    if (questions.length > 0 && !sessionComplete) {
      const sessionKey = getSessionKey()
      sessionStorage.setItem(sessionKey, JSON.stringify({
        questions,
        answers,
        currentIndex,
        startTime
      }))
    }
  }, [questions, answers, currentIndex, startTime, sessionComplete])

  // Clear session when practice is complete
  useEffect(() => {
    if (sessionComplete) {
      const sessionKey = getSessionKey()
      sessionStorage.removeItem(sessionKey)
    }
  }, [sessionComplete])

  // Handle answer state when moving to a question
  useEffect(() => {
    const question = questions[currentIndex]
    if (!question) return

    // Check if this question was already answered
    const previousAnswer = answers.find(a => a.question_id === question.id)

    if (previousAnswer) {
      // Restore the previous answer state
      setSelectedAnswer(previousAnswer.selected_answer)
      setIsCorrect(previousAnswer.is_correct)
      setShowFeedback(true)
      // For EMQ, parse the stored answer
      if (question.question_type === 'emq') {
        try {
          setEmqAnswers(JSON.parse(previousAnswer.selected_answer))
        } catch {
          setEmqAnswers([])
        }
      }
    } else {
      // Reset for a new unanswered question
      setSelectedAnswer(null)
      setEmqAnswers([])
      setShowFeedback(false)
      setIsCorrect(false)
      setExplanation('')
      setExplanationStructured(null)
      setQuestionStartTime(Date.now())
    }
  }, [currentIndex, questions, answers])

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleEMQAnswer = (scenarioIndex: number, answer: string) => {
    setEmqAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[scenarioIndex] = answer
      return newAnswers
    })
  }

  const handleSubmit = async () => {
    if (!currentQuestion) return

    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000)
    let answerToSubmit: string

    if (currentQuestion.question_type === 'emq') {
      answerToSubmit = JSON.stringify(emqAnswers)
    } else {
      answerToSubmit = selectedAnswer || ''
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/questions/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          selected_answer: answerToSubmit,
          time_taken_seconds: timeTaken
        })
      })

      if (!res.ok) throw new Error('Failed to submit answer')

      const data = await res.json()

      setIsCorrect(data.is_correct)
      setExplanation(data.explanation)
      setEnhancedExplanation(data.enhanced_explanation || null)
      setExplanationStructured(data.explanation_structured || null)
      setCorrectAnswer(data.correct_answer || '')
      setShowFeedback(true)

      // Update streak
      if (data.is_correct) {
        setCurrentStreak(prev => prev + 1)
      } else {
        setCurrentStreak(0)
      }

      // Track the answer
      setAnswers(prev => [...prev, {
        question_id: currentQuestion.id,
        selected_answer: answerToSubmit,
        is_correct: data.is_correct,
        time_taken_seconds: timeTaken
      }])
    } catch (err) {
      console.error('Error submitting answer:', err)
      // Still show feedback even if save fails
      setShowFeedback(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setSessionComplete(true)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const handleGoToQuestion = (index: number) => {
    setCurrentIndex(index)
  }

  const getQuestionStatus = (index: number): 'current' | 'correct' | 'incorrect' | 'unanswered' => {
    if (index === currentIndex) return 'current'
    const answer = answers.find(a => a.question_id === questions[index]?.id)
    if (!answer) return 'unanswered'
    return answer.is_correct ? 'correct' : 'incorrect'
  }

  const canSubmit = () => {
    if (!currentQuestion) return false

    if (currentQuestion.question_type === 'emq') {
      // For EMQ, all scenarios must be answered
      try {
        const scenarios = JSON.parse(currentQuestion.correct_answer)
        return emqAnswers.filter(Boolean).length === scenarios.length
      } catch {
        return false
      }
    }

    if (currentQuestion.question_type === 'calculation') {
      // For calculation, need a non-empty answer
      return selectedAnswer !== null && selectedAnswer.trim() !== ''
    }

    return selectedAnswer !== null
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4] pt-20">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4] pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to practice</h2>
          <Link href="/login" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4] pt-20">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">Try adjusting your filters or check back later.</p>
          <Link
            href="/dashboard/question-bank"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors inline-block"
          >
            Back to Question Bank
          </Link>
        </div>
      </div>
    )
  }

  // Session complete - show results
  if (sessionComplete) {
    const correctCount = answers.filter(a => a.is_correct).length
    const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0

    return (
      <AccessControl showTrialBanner={false}>
        <div className="min-h-screen bg-[#fbfaf4]">
          {/* Fixed Header with Navbar */}
          <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14">
                {/* Left - Logo & Nav */}
                <div className="flex items-center space-x-8">
                  <Link href="/" className="flex items-center space-x-2">
                    <Image src="/logo.png" alt="PreRegExamPrep" width={28} height={28} className="rounded" />
                    <span className="font-semibold text-gray-900">PreRegExamPrep</span>
                  </Link>
                  <nav className="hidden md:flex items-center space-x-1">
                    <Link href="/dashboard" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link href="/dashboard/progress" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                      Progress
                    </Link>
                    <Link href="/dashboard/question-bank" className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-full">
                      Questions
                    </Link>
                    <Link href="/dashboard/flashcards" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                      Flashcards
                    </Link>
                    <Link href="/blog" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                      Blog
                    </Link>
                  </nav>
                </div>
                {/* Right - User (Desktop) */}
                <div className="hidden md:flex items-center space-x-3">
                  {/* Subscribe button for non-subscribed users */}
                  {accessType !== 'subscription' && (
                    <button
                      onClick={handleSubscribe}
                      disabled={subscribing}
                      className="text-sm font-medium text-white bg-black px-4 py-1.5 rounded-full hover:bg-gray-800 disabled:opacity-50"
                    >
                      {subscribing ? 'Loading...' : 'Subscribe'}
                    </button>
                  )}
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
                    href="/dashboard/question-bank"
                    className="block px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Questions
                  </Link>
                  <Link
                    href="/dashboard/flashcards"
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
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
                    {/* Subscribe button for non-subscribed users (mobile) */}
                    {accessType !== 'subscription' && (
                      <button
                        onClick={() => {
                          handleSubscribe()
                          setMobileMenuOpen(false)
                        }}
                        disabled={subscribing}
                        className="w-full text-left px-3 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg mb-2 disabled:opacity-50"
                      >
                        {subscribing ? 'Loading...' : 'Subscribe'}
                      </button>
                    )}
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
                  <Link href="/dashboard/question-bank" className="hover:text-gray-900">Question Bank</Link>
                  <span>/</span>
                  <span className="text-gray-900">Results</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '96px' }} className="pb-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                accuracy >= 70 ? 'bg-green-100' : accuracy >= 50 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <span className={`text-3xl font-bold ${
                  accuracy >= 70 ? 'text-green-600' : accuracy >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {accuracy}%
                </span>
              </div>

              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Practice Complete!</h1>
              <p className="text-gray-600 mb-8">
                {accuracy >= 70 ? 'Excellent work!' : accuracy >= 50 ? 'Good effort! Keep practicing.' : 'Keep studying and try again!'}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-[#fbfaf4] rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">{correctCount}</p>
                  <p className="text-sm text-gray-600">Correct</p>
                </div>
                <div className="bg-[#fbfaf4] rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">{answers.length - correctCount}</p>
                  <p className="text-sm text-gray-600">Incorrect</p>
                </div>
                <div className="bg-[#fbfaf4] rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900 font-mono">{formatTime(elapsedTime)}</p>
                  <p className="text-sm text-gray-600">Time</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link
                  href="/dashboard/question-bank"
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-[#fbfaf4] transition-colors"
                >
                  Back to Question Bank
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Practice Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </AccessControl>
    )
  }

  // Calculate score
  const correctCount = answers.filter(a => a.is_correct).length
  const answeredCount = answers.length
  const scorePercentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0

  // Content padding (no banner, just header + breadcrumb)
  const contentPaddingTop = '96px'

  // Exit Confirmation Modal
  const ExitConfirmationModal = () => {
    if (!showExitModal) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={cancelExit}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl transform transition-all">
          {/* Warning Icon */}
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            End Practice Session?
          </h3>

          <p className="text-gray-600 text-center mb-6">
            Your practice session is still in progress. If you leave now, your current progress will be saved but the session will end.
          </p>

          {/* Progress Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">{answers.length}</p>
                <p className="text-xs text-gray-500">Answered</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{questions.length - answers.length}</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 font-mono">{formatTime(elapsedTime)}</p>
                <p className="text-xs text-gray-500">Time</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={cancelExit}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Continue Practice
            </button>
            <button
              onClick={confirmExit}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Practice view
  return (
    <AccessControl showTrialBanner={false}>
      <div className="min-h-screen bg-[#fbfaf4]">
        {/* Exit Confirmation Modal */}
        <ExitConfirmationModal />
        {/* Fixed Header with Navbar */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
          {/* Main Navigation */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              {/* Left - Logo & Nav */}
              <div className="flex items-center space-x-8">
                <button onClick={() => handleNavigationAttempt('/')} className="flex items-center space-x-2">
                  <Image src="/logo.png" alt="PreRegExamPrep" width={28} height={28} className="rounded" />
                  <span className="font-semibold text-gray-900">PreRegExamPrep</span>
                </button>
                <nav className="hidden md:flex items-center space-x-1">
                  <button onClick={() => handleNavigationAttempt('/dashboard')} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                    Dashboard
                  </button>
                  <button onClick={() => handleNavigationAttempt('/dashboard/progress')} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                    Progress
                  </button>
                  <button onClick={() => handleNavigationAttempt('/dashboard/question-bank')} className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-full">
                    Questions
                  </button>
                  <button onClick={() => handleNavigationAttempt('/blog')} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                    Blog
                  </button>
                </nav>
              </div>
              {/* Right - User (Desktop) */}
              <div className="hidden md:flex items-center space-x-3">
                {/* Subscribe button for non-subscribed users */}
                {accessType !== 'subscription' && (
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className="text-sm font-medium text-white bg-black px-4 py-1.5 rounded-full hover:bg-gray-800 disabled:opacity-50"
                  >
                    {subscribing ? 'Loading...' : 'Subscribe'}
                  </button>
                )}
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
                <button
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleNavigationAttempt('/dashboard')
                  }}
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleNavigationAttempt('/dashboard/progress')
                  }}
                >
                  Progress
                </button>
                <button
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleNavigationAttempt('/dashboard/question-bank')
                  }}
                >
                  Questions
                </button>
                <button
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleNavigationAttempt('/blog')
                  }}
                >
                  Blog
                </button>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                  </div>
                  {/* Subscribe button for non-subscribed users (mobile) */}
                  {accessType !== 'subscription' && (
                    <button
                      onClick={() => {
                        handleSubscribe()
                        setMobileMenuOpen(false)
                      }}
                      disabled={subscribing}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg mb-2 disabled:opacity-50"
                    >
                      {subscribing ? 'Loading...' : 'Subscribe'}
                    </button>
                  )}
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
          {/* Breadcrumb with Trial Info and End Session */}
          <div className="border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <button onClick={() => handleNavigationAttempt('/dashboard')} className="hover:text-gray-900">Dashboard</button>
                  <span>/</span>
                  <button onClick={() => handleNavigationAttempt('/dashboard/question-bank')} className="hover:text-gray-900">Question Bank</button>
                  <span>/</span>
                  <span className="text-gray-900">Practice</span>
                </div>
                <div className="flex items-center gap-4">
                  {/* Trial info - compact inline display */}
                  {accessType === 'trial' && trial && (
                    <span className="text-xs text-gray-500">
                      <span className="font-medium text-gray-700">{trial.questionsRemaining}</span> questions left
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setPendingNavigation(null)
                      setShowExitModal(true)
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    End Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div style={{ paddingTop: contentPaddingTop }} className="pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Question Content - Left Side */}
            <div className="flex-1 order-2 lg:order-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Question Metadata */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-gray-900">
                    Question {currentIndex + 1}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                    {currentQuestion.question_type.toUpperCase()}
                  </span>
                  {currentQuestion.question_categories && (
                    <span className="text-xs text-gray-500">
                      {currentQuestion.question_categories.name}
                    </span>
                  )}
                </div>

                {/* Question Display */}
                {currentQuestion.question_type === 'emq' ? (
                  <EMQQuestion
                    question={currentQuestion}
                    selectedAnswers={emqAnswers}
                    onSelectAnswer={handleEMQAnswer}
                    showFeedback={showFeedback}
                  />
                ) : currentQuestion.question_type === 'calculation' ? (
                  <CalculationQuestion
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelectAnswer={handleSelectAnswer}
                    showFeedback={showFeedback}
                    isCorrect={isCorrect}
                  />
                ) : (
                  <SBAQuestion
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelectAnswer={handleSelectAnswer}
                    showFeedback={showFeedback}
                    isCorrect={isCorrect}
                  />
                )}

                {/* Feedback */}
                {showFeedback && (
                  <QuestionFeedback
                    isCorrect={isCorrect}
                    explanation={explanation}
                    enhancedExplanation={enhancedExplanation}
                    explanationStructured={explanationStructured}
                    questionType={currentQuestion.question_type}
                    onNext={handleNext}
                    isLastQuestion={currentIndex === questions.length - 1}
                    questionId={currentQuestion.id}
                    correctAnswer={correctAnswer}
                    options={currentQuestion.options}
                    streakCount={currentStreak}
                  />
                )}

                {/* Action Buttons */}
                {!showFeedback && (
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleSkip}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-[#fbfaf4] transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit() || submitting}
                      className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Answer'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Sidebar - Right Side */}
            <div className="w-full lg:w-72 order-1 lg:order-2 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6 lg:sticky lg:top-24">
                {/* Score and Timer */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-2xl font-bold text-gray-900">{scorePercentage}%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {correctCount}/{answeredCount}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="text-2xl font-bold text-gray-900 font-mono">{formatTime(elapsedTime)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      elapsed
                    </p>
                  </div>
                </div>

                {/* Question Navigator */}
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-900 mb-3">Questions</p>
                  <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                    {questions.map((_, index) => {
                      const status = getQuestionStatus(index)
                      return (
                        <button
                          key={index}
                          onClick={() => handleGoToQuestion(index)}
                          className={`
                            w-full aspect-square rounded-lg text-sm font-medium transition-all
                            flex items-center justify-center
                            ${status === 'current'
                              ? 'bg-black text-white'
                              : status === 'correct'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : status === 'incorrect'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                          `}
                        >
                          {index + 1}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-black"></span>
                      <span className="text-gray-600">Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-green-100 border border-green-200"></span>
                      <span className="text-gray-600">Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-red-100 border border-red-200"></span>
                      <span className="text-gray-600">Incorrect</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></span>
                      <span className="text-gray-600">Unanswered</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Tools - only for calculation questions */}
                {currentQuestion.question_type === 'calculation' && (
                  <CalculationToolsDrawer />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccessControl>
  )
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4] pt-20">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PracticeContent />
    </Suspense>
  )
}
