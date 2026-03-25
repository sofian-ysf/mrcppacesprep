'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { SpotDiagnosis, StudyMode } from '@/app/types/spot-diagnosis'

interface SpotDiagnosisCardProps {
  card: SpotDiagnosis
  mode: StudyMode
  allCards: SpotDiagnosis[]
  onNext: () => void
}

export default function SpotDiagnosisCard({ card, mode, allCards, onNext }: SpotDiagnosisCardProps) {
  const [revealed, setRevealed] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [timerActive, setTimerActive] = useState(false)
  const [mcqOptions, setMcqOptions] = useState<string[]>([])

  // Generate MCQ options when card changes
  useEffect(() => {
    if (mode === 'mcq') {
      const correctAnswer = card.diagnosis
      const otherOptions = allCards
        .filter((c) => c.id !== card.id)
        .map((c) => c.diagnosis)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      const options = [...otherOptions, correctAnswer].sort(() => Math.random() - 0.5)
      setMcqOptions(options.length >= 4 ? options : [correctAnswer])
    }
  }, [card, mode, allCards])

  // Reset state when card changes
  useEffect(() => {
    setRevealed(false)
    setSelectedOption(null)
    setTimeLeft(10)
    setTimerActive(mode === 'timed')
  }, [card, mode])

  // Timer for timed mode
  useEffect(() => {
    if (!timerActive || mode !== 'timed') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRevealed(true)
          setTimerActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timerActive, mode])

  const handleReveal = useCallback(() => {
    setRevealed(true)
    setTimerActive(false)
  }, [])

  const handleMCQSelect = useCallback(
    (option: string) => {
      setSelectedOption(option)
      setRevealed(true)
    },
    []
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.code === 'Space' && !revealed) {
        e.preventDefault()
        handleReveal()
      }
      if (e.code === 'ArrowRight' && revealed) {
        onNext()
      }
    },
    [revealed, handleReveal, onNext]
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'Hard':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div
      className="w-full max-w-2xl mx-auto"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Spot diagnosis card"
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
            {card.difficulty}
          </span>
          {mode === 'timed' && !revealed && (
            <div className={`flex items-center gap-2 ${timeLeft <= 3 ? 'text-red-600' : 'text-gray-600'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono font-medium">{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          <Image
            src={card.image_url}
            alt="Spot diagnosis image"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Classic mode - tap to reveal */}
          {mode === 'classic' && !revealed && (
            <button
              onClick={handleReveal}
              className="w-full py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Tap to Reveal Diagnosis
            </button>
          )}

          {/* MCQ mode - options */}
          {mode === 'mcq' && !revealed && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-4">Select the correct diagnosis:</p>
              {mcqOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMCQSelect(option)}
                  className="w-full py-3 px-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Timed mode - waiting */}
          {mode === 'timed' && !revealed && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">What is the diagnosis?</p>
              <button
                onClick={handleReveal}
                className="py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Reveal Answer
              </button>
            </div>
          )}

          {/* Revealed content */}
          {revealed && (
            <div className="space-y-4">
              {/* MCQ feedback */}
              {mode === 'mcq' && selectedOption && (
                <div
                  className={`p-3 rounded-lg ${
                    selectedOption === card.diagnosis
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p className={`font-medium ${selectedOption === card.diagnosis ? 'text-green-700' : 'text-red-700'}`}>
                    {selectedOption === card.diagnosis ? 'Correct!' : 'Incorrect'}
                  </p>
                </div>
              )}

              {/* Diagnosis */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{card.diagnosis}</h3>
                {card.description && <p className="text-gray-600 mt-2">{card.description}</p>}
              </div>

              {/* Key features */}
              {card.key_features && card.key_features.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {card.key_features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exam tips */}
              {card.exam_tips && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Exam Tip:</h4>
                  <p className="text-sm text-blue-700">{card.exam_tips}</p>
                </div>
              )}

              {/* Next button */}
              <button
                onClick={onNext}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
