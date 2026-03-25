'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface QuestionCategory {
  name: string
}

interface Verification {
  id: string
  is_correct: boolean
  ai_answer: string
  discrepancy_notes: string | null
  confidence_score: number
  status: string
  verified_at: string
}

interface Question {
  id: string
  question_text: string
  options: { letter: string; text: string }[] | null
  correct_answer: string
  explanation: string
  difficulty: string
  status: string
  question_categories: QuestionCategory
  question_verifications: Verification[] | null
}

interface Stats {
  totalCalculations: number
  verified: number
  needsReview: number
  notVerified: number
}

export default function VerifyCalculationsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Verification state
  const [verifying, setVerifying] = useState(false)
  const [verificationProgress, setVerificationProgress] = useState(0)

  // Detail modal
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('status', statusFilter)

      const response = await fetch(`/api/admin/verify-calculations?${params}`)
      const data = await response.json()

      setQuestions(data.questions || [])
      setTotalPages(data.totalPages || 1)
      setStats(data.stats || null)
    } catch (err) {
      console.error('Failed to fetch questions:', err)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => {
    fetchQuestions()
    setSelectedIds(new Set())
  }, [fetchQuestions])

  function toggleSelectAll() {
    if (selectedIds.size === questions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(questions.map(q => q.id)))
    }
  }

  function toggleSelect(id: string) {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  async function handleVerify() {
    if (selectedIds.size === 0) return

    setVerifying(true)
    setVerificationProgress(0)

    try {
      const ids = Array.from(selectedIds)
      const batchSize = 5
      let processed = 0

      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize)

        const response = await fetch('/api/admin/verify-calculations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionIds: batch })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Verification failed')
        }

        processed += batch.length
        setVerificationProgress(Math.round((processed / ids.length) * 100))
      }

      setSelectedIds(new Set())
      fetchQuestions()
    } catch (err) {
      console.error('Verification error:', err)
      alert(`Verification failed: ${err}`)
    } finally {
      setVerifying(false)
      setVerificationProgress(0)
    }
  }

  async function handleMarkAsFixed(questionId: string) {
    try {
      const response = await fetch('/api/admin/verify-calculations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, status: 'fixed' })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      fetchQuestions()
      setSelectedQuestion(null)
    } catch (err) {
      console.error('Error marking as fixed:', err)
      alert('Failed to update status')
    }
  }

  function getVerificationStatus(question: Question) {
    const verification = question.question_verifications?.[0]
    if (!verification) return { status: 'not_verified', label: 'Not Verified', color: 'bg-gray-100 text-gray-700' }
    if (verification.status === 'fixed') return { status: 'fixed', label: 'Fixed', color: 'bg-blue-100 text-blue-700' }
    if (verification.is_correct) return { status: 'verified', label: 'Verified', color: 'bg-green-100 text-green-700' }
    return { status: 'needs_review', label: 'Needs Review', color: 'bg-red-100 text-red-700' }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verify Calculations</h2>
          <p className="text-gray-600 mt-1">Use AI to verify calculation questions are correct</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Calculations</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCalculations}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Verified Correct</p>
            <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Needs Review</p>
            <p className="text-2xl font-bold text-red-600">{stats.needsReview}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Not Verified</p>
            <p className="text-2xl font-bold text-gray-600">{stats.notVerified}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
          >
            <option value="all">All Questions</option>
            <option value="not_verified">Not Verified</option>
            <option value="verified">Verified Correct</option>
            <option value="needs_review">Needs Review</option>
          </select>

          <div className="ml-auto flex items-center gap-3">
            {selectedIds.size > 0 && (
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium flex items-center gap-2"
              >
                {verifying ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Verifying... {verificationProgress}%
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verify {selectedIds.size} Selected
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
          </div>
        ) : questions.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={questions.length > 0 && selectedIds.size === questions.length}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Question</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Answer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">AI Answer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => {
                  const verificationStatus = getVerificationStatus(question)
                  const verification = question.question_verifications?.[0]

                  return (
                    <tr
                      key={question.id}
                      className={`border-t border-gray-100 hover:bg-gray-50 ${
                        selectedIds.has(question.id) ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(question.id)}
                          onChange={() => toggleSelect(question.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900 line-clamp-2 max-w-md">
                          {question.question_text}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {question.question_categories?.name || 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                        {question.correct_answer}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${verificationStatus.color}`}>
                          {verificationStatus.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {verification ? (
                          <span className={`font-mono ${verification.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                            {verification.ai_answer}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedQuestion(question)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">No calculation questions found</p>
          </div>
        )}
      </div>

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Question Details</h3>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Question */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Question</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedQuestion.question_text}</p>
              </div>

              {/* Options */}
              {selectedQuestion.options && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Options</h4>
                  <div className="space-y-2">
                    {selectedQuestion.options.map((opt) => (
                      <div
                        key={opt.letter}
                        className={`p-2 rounded text-sm ${
                          opt.letter === selectedQuestion.correct_answer
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span className="font-medium">{opt.letter}.</span> {opt.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Correct Answer */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Stored Correct Answer</h4>
                <p className="text-green-700 font-mono font-medium">{selectedQuestion.correct_answer}</p>
              </div>

              {/* Explanation */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Stored Explanation</h4>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedQuestion.explanation}</p>
              </div>

              {/* AI Verification Results */}
              {selectedQuestion.question_verifications?.[0] && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Verification Result
                  </h4>

                  <div className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        selectedQuestion.question_verifications[0].is_correct
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedQuestion.question_verifications[0].is_correct ? 'Correct' : 'Incorrect'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Confidence: {Math.round((selectedQuestion.question_verifications[0].confidence_score || 0) * 100)}%
                      </span>
                    </div>

                    {/* AI Answer */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-1">AI's Answer</h5>
                      <p className="font-mono text-blue-700">{selectedQuestion.question_verifications[0].ai_answer}</p>
                    </div>

                    {/* Discrepancy Notes */}
                    {selectedQuestion.question_verifications[0].discrepancy_notes && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-red-800 mb-2">Discrepancies Found</h5>
                        <p className="text-sm text-red-700 whitespace-pre-wrap">
                          {selectedQuestion.question_verifications[0].discrepancy_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-gray-200 pt-6 flex justify-between">
                <Link
                  href={`/admin/questions?search=${encodeURIComponent(selectedQuestion.id)}`}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Edit Question
                </Link>

                <div className="flex gap-3">
                  {selectedQuestion.question_verifications?.[0] && !selectedQuestion.question_verifications[0].is_correct && (
                    <button
                      onClick={() => handleMarkAsFixed(selectedQuestion.id)}
                      className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Mark as Fixed
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
