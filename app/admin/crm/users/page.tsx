'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import RichTextEditor from '@/app/components/RichTextEditor'

interface CRMUser {
  id: string
  email: string
  signup_date: string
  trial_started_at?: string
  trial_expires_at?: string
  questions_used?: number
  questions_limit?: number
  nurture_group: string
  days_remaining?: number
  days_since_expiry?: number
  trial_status?: string
  emails_sent: number
  last_email_at: string | null
  // Subscription fields
  package_type?: string
  amount_paid?: number
  access_granted_at?: string
  access_expires_at?: string
  status?: string
  access_remaining?: string
}

interface EmailHistoryItem {
  id: string
  email_type: string
  subject: string
  sent_at: string
  metadata?: Record<string, unknown>
}

type EmailType = 'trial_reminder' | 'trial_expiring' | 'win_back' | 'custom'

export default function CRMUsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [users, setUsers] = useState<CRMUser[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Filters
  const [group, setGroup] = useState(searchParams.get('group') || 'active_subscribers')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [emailFilter, setEmailFilter] = useState<'all' | 'not_emailed' | 'emailed'>('all')

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectAllPages, setSelectAllPages] = useState(false)

  // Email modal
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailType, setEmailType] = useState<EmailType>('trial_reminder')
  const [customSubject, setCustomSubject] = useState('')
  const [customBody, setCustomBody] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)

  // Preview
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [previewSubject, setPreviewSubject] = useState<string | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  // Email history modal
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyUser, setHistoryUser] = useState<CRMUser | null>(null)
  const [emailHistory, setEmailHistory] = useState<EmailHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Export loading
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('group', group)
        params.set('page', page.toString())
        if (search) params.set('search', search)
        if (emailFilter !== 'all') params.set('emailFilter', emailFilter)

        const response = await fetch(`/api/admin/crm/users?${params}`)
        const data = await response.json()

        setUsers(data.users || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        console.error('Failed to fetch CRM users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
    setSelectedIds(new Set())
    setSelectAllPages(false)
  }, [group, page, search, emailFilter])

  useEffect(() => {
    // Update URL when group changes
    const params = new URLSearchParams(searchParams.toString())
    params.set('group', group)
    router.push(`/admin/crm/users?${params.toString()}`, { scroll: false })
  }, [group, router, searchParams])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  function toggleSelectAll() {
    if (selectAllPages) {
      // Deselect all
      setSelectAllPages(false)
      setSelectedIds(new Set())
    } else if (selectedIds.size === users.length && users.length > 0) {
      // Current page is fully selected, deselect all
      setSelectedIds(new Set())
    } else {
      // Select all on current page
      setSelectedIds(new Set(users.map(u => u.id)))
    }
  }

  async function selectAllAcrossPages() {
    try {
      const params = new URLSearchParams()
      params.set('group', group)
      if (search) params.set('search', search)
      if (emailFilter !== 'all') params.set('emailFilter', emailFilter)
      params.set('allIds', 'true')

      const response = await fetch(`/api/admin/crm/users?${params}`)
      const data = await response.json()

      if (data.allIds) {
        setSelectedIds(new Set(data.allIds))
        setSelectAllPages(true)
      }
    } catch (err) {
      console.error('Failed to select all users:', err)
    }
  }

  function toggleSelect(id: string) {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
      // If deselecting while "select all pages" is active, turn it off
      if (selectAllPages) {
        setSelectAllPages(false)
      }
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  async function handleExport() {
    setExporting(true)
    try {
      const params = new URLSearchParams()
      params.set('group', group)
      if (search) params.set('search', search)

      const response = await fetch(`/api/admin/crm/export?${params}`)
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `crm-${group}-users-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Failed to export:', err)
      alert('Failed to export users')
    } finally {
      setExporting(false)
    }
  }

  async function fetchPreview(type: string) {
    if (type === 'custom') {
      // Generate preview for custom email locally
      if (!customSubject.trim() || !customBody.trim()) {
        alert('Please enter both subject and message to preview')
        return
      }

      // Replace placeholders with example values
      const replacePlaceholders = (text: string) => {
        return text
          .replace(/\{\{first_name\}\}/gi, 'John')
          .replace(/\{\{email\}\}/gi, 'user@example.com')
      }

      const previewSubject = replacePlaceholders(customSubject)
      const previewBody = replacePlaceholders(customBody)

      // Style links in the HTML content
      const styledBody = previewBody.replace(/<a /g, '<a style="color: #0066cc; text-decoration: none;" ')

      const previewHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #333; margin-bottom: 20px;">MRCPPACESPREP</h2>
    <div style="font-size: 14px;">
      ${styledBody}
    </div>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 20px 0;">
    <p style="font-size: 12px; color: #666; margin: 0;">
      You're receiving this email because you signed up for MRCPPACESPREP.<br>
      <a href="https://www.mrcppacesprep.com/unsubscribe?email=user@example.com" style="color: #666;">Unsubscribe</a> |
      <a href="https://www.mrcppacesprep.com" style="color: #666;">Visit our website</a>
    </p>
  </div>
</body>
</html>`

      setPreviewHtml(previewHtml)
      setPreviewSubject(previewSubject)
      setShowPreview(true)
      return
    }

    setLoadingPreview(true)
    try {
      const response = await fetch(`/api/admin/crm/preview-email?type=${type}`)
      const data = await response.json()
      if (response.ok) {
        setPreviewHtml(data.html)
        setPreviewSubject(data.subject)
        setShowPreview(true)
      }
    } catch (err) {
      console.error('Failed to fetch preview:', err)
    } finally {
      setLoadingPreview(false)
    }
  }

  async function fetchEmailHistory(user: CRMUser) {
    setHistoryUser(user)
    setShowHistoryModal(true)
    setLoadingHistory(true)
    try {
      const response = await fetch(`/api/admin/crm/email-history?userId=${user.id}`)
      const data = await response.json()
      if (response.ok) {
        setEmailHistory(data.emails || [])
      }
    } catch (err) {
      console.error('Failed to fetch email history:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  async function handleSendEmail() {
    if (selectedIds.size === 0) return

    if (emailType === 'custom' && (!customSubject.trim() || !customBody.trim())) {
      alert('Please provide both subject and body for custom emails')
      return
    }

    setSendingEmail(true)
    try {
      const response = await fetch('/api/admin/crm/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: Array.from(selectedIds),
          emailType,
          customSubject: emailType === 'custom' ? customSubject : undefined,
          customBody: emailType === 'custom' ? customBody : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        let message = `Successfully sent ${data.sent} email(s)`
        if (data.skipped > 0) {
          message += `. ${data.skipped} skipped (invalid emails)`
        }
        if (data.failed > 0) {
          message += `. ${data.failed} failed`
        }
        if (data.skippedEmails && data.skippedEmails.length > 0) {
          message += `\n\nSkipped emails:\n${data.skippedEmails.join('\n')}`
        }
        alert(message)
        setShowEmailModal(false)
        setSelectedIds(new Set())
        setCustomSubject('')
        setCustomBody('')
      } else {
        alert(data.error || 'Failed to send emails')
      }
    } catch (err) {
      console.error('Failed to send emails:', err)
      alert('Failed to send emails')
    } finally {
      setSendingEmail(false)
    }
  }

  const emailTypeOptions = group === 'active_trial'
    ? [
        { value: 'trial_reminder', label: 'Trial Reminder', description: 'Remind users to continue practicing' },
        { value: 'trial_expiring', label: 'Trial Expiring', description: 'Alert users their trial is ending soon' },
        { value: 'custom', label: 'Custom Email', description: 'Write a custom message' }
      ]
    : group === 'no_trial'
    ? [
        { value: 'win_back', label: 'Subscribe Reminder', description: 'Encourage new signups to subscribe' },
        { value: 'custom', label: 'Custom Email', description: 'Write a custom message' }
      ]
    : group === 'active_subscribers'
    ? [
        { value: 'custom', label: 'Custom Email', description: 'Write a custom message to active subscribers' }
      ]
    : [
        { value: 'win_back', label: 'Win Back', description: 'Re-engage expired trial users' },
        { value: 'custom', label: 'Custom Email', description: 'Write a custom message' }
      ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/crm" className="hover:text-gray-700">CRM</Link>
            <span>/</span>
            <span>Users</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {group === 'active_trial' ? 'Active Trial Users' : group === 'expired_trial' ? 'Expired Trial Users' : group === 'no_trial' ? 'New Signups (No Trial)' : 'Active Subscribers'}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Group Filter */}
          <select
            value={group}
            onChange={(e) => { setGroup(e.target.value); setPage(1); setSelectedIds(new Set()) }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
          >
            <option value="active_subscribers">Active Subscribers</option>
            <option value="active_trial">Group 1: Active Trials</option>
            <option value="expired_trial">Group 2: Expired Trials</option>
            <option value="no_trial">Group 3: New Signups (No Trial)</option>
          </select>

          {/* Email Filter */}
          <select
            value={emailFilter}
            onChange={(e) => { setEmailFilter(e.target.value as 'all' | 'not_emailed' | 'emailed'); setPage(1); setSelectedIds(new Set()) }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
          >
            <option value="all">All Users</option>
            <option value="not_emailed">Not Emailed Yet</option>
            <option value="emailed">Already Emailed</option>
          </select>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by email..."
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
            >
              Search
            </button>
          </form>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {total} users found
            </span>
            <button
              onClick={handleExport}
              disabled={exporting || total === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Select All Pages Banner */}
      {selectedIds.size === users.length && users.length > 0 && total > users.length && !selectAllPages && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm text-yellow-800">
            All {users.length} users on this page are selected.
          </span>
          <button
            onClick={selectAllAcrossPages}
            className="px-4 py-1.5 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
          >
            Select all {total} users
          </button>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm text-blue-800">
            {selectAllPages ? `All ${total} users selected` : `${selectedIds.size} user${selectedIds.size !== 1 ? 's' : ''} selected`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => { setSelectedIds(new Set()); setSelectAllPages(false) }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Selection
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Email
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
          </div>
        ) : users.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectAllPages || (users.length > 0 && users.every(u => selectedIds.has(u.id)))}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Signup Date</th>
                  {group === 'active_subscribers' ? (
                    <>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Package Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount Paid</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Access Expires</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      {group !== 'no_trial' && (
                        <>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Questions Used</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                            {group === 'active_trial' ? 'Days Remaining' : 'Days Since Expiry'}
                          </th>
                        </>
                      )}
                    </>
                  )}
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Emails Sent</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-t border-gray-100 hover:bg-gray-50 ${
                      selectedIds.has(user.id) ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(user.id)}
                        onChange={() => toggleSelect(user.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(user.signup_date).toLocaleDateString()}
                    </td>
                    {group === 'active_subscribers' ? (
                      <>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            {user.package_type === '2month' ? 'Standard (2 Mo)' : user.package_type === '6month' ? 'Plus (6 Mo)' : user.package_type === '12month' ? 'Complete (12 Mo)' : user.package_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          £{user.amount_paid?.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {user.access_expires_at ? new Date(user.access_expires_at).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            Active
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            group === 'active_trial'
                              ? 'bg-green-100 text-green-700'
                              : group === 'no_trial'
                                ? 'bg-gray-100 text-gray-700'
                                : user.trial_status === 'exhausted'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-orange-100 text-orange-700'
                          }`}>
                            {group === 'active_trial' ? 'Active' : group === 'no_trial' ? 'No Trial' : user.trial_status || 'Expired'}
                          </span>
                        </td>
                        {group !== 'no_trial' && (
                          <>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {user.questions_used} / {user.questions_limit}
                            </td>
                            <td className="py-3 px-4">
                              {group === 'active_trial' ? (
                                <span className={`text-sm ${
                                  (user.days_remaining || 0) <= 2 ? 'text-red-600 font-medium' : 'text-gray-600'
                                }`}>
                                  {user.days_remaining || 0} days
                                </span>
                              ) : (
                                <span className="text-sm text-gray-600">
                                  {user.days_since_expiry || 0} days ago
                                </span>
                              )}
                            </td>
                          </>
                        )}
                      </>
                    )}
                    <td className="py-3 px-4">
                      {user.emails_sent > 0 ? (
                        <button
                          onClick={() => fetchEmailHistory(user)}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {user.emails_sent} email{user.emails_sent !== 1 ? 's' : ''}
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-2">No users found</p>
            {search && (
              <button
                onClick={() => { setSearch(''); setSearchInput('') }}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Send Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-xl shadow-xl mx-4 flex ${showPreview ? 'max-w-5xl' : 'max-w-lg'} w-full`}>
            {/* Left side - Email selection */}
            <div className={`${showPreview ? 'w-1/2 border-r border-gray-200' : 'w-full'}`}>
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Send Email</h3>
                <button
                  onClick={() => { setShowEmailModal(false); setShowPreview(false); setPreviewHtml(null); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                <p className="text-sm text-gray-600">
                  Sending to <span className="font-medium">{selectedIds.size} user{selectedIds.size !== 1 ? 's' : ''}</span>
                </p>

                {/* Email Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Template
                  </label>
                  <div className="space-y-2">
                    {emailTypeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                          emailType === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <label className="flex items-start gap-3 cursor-pointer flex-1">
                          <input
                            type="radio"
                            name="emailType"
                            value={option.value}
                            checked={emailType === option.value}
                            onChange={(e) => setEmailType(e.target.value as EmailType)}
                            className="mt-0.5"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{option.label}</p>
                            <p className="text-xs text-gray-500">{option.description}</p>
                          </div>
                        </label>
                        {option.value !== 'custom' && (
                          <button
                            type="button"
                            onClick={() => fetchPreview(option.value)}
                            disabled={loadingPreview}
                            className="ml-2 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                          >
                            {loadingPreview && emailType === option.value ? 'Loading...' : 'Preview'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Email Fields */}
                {emailType === 'custom' && (
                  <div className="space-y-4 pt-2">
                    {/* Placeholders hint */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-blue-800 mb-1">Available placeholders:</p>
                      <div className="flex flex-wrap gap-2">
                        <code className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{'{{first_name}}'}</code>
                        <code className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{'{{email}}'}</code>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder="e.g. Hi {{first_name}}, we have a special offer!"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <RichTextEditor
                        value={customBody}
                        onChange={setCustomBody}
                        placeholder="Hi {{first_name}}, write your message here..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Use the toolbar to format your email. You can still use placeholders: <code className="bg-gray-100 px-1">{'{{first_name}}'}</code> <code className="bg-gray-100 px-1">{'{{email}}'}</code>
                      </p>
                    </div>

                    {/* Preview Button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => fetchPreview('custom')}
                        disabled={!customSubject.trim() || !customBody.trim()}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        👁️ Preview Email
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => { setShowEmailModal(false); setShowPreview(false); setPreviewHtml(null); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail || (emailType === 'custom' && (!customSubject.trim() || !customBody.trim()))}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {sendingEmail ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right side - Preview */}
            {showPreview && previewHtml && (
              <div className="w-1/2 flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
                    {previewSubject && (
                      <p className="text-xs text-gray-500 mt-0.5">Subject: {previewSubject}</p>
                    )}
                  </div>
                  <button
                    onClick={() => { setShowPreview(false); setPreviewHtml(null); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-auto bg-gray-100 p-4">
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-full min-h-[500px] bg-white rounded-lg shadow-sm"
                    title="Email Preview"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email History Modal */}
      {showHistoryModal && historyUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Email History</h3>
                <p className="text-sm text-gray-500">{historyUser.email}</p>
              </div>
              <button
                onClick={() => { setShowHistoryModal(false); setHistoryUser(null); setEmailHistory([]); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              {loadingHistory ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin h-6 w-6 border-2 border-gray-900 border-t-transparent rounded-full"></div>
                </div>
              ) : emailHistory.length > 0 ? (
                <div className="space-y-3">
                  {emailHistory.map((email) => (
                    <div key={email.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{email.subject}</p>
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                            email.email_type === 'win_back' ? 'bg-orange-100 text-orange-700' :
                            email.email_type === 'trial_expiring' ? 'bg-yellow-100 text-yellow-700' :
                            email.email_type === 'trial_reminder' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {email.email_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {new Date(email.sent_at).toLocaleDateString()} {new Date(email.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {email.email_type === 'custom' && !!email.metadata?.customBody && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 whitespace-pre-wrap">
                          {String(email.metadata.customBody)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm">No emails sent to this user yet</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => { setShowHistoryModal(false); setHistoryUser(null); setEmailHistory([]); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
