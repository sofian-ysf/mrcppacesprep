'use client'

import { StudyMode } from '@/app/types/spot-diagnosis'

interface StudyModeSelectorProps {
  currentMode: StudyMode
  onModeChange: (mode: StudyMode) => void
}

const modes: { value: StudyMode; label: string; description: string }[] = [
  { value: 'classic', label: 'Classic', description: 'Flip cards to reveal diagnosis' },
  { value: 'mcq', label: 'MCQ', description: 'Multiple choice questions' },
  { value: 'timed', label: 'Timed', description: '10 second challenge' },
]

export default function StudyModeSelector({ currentMode, onModeChange }: StudyModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onModeChange(mode.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentMode === mode.value
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
          title={mode.description}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}
