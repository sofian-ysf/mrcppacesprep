'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MilestoneModalProps {
  questionsAnswered: number
  accuracy: number
  onClose: () => void
}

const MILESTONES = [25, 50, 75, 100]

export default function MilestoneModal({ questionsAnswered, accuracy, onClose }: MilestoneModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const currentMilestone = MILESTONES.find(m => m === questionsAnswered) || questionsAnswered
  const isComplete = questionsAnswered >= 100

  const getMilestoneContent = () => {
    if (isComplete) {
      return {
        title: 'Trial Complete!',
        message: "You've completed all 100 trial questions. Ready to continue your journey?",
        emoji: '🎉',
        cta: 'Unlock Full Access',
        ctaSecondary: null
      }
    }

    switch (currentMilestone) {
      case 25:
        return {
          title: "You're Off to a Great Start!",
          message: "You've completed 25 questions. Keep up the momentum!",
          emoji: '🚀',
          cta: 'Keep Practicing',
          ctaSecondary: 'View Progress'
        }
      case 50:
        return {
          title: 'Halfway There!',
          message: `50 questions done with ${accuracy}% accuracy. You're making excellent progress!`,
          emoji: '🔥',
          cta: 'Continue to 75',
          ctaSecondary: 'Unlock Full Access'
        }
      case 75:
        return {
          title: 'Almost There!',
          message: "Just 25 more questions in your trial. Make them count!",
          emoji: '⭐',
          cta: 'Finish Strong',
          ctaSecondary: 'Unlock 2000+ More'
        }
      default:
        return {
          title: 'Keep Going!',
          message: `You've answered ${questionsAnswered} questions so far.`,
          emoji: '💪',
          cta: 'Continue',
          ctaSecondary: null
        }
    }
  }

  const content = getMilestoneContent()

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-white rounded-2xl p-8 max-w-md w-full transform transition-transform duration-300 ${
        isVisible ? 'scale-100' : 'scale-95'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-6xl mb-4">{content.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h2>
          <p className="text-gray-600 mb-6">{content.message}</p>

          {/* Progress visualization */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium text-gray-900">{questionsAnswered}/100</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isComplete ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${(questionsAnswered / 100) * 100}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-900">{questionsAnswered}</p>
              <p className="text-xs text-gray-500">Questions</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-900">{accuracy}%</p>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            {isComplete ? (
              <Link
                href="/pricing"
                className="block w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {content.cta}
              </Link>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {content.cta}
              </button>
            )}

            {content.ctaSecondary && !isComplete && (
              <Link
                href="/pricing"
                className="block w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {content.ctaSecondary}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
