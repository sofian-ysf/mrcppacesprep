'use client'

import Link from 'next/link'

interface TrialBannerProps {
  questionsUsed: number
  questionsRemaining: number
  daysRemaining: number
  onUpgrade?: () => void
}

export default function TrialBanner({
  questionsUsed,
  questionsRemaining,
  daysRemaining,
  onUpgrade
}: TrialBannerProps) {
  const totalQuestions = 100
  const progressPercent = (questionsUsed / totalQuestions) * 100
  const isRunningLow = questionsRemaining < 20 || daysRemaining < 2
  const isCritical = questionsRemaining < 10 || daysRemaining < 1

  // Determine banner color scheme
  const colorScheme = isCritical
    ? 'bg-red-50 border-red-200'
    : isRunningLow
    ? 'bg-yellow-50 border-yellow-200'
    : 'bg-blue-50 border-blue-200'

  const textColor = isCritical
    ? 'text-red-800'
    : isRunningLow
    ? 'text-yellow-800'
    : 'text-blue-800'

  const progressBarColor = isCritical
    ? 'bg-red-500'
    : isRunningLow
    ? 'bg-yellow-500'
    : 'bg-blue-500'

  const badgeColor = isCritical
    ? 'bg-red-100 text-red-700'
    : isRunningLow
    ? 'bg-yellow-100 text-yellow-700'
    : 'bg-blue-100 text-blue-700'

  return (
    <div className={`rounded-lg border p-4 ${colorScheme}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}>
            FREE TRIAL
          </span>
          <span className={`text-sm font-medium ${textColor}`}>
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
          </span>
        </div>
        {onUpgrade ? (
          <button
            onClick={onUpgrade}
            className="text-sm font-medium text-white bg-black hover:bg-gray-800 px-4 py-1.5 rounded-lg transition-colors"
          >
            Upgrade Now
          </button>
        ) : (
          <Link
            href="/#pricing"
            className="text-sm font-medium text-white bg-black hover:bg-gray-800 px-4 py-1.5 rounded-lg transition-colors"
          >
            Upgrade Now
          </Link>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className={textColor}>
            {questionsUsed} of {totalQuestions} questions used
          </span>
          <span className={`font-medium ${textColor}`}>
            {questionsRemaining} remaining
          </span>
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div
            className={`h-full ${progressBarColor} transition-all duration-300`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Warning message when running low */}
      {isRunningLow && (
        <p className={`text-xs mt-2 ${textColor}`}>
          {isCritical ? (
            <>
              {questionsRemaining <= 0
                ? "You've used all your trial questions. Upgrade to continue practicing."
                : `Only ${questionsRemaining} questions left! Upgrade now to get unlimited access.`}
            </>
          ) : (
            'Running low on trial questions. Consider upgrading for unlimited access.'
          )}
        </p>
      )}

      {/* Trial benefits reminder */}
      <div className={`text-xs mt-3 pt-3 border-t ${isCritical ? 'border-red-200' : isRunningLow ? 'border-yellow-200' : 'border-blue-200'}`}>
        <p className={`${textColor} opacity-75`}>
          Trial includes clinical questions only. Upgrade for calculations + unlimited access.
        </p>
      </div>
    </div>
  )
}

// Compact version for showing in practice sessions
export function TrialBannerCompact({
  questionsRemaining,
  daysRemaining
}: {
  questionsRemaining: number
  daysRemaining: number
}) {
  const isRunningLow = questionsRemaining < 20 || daysRemaining < 2

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
      isRunningLow ? 'bg-yellow-50 text-yellow-800' : 'bg-blue-50 text-blue-800'
    }`}>
      <span className="font-medium">Trial:</span>
      <span>{questionsRemaining} questions left</span>
      <span className="text-xs opacity-75">({daysRemaining}d remaining)</span>
      <Link
        href="/#pricing"
        className="ml-auto text-xs font-medium underline hover:no-underline"
      >
        Upgrade
      </Link>
    </div>
  )
}
