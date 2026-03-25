'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProgressBar from '@/app/components/admin/ProgressBar'
import QuestionEditor, { type Question } from '@/app/components/admin/QuestionEditor'

interface Category {
  id: string
  name: string
}

export default function QuestionReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Filter state
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '')
  const [difficultyFilter, setDifficultyFilter] = useState(searchParams.get('difficulty') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')

  // Question navigation state
  const [questionIds, setQuestionIds] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(parseInt(searchParams.get('index') || '0'))
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [questionLoading, setQuestionLoading] = useState(false)

  // Save state
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/admin/categories')
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // Fetch question IDs when filters change
  useEffect(() => {
    async function fetchQuestionIds() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (categoryFilter) params.set('category', categoryFilter)
        if (difficultyFilter) params.set('difficulty', difficultyFilter)
        if (statusFilter) params.set('status', statusFilter)

        const response = await fetch(`/api/admin/questions/ids?${params}`)
        const data = await response.json()
        setQuestionIds(data.ids || [])
        setCurrentIndex(0)
      } catch (err) {
        console.error('Failed to fetch question IDs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuestionIds()
  }, [categoryFilter, difficultyFilter, statusFilter])

  // Fetch current question when index changes
  useEffect(() => {
    async function fetchCurrentQuestion() {
      if (questionIds.length === 0 || currentIndex >= questionIds.length) {
        setCurrentQuestion(null)
        return
      }

      setQuestionLoading(true)
      try {
        const questionId = questionIds[currentIndex]
        const response = await fetch(`/api/admin/questions/${questionId}`)
        const data = await response.json()
        setCurrentQuestion(data.question)
        setSaveStatus('idle')
      } catch (err) {
        console.error('Failed to fetch question:', err)
      } finally {
        setQuestionLoading(false)
      }
    }
    fetchCurrentQuestion()
  }, [questionIds, currentIndex])

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (categoryFilter) params.set('category', categoryFilter)
    if (difficultyFilter) params.set('difficulty', difficultyFilter)
    if (statusFilter) params.set('status', statusFilter)
    if (currentIndex > 0) params.set('index', currentIndex.toString())

    const newUrl = `/admin/questions/review${params.toString() ? '?' + params.toString() : ''}`
    router.replace(newUrl, { scroll: false })
  }, [categoryFilter, difficultyFilter, statusFilter, currentIndex, router])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't navigate if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return
      }

      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, questionIds.length, hasUnsavedChanges])

  function goToPrevious() {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Discard them?')) {
      return
    }
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setHasUnsavedChanges(false)
    }
  }

  function goToNext() {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Discard them?')) {
      return
    }
    if (currentIndex < questionIds.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setHasUnsavedChanges(false)
    }
  }

  async function handleSave(updates: Partial<Question>) {
    if (!currentQuestion) return

    setSaving(true)
    setSaveStatus('saving')
    try {
      const response = await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentQuestion.id, ...updates })
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      setSaveStatus('saved')
      setHasUnsavedChanges(false)

      // Update current question with saved values
      setCurrentQuestion({ ...currentQuestion, ...updates })

      // Reset save status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (err) {
      console.error('Failed to save question:', err)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header with filters and progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="approved">Approved</option>
            <option value="archived">Archived</option>
          </select>

          <div className="ml-auto">
            <ProgressBar current={currentIndex + 1} total={questionIds.length} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
          </div>
        ) : questionIds.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No questions found matching filters
          </div>
        ) : questionLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
          </div>
        ) : currentQuestion ? (
          <QuestionEditor
            question={currentQuestion}
            onSave={handleSave}
            saving={saving}
            saveStatus={saveStatus}
          />
        ) : null}
      </div>

      {/* Navigation footer */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0 || loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {questionIds.length}
          </span>

          <button
            onClick={goToNext}
            disabled={currentIndex >= questionIds.length - 1 || loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-2">
          Use ← → arrow keys to navigate
        </p>
      </div>
    </div>
  )
}
