# Question Review Editor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an admin page for reviewing and editing questions with swipe-through navigation by category.

**Architecture:** New page at `/admin/questions/review` with filters at top, two-column editor (question+options left, explanation right), and navigation controls. Fetches question IDs upfront, loads full question data on demand.

**Tech Stack:** Next.js App Router, React, TailwindCSS, Supabase

---

## Task 1: Create Question IDs API Endpoint

**Files:**
- Create: `app/api/admin/questions/ids/route.ts`

**Step 1: Create the API route file**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const categoryId = searchParams.get('category')
    const questionType = searchParams.get('type')
    const difficulty = searchParams.get('difficulty')

    // Build query - only fetch IDs for performance
    let query = supabase
      .from('questions')
      .select('id', { count: 'exact' })

    if (status) {
      query = query.eq('status', status)
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }
    if (questionType) {
      query = query.eq('question_type', questionType)
    }
    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    query = query.order('created_at', { ascending: false })

    const { data: questions, count, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      ids: questions?.map(q => q.id) || [],
      total: count || 0
    })
  } catch (error) {
    console.error('Question IDs error:', error)
    return NextResponse.json({ error: 'Failed to fetch question IDs' }, { status: 500 })
  }
}
```

**Step 2: Commit**

```bash
git add app/api/admin/questions/ids/route.ts
git commit -m "feat(api): add endpoint to fetch question IDs for review page"
```

---

## Task 2: Create Single Question API Endpoint

**Files:**
- Create: `app/api/admin/questions/[id]/route.ts`

**Step 1: Create the dynamic route file**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const { id } = await params

    const { data: question, error } = await supabase
      .from('questions')
      .select(`
        *,
        question_categories (id, name, slug)
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    return NextResponse.json({ question })
  } catch (error) {
    console.error('Single question error:', error)
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 })
  }
}
```

**Step 2: Commit**

```bash
git add app/api/admin/questions/[id]/route.ts
git commit -m "feat(api): add endpoint to fetch single question by ID"
```

---

## Task 3: Create Progress Bar Component

**Files:**
- Create: `app/components/admin/ProgressBar.tsx`

**Step 1: Create the component**

```typescript
interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">
          Question {current} of {total}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add app/components/admin/ProgressBar.tsx
git commit -m "feat(components): add ProgressBar component for review page"
```

---

## Task 4: Create Question Editor Component

**Files:**
- Create: `app/components/admin/QuestionEditor.tsx`

**Step 1: Create the component**

```typescript
'use client'

import { useState, useEffect } from 'react'

interface Option {
  letter: string
  text: string
}

interface Question {
  id: string
  question_text: string
  options: Option[] | null
  correct_answer: string
  explanation: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  status: string
  question_categories?: { id: string; name: string; slug: string }
}

interface QuestionEditorProps {
  question: Question
  onSave: (updates: Partial<Question>) => Promise<void>
  saving: boolean
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

export default function QuestionEditor({ question, onSave, saving, saveStatus }: QuestionEditorProps) {
  const [questionText, setQuestionText] = useState(question.question_text)
  const [options, setOptions] = useState<Option[]>(question.options || [])
  const [correctAnswer, setCorrectAnswer] = useState(question.correct_answer)
  const [explanation, setExplanation] = useState(question.explanation)
  const [hasChanges, setHasChanges] = useState(false)

  // Reset form when question changes
  useEffect(() => {
    setQuestionText(question.question_text)
    setOptions(question.options || [])
    setCorrectAnswer(question.correct_answer)
    setExplanation(question.explanation)
    setHasChanges(false)
  }, [question.id])

  // Track changes
  useEffect(() => {
    const changed =
      questionText !== question.question_text ||
      JSON.stringify(options) !== JSON.stringify(question.options || []) ||
      correctAnswer !== question.correct_answer ||
      explanation !== question.explanation
    setHasChanges(changed)
  }, [questionText, options, correctAnswer, explanation, question])

  function updateOption(index: number, text: string) {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], text }
    setOptions(newOptions)
  }

  async function handleSave() {
    await onSave({
      question_text: questionText,
      options: options,
      correct_answer: correctAnswer,
      explanation: explanation
    })
  }

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Left Column - Question & Options */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={option.letter} className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-sm font-medium text-gray-700">
                  {option.letter}
                </span>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Answer
          </label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {options.map((option) => (
              <option key={option.letter} value={option.letter}>
                {option.letter} - {option.text.substring(0, 50)}{option.text.length > 50 ? '...' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Column - Explanation */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Explanation
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[300px]"
        />
      </div>
    </div>
  )
}

export { type Question, type Option }
```

**Step 2: Commit**

```bash
git add app/components/admin/QuestionEditor.tsx
git commit -m "feat(components): add QuestionEditor component with two-column layout"
```

---

## Task 5: Create Review Page

**Files:**
- Create: `app/admin/questions/review/page.tsx`

**Step 1: Create the page**

```typescript
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

          <button
            onClick={() => handleSave({
              question_text: currentQuestion?.question_text || '',
              options: currentQuestion?.options || [],
              correct_answer: currentQuestion?.correct_answer || '',
              explanation: currentQuestion?.explanation || ''
            })}
            disabled={saving || !currentQuestion}
            className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              saveStatus === 'saved'
                ? 'bg-green-600 text-white'
                : saveStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : saveStatus === 'error' ? (
              'Error - Try Again'
            ) : (
              'Save Changes'
            )}
          </button>

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
```

**Step 2: Commit**

```bash
git add app/admin/questions/review/page.tsx
git commit -m "feat(admin): add question review page with swipe navigation"
```

---

## Task 6: Add Review Link to Admin Sidebar

**Files:**
- Modify: `app/admin/layout.tsx`

**Step 1: Find the navigation array and add review link**

Look for the navigation items array in `app/admin/layout.tsx` and add a new entry for the review page after the "Questions" link:

```typescript
{
  name: 'Review Questions',
  href: '/admin/questions/review',
  icon: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )
}
```

**Step 2: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat(admin): add review questions link to sidebar navigation"
```

---

## Task 7: Update PUT API to Support Full Question Updates

**Files:**
- Modify: `app/api/admin/questions/route.ts`

**Step 1: Update the PUT handler to accept all question fields**

The current PUT handler already supports updating via `...updates`, but verify it handles `question_text`, `options`, `correct_answer`, and `explanation`. The existing code should work since it spreads all updates:

```typescript
const { data, error } = await supabase
  .from('questions')
  .update(updates)  // This already accepts any fields
  .in('id', questionIds)
  .select()
```

Add `updated_at` timestamp to track changes:

```typescript
// Add updated_at timestamp
updates.updated_at = new Date().toISOString()
```

**Step 2: Commit**

```bash
git add app/api/admin/questions/route.ts
git commit -m "feat(api): add updated_at timestamp to question updates"
```

---

## Task 8: Test the Feature End-to-End

**Step 1: Start the dev server**

```bash
npm run dev
```

**Step 2: Navigate to the review page**

Open browser to `http://localhost:3000/admin/questions/review`

**Step 3: Verify functionality**

- [ ] Filters work (category, difficulty, status)
- [ ] Progress bar shows correct count
- [ ] Can navigate with arrow buttons
- [ ] Can navigate with keyboard arrows (when not in input)
- [ ] Question text is editable
- [ ] Options are editable
- [ ] Correct answer dropdown works
- [ ] Explanation is editable
- [ ] Save button works and shows status
- [ ] URL updates with filters and index
- [ ] Refreshing page maintains position

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete question review editor implementation"
```
