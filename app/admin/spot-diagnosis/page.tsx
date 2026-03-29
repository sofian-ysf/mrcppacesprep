'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SpotDiagnosis {
  id: string
  image_url: string | null
  youtube_id: string | null
  media_type: 'image' | 'video'
  diagnosis: string
  description: string | null
  key_features: string[]
  exam_tips: string | null
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category_id: string | null
  created_at: string
}

type FilterType = 'all' | 'missing' | 'has_image' | 'has_video'

export default function SpotDiagnosisAdmin() {
  const router = useRouter()
  const [allCards, setAllCards] = useState<SpotDiagnosis[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState<FilterType>('all')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [imageUrl, setImageUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [saving, setSaving] = useState(false)

  // Fetch all cards on mount
  useEffect(() => {
    async function fetchAllCards() {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/spot-diagnosis?limit=1000')
        const data = await response.json()
        setAllCards(data.spotDiagnoses || [])
      } catch (error) {
        console.error('Failed to fetch cards:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllCards()
  }, [])

  // Filter cards based on current filter
  const filteredCards = allCards.filter(card => {
    switch (filter) {
      case 'missing':
        return !card.image_url && !card.youtube_id
      case 'has_image':
        return card.media_type === 'image' && !!card.image_url
      case 'has_video':
        return card.media_type === 'video' && !!card.youtube_id
      default:
        return true
    }
  })

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === 'a' || e.key === 'A') {
        navigatePrev()
      } else if (e.key === 'd' || e.key === 'D') {
        navigateNext()
      } else if (e.key === 'Escape') {
        router.push('/admin')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, filteredCards.length, isDirty, router])

  // Paste handler for images
  useEffect(() => {
    async function handlePaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            await uploadFile(file)
          }
          return
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  // Save current card
  async function saveCurrentCard(): Promise<boolean> {
    if (!currentCard || !isDirty) return true
    if (saving) return false

    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        id: currentCard.id,
        media_type: mediaType,
      }

      if (mediaType === 'image') {
        payload.image_url = imageUrl || null
        payload.youtube_id = null
      } else {
        payload.youtube_id = extractYouTubeId(youtubeUrl)
        payload.image_url = null
      }

      const response = await fetch('/api/admin/spot-diagnosis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        // Update local state
        setAllCards(cards => cards.map(c =>
          c.id === currentCard.id
            ? { ...c, media_type: mediaType, image_url: payload.image_url as string | null, youtube_id: payload.youtube_id as string | null }
            : c
        ))
        setIsDirty(false)
        return true
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save')
        return false
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Navigation functions that save first
  async function navigateNext() {
    if (saving || currentIndex >= filteredCards.length - 1) return
    if (isDirty) {
      const saved = await saveCurrentCard()
      if (!saved) return
    }
    setCurrentIndex(i => i + 1)
  }

  async function navigatePrev() {
    if (saving || currentIndex <= 0) return
    if (isDirty) {
      const saved = await saveCurrentCard()
      if (!saved) return
    }
    setCurrentIndex(i => i - 1)
  }

  const currentCard = filteredCards[currentIndex]
  const totalCards = filteredCards.length
  const missingCount = allCards.filter(c => !c.image_url && !c.youtube_id).length

  // Sync current card to form state
  useEffect(() => {
    if (currentCard) {
      setMediaType(currentCard.media_type || 'image')
      setImageUrl(currentCard.image_url || '')
      setYoutubeUrl(currentCard.youtube_id ? `https://youtube.com/watch?v=${currentCard.youtube_id}` : '')
      setIsDirty(false)
    }
  }, [currentCard?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (totalCards === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No cards match the current filter.</p>
        <button
          onClick={() => setFilter('all')}
          className="text-blue-600 hover:text-blue-800"
        >
          Show all cards
        </button>
      </div>
    )
  }

  function extractYouTubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'spot-diagnosis')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setImageUrl(data.url)
        setMediaType('image')
        setIsDirty(true)
      } else {
        const error = await response.json()
        alert(error.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      uploadFile(file)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Dashboard
        </Link>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as FilterType)
            setCurrentIndex(0)
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Cards ({allCards.length})</option>
          <option value="missing">Missing Media ({missingCount})</option>
          <option value="has_image">Has Image</option>
          <option value="has_video">Has Video</option>
        </select>
      </div>

      {/* Progress */}
      <div className="text-center text-sm text-gray-600">
        Card {currentIndex + 1} of {totalCards}
        {filter === 'all' && missingCount > 0 && (
          <span className="ml-2 text-amber-600">({missingCount} missing media)</span>
        )}
      </div>

      {/* Main card area */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex gap-8">
          {/* Left: Card details */}
          <div className="flex-1 min-w-0">
            {/* Difficulty badge */}
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 ${
              currentCard.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              currentCard.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentCard.difficulty}
            </span>

            {/* Diagnosis title */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              {currentCard.diagnosis}
            </h2>

            {/* Description */}
            {currentCard.description && (
              <p className="text-gray-600 mb-4 leading-relaxed">
                {currentCard.description}
              </p>
            )}

            {/* Key features */}
            {currentCard.key_features && currentCard.key_features.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Key Features</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {currentCard.key_features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exam tips */}
            {currentCard.exam_tips && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-700 mb-2">💡 Exam Tips</h3>
                <p className="text-blue-600">{currentCard.exam_tips}</p>
              </div>
            )}
          </div>

          {/* Right: Media upload */}
          <div className="w-80 flex-shrink-0 space-y-4">
            {/* Image/Video toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => { setMediaType('image'); setIsDirty(true) }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  mediaType === 'image'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📷 Image
              </button>
              <button
                onClick={() => { setMediaType('video'); setIsDirty(true) }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  mediaType === 'video'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ▶️ Video
              </button>
            </div>

            {mediaType === 'image' ? (
              <>
                {/* Drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-blue-300 bg-blue-50/50'
                  } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                      <p className="text-blue-600 mt-2">Uploading...</p>
                    </div>
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-40 mx-auto rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Invalid+URL'
                      }}
                    />
                  ) : (
                    <>
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-blue-600 font-medium">Drop image here</p>
                      <p className="text-sm text-gray-500 mt-1">
                        or paste with <kbd className="px-1 bg-gray-200 rounded">⌘V</kbd>
                      </p>
                    </>
                  )}
                </div>

                {/* URL input */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Or enter URL:</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => { setImageUrl(e.target.value); setIsDirty(true) }}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* YouTube URL input */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">YouTube URL:</label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => { setYoutubeUrl(e.target.value); setIsDirty(true) }}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                {/* YouTube preview */}
                {youtubeUrl && extractYouTubeId(youtubeUrl) && (
                  <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(youtubeUrl)}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </>
            )}

            {/* Save status */}
            <div className="text-center text-xs">
              {saving ? (
                <span className="text-blue-600">Saving...</span>
              ) : isDirty ? (
                <span className="text-amber-600">● Unsaved changes</span>
              ) : (
                <span className="text-green-600">✓ Auto-saves on navigate</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={navigatePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
        >
          ← Prev <kbd className="ml-1 px-1.5 py-0.5 bg-gray-200 rounded text-xs">A</kbd>
        </button>
        <button
          onClick={navigateNext}
          disabled={currentIndex === totalCards - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          <kbd className="mr-1 px-1.5 py-0.5 bg-blue-500 rounded text-xs">D</kbd> Next →
        </button>
      </div>

      {/* Keyboard shortcuts */}
      <div className="text-center text-xs text-gray-400 pt-4">
        <kbd className="px-2 py-1 bg-gray-100 rounded">A</kbd> Prev
        <span className="mx-3">·</span>
        <kbd className="px-2 py-1 bg-gray-100 rounded">D</kbd> Next
        <span className="mx-3">·</span>
        <kbd className="px-2 py-1 bg-gray-100 rounded">⌘V</kbd> Paste
        <span className="mx-3">·</span>
        <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> Back
      </div>
    </div>
  )
}
