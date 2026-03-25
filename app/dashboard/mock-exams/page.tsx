'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSubscription } from '@/app/hooks/useSubscription'
import UpgradePrompt from '@/app/components/UpgradePrompt'
import { DashboardLayout } from '@/app/components/dashboard'

interface MockExam {
  id: string
  name: string
  description: string
  duration: number
  questionCount: number
  type: 'full' | 'mini' | 'calculation'
}

interface ExamResult {
  id: string
  exam_type: string
  exam_name: string
  total_questions: number
  answered_questions: number
  correct_answers: number
  score_percentage: number
  time_taken_seconds: number
  time_limit_seconds: number
  completed_at: string
}

interface ExamSummary {
  totalExams: number
  averageScore: number
  bestScore: number
  totalTimeSeconds: number
}

const mockExams: MockExam[] = [
  {
    id: 'full-exam-1',
    name: 'Full-Length Practice Exam',
    description: 'Complete 110-question exam in 2.5 hours - exactly like the real MRCP PACES exam',
    duration: 150,
    questionCount: 110,
    type: 'full'
  },
  {
    id: 'mini-exam-1',
    name: 'Mini Practice Exam',
    description: 'Focused 25-question exam on clinical topics',
    duration: 30,
    questionCount: 25,
    type: 'mini'
  },
  {
    id: 'calculation-session',
    name: 'Calculation Practice Exam',
    description: 'Intensive calculation practice with time pressure',
    duration: 20,
    questionCount: 15,
    type: 'calculation'
  }
]

export default function MockExamsPage() {
  const router = useRouter()
  const { hasAccess, loading, isLoggedIn } = useSubscription()
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [examHistory, setExamHistory] = useState<ExamResult[]>([])
  const [summary, setSummary] = useState<ExamSummary | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/mock-exams/results')
        if (res.ok) {
          const data = await res.json()
          setExamHistory(data.results || [])
          setSummary(data.summary || null)
        }
      } catch (err) {
        console.error('Error fetching exam history:', err)
      } finally {
        setHistoryLoading(false)
      }
    }

    if (isLoggedIn) {
      fetchHistory()
    }
  }, [isLoggedIn])

  const handleStartExam = (exam: MockExam) => {
    if (!hasAccess) {
      setShowUpgradePrompt(true)
      return
    }
    router.push(`/dashboard/mock-exams/${exam.type}`)
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${hrs}h ${mins}m`
    }
    if (mins > 0) {
      return `${mins}m ${secs}s`
    }
    return `${secs}s`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to access mock exams</h2>
          <Link href="/login" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        isLoggedIn={isLoggedIn}
      />
      <DashboardLayout
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Mock Exams' }
        ]}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Mock Exams</h1>
          <p className="text-gray-600">
            Practice under real exam conditions with timed mock exams and detailed performance analysis
          </p>
        </div>

        {/* Summary Stats */}
        {summary && summary.totalExams > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Exams Taken</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalExams}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{summary.averageScore}%</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Best Score</p>
              <p className="text-2xl font-bold text-green-600">{summary.bestScore}%</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(summary.totalTimeSeconds)}</p>
            </div>
          </div>
        )}

        {/* Exam Types */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {mockExams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.name}</h3>
                <p className="text-sm text-gray-600">{exam.description}</p>
              </div>

              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span className="font-medium">{exam.questionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{exam.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium capitalize">{exam.type}</span>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam)}
                className="w-full py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                {!hasAccess && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                Start Mock Exam
              </button>
            </div>
          ))}
        </div>

        {/* Exam History */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Mock Exam History</h2>

          {historyLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-black rounded-full mx-auto"></div>
            </div>
          ) : examHistory.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-gray-600">No mock exams completed yet</p>
              <p className="text-sm text-gray-500 mt-2">Start your first mock exam to track your progress</p>
            </div>
          ) : (
            <div className="space-y-3">
              {examHistory.map((result) => (
                <div
                  key={result.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    result.score_percentage >= 70
                      ? 'bg-green-50 border-green-200'
                      : result.score_percentage >= 50
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                      result.score_percentage >= 70
                        ? 'bg-green-100 text-green-700'
                        : result.score_percentage >= 50
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {result.score_percentage}%
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{result.exam_name}</p>
                      <p className="text-sm text-gray-600">
                        {result.correct_answers}/{result.total_questions} correct • {formatTime(result.time_taken_seconds)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{formatDate(result.completed_at)}</p>
                    <p className={`text-xs font-medium ${
                      result.score_percentage >= 70
                        ? 'text-green-600'
                        : result.score_percentage >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {result.score_percentage >= 70 ? 'Passed' : result.score_percentage >= 50 ? 'Nearly There' : 'Needs Practice'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  )
}
