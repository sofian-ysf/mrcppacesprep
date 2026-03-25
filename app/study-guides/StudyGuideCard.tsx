'use client'

import Link from 'next/link'
import { useState } from 'react'

interface StudyGuideCardProps {
  slug: string
  title: string
  description: string
  items: string[]
  stats: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal'
  icon: React.ReactNode
  hasAccess: boolean
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  purple: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
  },
  teal: {
    bg: 'bg-teal-100',
    text: 'text-teal-600',
  },
}

export function StudyGuideCard({
  slug,
  title,
  description,
  items,
  stats,
  color,
  icon,
  hasAccess,
}: StudyGuideCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/study-guides/download?guide=${slug}`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = '/signup'
          return
        }
        throw new Error(data.error || 'Download failed')
      }

      // Open the signed URL in a new tab to trigger download
      window.open(data.url, '_blank')
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const colors = colorClasses[color]

  return (
    <div className="rounded-xl border bg-white p-8 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${colors.bg}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <ul className="text-sm text-gray-600 space-y-2 mb-4">
            {items.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${colors.text}`}>{stats}</span>
            {hasAccess ? (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`${colors.text} font-semibold hover:underline disabled:opacity-50`}
              >
                {isDownloading ? 'Downloading...' : 'Download →'}
              </button>
            ) : (
              <Link href="/signup" className={`${colors.text} font-semibold hover:underline`}>
                Subscribe to Download →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
