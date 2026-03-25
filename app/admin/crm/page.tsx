'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CRMStats {
  activeSubscribersCount: number
  activeTrialCount: number
  expiredTrialCount: number
  noTrialCount: number
  totalNurtureUsers: number
  emailsSentToday: number
  emailsSentThisWeek: number
  recentEmails: {
    id: string
    email_type: string
    subject: string
    sent_at: string
    user_id: string
  }[]
}

export default function CRMDashboardPage() {
  const [stats, setStats] = useState<CRMStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const response = await fetch('/api/admin/crm/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError('Failed to load CRM statistics')
      console.error('CRM stats error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CRM Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage trial user nurture campaigns</p>
        </div>
        <Link
          href="/admin/crm/users"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          View All Users
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Subscribers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Subscribers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.activeSubscribersCount || 0}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <Link href="/admin/crm/users?group=active_subscribers" className="text-sm text-blue-600 hover:underline mt-3 inline-block">
            View active subscribers
          </Link>
        </div>

        {/* Active Trials */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Trials</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.activeTrialCount || 0}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <Link href="/admin/crm/users?group=active_trial" className="text-sm text-blue-600 hover:underline mt-3 inline-block">
            View active trial users
          </Link>
        </div>

        {/* Expired Trials */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Expired Trials</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.expiredTrialCount || 0}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <Link href="/admin/crm/users?group=expired_trial" className="text-sm text-blue-600 hover:underline mt-3 inline-block">
            View expired trial users
          </Link>
        </div>

        {/* Emails Sent Today */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Emails Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.emailsSentToday || 0}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">Sent today via nurture campaigns</p>
        </div>

        {/* Emails Sent This Week */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Emails This Week</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.emailsSentThisWeek || 0}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">Sent this week</p>
        </div>
      </div>

      {/* User Groups */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Active Subscribers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Active Subscribers</h3>
              <p className="text-sm text-gray-500">{stats?.activeSubscribersCount || 0} users</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Users with active paid subscriptions. These are your paying customers.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Full platform access
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Custom emails
            </div>
          </div>
          <Link
            href="/admin/crm/users?group=active_subscribers"
            className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Manage subscribers
            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Group 1: Active Trials */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-700 font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Active Trial Users</h3>
              <p className="text-sm text-gray-500">{stats?.activeTrialCount || 0} users</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Users currently on their free trial. These users can be nurtured with reminders to keep practicing and convert before their trial expires.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Trial Reminder emails
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Trial Expiring emails
            </div>
          </div>
          <Link
            href="/admin/crm/users?group=active_trial"
            className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Manage active trial users
            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Group 2: Expired Trials */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-700 font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Expired Trial Users</h3>
              <p className="text-sm text-gray-500">{stats?.expiredTrialCount || 0} users</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Users whose trial has expired or was exhausted, and have never subscribed. These are win-back opportunities.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Win-back emails
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Custom promotion emails
            </div>
          </div>
          <Link
            href="/admin/crm/users?group=expired_trial"
            className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Manage expired trial users
            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Group 3: No Trial (New Signups) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-700 font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">New Signups (No Trial)</h3>
              <p className="text-sm text-gray-500">{stats?.noTrialCount || 0} users</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Users who signed up after free trials were disabled. They need to subscribe to access content.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Subscribe reminder emails
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Custom promotion emails
            </div>
          </div>
          <Link
            href="/admin/crm/users?group=no_trial"
            className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Manage new signups
            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Recent Email Activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Email Activity</h3>
        </div>
        {stats?.recentEmails && stats.recentEmails.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {stats.recentEmails.map((email) => (
              <div key={email.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    email.email_type === 'win_back' ? 'bg-orange-100' :
                    email.email_type === 'trial_expiring' ? 'bg-yellow-100' :
                    email.email_type === 'trial_reminder' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    <svg className={`h-4 w-4 ${
                      email.email_type === 'win_back' ? 'text-orange-600' :
                      email.email_type === 'trial_expiring' ? 'text-yellow-600' :
                      email.email_type === 'trial_reminder' ? 'text-blue-600' :
                      'text-gray-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{email.subject}</p>
                    <p className="text-xs text-gray-500">
                      {email.email_type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(email.sent_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">No emails sent yet</p>
            <p className="text-sm">Send your first nurture email from the user list</p>
          </div>
        )}
      </div>
    </div>
  )
}
