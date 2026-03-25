'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TrialNotificationBannerProps {
  questionsUsed: number
  questionsRemaining: number
  daysRemaining: number
  currentStreak: number
  className?: string
}

type NotificationType = 'streak' | 'category' | 'expiring' | 'progress' | null

export default function TrialNotificationBanner({
  questionsUsed,
  questionsRemaining,
  daysRemaining,
  currentStreak,
  className = ''
}: TrialNotificationBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [notificationType, setNotificationType] = useState<NotificationType>(null)

  useEffect(() => {
    // Determine which notification to show based on priority
    if (currentStreak >= 3) {
      setNotificationType('streak')
    } else if (daysRemaining <= 2 && daysRemaining > 0) {
      setNotificationType('expiring')
    } else if (questionsUsed === 25 || questionsUsed === 50 || questionsUsed === 75) {
      setNotificationType('progress')
    } else if (questionsUsed > 0 && questionsUsed % 20 === 0) {
      setNotificationType('category')
    }
  }, [questionsUsed, questionsRemaining, daysRemaining, currentStreak])

  if (dismissed || !notificationType) return null

  const getNotificationContent = () => {
    switch (notificationType) {
      case 'streak':
        return {
          icon: (
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          ),
          message: `You're on a ${currentStreak}-day streak! Keep it going!`,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800'
        }
      case 'expiring':
        return {
          icon: (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          message: `Only ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left in your trial!`,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          cta: 'Upgrade Now'
        }
      case 'progress':
        return {
          icon: (
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          message: `Great progress! You've answered ${questionsUsed} questions.`,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        }
      case 'category':
        return {
          icon: (
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          ),
          message: "Try a new category today to expand your knowledge!",
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        }
      default:
        return null
    }
  }

  const content = getNotificationContent()
  if (!content) return null

  return (
    <div className={`${content.bgColor} ${content.borderColor} border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {content.icon}
          <span className={`text-sm font-medium ${content.textColor}`}>
            {content.message}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {content.cta && (
            <Link
              href="/pricing"
              className="px-3 py-1 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
            >
              {content.cta}
            </Link>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
