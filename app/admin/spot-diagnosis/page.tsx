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

  const currentCard = filteredCards[currentIndex]
  const totalCards = filteredCards.length
  const missingCount = allCards.filter(c => !c.image_url && !c.youtube_id).length

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

      {/* Current card placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold">{currentCard?.diagnosis}</h2>
        <p className="text-gray-500 mt-2">{currentCard?.description || 'No description'}</p>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
        >
          ← Prev (A)
        </button>
        <button
          onClick={() => setCurrentIndex(i => Math.min(totalCards - 1, i + 1))}
          disabled={currentIndex === totalCards - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Next (D) →
        </button>
      </div>
    </div>
  )
}
