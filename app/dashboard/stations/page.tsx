'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import { PacesStation, STATION_TYPES, StationNumber } from '@/app/types/stations'
import { DashboardLayout } from '@/app/components/dashboard'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const STATION_LABELS: Record<StationNumber, string> = {
  1: 'Station 1: Respiratory & Abdominal',
  2: 'Station 2: History Taking',
  3: 'Station 3: Cardiovascular & Neurological',
  4: 'Station 4: Communication & Ethics',
  5: 'Station 5: Brief Consultation'
}

const STATION_DESCRIPTIONS: Record<StationNumber, string> = {
  1: 'Physical examination of respiratory and abdominal systems',
  2: 'Taking a focused medical history from a patient',
  3: 'Physical examination of cardiovascular and neurological systems',
  4: 'Communication skills and ethical scenarios',
  5: 'Integrated clinical assessment with multiple skills'
}

export default function StationsPage() {
  const { user, loading: authLoading } = useAuth()
  const [selectedStation, setSelectedStation] = useState<StationNumber | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  // Build query string
  const queryParams = new URLSearchParams()
  if (selectedStation) queryParams.set('station_number', String(selectedStation))
  if (selectedDifficulty) queryParams.set('difficulty', selectedDifficulty)
  const queryString = queryParams.toString()

  const { data, error, isLoading } = useSWR(
    user ? `/api/stations${queryString ? `?${queryString}` : ''}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  const stations: PacesStation[] = data?.stations || []
  const apiError = error?.message || data?.error

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stations...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to access PACES stations</h2>
          <Link href="/login" className="pill-btn pill-btn-primary">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Hard':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStationTypeLabel = (stationType: string): string => {
    return stationType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'PACES Stations' }
      ]}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">PACES Stations</h1>
        <p className="text-sm text-gray-500">Practice clinical examination scenarios with timed sessions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Station Number Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Station</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStation(null)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedStation === null
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {([1, 2, 3, 4, 5] as StationNumber[]).map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedStation(num)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedStation === num
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Station {num}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDifficulty(null)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedDifficulty === null
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {['Easy', 'Medium', 'Hard'].map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedDifficulty === diff
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Station Type Description (when filtered) */}
      {selectedStation && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-1">{STATION_LABELS[selectedStation]}</h2>
          <p className="text-sm text-blue-700">{STATION_DESCRIPTIONS[selectedStation]}</p>
        </div>
      )}

      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {apiError}
        </div>
      )}

      {/* Stations Grid */}
      {stations.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500">No stations available yet.</p>
          <p className="text-sm text-gray-400 mt-1">Check back later for PACES practice stations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map((station) => (
            <Link
              key={station.id}
              href={`/dashboard/stations/${station.id}/practice`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all group"
            >
              {/* Station Badge & Difficulty */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-sm font-bold">
                    {station.station_number}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {getStationTypeLabel(station.station_type)}
                  </span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColor(station.difficulty)}`}>
                  {station.difficulty}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-medium text-gray-900 mb-2 group-hover:text-black">
                {station.title}
              </h3>

              {/* Preview */}
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {station.scenario_text.substring(0, 120)}...
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{Math.floor(station.time_limit_seconds / 60)} min</span>
                </div>
                <span className="text-xs font-medium text-gray-900 group-hover:text-black flex items-center gap-1">
                  Practice
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Station Overview (when no filter selected) */}
      {!selectedStation && stations.length === 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">PACES Exam Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {([1, 2, 3, 4, 5] as StationNumber[]).map(num => (
              <div key={num} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 text-lg font-bold">
                    {num}
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">Station {num}</h3>
                    <p className="text-xs text-gray-500">
                      {STATION_TYPES[num].map(t => getStationTypeLabel(t)).join(', ')}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{STATION_DESCRIPTIONS[num]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
