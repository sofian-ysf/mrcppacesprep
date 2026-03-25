'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  resource_count: number
  post_count: number
  published_count: number
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const response = await fetch('/api/admin/blog/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(categoryId: string, file: File) {
    setUploading(categoryId)
    setUploadProgress('Uploading file...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('categoryId', categoryId)

      const response = await fetch('/api/admin/blog/resources/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      setUploadProgress('Processing document...')

      const data = await response.json()

      // Process the document (extract text, generate embeddings)
      const processResponse = await fetch('/api/admin/blog/resources/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: data.resourceId }),
      })

      if (!processResponse.ok) {
        const processData = await processResponse.json()
        throw new Error(processData.error || 'Processing failed')
      }

      setUploadProgress('Done!')
      setTimeout(() => {
        setUploading(null)
        setUploadProgress('')
        fetchCategories()
      }, 1000)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadProgress('Error: ' + (error as Error).message)
      setTimeout(() => {
        setUploading(null)
        setUploadProgress('')
      }, 3000)
    }
  }

  function handleFileSelect(categoryId: string) {
    setSelectedCategory(categoryId)
    fileInputRef.current?.click()
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && selectedCategory) {
      handleFileUpload(selectedCategory, file)
    }
    e.target.value = ''
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.md,.docx"
        onChange={onFileChange}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Blog Categories</h2>
          <p className="text-sm text-gray-500 mt-1">Upload resources to generate blog posts using AI</p>
        </div>
        <Link
          href="/admin/blog"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Back to Blog Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {category.resource_count} resources
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                {category.post_count} posts
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleFileSelect(category.id)}
                disabled={uploading === category.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {uploading === category.id ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full"></div>
                    <span className="truncate">{uploadProgress}</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload
                  </>
                )}
              </button>
              <Link
                href={`/admin/blog/generate?category=${category.id}`}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Generate
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-2">Tips for better blog generation:</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Upload relevant PDFs, markdown files, or text documents about the topic</li>
          <li>More specific resources lead to better, more accurate blog content</li>
          <li>Include industry guidelines, research papers, or educational materials</li>
          <li>The AI will use these resources to generate SEO-optimized blog posts</li>
        </ul>
      </div>
    </div>
  )
}
