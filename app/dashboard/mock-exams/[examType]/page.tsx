'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { useSubscription } from '@/app/hooks/useSubscription'
import { useEffect, useState, useCallback } from 'react'
import AccessControl from '@/app/components/AccessControl'
import { Question } from '@/app/types/questions'
import SBAQuestion from '@/app/components/questions/SBAQuestion'
import EMQQuestion from '@/app/components/questions/EMQQuestion'
import CalculationQuestion from '@/app/components/questions/CalculationQuestion'
import { getStoredGclid } from '@/app/components/GclidCapture'

interface ExamAnswer {
  questionId: string
  selectedAnswer: string
  isCorrect?: boolean
}

interface ExamInfo {
  type: string
  name: string
  duration: number
  questionCount: number
}

export default function MockExamSession() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const { accessType } = useSubscription()
  const examType = params.examType as string

  // State
  const [examInfo, setExamInfo] = useState<ExamInfo | null>(null)
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
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Answer state
  const [answers, setAnswers] = useState<Map<string, ExamAnswer>>(new Map())
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [emqAnswers, setEmqAnswers] = useState<string[]>([])

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0) // in seconds
  const [examStarted, setExamStarted] = useState(false)
  const [examStartTime, setExamStartTime] = useState<number>(0)
  const [examFinished, setExamFinished] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [timeTaken, setTimeTaken] = useState(0)

  // Fetch exam questions
  useEffect(() => {
    async function fetchExam() {
      try {
        const res = await fetch(`/api/mock-exams?type=${examType}`)
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Please log in to take mock exams')
          }
          throw new Error('Failed to fetch exam')
        }

        const data = await res.json()

        if (!data.questions || data.questions.length === 0) {
          throw new Error('No questions available for this exam')
        }

        setExamInfo(data.exam)
        setQuestions(data.questions)
        setTimeRemaining(data.exam.duration * 60) // Convert to seconds
      } catch (err) {
        console.error('Error fetching exam:', err)
        setError(err instanceof Error ? err.message : 'Failed to load exam')
      } finally {
        setLoading(false)
      }
    }

    if (user && examType) {
      fetchExam()
    }
  }, [user, examType])

  // Timer countdown
  useEffect(() => {
    if (!examStarted || examFinished || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setExamFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [examStarted, examFinished, timeRemaining])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && examStarted && !showResults) {
      handleFinishExam()
    }
  }, [timeRemaining, examStarted, showResults])

  const currentQuestion = questions[currentIndex]

  // Load saved answer when changing questions
  useEffect(() => {
    if (!currentQuestion) return

    const savedAnswer = answers.get(currentQuestion.id)
    if (savedAnswer) {
      if (currentQuestion.question_type === 'emq') {
        try {
          setEmqAnswers(JSON.parse(savedAnswer.selectedAnswer))
        } catch {
          setEmqAnswers([])
        }
      } else {
        setSelectedAnswer(savedAnswer.selectedAnswer)
      }
    } else {
      setSelectedAnswer(null)
      setEmqAnswers([])
    }
  }, [currentIndex, currentQuestion, answers])

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

  const saveCurrentAnswer = useCallback(() => {
    if (!currentQuestion) return

    let answerToSave: string
    if (currentQuestion.question_type === 'emq') {
      answerToSave = JSON.stringify(emqAnswers)
    } else {
      answerToSave = selectedAnswer || ''
    }

    if (answerToSave) {
      setAnswers(prev => {
        const newAnswers = new Map(prev)
        newAnswers.set(currentQuestion.id, {
          questionId: currentQuestion.id,
          selectedAnswer: answerToSave
        })
        return newAnswers
      })
    }
  }, [currentQuestion, selectedAnswer, emqAnswers])

  const handleNext = () => {
    saveCurrentAnswer()
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    saveCurrentAnswer()
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleGoToQuestion = (index: number) => {
    saveCurrentAnswer()
    setCurrentIndex(index)
  }

  const getQuestionStatus = (index: number): 'current' | 'answered' | 'unanswered' => {
    if (index === currentIndex) return 'current'
    const question = questions[index]
    return answers.has(question?.id) ? 'answered' : 'unanswered'
  }

  const handleFinishExam = async () => {
    saveCurrentAnswer()
    setSubmitting(true)

    // Calculate time taken
    const examTimeTaken = examStartTime > 0 ? Math.floor((Date.now() - examStartTime) / 1000) : 0
    setTimeTaken(examTimeTaken)

    // Grade all answers
    const gradedAnswers = new Map<string, ExamAnswer>()
    let correctCount = 0

    for (const question of questions) {
      const answer = answers.get(question.id)
      if (answer) {
        let isCorrect = false

        if (question.question_type === 'emq') {
          try {
            const selectedAnswers = JSON.parse(answer.selectedAnswer)
            const correctAnswers = JSON.parse(question.correct_answer)
            isCorrect = correctAnswers.every((scenario: { correct_answer: string }, index: number) => {
              return selectedAnswers[index] === scenario.correct_answer
            })
          } catch {
            isCorrect = false
          }
        } else {
          isCorrect = answer.selectedAnswer.toLowerCase() === question.correct_answer.toLowerCase()
        }

        if (isCorrect) correctCount++

        gradedAnswers.set(question.id, {
          ...answer,
          isCorrect
        })

        // Save individual answer to database
        try {
          await fetch('/api/questions/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question_id: question.id,
              selected_answer: answer.selectedAnswer,
              time_taken_seconds: 0
            })
          })
        } catch (err) {
          console.error('Error saving answer:', err)
        }
      }
    }

    // Save exam result to history
    try {
      const scorePercentage = Math.round((correctCount / questions.length) * 100)
      await fetch('/api/mock-exams/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_type: examInfo?.type,
          exam_name: examInfo?.name,
          total_questions: questions.length,
          answered_questions: gradedAnswers.size,
          correct_answers: correctCount,
          score_percentage: scorePercentage,
          time_taken_seconds: examTimeTaken,
          time_limit_seconds: (examInfo?.duration || 0) * 60
        })
      })
    } catch (err) {
      console.error('Error saving exam result:', err)
    }

    setAnswers(gradedAnswers)
    setExamFinished(true)
    setShowResults(true)
    setSubmitting(false)
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to take mock exams</h2>
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
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error}</h2>
          <Link
            href="/dashboard/mock-exams"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors inline-block mt-4"
          >
            Back to Mock Exams
          </Link>
        </div>
      </div>
    )
  }

  // Pre-exam start screen
  if (!examStarted) {
    return (
      <AccessControl>
        <div className="min-h-screen bg-[#fbfaf4] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-lg w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{examInfo?.name}</h1>
            <p className="text-gray-600 mb-6">You are about to start a timed mock exam.</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#fbfaf4] rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{examInfo?.questionCount}</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="bg-[#fbfaf4] rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{examInfo?.duration} min</p>
                <p className="text-sm text-gray-600">Time Limit</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-yellow-800 mb-2">Before you begin:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Ensure you have a stable internet connection</li>
                <li>• The timer will start immediately</li>
                <li>• You can navigate between questions</li>
                <li>• Your exam will auto-submit when time runs out</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Link
                href="/dashboard/mock-exams"
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                onClick={() => {
                  setExamStartTime(Date.now())
                  setExamStarted(true)
                }}
                className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Start Exam
              </button>
            </div>
          </div>
        </div>
      </AccessControl>
    )
  }

  // Results screen
  if (showResults) {
    const totalQuestions = questions.length
    const answeredCount = answers.size
    const correctCount = Array.from(answers.values()).filter(a => a.isCorrect).length
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0
    const overallScore = Math.round((correctCount / totalQuestions) * 100)

    return (
      <AccessControl>
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
                    <Link href="/dashboard/question-bank" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
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
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
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
                  <Link href="/dashboard/mock-exams" className="hover:text-gray-900">Mock Exams</Link>
                  <span>/</span>
                  <span className="text-gray-900">Results</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '8px', paddingTop: '16px' }} className="pb-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center mb-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                overallScore >= 70 ? 'bg-green-100' : overallScore >= 50 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <span className={`text-4xl font-bold ${
                  overallScore >= 70 ? 'text-green-600' : overallScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {overallScore}%
                </span>
              </div>

              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {examInfo?.name} Complete!
              </h1>
              <p className="text-gray-600 mb-8">
                {overallScore >= 70 ? 'Excellent work! You passed!' : overallScore >= 50 ? 'Good effort! Keep practicing.' : 'Keep studying and try again!'}
              </p>

              <div className="grid grid-cols-5 gap-3 mb-8">
                <div className="bg-[#fbfaf4] rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">{correctCount}</p>
                  <p className="text-sm text-gray-600">Correct</p>
                </div>
                <div className="bg-[#fbfaf4] rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">{answeredCount - correctCount}</p>
                  <p className="text-sm text-gray-600">Incorrect</p>
                </div>
                <div className="bg-[#fbfaf4] rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">{totalQuestions - answeredCount}</p>
                  <p className="text-sm text-gray-600">Skipped</p>
                </div>
                <div className="bg-[#fbfaf4] rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">{accuracy}%</p>
                  <p className="text-sm text-gray-600">Accuracy</p>
                </div>
                <div className="bg-[#fbfaf4] rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900 font-mono">{formatTime(timeTaken)}</p>
                  <p className="text-sm text-gray-600">Time</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link
                  href="/dashboard/mock-exams"
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-[#fbfaf4] transition-colors"
                >
                  Back to Mock Exams
                </Link>
                <Link
                  href="/dashboard/progress"
                  className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  View Progress
                </Link>
              </div>
            </div>

            {/* Question Review */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Question Review</h2>
              <div className="space-y-3">
                {questions.map((question, index) => {
                  const answer = answers.get(question.id)
                  const status = !answer ? 'unanswered' : answer.isCorrect ? 'correct' : 'incorrect'

                  return (
                    <div
                      key={question.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        status === 'correct' ? 'bg-green-50 border-green-200' :
                        status === 'incorrect' ? 'bg-red-50 border-red-200' :
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          status === 'correct' ? 'bg-green-100 text-green-700' :
                          status === 'incorrect' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {question.question_text.substring(0, 60)}...
                          </p>
                          <p className="text-xs text-gray-500">
                            {question.question_categories?.name} • {question.difficulty}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        status === 'correct' ? 'bg-green-100 text-green-700' :
                        status === 'incorrect' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {status === 'correct' ? 'Correct' : status === 'incorrect' ? 'Incorrect' : 'Skipped'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </AccessControl>
    )
  }

  // Exam in progress
  return (
    <AccessControl>
      <div className="min-h-screen bg-[#fbfaf4]">
        {/* Header with Timer */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{examInfo?.name}</h1>
                <p className="text-sm text-gray-600">
                  Question {currentIndex + 1} of {questions.length}
                </p>
              </div>
              <div className={`text-right ${timeRemaining < 300 ? 'text-red-600' : ''}`}>
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className={`text-2xl font-bold font-mono ${timeRemaining < 300 ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Question Content */}
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
                </div>

                {/* Question Display */}
                {currentQuestion.question_type === 'emq' ? (
                  <EMQQuestion
                    question={currentQuestion}
                    selectedAnswers={emqAnswers}
                    onSelectAnswer={handleEMQAnswer}
                    showFeedback={false}
                  />
                ) : currentQuestion.question_type === 'calculation' ? (
                  <CalculationQuestion
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelectAnswer={handleSelectAnswer}
                    showFeedback={false}
                    isCorrect={false}
                  />
                ) : (
                  <SBAQuestion
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelectAnswer={handleSelectAnswer}
                    showFeedback={false}
                    isCorrect={false}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-[#fbfaf4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="flex-1 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to submit your exam? You cannot change your answers after submission.')) {
                          handleFinishExam()
                        }
                      }}
                      disabled={submitting}
                      className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Exam'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Question Navigator Sidebar */}
            <div className="w-full lg:w-72 order-1 lg:order-2 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6 lg:sticky lg:top-24">
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Answered</span>
                    <span className="font-medium text-gray-900">{answers.size} / {questions.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all"
                      style={{ width: `${(answers.size / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question Grid */}
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
                            : status === 'answered'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
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
                      <span className="text-gray-600">Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></span>
                      <span className="text-gray-600">Unanswered</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to submit your exam? You cannot change your answers after submission.')) {
                      handleFinishExam()
                    }
                  }}
                  disabled={submitting}
                  className="w-full mt-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Finish & Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccessControl>
  )
}
