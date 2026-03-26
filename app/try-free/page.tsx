'use client'

import { useState } from 'react'
import Link from 'next/link'
import FAQSection from '@/app/components/FAQSection'
import {
  demoSpotDiagnoses,
  demoStations,
  demoDifferentials,
  demoSBAs,
  demoFAQs,
  DemoSpotDiagnosis,
  DemoStation,
  DemoDifferential,
  DemoSBA
} from './demoContent'

type TabType = 'spot-diagnosis' | 'stations' | 'differentials' | 'sbas'

const tabs: { id: TabType; label: string; count: number }[] = [
  { id: 'spot-diagnosis', label: 'Spot Diagnosis', count: demoSpotDiagnoses.length },
  { id: 'stations', label: 'Stations', count: demoStations.length },
  { id: 'differentials', label: 'Differentials', count: demoDifferentials.length },
  { id: 'sbas', label: 'SBAs', count: demoSBAs.length },
]

// Demo Badge Component
function DemoBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
      DEMO
    </span>
  )
}

// Spot Diagnosis Card Component
function SpotDiagnosisCard({ item, isRevealed, onReveal }: { item: DemoSpotDiagnosis; isRevealed: boolean; onReveal: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DemoBadge />
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            item.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
            item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {item.difficulty}
          </span>
        </div>
      </div>

      {/* Image Placeholder */}
      <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
        <div className="text-center p-4">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-400">Clinical Image</p>
          <p className="text-xs text-gray-400 mt-1">(Demo placeholder)</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {!isRevealed ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">What is the diagnosis?</p>
            <button
              onClick={onReveal}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Reveal Answer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{item.diagnosis}</h3>
              <p className="text-gray-600 mt-1">{item.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
              <ul className="space-y-1">
                {item.key_features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5">&#10003;</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-1">Exam Tips:</h4>
              <p className="text-sm text-blue-800">{item.exam_tips}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Station Card Component
function StationCard({ item, isRevealed, onReveal }: { item: DemoStation; isRevealed: boolean; onReveal: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-sm font-bold">
            {item.station_number}
          </span>
          <span className="text-sm font-medium text-gray-900">{item.title}</span>
          <DemoBadge />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase">{item.station_type}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            item.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
            item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {item.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Scenario:</h4>
          <p className="text-gray-700">{item.scenario_text}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-1">Patient Information:</h4>
          <p className="text-sm text-gray-700">{item.patient_info}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 mb-1">Task:</h4>
          <p className="text-sm text-blue-800">{item.task_instructions}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Time limit: {Math.floor(item.time_limit_seconds / 60)} minutes</span>
        </div>

        {!isRevealed ? (
          <button
            onClick={onReveal}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Show Model Answer
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Model Answer:</h4>
            <div className="text-sm text-green-800 whitespace-pre-line">{item.model_answer}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Differential Card Component
function DifferentialCard({ item, isFlipped, onFlip }: { item: DemoDifferential; isFlipped: boolean; onFlip: () => void }) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer min-h-[300px]"
      onClick={onFlip}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DemoBadge />
          <span className="text-xs text-gray-500">{item.category}</span>
        </div>
        <span className="text-xs text-gray-400">{isFlipped ? 'Click to flip back' : 'Click to reveal'}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        {!isFlipped ? (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.sign_name}</h3>
            <p className="text-gray-500">What are the differential diagnoses?</p>
            <div className="mt-6">
              <svg className="w-8 h-8 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{item.sign_name} - Differentials</h3>

            <div>
              <h4 className="text-sm font-medium text-green-700 mb-1">Common:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
                {item.differentials_list.common.map((diff, i) => (
                  <li key={i}>{diff}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-yellow-700 mb-1">Less Common:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
                {item.differentials_list.less_common.map((diff, i) => (
                  <li key={i}>{diff}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-red-700 mb-1">Rare but Important:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
                {item.differentials_list.rare_but_important.map((diff, i) => (
                  <li key={i}>{diff}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <h4 className="font-medium text-amber-900 mb-1">Memory Aid:</h4>
              <p className="text-sm text-amber-800">{item.memory_aid}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// SBA Question Component
function SBAQuestion({ item, selectedAnswer, hasSubmitted, onSelect, onSubmit }: {
  item: DemoSBA
  selectedAnswer: string | null
  hasSubmitted: boolean
  onSelect: (answer: string) => void
  onSubmit: () => void
}) {
  const isCorrect = selectedAnswer === item.correct_answer

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <DemoBadge />
          <span className="text-sm font-medium text-gray-700">Single Best Answer</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          item.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
          item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {item.difficulty}
        </span>
      </div>

      {/* Question */}
      <div className="p-4">
        <p className="text-gray-900 leading-relaxed whitespace-pre-line mb-4">{item.question_text}</p>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {item.options.map((option) => {
            const isSelected = selectedAnswer === option.letter
            const isCorrectAnswer = option.letter === item.correct_answer

            let style = 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            if (hasSubmitted) {
              if (isCorrectAnswer) style = 'border-green-500 bg-green-50'
              else if (isSelected) style = 'border-red-500 bg-red-50'
              else style = 'border-gray-200 opacity-50'
            } else if (isSelected) {
              style = 'border-gray-900 bg-gray-50'
            }

            return (
              <button
                key={option.letter}
                onClick={() => !hasSubmitted && onSelect(option.letter)}
                disabled={hasSubmitted}
                className={`w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all ${style}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    hasSubmitted && isCorrectAnswer ? 'bg-green-500 text-white' :
                    hasSubmitted && isSelected ? 'bg-red-500 text-white' :
                    isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {option.letter}
                  </span>
                  <span className="text-sm text-gray-900">{option.text}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Submit Button */}
        {!hasSubmitted && (
          <button
            onClick={onSubmit}
            disabled={!selectedAnswer}
            className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
              selectedAnswer ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        )}

        {/* Feedback */}
        {hasSubmitted && (
          <div className="space-y-3 mt-4">
            {/* Result Banner */}
            <div className={`rounded-lg p-3 flex items-center gap-3 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {isCorrect ? (
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className={`text-sm font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct!' : `Incorrect - Answer: ${item.correct_answer}`}
              </span>
            </div>

            {/* Explanation */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
              <p className="text-sm text-gray-700 whitespace-pre-line">{item.explanation}</p>
            </div>

            {/* Key Points */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Points:</h4>
              <ul className="space-y-1">
                {item.key_points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-gray-400">&#8226;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinical Pearl */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <h4 className="font-medium text-amber-900 mb-1">Clinical Pearl:</h4>
              <p className="text-sm text-amber-800">{item.clinical_pearl}</p>
            </div>

            {/* Exam Tip */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-1">Exam Tip:</h4>
              <p className="text-sm text-blue-800">{item.exam_tip}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TryFreeDemoPage() {
  const [activeTab, setActiveTab] = useState<TabType>('spot-diagnosis')
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0)
  const [spotRevealed, setSpotRevealed] = useState<Record<string, boolean>>({})
  const [currentStationIndex, setCurrentStationIndex] = useState(0)
  const [stationRevealed, setStationRevealed] = useState<Record<string, boolean>>({})
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0)
  const [diffFlipped, setDiffFlipped] = useState<Record<string, boolean>>({})
  const [currentSBAIndex, setCurrentSBAIndex] = useState(0)
  const [sbaAnswers, setSBAAnswers] = useState<Record<string, { selected: string; submitted: boolean }>>({})

  // Navigation handlers
  const handleSpotNext = () => {
    if (currentSpotIndex < demoSpotDiagnoses.length - 1) {
      setCurrentSpotIndex(prev => prev + 1)
    }
  }
  const handleSpotPrev = () => {
    if (currentSpotIndex > 0) {
      setCurrentSpotIndex(prev => prev - 1)
    }
  }

  const handleStationNext = () => {
    if (currentStationIndex < demoStations.length - 1) {
      setCurrentStationIndex(prev => prev + 1)
    }
  }
  const handleStationPrev = () => {
    if (currentStationIndex > 0) {
      setCurrentStationIndex(prev => prev - 1)
    }
  }

  const handleDiffNext = () => {
    if (currentDiffIndex < demoDifferentials.length - 1) {
      setCurrentDiffIndex(prev => prev + 1)
    }
  }
  const handleDiffPrev = () => {
    if (currentDiffIndex > 0) {
      setCurrentDiffIndex(prev => prev - 1)
    }
  }

  const handleSBANext = () => {
    if (currentSBAIndex < demoSBAs.length - 1) {
      setCurrentSBAIndex(prev => prev + 1)
    }
  }
  const handleSBAPrev = () => {
    if (currentSBAIndex > 0) {
      setCurrentSBAIndex(prev => prev - 1)
    }
  }

  const currentSpot = demoSpotDiagnoses[currentSpotIndex]
  const currentStation = demoStations[currentStationIndex]
  const currentDiff = demoDifferentials[currentDiffIndex]
  const currentSBA = demoSBAs[currentSBAIndex]

  return (
    <div className="min-h-screen bg-[#fbfaf4]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">Free Demo</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  Try Before You Subscribe
                </span>
              </div>
              <p className="text-gray-600">Explore sample content from all MRCP PACES modules</p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Get Full Access
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Spot Diagnosis Tab */}
        {activeTab === 'spot-diagnosis' && (
          <div>
            {/* Progress */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleSpotPrev}
                disabled={currentSpotIndex === 0}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{currentSpotIndex + 1}</span> of{' '}
                <span className="font-medium text-gray-900">{demoSpotDiagnoses.length}</span>
              </span>
              <button
                onClick={handleSpotNext}
                disabled={currentSpotIndex === demoSpotDiagnoses.length - 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <SpotDiagnosisCard
              item={currentSpot}
              isRevealed={spotRevealed[currentSpot.id] || false}
              onReveal={() => setSpotRevealed(prev => ({ ...prev, [currentSpot.id]: true }))}
            />

            {/* Progress bar */}
            <div className="mt-6 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentSpotIndex + 1) / demoSpotDiagnoses.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Stations Tab */}
        {activeTab === 'stations' && (
          <div>
            {/* Progress */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleStationPrev}
                disabled={currentStationIndex === 0}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{currentStationIndex + 1}</span> of{' '}
                <span className="font-medium text-gray-900">{demoStations.length}</span>
              </span>
              <button
                onClick={handleStationNext}
                disabled={currentStationIndex === demoStations.length - 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <StationCard
              item={currentStation}
              isRevealed={stationRevealed[currentStation.id] || false}
              onReveal={() => setStationRevealed(prev => ({ ...prev, [currentStation.id]: true }))}
            />

            {/* Progress bar */}
            <div className="mt-6 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStationIndex + 1) / demoStations.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Differentials Tab */}
        {activeTab === 'differentials' && (
          <div>
            {/* Progress */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleDiffPrev}
                disabled={currentDiffIndex === 0}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{currentDiffIndex + 1}</span> of{' '}
                <span className="font-medium text-gray-900">{demoDifferentials.length}</span>
              </span>
              <button
                onClick={handleDiffNext}
                disabled={currentDiffIndex === demoDifferentials.length - 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <DifferentialCard
              item={currentDiff}
              isFlipped={diffFlipped[currentDiff.id] || false}
              onFlip={() => setDiffFlipped(prev => ({ ...prev, [currentDiff.id]: !prev[currentDiff.id] }))}
            />

            {/* Progress bar */}
            <div className="mt-6 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentDiffIndex + 1) / demoDifferentials.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* SBAs Tab */}
        {activeTab === 'sbas' && (
          <div>
            {/* Progress */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleSBAPrev}
                disabled={currentSBAIndex === 0}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{currentSBAIndex + 1}</span> of{' '}
                <span className="font-medium text-gray-900">{demoSBAs.length}</span>
              </span>
              <button
                onClick={handleSBANext}
                disabled={currentSBAIndex === demoSBAs.length - 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <SBAQuestion
              item={currentSBA}
              selectedAnswer={sbaAnswers[currentSBA.id]?.selected || null}
              hasSubmitted={sbaAnswers[currentSBA.id]?.submitted || false}
              onSelect={(answer) => setSBAAnswers(prev => ({
                ...prev,
                [currentSBA.id]: { selected: answer, submitted: false }
              }))}
              onSubmit={() => setSBAAnswers(prev => ({
                ...prev,
                [currentSBA.id]: { ...prev[currentSBA.id], submitted: true }
              }))}
            />

            {/* Progress bar */}
            <div className="mt-6 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentSBAIndex + 1) / demoSBAs.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* What's in Full Version */}
        <div className="mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 text-white">
          <h2 className="text-xl font-bold mb-4">What&apos;s in the Full Version?</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">2,000+ Questions</h3>
                <p className="text-sm text-gray-300">Across all PACES stations and topics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Progress Tracking</h3>
                <p className="text-sm text-gray-300">Monitor your performance over time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Spaced Repetition</h3>
                <p className="text-sm text-gray-300">Smart review scheduling for retention</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Mock Exams</h3>
                <p className="text-sm text-gray-300">Timed tests simulating real exam</p>
              </div>
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Full Access
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <FAQSection
            faqs={demoFAQs}
            title="Frequently Asked Questions"
            className="bg-white rounded-xl border border-gray-200 p-6"
          />
        </div>
      </div>

      {/* Persistent Bottom CTA - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="text-sm">
          <span className="text-gray-500">Ready to start?</span>
        </div>
        <Link
          href="/pricing"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Get Full Access
        </Link>
      </div>

      {/* Bottom padding for mobile CTA */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}
