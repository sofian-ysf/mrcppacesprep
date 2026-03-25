'use client'

import { useState, useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { pharmacyFormulas } from '@/app/lib/pharmacy-data/formulas'

interface KaTeXProps {
  math: string
  fallback: string
  displayMode?: boolean
}

function KaTeX({ math, fallback, displayMode = false }: KaTeXProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          throwOnError: false,
          displayMode,
          strict: false,
        })
        setError(false)
      } catch {
        setError(true)
      }
    }
  }, [math, displayMode])

  if (error) {
    return <span className="font-mono text-gray-700">{fallback}</span>
  }

  return <span ref={containerRef} />
}

export default function FormulaReference() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {pharmacyFormulas.map((formula, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white"
        >
          {/* Header - always visible */}
          <button
            onClick={() => toggleExpand(index)}
            className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <h3 className="text-sm font-medium text-gray-900">{formula.name}</h3>
              <div className="mt-1">
                <KaTeX
                  math={formula.formula}
                  fallback={formula.formulaText}
                />
              </div>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${expandedIndex === index ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Expanded Content */}
          {expandedIndex === index && (
            <div className="px-3 pb-3 border-t border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-600 mt-2">{formula.description}</p>

              {formula.variables && formula.variables.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Variables:</p>
                  <div className="space-y-1">
                    {formula.variables.map((variable, vIndex) => (
                      <div key={vIndex} className="flex text-xs">
                        <span className="font-mono text-gray-700 w-24 flex-shrink-0">{variable.symbol}</span>
                        <span className="text-gray-600">{variable.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formula.example && (
                <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-1">Example:</p>
                  <p className="text-xs font-mono text-gray-700">{formula.example}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Footer Note */}
      <p className="text-xs text-gray-500 text-center pt-2">
        Common pharmaceutical calculation formulas
      </p>
    </div>
  )
}
