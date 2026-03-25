'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  resource_count: number
  post_count: number
}

interface Job {
  id: string
  topic: string
  status: string
  error_message?: string
  created_at: string
  completed_at?: string
  blog_categories: { name: string }
}

interface TopicSuggestion {
  title: string
  description: string
  keywords: string[]
}

export default function BlogGeneratePage() {
  const searchParams = useSearchParams()
  const preselectedCategory = searchParams.get('category')

  const [categories, setCategories] = useState<Category[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [categoryId, setCategoryId] = useState(preselectedCategory || '')
  const [topic, setTopic] = useState('')
  const [targetKeywords, setTargetKeywords] = useState('')
  const [wordCountTarget, setWordCountTarget] = useState(1500)
  const [includeFaq, setIncludeFaq] = useState(true)

  // UI state
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Topic suggestion state
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([])
  const [suggesting, setSuggesting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [categoriesRes, jobsRes] = await Promise.all([
        fetch('/api/admin/blog/categories'),
        fetch('/api/admin/blog/generate'),
      ])

      const [categoriesData, jobsData] = await Promise.all([
        categoriesRes.json(),
        jobsRes.json(),
      ])

      setCategories(categoriesData.categories || [])
      setJobs(jobsData.jobs || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSuggestTopics() {
    if (!categoryId) {
      setError('Please select a category first')
      return
    }

    setSuggesting(true)
    setError('')
    setSuggestions([])

    try {
      const response = await fetch('/api/admin/blog/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to suggest topics')
      }

      setSuggestions(data.topics || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSuggesting(false)
    }
  }

  function selectSuggestion(suggestion: TopicSuggestion) {
    setTopic(suggestion.title)
    setTargetKeywords(suggestion.keywords.join(', '))
    setSuggestions([])
  }

  async function handleGenerate() {
    if (!categoryId) {
      setError('Please select a category')
      return
    }
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setGenerating(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          topic: topic.trim(),
          targetKeywords: targetKeywords.split(',').map(k => k.trim()).filter(Boolean),
          wordCountTarget,
          includeFaq,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setSuccess(`Blog post generated successfully!`)
      setTopic('')
      setTargetKeywords('')
      fetchData()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Generate Blog Post</h2>
          <p className="text-sm text-gray-500 mt-1">Create SEO-optimized blog content using AI and your uploaded resources</p>
        </div>
        <Link
          href="/admin/blog"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Back to Blog Dashboard
        </Link>
      </div>

      {/* Generation Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Generate New Blog Post</h3>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.resource_count} resources)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Topic / Title Idea
              </label>
              <button
                type="button"
                onClick={handleSuggestTopics}
                disabled={suggesting || !categoryId}
                className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {suggesting ? (
                  <>
                    <div className="animate-spin h-3 w-3 border-2 border-gray-600 border-t-transparent rounded-full"></div>
                    Suggesting...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Suggest Topics
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., How to Pass Your GPhC Pre-Registration Exam First Time"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a topic or title idea, or click "Suggest Topics" to get AI recommendations.
            </p>

            {/* Topic Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Suggested Topics:</p>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 text-sm">{suggestion.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{suggestion.description}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {suggestion.keywords.map((keyword, kidx) => (
                          <span key={kidx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Keywords (optional)
            </label>
            <input
              type="text"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              placeholder="e.g., GPhC exam tips, pharmacy revision, pre-reg exam"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Comma-separated keywords to target for SEO. Leave empty for auto-generated keywords.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Word Count: {wordCountTarget}
            </label>
            <input
              type="range"
              min={800}
              max={3000}
              step={100}
              value={wordCountTarget}
              onChange={(e) => setWordCountTarget(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>800 (Short)</span>
              <span>1500 (Medium)</span>
              <span>3000 (Long)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeFaq"
              checked={includeFaq}
              onChange={(e) => setIncludeFaq(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <label htmlFor="includeFaq" className="text-sm text-gray-700">
              Include FAQ section (recommended for SEO)
            </label>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !categoryId || !topic.trim()}
            className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Generating... This may take a minute
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Blog Post
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent Generation Jobs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Generation Jobs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No generation jobs yet
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{job.topic}</div>
                      {job.error_message && (
                        <div className="text-xs text-red-600 mt-1">{job.error_message}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.blog_categories?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        job.status === 'completed' ? 'bg-green-100 text-green-700' :
                        job.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        job.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
