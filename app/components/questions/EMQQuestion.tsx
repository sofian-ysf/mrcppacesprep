'use client'

import { useState } from 'react'
import { Question, QuestionOption, EMQScenario } from '@/app/types/questions'

interface EMQQuestionProps {
  question: Question
  selectedAnswers: string[]
  onSelectAnswer: (scenarioIndex: number, answer: string) => void
  showFeedback: boolean
}

export default function EMQQuestion({
  question,
  selectedAnswers,
  onSelectAnswer,
  showFeedback
}: EMQQuestionProps) {
  const options = question.options as QuestionOption[]
  const [activeScenario, setActiveScenario] = useState(0)

  // Parse scenarios from correct_answer (stored as JSON string)
  let scenarios: EMQScenario[] = []
  try {
    scenarios = JSON.parse(question.correct_answer)
  } catch {
    scenarios = []
  }

  return (
    <div className="space-y-6">
      {/* Theme/Title */}
      <div className="prose prose-gray max-w-none">
        <h3 className="text-lg font-semibold text-gray-900">{question.question_text}</h3>
      </div>

      {/* Options List */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {options?.map((option) => (
            <div key={option.letter} className="flex items-start gap-2 text-sm">
              <span className="font-medium text-gray-900 w-6">{option.letter}.</span>
              <span className="text-gray-700">{option.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {scenarios.map((_, index) => {
            const hasAnswer = selectedAnswers[index] !== undefined
            const isActive = activeScenario === index

            let tabClass = 'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap'

            if (showFeedback) {
              const isCorrect = selectedAnswers[index] === scenarios[index].correct_answer
              if (isCorrect) {
                tabClass += ' border-green-500 text-green-700 bg-green-50'
              } else {
                tabClass += ' border-red-500 text-red-700 bg-red-50'
              }
            } else if (isActive) {
              tabClass += ' border-black text-gray-900'
            } else if (hasAnswer) {
              tabClass += ' border-gray-300 text-gray-700'
            } else {
              tabClass += ' border-transparent text-gray-500 hover:text-gray-700'
            }

            return (
              <button
                key={index}
                onClick={() => setActiveScenario(index)}
                className={tabClass}
              >
                Scenario {index + 1}
                {hasAnswer && !showFeedback && (
                  <span className="ml-2 text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                    {selectedAnswers[index]}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Scenario */}
      {scenarios[activeScenario] && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-gray-900">{scenarios[activeScenario].stem}</p>
          </div>

          {/* Answer Selection */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Select the best answer:</p>
            <div className="flex flex-wrap gap-2">
              {options?.map((option) => {
                const isSelected = selectedAnswers[activeScenario] === option.letter
                const isCorrectAnswer = option.letter === scenarios[activeScenario].correct_answer

                let btnClass = 'px-4 py-2 text-sm font-medium rounded-lg border transition-all'

                if (showFeedback) {
                  if (isCorrectAnswer) {
                    btnClass += ' border-green-500 bg-green-100 text-green-800'
                  } else if (isSelected && !isCorrectAnswer) {
                    btnClass += ' border-red-500 bg-red-100 text-red-800'
                  } else {
                    btnClass += ' border-gray-200 bg-gray-50 text-gray-400'
                  }
                } else if (isSelected) {
                  btnClass += ' border-black bg-black text-white'
                } else {
                  btnClass += ' border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }

                return (
                  <button
                    key={option.letter}
                    onClick={() => !showFeedback && onSelectAnswer(activeScenario, option.letter)}
                    disabled={showFeedback}
                    className={btnClass}
                  >
                    {option.letter}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Feedback for this scenario */}
          {showFeedback && (
            <div className={`p-3 rounded-lg ${
              selectedAnswers[activeScenario] === scenarios[activeScenario].correct_answer
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className="text-sm">
                {selectedAnswers[activeScenario] === scenarios[activeScenario].correct_answer
                  ? 'Correct!'
                  : `Incorrect. The correct answer is ${scenarios[activeScenario].correct_answer}.`
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress indicator */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {selectedAnswers.filter(Boolean).length} of {scenarios.length} scenarios answered
        </span>
        {!showFeedback && selectedAnswers.filter(Boolean).length < scenarios.length && (
          <span className="text-amber-600">
            Complete all scenarios before submitting
          </span>
        )}
      </div>
    </div>
  )
}
