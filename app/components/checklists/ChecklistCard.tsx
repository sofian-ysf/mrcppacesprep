'use client'

import { useState } from 'react'
import { ExamChecklist } from '@/app/types/checklists'

interface ChecklistCardProps {
  checklist: ExamChecklist
}

export default function ChecklistCard({ checklist }: ChecklistCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set())

  const toggleStep = (index: number) => {
    const newChecked = new Set(checkedSteps)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedSteps(newChecked)
  }

  const progress = checklist.steps.length > 0
    ? Math.round((checkedSteps.size / checklist.steps.length) * 100)
    : 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-gray-900">
            {checklist.system_name}
          </span>
          <span className="text-xs text-gray-500">
            {checklist.steps.length} steps
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8">{progress}%</span>
          </div>
          {/* Expand/collapse icon */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {/* Steps with checkboxes */}
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Examination Steps</h4>
            <ul className="space-y-2">
              {checklist.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={checkedSteps.has(index)}
                    onChange={() => toggleStep(index)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className={`text-sm ${checkedSteps.has(index) ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {step.step}
                    </span>
                    {step.details && (
                      <p className={`text-xs mt-0.5 ${checkedSteps.has(index) ? 'text-gray-300' : 'text-gray-500'}`}>
                        {step.details}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips section */}
          {checklist.tips && (
            <div className="mx-4 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Tips</h4>
              <p className="text-sm text-blue-700">{checklist.tips}</p>
            </div>
          )}

          {/* Common findings */}
          {checklist.common_findings && checklist.common_findings.length > 0 && (
            <div className="mx-4 mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Common Findings</h4>
              <div className="flex flex-wrap gap-2">
                {checklist.common_findings.map((finding, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                  >
                    {finding}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Presentation template */}
          {checklist.presentation_template && (
            <div className="mx-4 mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
              <h4 className="text-sm font-medium text-green-800 mb-1">Presentation Template</h4>
              <p className="text-sm text-green-700 whitespace-pre-line">{checklist.presentation_template}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
