'use client'

import { useState } from 'react'
import {
  weightConversions,
  volumeConversions,
  concentrationTable,
  dropFactorTable
} from '@/app/lib/pharmacy-data/conversions'

type TabKey = 'weight' | 'volume' | 'concentration' | 'dropFactor'

export default function ConversionTables() {
  const [activeTab, setActiveTab] = useState<TabKey>('weight')

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'weight', label: 'Weight' },
    { key: 'volume', label: 'Volume' },
    { key: 'concentration', label: 'Concentration' },
    { key: 'dropFactor', label: 'IV Drops' },
  ]

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tables */}
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        {activeTab === 'weight' && (
          <div>
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">{weightConversions.title}</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">From</th>
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">To</th>
                  <th className="text-right px-3 py-2 text-gray-600 font-medium">Factor</th>
                </tr>
              </thead>
              <tbody>
                {weightConversions.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-gray-900">{row.from}</td>
                    <td className="px-3 py-2 text-gray-900">{row.to}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-900">{row.factor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'volume' && (
          <div>
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">{volumeConversions.title}</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">From</th>
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">To</th>
                  <th className="text-right px-3 py-2 text-gray-600 font-medium">Factor</th>
                </tr>
              </thead>
              <tbody>
                {volumeConversions.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-gray-900">{row.from}</td>
                    <td className="px-3 py-2 text-gray-900">{row.to}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-900">{row.factor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'concentration' && (
          <div>
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">{concentrationTable.title}</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">Expression</th>
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {concentrationTable.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 font-mono text-gray-900">{row.expression}</td>
                    <td className="px-3 py-2 text-gray-900">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'dropFactor' && (
          <div>
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">{dropFactorTable.title}</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">Set Type</th>
                  <th className="text-right px-3 py-2 text-gray-600 font-medium">Drops/mL</th>
                </tr>
              </thead>
              <tbody>
                {dropFactorTable.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-gray-900">{row.setType}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-900">{row.dropsPerMl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Reference Note */}
      <p className="text-xs text-gray-500 text-center">
        Common pharmacy conversions for UK practice
      </p>
    </div>
  )
}
