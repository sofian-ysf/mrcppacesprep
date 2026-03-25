'use client'

import { useState, useEffect, useRef } from 'react'

export default function Scratchpad() {
  const [content, setContent] = useState('')
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('scratchpad_content')
    if (saved) {
      setContent(saved)
      setCharCount(saved.length)
    }
  }, [])

  // Save to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem('scratchpad_content', content)
    setCharCount(content.length)
  }, [content])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleClear = () => {
    if (content.trim()) {
      setShowClearConfirm(true)
    }
  }

  const confirmClear = () => {
    setContent('')
    setShowClearConfirm(false)
    textareaRef.current?.focus()
  }

  const cancelClear = () => {
    setShowClearConfirm(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-2">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Working Notes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{charCount} chars</span>
          <button
            onClick={handleClear}
            disabled={!content.trim()}
            className="text-xs px-2 py-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:bg-transparent"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
          <p className="text-sm text-yellow-800 mb-2">Clear all notes?</p>
          <div className="flex gap-2">
            <button
              onClick={confirmClear}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear
            </button>
            <button
              onClick={cancelClear}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Textarea */}
      <div className="flex-1 min-h-0">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder="Use this space to work out your calculations...

Example:
- Total dose = weight x dose/kg
- 70 kg x 5 mg/kg = 350 mg
- Daily doses = 350 mg x 3 = 1050 mg"
          className="w-full h-full min-h-[200px] p-3 text-sm font-mono bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400"
        />
      </div>

      {/* Tips */}
      <div className="pt-3 border-t border-gray-200 mt-2">
        <p className="text-xs text-gray-500">
          Notes are saved automatically and persist across questions in this session.
        </p>
      </div>
    </div>
  )
}
