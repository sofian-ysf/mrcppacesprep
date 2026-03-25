'use client'

import { use } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import { PacesStation } from '@/app/types/stations'
import { DashboardLayout } from '@/app/components/dashboard'
import StationPractice from '@/app/components/stations/StationPractice'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface PageProps {
  params: Promise<{ id: string }>
}

export default function StationPracticePage({ params }: PageProps) {
  const { id } = use(params)
  const { user, loading: authLoading } = useAuth()

  // Fetch current station
  const { data: stationData, error: stationError, isLoading: stationLoading } = useSWR(
    user ? `/api/stations/${id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  // Fetch all stations to determine next station
  const { data: allStationsData } = useSWR(
    user && stationData?.station ? '/api/stations' : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  )

  const station: PacesStation | null = stationData?.station || null
  const allStations: PacesStation[] = allStationsData?.stations || []
  const apiError = stationError?.message || stationData?.error

  // Find next station
  const getNextStationId = (): string | undefined => {
    if (!station || allStations.length === 0) return undefined

    const currentIndex = allStations.findIndex(s => s.id === station.id)
    if (currentIndex === -1 || currentIndex >= allStations.length - 1) return undefined

    return allStations[currentIndex + 1]?.id
  }

  if (authLoading || stationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading station...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to practice</h2>
          <Link href="/login" className="pill-btn pill-btn-primary">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  if (apiError || !station) {
    return (
      <DashboardLayout
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'PACES Stations', href: '/dashboard/stations' },
          { label: 'Error' }
        ]}
      >
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Station Not Found</h2>
          <p className="text-red-600 mb-4">{apiError || 'The requested station could not be found.'}</p>
          <Link
            href="/dashboard/stations"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Back to Stations
          </Link>
        </div>
      </DashboardLayout>
    )
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
        { label: 'PACES Stations', href: '/dashboard/stations' },
        { label: `Station ${station.station_number}: ${getStationTypeLabel(station.station_type)}`, href: `/dashboard/stations?station_number=${station.station_number}` },
        { label: station.title }
      ]}
    >
      <StationPractice
        station={station}
        nextStationId={getNextStationId()}
      />
    </DashboardLayout>
  )
}
