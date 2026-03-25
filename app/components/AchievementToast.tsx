'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: string
}

interface AchievementToastProps {
  achievement: Achievement
  onClose: () => void
  autoClose?: number
}

export default function AchievementToast({
  achievement,
  onClose,
  autoClose = 5000
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, autoClose)

    return () => clearTimeout(timer)
  }, [autoClose, onClose])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-500 to-orange-500'
      case 'epic':
        return 'from-gray-700 to-gray-900'
      case 'rare':
        return 'from-blue-500 to-cyan-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} p-1 rounded-xl shadow-2xl`}>
        <div className="bg-white rounded-lg p-4 flex items-center gap-4 min-w-[320px]">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center shadow-lg`}>
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Achievement Unlocked!</p>
            <h3 className="font-bold text-gray-900">{achievement.name}</h3>
            <p className="text-sm text-gray-600">{achievement.description}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for managing achievement toasts
export function useAchievementToasts() {
  const [toasts, setToasts] = useState<Achievement[]>([])

  const addToast = (achievement: Achievement) => {
    setToasts(prev => [...prev, achievement])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return { toasts, addToast, removeToast }
}
