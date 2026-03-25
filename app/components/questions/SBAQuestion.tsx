'use client'

import { Question, QuestionOption } from '@/app/types/questions'

interface SBAQuestionProps {
  question: Question
  selectedAnswer: string | null
  onSelectAnswer: (answer: string) => void
  showFeedback: boolean
  isCorrect?: boolean
}

export default function SBAQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  showFeedback,
  isCorrect
}: SBAQuestionProps) {
  const options = question.options as QuestionOption[]

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-900 whitespace-pre-wrap">{question.question_text}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options?.map((option) => {
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
    </div>
  )
}
