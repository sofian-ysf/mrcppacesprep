'use client'

import { useEffect, useState } from 'react'

interface Question {
  id: string
  category_id: string
  question_type: 'sba' | 'emq' | 'calculation'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  question_text: string
  options: { letter: string; text: string }[] | null
  correct_answer: string
  explanation: string
  explanation_structured: StructuredExplanation | null
  is_trial_featured: boolean
  trial_display_order: number | null
  status: string
  question_categories: { name: string; slug: string }
}

interface StructuredExplanation {
  summary: string
  key_points: string[]
  clinical_pearl: string
  why_wrong: Record<string, string>
  exam_tip: string
  related_topics: string[]
}

interface Category {
  id: string
  name: string
  slug: string
  question_type: 'clinical' | 'calculation'
}

interface EnhancementStatus {
  needsEnhancement: number
  enhanced: number
  trialFeaturedCount: number
}

export default function TrialQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [enhancementStatus, setEnhancementStatus] = useState<EnhancementStatus | null>(null)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [showNeedsEnhancement, setShowNeedsEnhancement] = useState(false)

  // Selected question for preview
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
    byCategory: {} as Record<string, number>
  })

  useEffect(() => {
    fetchCategories()
    fetchEnhancementStatus()
  }, [])

  useEffect(() => {
    fetchQuestions()
  }, [categoryFilter, difficultyFilter, showFeaturedOnly, showNeedsEnhancement])

  async function fetchCategories() {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      // Only show clinical categories for trial
      const clinicalCategories = (data.categories || []).filter(
        (c: Category) => c.question_type === 'clinical'
      )
      setCategories(clinicalCategories)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  async function fetchEnhancementStatus() {
    try {
      const response = await fetch('/api/admin/enhance-explanations?trialFeaturedOnly=true')
      const data = await response.json()
      setEnhancementStatus(data)
    } catch (err) {
      console.error('Failed to fetch enhancement status:', err)
    }
  }

  async function fetchQuestions() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('status', 'approved')
      if (categoryFilter) params.set('category', categoryFilter)
      if (difficultyFilter) params.set('difficulty', difficultyFilter)
      params.set('limit', '200')

      // Add trial-specific filters
      if (showFeaturedOnly) params.set('trialFeatured', 'true')

      const response = await fetch(`/api/admin/questions?${params}`)
      const data = await response.json()

      let filteredQuestions = (data.questions || []).filter(
        (q: Question) => q.question_type !== 'calculation'
      )

      // Apply client-side filters
      if (showNeedsEnhancement) {
        filteredQuestions = filteredQuestions.filter(
          (q: Question) => !q.explanation_structured
        )
      }

      setQuestions(filteredQuestions)

      // Calculate stats
      const featured = filteredQuestions.filter((q: Question) => q.is_trial_featured)
      const byDifficulty = {
        Easy: featured.filter((q: Question) => q.difficulty === 'Easy').length,
        Medium: featured.filter((q: Question) => q.difficulty === 'Medium').length,
        Hard: featured.filter((q: Question) => q.difficulty === 'Hard').length
      }
      const byCategory: Record<string, number> = {}
      featured.forEach((q: Question) => {
        const cat = q.question_categories?.name || 'Unknown'
        byCategory[cat] = (byCategory[cat] || 0) + 1
      })

      setStats({
        total: filteredQuestions.length,
        featured: featured.length,
        byDifficulty,
        byCategory
      })
    } catch (err) {
      console.error('Failed to fetch questions:', err)
    } finally {
      setLoading(false)
    }
  }

  async function toggleTrialFeatured(questionId: string, featured: boolean) {
    setSaving(true)
    try {
      await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: questionId,
          is_trial_featured: featured
        })
      })
      fetchQuestions()
      fetchEnhancementStatus()
    } catch (err) {
      console.error('Failed to update question:', err)
    } finally {
      setSaving(false)
    }
  }

  async function updateTrialOrder(questionId: string, order: number | null) {
    try {
      await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: questionId,
          trial_display_order: order
        })
      })
      fetchQuestions()
    } catch (err) {
      console.error('Failed to update order:', err)
    }
  }

  async function enhanceTrialQuestions() {
    if (!confirm('This will generate AI-enhanced explanations for all trial-featured questions that need them. Continue?')) {
      return
    }

    setEnhancing(true)
    try {
      const response = await fetch('/api/admin/enhance-explanations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trialFeaturedOnly: true })
      })
      const data = await response.json()
      alert(`Enhancement started for ${data.questionsToProcess} questions. This may take a few minutes.`)
    } catch (err) {
      console.error('Failed to start enhancement:', err)
      alert('Failed to start enhancement')
    } finally {
      setEnhancing(false)
      // Refresh after a delay
      setTimeout(() => {
        fetchQuestions()
        fetchEnhancementStatus()
      }, 5000)
    }
  }

  // Target distribution
  const TARGET_TOTAL = 100
  const TARGET_DIFFICULTY = { Easy: 30, Medium: 50, Hard: 20 }
  const CATEGORIES_COUNT = categories.length || 12
  const TARGET_PER_CATEGORY = Math.ceil(TARGET_TOTAL / CATEGORIES_COUNT)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trial Questions Curation</h1>
          <p className="text-gray-600 mt-1">
            Select and manage the 100 questions for the 7-day trial experience
          </p>
        </div>
        <button
          onClick={enhanceTrialQuestions}
          disabled={enhancing || !enhancementStatus?.needsEnhancement}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {enhancing ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Enhancing...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Enhance Explanations ({enhancementStatus?.needsEnhancement || 0})
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Featured Questions</p>
            <span className={`text-xs px-2 py-1 rounded-full ${
              stats.featured === TARGET_TOTAL ? 'bg-green-100 text-green-700' :
              stats.featured > TARGET_TOTAL ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              Target: {TARGET_TOTAL}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.featured}</p>
          <p className="text-xs text-gray-500 mt-1">
            {TARGET_TOTAL - stats.featured > 0
              ? `${TARGET_TOTAL - stats.featured} more needed`
              : stats.featured > TARGET_TOTAL
                ? `${stats.featured - TARGET_TOTAL} over target`
                : 'Target reached!'
            }
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-500">Enhanced</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {enhancementStatus?.enhanced || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            of {stats.featured} featured
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-500">Difficulty Distribution</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Easy:</span>
              <span className={stats.byDifficulty.Easy === TARGET_DIFFICULTY.Easy ? 'text-green-600 font-medium' : ''}>
                {stats.byDifficulty.Easy}/{TARGET_DIFFICULTY.Easy}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-600">Medium:</span>
              <span className={stats.byDifficulty.Medium === TARGET_DIFFICULTY.Medium ? 'text-green-600 font-medium' : ''}>
                {stats.byDifficulty.Medium}/{TARGET_DIFFICULTY.Medium}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-600">Hard:</span>
              <span className={stats.byDifficulty.Hard === TARGET_DIFFICULTY.Hard ? 'text-green-600 font-medium' : ''}>
                {stats.byDifficulty.Hard}/{TARGET_DIFFICULTY.Hard}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-500">Categories Covered</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {Object.keys(stats.byCategory).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            of {CATEGORIES_COUNT} categories
          </p>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-sm font-medium text-gray-500 mb-3">Category Distribution (target: ~{TARGET_PER_CATEGORY} each)</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const count = stats.byCategory[cat.name] || 0
            const isGood = count >= TARGET_PER_CATEGORY - 2 && count <= TARGET_PER_CATEGORY + 2
            return (
              <span
                key={cat.id}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isGood ? 'bg-green-100 text-green-700' :
                  count === 0 ? 'bg-gray-100 text-gray-500' :
                  count < TARGET_PER_CATEGORY - 2 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}
              >
                {cat.name.split(' ')[0]}: {count}
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Questions List */}
        <div className="flex-1">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
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

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Featured only
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showNeedsEnhancement}
                  onChange={(e) => setShowNeedsEnhancement(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Needs enhancement
              </label>

              <span className="ml-auto text-sm text-gray-600">
                {questions.length} questions
              </span>
            </div>
          </div>

          {/* Questions Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full" />
              </div>
            ) : questions.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center text-sm font-medium text-gray-500">Featured</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Question</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 w-32">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 w-24">Difficulty</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 w-24">Enhanced</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 w-20">Order</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr
                      key={question.id}
                      className={`border-t border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedQuestion?.id === question.id ? 'bg-blue-50' : ''
                      } ${question.is_trial_featured ? 'bg-green-50/50' : ''}`}
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={question.is_trial_featured}
                          onChange={(e) => toggleTrialFeatured(question.id, e.target.checked)}
                          disabled={saving}
                          className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {question.question_text}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {question.question_categories?.name?.split(' ')[0] || 'Unknown'}
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
                        {question.explanation_structured ? (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        {question.is_trial_featured && (
                          <input
                            type="number"
                            value={question.trial_display_order || ''}
                            onChange={(e) => updateTrialOrder(question.id, e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="#"
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                            min="1"
                            max="100"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No questions found matching filters
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

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Explanation</p>
                <p className="text-gray-700 text-sm">{selectedQuestion.explanation}</p>
              </div>

              {selectedQuestion.explanation_structured && (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-gray-800 mb-2">Enhanced Explanation</p>

                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Summary</p>
                        <p className="text-sm text-gray-700">{selectedQuestion.explanation_structured.summary}</p>
                      </div>

                      <div className="bg-blue-50 rounded p-3">
                        <p className="text-xs font-medium text-blue-700 mb-1">Key Points</p>
                        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                          {selectedQuestion.explanation_structured.key_points.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-amber-50 rounded p-3">
                        <p className="text-xs font-medium text-amber-700 mb-1">Clinical Pearl</p>
                        <p className="text-sm text-gray-700">{selectedQuestion.explanation_structured.clinical_pearl}</p>
                      </div>

                      <div className="bg-green-50 rounded p-3">
                        <p className="text-xs font-medium text-green-700 mb-1">Exam Tip</p>
                        <p className="text-sm text-gray-700">{selectedQuestion.explanation_structured.exam_tip}</p>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Related Topics</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedQuestion.explanation_structured.related_topics.map((topic, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-200 rounded text-xs text-gray-600">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => toggleTrialFeatured(selectedQuestion.id, !selectedQuestion.is_trial_featured)}
                  disabled={saving}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedQuestion.is_trial_featured
                      ? 'border border-red-300 text-red-600 hover:bg-red-50'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedQuestion.is_trial_featured ? 'Remove from Trial' : 'Add to Trial'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
