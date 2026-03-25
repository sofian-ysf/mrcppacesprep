'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface Category {
  id: string
  slug: string
  name: string
  question_type: 'clinical' | 'calculation'
  resource_count: number
}

interface GenerationJob {
  id: string
  category_id: string
  question_type: string
  difficulty: string
  quantity: number
  status: string
  questions_generated: number
  error_message?: string
  created_at: string
  question_categories: { name: string }
}

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const preselectedCategory = searchParams.get('category')

  const [categories, setCategories] = useState<Category[]>([])
  const [jobs, setJobs] = useState<GenerationJob[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [progress, setProgress] = useState({ generated: 0, total: 0 })

  // Form state
  const [categoryId, setCategoryId] = useState(preselectedCategory || '')
  const [questionType, setQuestionType] = useState<'sba' | 'emq' | 'calculation'>('sba')
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium')
  const [quantity, setQuantity] = useState(5)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (preselectedCategory) {
      setCategoryId(preselectedCategory)
    }
  }, [preselectedCategory])

  // Auto-refresh jobs table when there are processing jobs
  useEffect(() => {
    const hasProcessingJobs = jobs.some(job => job.status === 'processing')
    if (hasProcessingJobs && !generating) {
      const interval = setInterval(() => {
        fetch('/api/admin/generate')
          .then(res => res.json())
          .then(data => setJobs(data.jobs || []))
          .catch(console.error)
      }, 3000) // Refresh every 3 seconds
      return () => clearInterval(interval)
    }
  }, [jobs, generating])

  async function fetchData() {
    try {
      const [categoriesRes, jobsRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/generate')
      ])

      const categoriesData = await categoriesRes.json()
      const jobsData = await jobsRes.json()

      setCategories(categoriesData.categories || [])
      setJobs(jobsData.jobs || [])
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function pollJobStatus(jobId: string, totalQuantity: number): Promise<void> {
    const maxAttempts = 300 // 10 minutes max (300 * 2 seconds)
    let attempts = 0

    setProgress({ generated: 0, total: totalQuantity })

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Poll every 2 seconds
      attempts++

      try {
        const response = await fetch(`/api/admin/generate?jobId=${jobId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to get job status')
        }

        const job = data.job

        // Update progress
        setProgress({ generated: job.questions_generated || 0, total: totalQuantity })

        if (job.status === 'completed') {
          setSuccess(`Successfully generated ${job.questions_generated} questions!`)
          setGenerating(false)
          setProgress({ generated: 0, total: 0 })
          fetchData()
          return
        } else if (job.status === 'failed') {
          throw new Error(job.error_message || 'Generation failed')
        }
        // If still processing, continue polling
      } catch (err) {
        setError((err as Error).message)
        setGenerating(false)
        setProgress({ generated: 0, total: 0 })
        fetchData()
        return
      }
    }

    // Timeout after max attempts
    setError('Generation is taking too long. Check the jobs list for status.')
    setGenerating(false)
    setProgress({ generated: 0, total: 0 })
    fetchData()
  }

  async function handleGenerate() {
    if (!categoryId) {
      setError('Please select a category')
      return
    }

    const selectedCategory = categories.find(c => c.id === categoryId)
    if (selectedCategory && selectedCategory.resource_count === 0) {
      setError('Please upload resources for this category first')
      return
    }

    setGenerating(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          questionType,
          difficulty,
          quantity
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      // Start polling for job status
      fetchData() // Refresh to show the new job in processing state
      await pollJobStatus(data.jobId, quantity)
    } catch (err) {
      setError((err as Error).message)
      setGenerating(false)
    }
  }

  const selectedCategory = categories.find(c => c.id === categoryId)
  const availableQuestionTypes = selectedCategory?.question_type === 'calculation'
    ? [{ value: 'calculation', label: 'Calculation' }]
    : [
        { value: 'sba', label: 'Single Best Answer (SBA)' },
        { value: 'emq', label: 'Extended Matching (EMQ)' }
      ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Generation Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Generate New Questions</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value)
                // Reset question type if category type changes
                const cat = categories.find(c => c.id === e.target.value)
                if (cat?.question_type === 'calculation') {
                  setQuestionType('calculation')
                } else if (questionType === 'calculation') {
                  setQuestionType('sba')
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <optgroup label="Clinical">
                {categories.filter(c => c.question_type === 'clinical').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.resource_count} resources)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Calculations">
                {categories.filter(c => c.question_type === 'calculation').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.resource_count} resources)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as 'sba' | 'emq' | 'calculation')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              {availableQuestionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <button
            onClick={handleGenerate}
            disabled={generating || !categoryId}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate {quantity} Questions
              </>
            )}
          </button>

          {/* Progress Bar */}
          {generating && progress.total > 0 && (
            <div className="w-full max-w-md">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Generating questions...</span>
                <span>{progress.generated} / {progress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gray-900 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(progress.generated / progress.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {progress.generated === 0 ? 'Starting generation...' : `Batch ${Math.ceil(progress.generated / 10)} complete`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Generation Jobs</h2>

        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Difficulty</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Created</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {job.question_categories?.name || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 uppercase">
                      {job.question_type}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {job.difficulty}
                    </td>
                    <td className="py-3 px-4 min-w-[150px]">
                      {job.status === 'processing' ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{job.questions_generated}/{job.quantity}</span>
                            <span>{Math.round((job.questions_generated / job.quantity) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${(job.questions_generated / job.quantity) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600">{job.questions_generated}/{job.quantity}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        job.status === 'completed' ? 'bg-green-100 text-green-700' :
                        job.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        job.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {job.status}
                      </span>
                      {job.error_message && (
                        <p className="text-xs text-red-600 mt-1 max-w-[200px] truncate" title={job.error_message}>
                          {job.error_message}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No generation jobs yet</p>
        )}
      </div>
    </div>
  )
}
