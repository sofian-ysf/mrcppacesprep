'use client'

import { useState } from 'react'
import { Question, QuestionOption } from '@/app/types/questions'

interface CalculationQuestionProps {
  question: Question
  selectedAnswer: string | null
  onSelectAnswer: (answer: string) => void
  showFeedback: boolean
  isCorrect?: boolean
}

export default function CalculationQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  showFeedback,
  isCorrect
}: CalculationQuestionProps) {
  const [inputValue, setInputValue] = useState(selectedAnswer || '')

  // Check if this calculation question has multiple choice options
  const hasOptions = question.options && Array.isArray(question.options) && question.options.length > 0
  const options = hasOptions ? (question.options as QuestionOption[]) : null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    onSelectAnswer(value)
  }

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-900 whitespace-pre-wrap">{question.question_text}</p>
      </div>

      {/* Multiple Choice Options (if available) */}
      {hasOptions && options ? (
        <div className="space-y-3">
          {options.map((option) => {
            const isSelected = selectedAnswer === option.letter
            const isCorrectAnswer = option.letter.toLowerCase() === question.correct_answer.toLowerCase()

            let optionClasses = 'w-full p-4 text-left border rounded-lg transition-all flex items-start gap-3'

            if (showFeedback) {
              if (isCorrectAnswer) {
                optionClasses += ' border-green-500 bg-green-50'
              } else if (isSelected && !isCorrectAnswer) {
                optionClasses += ' border-red-500 bg-red-50'
              } else {
                optionClasses += ' border-gray-200 bg-gray-50 opacity-60'
              }
            } else if (isSelected) {
              optionClasses += ' border-black bg-gray-50'
            } else {
              optionClasses += ' border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }

            return (
              <button
                key={option.letter}
                onClick={() => !showFeedback && onSelectAnswer(option.letter)}
                disabled={showFeedback}
                className={optionClasses}
              >
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  showFeedback && isCorrectAnswer
                    ? 'bg-green-500 text-white'
                    : showFeedback && isSelected && !isCorrectAnswer
                    ? 'bg-red-500 text-white'
                    : isSelected
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {option.letter}
                </span>
                <span className="text-gray-900 text-left">{option.text}</span>
              </button>
            )
          })}
        </div>
      ) : (
        /* Free-text Answer Input (for calculation questions without options) */
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Your Answer
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={showFeedback}
              placeholder="Enter your answer (e.g., 250 mg, 2.5 mL)"
              className={`w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 transition-all ${
                showFeedback
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 focus:ring-green-500'
                    : 'border-red-500 bg-red-50 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-black focus:border-black'
              }`}
            />
            {showFeedback && (
              <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                isCorrect ? 'text-green-500' : 'text-red-500'
              }`}>
                {isCorrect ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            )}
          </div>

          {/* Show correct answer if wrong */}
          {showFeedback && !isCorrect && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-medium">Correct answer:</span> {question.correct_answer}
              </p>
            </div>
          )}

          {/* Tips */}
          {!showFeedback && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Include units in your answer (mg, mL, tablets, etc.)</li>
                <li>• Round to appropriate decimal places</li>
                <li>• Double-check your calculations before submitting</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
