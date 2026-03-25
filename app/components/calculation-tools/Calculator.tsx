'use client'

import { useState, useEffect, useCallback } from 'react'
import Decimal from 'decimal.js'

interface CalculatorProps {
  onCopyResult?: (value: string) => void
}

interface HistoryEntry {
  expression: string
  result: string
}

// Configure Decimal.js for pharmacy calculations
Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
})

export default function Calculator({ onCopyResult }: CalculatorProps) {
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState<Decimal>(new Decimal(0))
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [decimalPlaces, setDecimalPlaces] = useState(2)
  const [lastOperation, setLastOperation] = useState<string>('')
  const [clearOnNextInput, setClearOnNextInput] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)

  // Load state from sessionStorage
  useEffect(() => {
    const savedState = sessionStorage.getItem('calculator_state')
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        setMemory(new Decimal(state.memory || 0))
        setHistory(state.history || [])
        setDecimalPlaces(state.decimalPlaces || 2)
      } catch {
        // Ignore invalid state
      }
    }
  }, [])

  // Save state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('calculator_state', JSON.stringify({
      memory: memory.toString(),
      history,
      decimalPlaces
    }))
  }, [memory, history, decimalPlaces])

  const formatNumber = useCallback((num: Decimal): string => {
    if (!num.isFinite()) return 'Error'

    // Format with specified decimal places, removing trailing zeros
    const fixed = num.toFixed(decimalPlaces)
    const parsed = parseFloat(fixed)

    // Use toLocaleString for nice formatting but keep it simple for calculations
    if (Math.abs(parsed) >= 1e10 || (Math.abs(parsed) < 1e-6 && parsed !== 0)) {
      return num.toExponential(decimalPlaces)
    }

    return parsed.toString()
  }, [decimalPlaces])

  // Parse and evaluate expression using Decimal.js
  const evaluateExpression = useCallback((expr: string): Decimal | null => {
    try {
      // Tokenize the expression
      const tokens = expr.match(/(\d+\.?\d*|[+\-x÷%])/g)
      if (!tokens) return null

      // Convert to numbers and operators
      const values: Decimal[] = []
      const operators: string[] = []

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i].trim()
        if (!token) continue

        if (['+', '-', 'x', '÷', '%'].includes(token)) {
          operators.push(token)
        } else {
          values.push(new Decimal(token))
        }
      }

      if (values.length === 0) return null

      // Process multiplication and division first (operator precedence)
      let i = 0
      while (i < operators.length) {
        if (operators[i] === 'x' || operators[i] === '÷' || operators[i] === '%') {
          const left = values[i]
          const right = values[i + 1]
          let result: Decimal

          if (operators[i] === 'x') {
            result = left.times(right)
          } else if (operators[i] === '÷') {
            if (right.isZero()) {
              return null // Division by zero
            }
            result = left.dividedBy(right)
          } else {
            result = left.modulo(right)
          }

          values.splice(i, 2, result)
          operators.splice(i, 1)
        } else {
          i++
        }
      }

      // Process addition and subtraction
      let result = values[0]
      for (let j = 0; j < operators.length; j++) {
        if (operators[j] === '+') {
          result = result.plus(values[j + 1])
        } else if (operators[j] === '-') {
          result = result.minus(values[j + 1])
        }
      }

      return result
    } catch {
      return null
    }
  }, [])

  const handleNumber = (num: string) => {
    setError(false)
    if (clearOnNextInput) {
      setDisplay(num)
      setClearOnNextInput(false)
    } else if (display === '0' && num !== '.') {
      setDisplay(num)
    } else if (num === '.' && display.split(/[+\-x÷]/).pop()?.includes('.')) {
      // Don't add another decimal to the current number
      return
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperator = (op: string) => {
    setError(false)
    // Don't add operator if last character is already an operator
    const lastChar = display.trim().slice(-1)
    if (['+', '-', 'x', '÷'].includes(lastChar)) {
      setDisplay(display.slice(0, -2) + ' ' + op + ' ')
    } else {
      setDisplay(display + ' ' + op + ' ')
    }
    setClearOnNextInput(false)
  }

  const handleEquals = () => {
    const result = evaluateExpression(display)

    if (result === null) {
      setDisplay('Error')
      setError(true)
      setClearOnNextInput(true)
      return
    }

    const formattedResult = formatNumber(result)

    // Add to history
    setHistory(prev => {
      const newHistory = [{ expression: display, result: formattedResult }, ...prev]
      return newHistory.slice(0, 5) // Keep last 5
    })

    setDisplay(formattedResult)
    setLastOperation(display)
    setClearOnNextInput(true)
    setError(false)
  }

  const handleClear = () => {
    setDisplay('0')
    setLastOperation('')
    setClearOnNextInput(false)
    setError(false)
  }

  const handleBackspace = () => {
    if (error) {
      handleClear()
      return
    }
    if (display.length > 1) {
      let newDisplay = display.slice(0, -1).trim()
      // Remove trailing operator and space
      if (newDisplay.endsWith(' ')) {
        newDisplay = newDisplay.slice(0, -2).trim()
      }
      setDisplay(newDisplay || '0')
    } else {
      setDisplay('0')
    }
  }

  const handlePercent = () => {
    try {
      const num = new Decimal(display)
      setDisplay(formatNumber(num.dividedBy(100)))
      setClearOnNextInput(true)
    } catch {
      setDisplay('Error')
      setError(true)
      setClearOnNextInput(true)
    }
  }

  const handlePlusMinus = () => {
    if (display !== '0' && !error) {
      // Find the last number in the expression and negate it
      const parts = display.split(' ')
      const lastPart = parts[parts.length - 1]

      if (lastPart.startsWith('-')) {
        parts[parts.length - 1] = lastPart.slice(1)
      } else {
        parts[parts.length - 1] = '-' + lastPart
      }

      setDisplay(parts.join(' '))
    }
  }

  // Memory functions using Decimal
  const handleMemoryClear = () => setMemory(new Decimal(0))

  const handleMemoryRecall = () => {
    setDisplay(formatNumber(memory))
    setClearOnNextInput(true)
  }

  const handleMemoryAdd = () => {
    try {
      const current = new Decimal(display.split(' ').pop() || '0')
      setMemory(prev => prev.plus(current))
    } catch {
      // Ignore if current display can't be parsed
    }
  }

  const handleMemorySubtract = () => {
    try {
      const current = new Decimal(display.split(' ').pop() || '0')
      setMemory(prev => prev.minus(current))
    } catch {
      // Ignore if current display can't be parsed
    }
  }

  // Quick multipliers for pharmacy calculations
  const handleQuickMultiply = (factor: number) => {
    try {
      const num = new Decimal(display)
      const result = num.times(factor)
      const formattedResult = formatNumber(result)

      const factorLabel = factor < 1 ? `÷${1/factor}` : `x${factor}`
      setHistory(prev => {
        const newHistory = [{ expression: `${display} ${factorLabel}`, result: formattedResult }, ...prev]
        return newHistory.slice(0, 5)
      })

      setDisplay(formattedResult)
      setClearOnNextInput(true)
      setError(false)
    } catch {
      setDisplay('Error')
      setError(true)
      setClearOnNextInput(true)
    }
  }

  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(display)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
      onCopyResult?.(display)
    } catch {
      // Clipboard API might not be available
    }
  }

  const buttonClass = "flex items-center justify-center h-10 rounded-lg font-medium transition-colors"
  const numberClass = `${buttonClass} bg-gray-100 hover:bg-gray-200 text-gray-900 active:bg-gray-300`
  const operatorClass = `${buttonClass} bg-gray-200 hover:bg-gray-300 text-gray-900 active:bg-gray-400`
  const functionClass = `${buttonClass} bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm active:bg-gray-200`
  const equalsClass = `${buttonClass} bg-black hover:bg-gray-800 text-white active:bg-gray-700`

  return (
    <div className="space-y-3">
      {/* Display */}
      <div className={`bg-gray-50 rounded-lg p-3 ${error ? 'bg-red-50' : ''}`}>
        <div className="text-xs text-gray-500 h-4 truncate">
          {lastOperation}
        </div>
        <div className={`text-2xl font-mono text-right truncate ${error ? 'text-red-600' : 'text-gray-900'}`}>
          {display}
        </div>
      </div>

      {/* Memory & Settings Row */}
      <div className="flex gap-1">
        <button onClick={handleMemoryClear} className={`${functionClass} flex-1 text-xs`} title="Memory Clear">MC</button>
        <button onClick={handleMemoryRecall} className={`${functionClass} flex-1 text-xs`} title="Memory Recall">MR</button>
        <button onClick={handleMemoryAdd} className={`${functionClass} flex-1 text-xs`} title="Memory Add">M+</button>
        <button onClick={handleMemorySubtract} className={`${functionClass} flex-1 text-xs`} title="Memory Subtract">M-</button>
        <div className="flex-1 flex items-center justify-center">
          <span className={`text-xs px-1.5 py-0.5 rounded ${!memory.isZero() ? 'bg-blue-100 text-blue-700' : 'text-gray-400'}`}>
            M: {!memory.isZero() ? formatNumber(memory) : '0'}
          </span>
        </div>
      </div>

      {/* Quick Multipliers */}
      <div className="flex gap-1">
        <button onClick={() => handleQuickMultiply(1000)} className={`${functionClass} flex-1 text-xs`} title="Multiply by 1000">x1000</button>
        <button onClick={() => handleQuickMultiply(60)} className={`${functionClass} flex-1 text-xs`} title="Multiply by 60 (min/hr)">x60</button>
        <button onClick={() => handleQuickMultiply(24)} className={`${functionClass} flex-1 text-xs`} title="Multiply by 24 (hrs/day)">x24</button>
        <button onClick={() => handleQuickMultiply(0.001)} className={`${functionClass} flex-1 text-xs`} title="Divide by 1000">÷1000</button>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-4 gap-1">
        <button onClick={handleClear} className={`${functionClass} text-red-600`}>C</button>
        <button onClick={handlePlusMinus} className={functionClass}>+/-</button>
        <button onClick={handlePercent} className={functionClass}>%</button>
        <button onClick={() => handleOperator('÷')} className={operatorClass}>÷</button>

        <button onClick={() => handleNumber('7')} className={numberClass}>7</button>
        <button onClick={() => handleNumber('8')} className={numberClass}>8</button>
        <button onClick={() => handleNumber('9')} className={numberClass}>9</button>
        <button onClick={() => handleOperator('x')} className={operatorClass}>x</button>

        <button onClick={() => handleNumber('4')} className={numberClass}>4</button>
        <button onClick={() => handleNumber('5')} className={numberClass}>5</button>
        <button onClick={() => handleNumber('6')} className={numberClass}>6</button>
        <button onClick={() => handleOperator('-')} className={operatorClass}>-</button>

        <button onClick={() => handleNumber('1')} className={numberClass}>1</button>
        <button onClick={() => handleNumber('2')} className={numberClass}>2</button>
        <button onClick={() => handleNumber('3')} className={numberClass}>3</button>
        <button onClick={() => handleOperator('+')} className={operatorClass}>+</button>

        <button onClick={() => handleNumber('0')} className={`${numberClass} col-span-2`}>0</button>
        <button onClick={() => handleNumber('.')} className={numberClass}>.</button>
        <button onClick={handleEquals} className={equalsClass}>=</button>
      </div>

      {/* Bottom row: Backspace, Copy, Decimal Places */}
      <div className="flex gap-1 items-center">
        <button onClick={handleBackspace} className={`${functionClass} flex-1`} title="Backspace">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
          </svg>
        </button>
        <button
          onClick={handleCopyResult}
          className={`${functionClass} flex-1 ${copied ? 'bg-green-100 text-green-700' : ''}`}
          title="Copy Result"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <div className="flex-1 flex items-center justify-center gap-1">
          <span className="text-xs text-gray-500">DP:</span>
          {[2, 3, 4].map(dp => (
            <button
              key={dp}
              onClick={() => setDecimalPlaces(dp)}
              className={`w-6 h-6 text-xs rounded ${decimalPlaces === dp ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              {dp}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="border-t border-gray-200 pt-3">
          <div className="text-xs font-medium text-gray-500 mb-2">History</div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {history.map((entry, i) => (
              <button
                key={i}
                onClick={() => {
                  setDisplay(entry.result)
                  setClearOnNextInput(true)
                  setError(false)
                }}
                className="w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-50 flex justify-between"
              >
                <span className="text-gray-500 truncate flex-1">{entry.expression}</span>
                <span className="text-gray-900 font-mono ml-2">{entry.result}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
