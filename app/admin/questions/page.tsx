'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Question {
  id: string
  category_id: string
  question_type: 'sba' | 'emq' | 'calculation'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  question_text: string
  options: { letter: string; text: string }[] | null
  correct_answer: string
  explanation: string
  status: 'draft' | 'review' | 'approved' | 'archived'
  created_at: string
  question_categories: { name: string; slug: string }
}

interface Category {
  id: string
  name: string
}

export default function QuestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Filters
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '')
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '')
  const [difficultyFilter, setDifficultyFilter] = useState(searchParams.get('difficulty') || '')

  // Selected question for preview
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [approveAllLoading, setApproveAllLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchQuestions()
    setSelectedIds(new Set()) // Clear selections when filters/page change
  }, [page, statusFilter, categoryFilter, typeFilter, difficultyFilter])

  async function fetchCategories() {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  async function fetchQuestions() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      if (statusFilter) params.set('status', statusFilter)
      if (categoryFilter) params.set('category', categoryFilter)
      if (typeFilter) params.set('type', typeFilter)
      if (difficultyFilter) params.set('difficulty', difficultyFilter)

      const response = await fetch(`/api/admin/questions?${params}`)
      const data = await response.json()

      setQuestions(data.questions || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error('Failed to fetch questions:', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateQuestionStatus(id: string, status: string) {
    try {
      await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      fetchQuestions()
    } catch (err) {
      console.error('Failed to update question:', err)
    }
  }

  async function deleteQuestion(id: string) {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      await fetch('/api/admin/questions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      fetchQuestions()
      setSelectedQuestion(null)
    } catch (err) {
      console.error('Failed to delete question:', err)
    }
  }

  // Bulk selection helpers
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

  async function bulkApprove() {
    if (selectedIds.size === 0) return
    if (!confirm(`Approve ${selectedIds.size} question(s)?`)) return

    setBulkLoading(true)
    try {
      await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), status: 'approved' })
      })
      setSelectedIds(new Set())
      fetchQuestions()
    } catch (err) {
      console.error('Failed to bulk approve:', err)
    } finally {
      setBulkLoading(false)
    }
  }

  async function approveAll() {
    // Count how many questions can be approved (exclude already approved if filtering by status=approved)
    const countToApprove = statusFilter === 'approved' ? 0 : total
    if (countToApprove === 0) return

    if (!confirm(`Approve all ${countToApprove} question(s) matching current filters across all pages?`)) return

    setApproveAllLoading(true)
    try {
      const response = await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approveAll: true,
          status: 'approved',
          filters: {
            status: statusFilter || undefined,
            category: categoryFilter || undefined,
            type: typeFilter || undefined,
            difficulty: difficultyFilter || undefined
          }
        })
      })
      const data = await response.json()
      alert(`Successfully approved ${data.updated} question(s)`)
      setSelectedIds(new Set())
      fetchQuestions()
    } catch (err) {
      console.error('Failed to approve all:', err)
      alert('Failed to approve questions')
    } finally {
      setApproveAllLoading(false)
    }
  }

  // Get count of non-approved selected questions
  const approvableCount = questions.filter(q => selectedIds.has(q.id) && q.status !== 'approved').length

  // Check if approve all should be enabled (not filtering by approved status only)
  const canApproveAll = statusFilter !== 'approved' && total > 0

  return (
    <div className="flex gap-6">
      {/* Questions List */}
      <div className="flex-1">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Types</option>
              <option value="sba">SBA</option>
              <option value="emq">EMQ</option>
              <option value="calculation">Calculation</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => { setDifficultyFilter(e.target.value); setPage(1) }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <div className="ml-auto flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {total} questions found
              </span>
              {canApproveAll && (
                <button
                  onClick={approveAll}
                  disabled={approveAllLoading}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {approveAllLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Approving...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve All
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedIds.size} question{selectedIds.size !== 1 ? 's' : ''} selected
              {approvableCount > 0 && approvableCount !== selectedIds.size && (
                <span className="text-blue-600 ml-1">
                  ({approvableCount} can be approved)
                </span>
              )}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Selection
              </button>
              <button
                onClick={bulkApprove}
                disabled={bulkLoading || approvableCount === 0}
                className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {bulkLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Approving...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve Selected
                  </>
                )}
              </button>
            </div>
          </div>
        )}

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
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Difficulty</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr
                      key={question.id}
                      className={`border-t border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedQuestion?.id === question.id ? 'bg-blue-50' : ''
                      } ${selectedIds.has(question.id) ? 'bg-blue-50/50' : ''}`}
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(question.id)}
                          onChange={() => toggleSelect(question.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                          {question.question_text}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {question.question_categories?.name || 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 uppercase">
                        {question.question_type}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {question.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          question.status === 'approved' ? 'bg-green-100 text-green-700' :
                          question.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                          question.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {question.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {question.status !== 'approved' && (
                            <button
                              onClick={() => updateQuestionStatus(question.id, 'approved')}
                              className="text-green-600 hover:text-green-800"
                              title="Approve"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
              No questions found
            </div>
          )}
        </div>
      </div>

      {/* Question Preview Panel */}
      {selectedQuestion && (
        <div className="w-96 bg-white rounded-xl border border-gray-200 p-6 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Question Preview</h3>
            <button
              onClick={() => setSelectedQuestion(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* EMQ Display */}
            {selectedQuestion.question_type.toLowerCase() === 'emq' ? (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Theme</p>
                  <p className="text-gray-900 font-medium">{selectedQuestion.question_text}</p>
                </div>

                {selectedQuestion.options && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Options</p>
                    <div className="space-y-1">
                      {selectedQuestion.options.map((opt) => (
                        <div key={opt.letter} className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                          <span className="font-medium">{opt.letter}.</span> {opt.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Scenarios</p>
                  <div className="space-y-3">
                    {(() => {
                      try {
                        const scenarios = JSON.parse(selectedQuestion.correct_answer)
                        return scenarios.map((scenario: { stem: string; correct_answer: string }, idx: number) => (
                          <div key={idx} className="p-3 bg-blue-50 border border-blue-100 rounded">
                            <p className="text-sm text-gray-800 mb-2">
                              <span className="font-medium text-blue-700">Scenario {idx + 1}:</span> {scenario.stem}
                            </p>
                            <p className="text-sm text-green-700 font-medium">
                              Answer: {scenario.correct_answer}
                            </p>
                          </div>
                        ))
                      } catch {
                        return <p className="text-sm text-red-500">Unable to parse scenarios</p>
                      }
                    })()}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Explanation</p>
                  <p className="text-gray-700 text-sm">{selectedQuestion.explanation}</p>
                </div>
              </>
            ) : (
              /* SBA and Calculation Display */
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Question</p>
                  <p className="text-gray-900">{selectedQuestion.question_text}</p>
                </div>

                {selectedQuestion.options && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Options</p>
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

                {!selectedQuestion.options && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Correct Answer</p>
                    <p className="text-green-700 font-medium">{selectedQuestion.correct_answer}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Explanation</p>
                  <p className="text-gray-700 text-sm">{selectedQuestion.explanation}</p>
                </div>
              </>
            )}

            <div className="pt-4 border-t border-gray-200 flex gap-2">
              {selectedQuestion.status !== 'approved' && (
                <button
                  onClick={() => updateQuestionStatus(selectedQuestion.id, 'approved')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => deleteQuestion(selectedQuestion.id)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
