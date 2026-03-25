'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface StationTimerProps {
  initialSeconds: number
  onTimeUp?: () => void
  autoStart?: boolean
}

export default function StationTimer({
  initialSeconds,
  onTimeUp,
  autoStart = false
}: StationTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [hasStarted, setHasStarted] = useState(autoStart)
  const onTimeUpRef = useRef(onTimeUp)

  // Keep ref updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  // Timer logic
  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) return

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          onTimeUpRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, secondsRemaining])

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const handleStart = useCallback(() => {
    setIsRunning(true)
    setHasStarted(true)
  }, [])

  const handlePause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setSecondsRemaining(initialSeconds)
    setHasStarted(false)
  }, [initialSeconds])

  // Determine color based on time remaining
  const getTimerColor = (): string => {
    const percentRemaining = (secondsRemaining / initialSeconds) * 100

    if (percentRemaining <= 10) {
      return 'text-red-600 bg-red-50 border-red-200'
    }
    if (percentRemaining <= 25) {
      return 'text-orange-600 bg-orange-50 border-orange-200'
    }
    if (percentRemaining <= 50) {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
    return 'text-green-600 bg-green-50 border-green-200'
  }

  // Determine if timer should pulse (warning state)
  const shouldPulse = secondsRemaining > 0 && secondsRemaining <= 60 && isRunning

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Timer Display */}
      <div
        className={`
          text-4xl font-mono font-bold px-8 py-4 rounded-xl border-2 transition-all duration-300
          ${getTimerColor()}
          ${shouldPulse ? 'animate-pulse' : ''}
        `}
      >
        {formatTime(secondsRemaining)}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            secondsRemaining / initialSeconds <= 0.1
              ? 'bg-red-500'
              : secondsRemaining / initialSeconds <= 0.25
                ? 'bg-orange-500'
                : secondsRemaining / initialSeconds <= 0.5
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
          }`}
          style={{ width: `${(secondsRemaining / initialSeconds) * 100}%` }}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        {!hasStarted ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Start Timer
          </button>
        ) : (
          <>
            {isRunning ? (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Pause
              </button>
            ) : secondsRemaining > 0 ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Resume
              </button>
            ) : null}

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </>
        )}
      </div>

      {/* Time Up Message */}
      {secondsRemaining === 0 && hasStarted && (
        <div className="mt-2 text-red-600 font-medium animate-bounce">
          Time is up!
        </div>
      )}
    </div>
  )
}
