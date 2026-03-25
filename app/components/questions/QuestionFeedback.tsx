'use client'

import { useState, useEffect } from 'react'
import {
  FeedbackHeader,
  KeyPointsSection,
  ClinicalPearlBox,
  WhyWrongAccordion,
  ExamTipBanner,
  RelatedTopicsLinks
} from './feedback'
import { formatBoldText } from '@/app/lib/formatText'

interface StructuredExplanation {
  summary: string
  key_points: string[]
  clinical_pearl: string
  why_wrong: Record<string, string>
  exam_tip: string
  related_topics: string[]
}

interface QuestionOption {
  letter: string
  text: string
}

interface QuestionFeedbackProps {
  isCorrect: boolean
  explanation: string
  enhancedExplanation?: string | null
  explanationStructured?: StructuredExplanation | null
  questionType?: string
  onNext: () => void
  isLastQuestion: boolean
  questionId?: string
  correctAnswer?: string
  options?: QuestionOption[] | null
  streakCount?: number
  showEncouragement?: boolean
}

export default function QuestionFeedback({
  isCorrect,
  explanation,
  enhancedExplanation,
  explanationStructured,
  questionType,
  onNext,
  isLastQuestion,
  questionId,
  correctAnswer,
  options,
  streakCount = 0,
  showEncouragement = true
}: QuestionFeedbackProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [showBookmarkToast, setShowBookmarkToast] = useState(false)
  const [showStepByStep, setShowStepByStep] = useState(true)

  // Notes state
  const [showNotes, setShowNotes] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [existingNote, setExistingNote] = useState<string | null>(null)
  const [noteSaving, setNoteSaving] = useState(false)
  const [noteStatus, setNoteStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  // Check bookmark status and existing notes on mount
  useEffect(() => {
    if (questionId) {
      checkBookmarkStatus()
      fetchExistingNote()
    }
  }, [questionId])

  const checkBookmarkStatus = async () => {
    if (!questionId) return
    try {
      const res = await fetch(`/api/questions/bookmark?question_id=${questionId}`)
      if (res.ok) {
        const data = await res.json()
        setIsBookmarked(data.isBookmarked)
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error)
    }
  }

  const fetchExistingNote = async () => {
    if (!questionId) return
    try {
      const res = await fetch(`/api/notes?question_id=${questionId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.notes && data.notes.length > 0) {
          setExistingNote(data.notes[0].content)
          setNoteContent(data.notes[0].content)
        }
      }
    } catch (error) {
      console.error('Error fetching note:', error)
    }
  }

  const toggleBookmark = async () => {
    if (!questionId || bookmarkLoading) return

    setBookmarkLoading(true)
    try {
      const res = await fetch('/api/questions/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: questionId })
      })

      if (res.ok) {
        const data = await res.json()
        setIsBookmarked(data.isBookmarked)
        setShowBookmarkToast(true)
        setTimeout(() => setShowBookmarkToast(false), 2000)
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setBookmarkLoading(false)
    }
  }

  const saveNote = async () => {
    if (!questionId || !noteContent.trim()) return

    setNoteSaving(true)
    setNoteStatus('idle')

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          content: noteContent.trim()
        })
      })

      if (res.ok) {
        setExistingNote(noteContent.trim())
        setNoteStatus('saved')
        setTimeout(() => setNoteStatus('idle'), 2000)
      } else {
        setNoteStatus('error')
      }
    } catch (error) {
      console.error('Error saving note:', error)
      setNoteStatus('error')
    } finally {
      setNoteSaving(false)
    }
  }

  const deleteNote = async () => {
    if (!questionId) return

    setNoteSaving(true)
    try {
      const res = await fetch(`/api/notes?question_id=${questionId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setNoteContent('')
        setExistingNote(null)
        setShowNotes(false)
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    } finally {
      setNoteSaving(false)
    }
  }

  // Parse enhanced explanation into steps if it contains numbered steps
  const parseSteps = (text: string): string[] => {
    if (/(?:^|\n)\d+\.\s/.test(text) || /Step\s*\d+/i.test(text)) {
      const lines = text.split('\n').filter(line => line.trim())
      const steps: string[] = []
      let currentStep = ''

      for (const line of lines) {
        if (/^(\d+\.|Step\s*\d+)/i.test(line.trim())) {
          if (currentStep) {
            steps.push(currentStep.trim())
          }
          currentStep = line
        } else {
          currentStep += '\n' + line
        }
      }
      if (currentStep) {
        steps.push(currentStep.trim())
      }

      return steps.length > 1 ? steps : [text]
    }

    return [text]
  }

  const isCalculation = questionType === 'calculation'
  const hasEnhancedExplanation = isCalculation && enhancedExplanation
  const hasStructuredExplanation = !!explanationStructured

  return (
    <div className={`mt-6 p-6 rounded-lg border ${
      isCorrect
        ? 'bg-green-50 border-green-200'
        : 'bg-red-50 border-red-200'
    }`}>
      {/* Bookmark Toast */}
      {showBookmarkToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in">
          {isBookmarked ? 'Question bookmarked!' : 'Bookmark removed'}
        </div>
      )}

      {/* Result Header with Action Buttons */}
      <div className="flex items-center justify-between mb-4">
        <FeedbackHeader isCorrect={isCorrect} streak={showEncouragement ? streakCount : 0} />

        {/* Action Buttons */}
        {questionId && (
          <div className="flex items-center gap-2">
            {/* Notes Button */}
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-full transition-all ${
                existingNote
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
              }`}
              title={existingNote ? 'View/edit note' : 'Add a note'}
            >
              <svg className="w-5 h-5" fill={existingNote ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Bookmark Button */}
            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className={`p-2 rounded-full transition-all ${
                isBookmarked
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
              } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
            >
              {bookmarkLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Notes Section */}
      {showNotes && questionId && (
        <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">Personal Note</h4>
            {existingNote && (
              <button
                onClick={deleteNote}
                disabled={noteSaving}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add your notes about this question..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">
              {noteStatus === 'saved' && (
                <span className="text-green-600 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Saved!
                </span>
              )}
              {noteStatus === 'error' && (
                <span className="text-red-600">Failed to save</span>
              )}
            </div>
            <button
              onClick={saveNote}
              disabled={noteSaving || !noteContent.trim() || noteContent === existingNote}
              className="px-3 py-1 text-xs font-medium bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {noteSaving ? 'Saving...' : existingNote ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </div>
      )}

      {/* Correct Answer (if wrong) */}
      {!isCorrect && correctAnswer && (
        <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">Correct answer: </span>
            {questionType === 'emq' ? (
              <span>
                {(() => {
                  try {
                    const scenarios = JSON.parse(correctAnswer) as Array<{ stem?: string; correct_answer: string }>
                    return scenarios.map((s, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        <span className="font-medium">Scenario {i + 1}:</span> {s.correct_answer}
                      </span>
                    ))
                  } catch {
                    return correctAnswer
                  }
                })()}
              </span>
            ) : (
              correctAnswer
            )}
          </p>
        </div>
      )}

      {/* Structured Explanation Sections (for enhanced questions) */}
      {hasStructuredExplanation && (
        <>
          {/* Summary */}
          <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Summary</h4>
            <p className="text-sm text-gray-700">{formatBoldText(explanationStructured.summary)}</p>
          </div>

          {/* Key Points */}
          <KeyPointsSection points={explanationStructured.key_points} />

          {/* Clinical Pearl */}
          <ClinicalPearlBox pearl={explanationStructured.clinical_pearl} />

          {/* Why Wrong Options */}
          {!isCorrect && (
            <WhyWrongAccordion
              options={options}
              correctAnswer={correctAnswer || ''}
              whyWrong={explanationStructured.why_wrong}
            />
          )}

          {/* Exam Tip */}
          <ExamTipBanner tip={explanationStructured.exam_tip} />

          {/* Related Topics */}
          <RelatedTopicsLinks topics={explanationStructured.related_topics} />
        </>
      )}

      {/* Step-by-Step Working for Calculation Questions (legacy) */}
      {hasEnhancedExplanation && !hasStructuredExplanation && (
        <div className="mb-4">
          <button
            onClick={() => setShowStepByStep(!showStepByStep)}
            className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-blue-800">Step-by-Step Working</span>
            </div>
            <svg
              className={`w-5 h-5 text-blue-600 transition-transform ${showStepByStep ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showStepByStep && (
            <div className="mt-2 p-4 bg-white border border-blue-200 rounded-lg">
              <div className="space-y-3">
                {parseSteps(enhancedExplanation).map((step, index) => {
                  const steps = parseSteps(enhancedExplanation)
                  const isMultipleSteps = steps.length > 1

                  return (
                    <div key={index} className={isMultipleSteps ? "flex gap-3" : ""}>
                      {isMultipleSteps && (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">
                          {index + 1}
                        </div>
                      )}
                      <div className={`flex-1 text-sm text-gray-700 ${isMultipleSteps ? '' : ''}`}>
                        <p className="whitespace-pre-wrap font-mono leading-relaxed">
                          {formatBoldText(step.replace(/^\d+\.\s*|^Step\s*\d+[:\s]*/i, '').trim())}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Standard Explanation (shown if no structured explanation, or as fallback) */}
      {!hasStructuredExplanation && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            {hasEnhancedExplanation ? 'Summary' : 'Explanation'}
          </h4>
          <div className="prose prose-sm prose-gray max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{formatBoldText(explanation)}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          {isLastQuestion ? 'View Results' : 'Next Question'}
        </button>
      </div>
    </div>
  )
}
