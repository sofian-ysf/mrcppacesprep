'use client'

import useSWR from 'swr'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import { ExamChecklist } from '@/app/types/checklists'
import ChecklistCard from '@/app/components/checklists/ChecklistCard'
import { DashboardLayout } from '@/app/components/dashboard'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ChecklistsPage() {
  const { user, loading: authLoading } = useAuth()

  const { data, error, isLoading } = useSWR(
    user ? '/api/checklists' : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  const checklists: ExamChecklist[] = data?.checklists || []
  const apiError = error?.message || data?.error

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checklists...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to access examination checklists</h2>
          <Link href="/login" className="pill-btn pill-btn-primary">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Examination Checklists' }
      ]}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Examination Checklists</h1>
        <p className="text-sm text-gray-500">Step-by-step examination routines for clinical systems</p>
      </div>

      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {apiError}
        </div>
      )}

      {/* Checklists */}
      {checklists.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-gray-500">No examination checklists available yet.</p>
          <p className="text-sm text-gray-400 mt-1">Check back later for examination routines.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {checklists.map((checklist) => (
            <ChecklistCard key={checklist.id} checklist={checklist} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
