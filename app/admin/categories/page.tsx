'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  slug: string
  name: string
  description: string
  question_type: 'clinical' | 'calculation'
  resource_count: number
  question_count: number
}

export default function CategoriesPage() {
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
      const response = await fetch('/api/admin/categories')
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

      const response = await fetch('/api/admin/resources/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      setUploadProgress('Processing document...')

      const data = await response.json()

      // Process the document (extract text, generate embeddings)
      const processResponse = await fetch('/api/admin/resources/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: data.resourceId }),
      })

      if (!processResponse.ok) {
        throw new Error('Processing failed')
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

  const clinicalCategories = categories.filter(c => c.question_type === 'clinical')
  const calculationCategories = categories.filter(c => c.question_type === 'calculation')

  return (
    <div className="space-y-8">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.md,.docx"
        onChange={onFileChange}
        className="hidden"
      />

      {/* Clinical Categories */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Clinical Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinicalCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {category.question_count} questions
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
                      {uploadProgress}
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload File
                    </>
                  )}
                </button>
                <Link
                  href={`/admin/generate?category=${category.id}`}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Generate
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculation Categories */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Calculation Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculationCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {category.question_count} questions
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
                      {uploadProgress}
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload File
                    </>
                  )}
                </button>
                <Link
                  href={`/admin/generate?category=${category.id}`}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Generate
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
