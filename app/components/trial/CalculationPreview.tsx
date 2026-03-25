'use client'

import Link from 'next/link'

interface CalculationPreviewProps {
  className?: string
}

export default function CalculationPreview({ className = '' }: CalculationPreviewProps) {
  return (
    <div className={`bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Calculation Questions</h3>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              Premium
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Master pharmaceutical calculations with 500+ practice problems covering dosing, dilutions, IV rates, and more.
          </p>

          {/* Sample locked question preview */}
          <div className="bg-white/80 rounded-lg p-4 mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm" />
            <div className="relative">
              <p className="text-sm text-gray-500 line-clamp-2 blur-[2px] select-none">
                A patient requires 500 mL of 0.9% sodium chloride solution over 4 hours. Calculate the drip rate in drops per minute if the giving set delivers 20 drops per mL.
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-medium">Unlock with subscription</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <ul className="space-y-2 mb-4">
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Step-by-step solutions for every question
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Common formulas and unit conversions
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Real exam-style calculation problems
            </li>
          </ul>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Unlock Calculations
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
