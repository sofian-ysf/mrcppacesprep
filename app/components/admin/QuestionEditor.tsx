'use client'

import { useState, useEffect } from 'react'

interface Option {
  letter: string
  text: string
}

interface StructuredExplanation {
  summary: string
  key_points: string[]
  clinical_pearl: string
  why_wrong: Record<string, string>
  exam_tip: string
  related_topics: string[]
}

interface Question {
  id: string
  question_text: string
  options: Option[] | null
  correct_answer: string
  explanation: string
  explanation_structured?: StructuredExplanation | null
  difficulty: 'Easy' | 'Medium' | 'Hard'
  status: string
  question_categories?: { id: string; name: string; slug: string }
}

interface QuestionEditorProps {
  question: Question
  onSave: (updates: Partial<Question>) => Promise<void>
  saving: boolean
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

const emptyStructured: StructuredExplanation = {
  summary: '',
  key_points: [],
  clinical_pearl: '',
  why_wrong: {},
  exam_tip: '',
  related_topics: []
}

export default function QuestionEditor({ question, onSave, saving, saveStatus }: QuestionEditorProps) {
  const [questionText, setQuestionText] = useState(question.question_text)
  const [options, setOptions] = useState<Option[]>(question.options || [])
  const [correctAnswer, setCorrectAnswer] = useState(question.correct_answer)
  const [explanation, setExplanation] = useState(question.explanation)

  // Structured explanation state
  const [structured, setStructured] = useState<StructuredExplanation>(
    question.explanation_structured || emptyStructured
  )
  const [hasChanges, setHasChanges] = useState(false)

  // Reset form when question changes
  useEffect(() => {
    setQuestionText(question.question_text)
    setOptions(question.options || [])
    setCorrectAnswer(question.correct_answer)
    setExplanation(question.explanation)
    setStructured(question.explanation_structured || emptyStructured)
    setHasChanges(false)
  }, [question.id])

  // Track changes
  useEffect(() => {
    const changed =
      questionText !== question.question_text ||
      JSON.stringify(options) !== JSON.stringify(question.options || []) ||
      correctAnswer !== question.correct_answer ||
      explanation !== question.explanation ||
      JSON.stringify(structured) !== JSON.stringify(question.explanation_structured || emptyStructured)
    setHasChanges(changed)
  }, [questionText, options, correctAnswer, explanation, structured, question])

  function updateOption(index: number, text: string) {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], text }
    setOptions(newOptions)
  }

  function updateStructured<K extends keyof StructuredExplanation>(
    key: K,
    value: StructuredExplanation[K]
  ) {
    setStructured(prev => ({ ...prev, [key]: value }))
  }

  function updateKeyPoint(index: number, value: string) {
    const newPoints = [...structured.key_points]
    newPoints[index] = value
    updateStructured('key_points', newPoints)
  }

  function addKeyPoint() {
    updateStructured('key_points', [...structured.key_points, ''])
  }

  function removeKeyPoint(index: number) {
    const newPoints = structured.key_points.filter((_, i) => i !== index)
    updateStructured('key_points', newPoints)
  }

  function updateWhyWrong(letter: string, value: string) {
    updateStructured('why_wrong', { ...structured.why_wrong, [letter]: value })
  }

  function updateRelatedTopic(index: number, value: string) {
    const newTopics = [...structured.related_topics]
    newTopics[index] = value
    updateStructured('related_topics', newTopics)
  }

  function addRelatedTopic() {
    updateStructured('related_topics', [...structured.related_topics, ''])
  }

  function removeRelatedTopic(index: number) {
    const newTopics = structured.related_topics.filter((_, i) => i !== index)
    updateStructured('related_topics', newTopics)
  }

  // Get wrong options (all options except the correct answer)
  const wrongOptions = options.filter(opt => opt.letter !== correctAnswer)

  return (
    <div className="grid grid-cols-2 gap-6 h-full overflow-auto">
      {/* Left Column - Question & Options */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={option.letter} className="flex items-center gap-2">
                <span className={`w-6 h-6 flex items-center justify-center rounded text-sm font-medium ${
                  option.letter === correctAnswer
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {option.letter}
                </span>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Answer
          </label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {options.map((option) => (
              <option key={option.letter} value={option.letter}>
                {option.letter} - {option.text.substring(0, 50)}{option.text.length > 50 ? '...' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Column - Structured Explanation */}
      <div className="space-y-4 overflow-auto">
        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary
          </label>
          <textarea
            value={structured.summary}
            onChange={(e) => updateStructured('summary', e.target.value)}
            rows={3}
            placeholder="Brief summary of the correct answer..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Key Points */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-blue-700">
              Key Points
            </label>
            <button
              type="button"
              onClick={addKeyPoint}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              + Add Point
            </button>
          </div>
          <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            {structured.key_points.length === 0 ? (
              <p className="text-sm text-blue-600 italic">No key points yet. Click "Add Point" to add one.</p>
            ) : (
              structured.key_points.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 font-medium mt-2">{index + 1}.</span>
                  <textarea
                    value={point}
                    onChange={(e) => updateKeyPoint(index, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeKeyPoint(index)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Clinical Pearl */}
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            💡 Clinical Pearl
          </label>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <textarea
              value={structured.clinical_pearl}
              onChange={(e) => updateStructured('clinical_pearl', e.target.value)}
              rows={2}
              placeholder="Practical clinical insight or memory aid..."
              className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
          </div>
        </div>

        {/* Why Wrong */}
        <div>
          <label className="block text-sm font-medium text-red-700 mb-2">
            Why Wrong Options Are Incorrect
          </label>
          <div className="space-y-2 p-3 bg-red-50 rounded-lg border border-red-200">
            {wrongOptions.length === 0 ? (
              <p className="text-sm text-red-600 italic">No wrong options to explain.</p>
            ) : (
              wrongOptions.map((option) => (
                <div key={option.letter}>
                  <label className="block text-xs font-medium text-red-600 mb-1">
                    Option {option.letter}: {option.text.substring(0, 40)}{option.text.length > 40 ? '...' : ''}
                  </label>
                  <textarea
                    value={structured.why_wrong[option.letter] || ''}
                    onChange={(e) => updateWhyWrong(option.letter, e.target.value)}
                    rows={2}
                    placeholder={`Why ${option.letter} is incorrect...`}
                    className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Exam Tip */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Tip
          </label>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <textarea
              value={structured.exam_tip}
              onChange={(e) => updateStructured('exam_tip', e.target.value)}
              rows={2}
              placeholder="Exam-specific advice or common pitfalls..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white"
            />
          </div>
        </div>

        {/* Related Topics */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Related Topics
            </label>
            <button
              type="button"
              onClick={addRelatedTopic}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              + Add Topic
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {structured.related_topics.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No related topics yet.</p>
            ) : (
              structured.related_topics.map((topic, index) => (
                <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateRelatedTopic(index, e.target.value)}
                    placeholder="Topic name"
                    className="bg-transparent border-none text-sm focus:outline-none w-32"
                  />
                  <button
                    type="button"
                    onClick={() => removeRelatedTopic(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Plain Explanation (collapsed) */}
        <details className="mt-4">
          <summary className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">
            Plain Text Explanation (fallback)
          </summary>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={4}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </details>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onSave({
              question_text: questionText,
              options,
              correct_answer: correctAnswer,
              explanation,
              explanation_structured: structured
            })}
            disabled={saving || !hasChanges}
            className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              saveStatus === 'saved'
                ? 'bg-green-600 text-white'
                : saveStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : saveStatus === 'error' ? (
              'Error - Try Again'
            ) : hasChanges ? (
              'Save Changes'
            ) : (
              'No Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export { type Question, type Option, type StructuredExplanation }
