'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DeckUploadResult } from '@/app/types/flashcards'

export default function UploadFlashcardsPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [customName, setCustomName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DeckUploadResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith('.apkg')) {
      setFile(droppedFile)
      setError(null)
    } else {
      setError('Please drop a valid .apkg file')
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.name.endsWith('.apkg')) {
      setFile(selectedFile)
      setError(null)
    } else {
      setError('Please select a valid .apkg file')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setProgress('Preparing upload...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (customName.trim()) {
        formData.append('name', customName.trim())
      }

      setProgress('Uploading and parsing file...')

      const res = await fetch('/api/admin/flashcards/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setResult(data)
      setProgress('Upload complete!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProgress('')
    } finally {
      setUploading(false)
    }
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-900">Upload Successful!</h2>
              <p className="text-sm text-green-700">Your deck has been imported and is ready for use.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Import Summary</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Deck Name</p>
              <p className="text-lg font-medium text-gray-900">{result.deck.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cards Imported</p>
              <p className="text-lg font-medium text-gray-900">{result.cardsImported}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Slug</p>
              <p className="text-lg font-medium text-gray-900">{result.deck.slug}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-medium text-green-600">Active</p>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-800">Warnings:</p>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <Link
            href="/admin/flashcards"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Decks
          </Link>
          <button
            onClick={() => {
              setFile(null)
              setCustomName('')
              setResult(null)
            }}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
          >
            Upload Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Anki Deck</h1>
          <p className="mt-1 text-sm text-gray-500">
            Import flashcards from an Anki .apkg file
          </p>
        </div>
        <Link
          href="/admin/flashcards"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Decks
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        </div>
      )}

      {/* File Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : file
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {file ? (
          <div className="space-y-3">
            <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your .apkg file here
              </p>
              <p className="text-sm text-gray-500">or click to browse</p>
            </div>
            <input
              type="file"
              accept=".apkg"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              Browse Files
            </label>
          </div>
        )}
      </div>

      {/* Custom Name Input */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label htmlFor="deck-name" className="block text-sm font-medium text-gray-700">
          Custom Deck Name (optional)
        </label>
        <input
          type="text"
          id="deck-name"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Leave empty to use the original deck name"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
        />
        <p className="mt-2 text-xs text-gray-500">
          If left empty, the deck name will be extracted from the .apkg file.
        </p>
      </div>

      {/* Upload Button */}
      <div className="flex space-x-4">
        <Link
          href="/admin/flashcards"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            !file || uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-900 hover:bg-gray-800'
          }`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {progress}
            </>
          ) : (
            'Import Deck'
          )}
        </button>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">How to export from Anki</h3>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>Open Anki on your computer</li>
          <li>Go to File → Export</li>
          <li>Select the deck you want to export</li>
          <li>Choose &quot;Anki Deck Package (*.apkg)&quot; as the format</li>
          <li>Check &quot;Include media&quot; if your cards have images or audio</li>
          <li>Click &quot;Export&quot; and upload the file here</li>
        </ol>
      </div>
    </div>
  )
}
