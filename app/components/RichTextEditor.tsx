'use client'

import { useRef, useEffect, useState } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const saveSelection = (): Range | null => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    return selection.getRangeAt(0)
  }
  return null
}

const restoreSelection = (range: Range) => {
  const selection = window.getSelection()
  if (selection) {
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [savedSelection, setSavedSelection] = useState<Range | null>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      const currentSelection = saveSelection()
      editorRef.current.innerHTML = value
      if (currentSelection) {
        restoreSelection(currentSelection)
      }
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    // Restore selection if we have one saved
    if (savedSelection && editorRef.current?.contains(savedSelection.commonAncestorContainer)) {
      restoreSelection(savedSelection)
    }

    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertLink = () => {
    // Save current selection before showing prompt
    const currentSelection = saveSelection()
    const url = prompt('Enter URL:')

    if (url && currentSelection) {
      // Restore selection before inserting link
      restoreSelection(currentSelection)
      execCommand('createLink', url)
    } else if (url) {
      execCommand('createLink', url)
    }
  }

  const handleInput = () => {
    updateContent()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  const handleMouseUp = () => {
    // Save selection whenever user selects text
    const selection = saveSelection()
    if (selection) {
      setSavedSelection(selection)
    }
  }

  const handleButtonMouseDown = (e: React.MouseEvent) => {
    // Prevent button click from clearing the selection
    e.preventDefault()
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center gap-1 flex-wrap">
        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded transition-colors font-bold"
          title="Bold (Ctrl+B)"
        >
          B
        </button>

        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded transition-colors italic"
          title="Italic (Ctrl+I)"
        >
          I
        </button>

        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCommand('underline')}
          className="p-2 hover:bg-gray-200 rounded transition-colors underline"
          title="Underline (Ctrl+U)"
        >
          U
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCommand('insertUnorderedList')}
          className="px-2 py-1 hover:bg-gray-200 rounded transition-colors text-sm"
          title="Bullet List"
        >
          • List
        </button>

        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={insertLink}
          className="px-2 py-1 hover:bg-gray-200 rounded transition-colors text-sm"
          title="Insert Link"
        >
          🔗 Link
        </button>

        <button
          type="button"
          onMouseDown={handleButtonMouseDown}
          onClick={() => execCommand('removeFormat')}
          className="px-2 py-1 hover:bg-gray-200 rounded transition-colors ml-auto text-sm text-gray-600"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onMouseUp={handleMouseUp}
        onKeyUp={handleMouseUp}
        className="p-3 min-h-[200px] max-h-[400px] overflow-y-auto focus:outline-none"
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          lineHeight: '1.6'
        }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
