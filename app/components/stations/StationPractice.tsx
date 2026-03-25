'use client'

import { useState, useCallback } from 'react'
import { PacesStation } from '@/app/types/stations'
import StationTimer from './StationTimer'
import Link from 'next/link'

interface StationPracticeProps {
  station: PacesStation
  onComplete?: () => void
  nextStationId?: string
}

export default function StationPractice({
  station,
  onComplete,
  nextStationId
}: StationPracticeProps) {
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set())

  const handleRevealAnswer = useCallback(() => {
    setAnswerRevealed(true)
  }, [])

  const handleTimeUp = useCallback(() => {
    // Optionally auto-reveal answer when time is up
    // setAnswerRevealed(true)
  }, [])

  const toggleQuestion = useCallback((index: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }, [])

  const getStationTypeLabel = (stationType: string): string => {
    return stationType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getDifficultyColor = (difficulty: string): string => {
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold">
            {station.station_number}
          </span>
          <span className="text-sm text-gray-500">
            {getStationTypeLabel(station.station_type)}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(station.difficulty)}`}>
            {station.difficulty}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{station.title}</h1>
      </div>

      {/* Timer Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4 text-center">
          Station Timer ({Math.floor(station.time_limit_seconds / 60)} minutes)
        </h2>
        <StationTimer
          initialSeconds={station.time_limit_seconds}
          onTimeUp={handleTimeUp}
        />
      </div>

      {/* Scenario */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Scenario
        </h2>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
          {station.scenario_text}
        </div>
      </div>

      {/* Patient Information */}
      {station.patient_info && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Patient Information
          </h2>
          <div className="prose prose-sm max-w-none text-blue-800 whitespace-pre-wrap">
            {station.patient_info}
          </div>
        </div>
      )}

      {/* Task Instructions */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Your Task
        </h2>
        <div className="prose prose-sm max-w-none text-amber-800 whitespace-pre-wrap">
          {station.task_instructions}
        </div>
      </div>

      {/* Reveal Answer Button */}
      {!answerRevealed && (
        <div className="text-center mb-6">
          <button
            onClick={handleRevealAnswer}
            className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Reveal Model Answer
          </button>
        </div>
      )}

      {/* Model Answer & Marking Criteria (Hidden until revealed) */}
      {answerRevealed && (
        <>
          {/* Model Answer */}
          {station.model_answer && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Model Answer
              </h2>
              <div className="prose prose-sm max-w-none text-green-800 whitespace-pre-wrap">
                {station.model_answer}
              </div>
            </div>
          )}

          {/* Marking Criteria */}
          {station.marking_criteria && station.marking_criteria.length > 0 && (
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Marking Criteria
              </h2>
              <div className="space-y-3">
                {station.marking_criteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-4 p-3 bg-white rounded-lg border border-purple-100"
                  >
                    <span className="text-sm text-purple-800">{criterion.criterion}</span>
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
                      {criterion.marks}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t border-purple-200">
                  <span className="font-semibold text-purple-900">Total Marks</span>
                  <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-purple-600 text-white font-bold">
                    {station.marking_criteria.reduce((sum, c) => sum + c.marks, 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Examiner Questions */}
          {station.examiner_questions && station.examiner_questions.length > 0 && (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Examiner Questions
              </h2>
              <div className="space-y-3">
                {station.examiner_questions.map((eq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">
                        Q{index + 1}: {eq.question}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedQuestions.has(index) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedQuestions.has(index) && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600 font-medium mb-2">Ideal Answer:</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{eq.ideal_answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete Button */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link
              href="/dashboard/stations"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Stations
            </Link>

            {nextStationId && (
              <Link
                href={`/dashboard/stations/${nextStationId}/practice`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                Next Station
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}

            {onComplete && !nextStationId && (
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark Complete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
