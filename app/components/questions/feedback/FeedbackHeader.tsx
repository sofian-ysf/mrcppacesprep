'use client'

interface FeedbackHeaderProps {
  isCorrect: boolean
  streak?: number
}

export default function FeedbackHeader({ isCorrect, streak = 0 }: FeedbackHeaderProps) {
  // Get encouraging message for streaks
  const getStreakMessage = () => {
    if (!isCorrect) return null
    if (streak >= 10) return "Unstoppable! 10+ correct in a row!"
    if (streak >= 5) return "On fire! 5 correct in a row!"
    if (streak >= 3) return "Nice streak! Keep it going!"
    return null
  }

  const streakMessage = getStreakMessage()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isCorrect ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {isCorrect ? (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div>
          <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </h3>
          <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Great work!' : "Let's learn from this."}
          </p>
        </div>
      </div>

      {/* Streak Badge */}
      {streakMessage && (
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 border border-yellow-300 rounded-full">
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-yellow-800">{streak}</span>
        </div>
      )}
    </div>
  )
}
