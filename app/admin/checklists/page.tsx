'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ChecklistStep {
  step: string
  details?: string
}

interface ExamChecklist {
  id: string
  system_name: string
  steps: ChecklistStep[]
  tips: string | null
  common_findings: string[]
  presentation_template: string | null
  created_at: string
}

export default function ChecklistsAdmin() {
  const [items, setItems] = useState<ExamChecklist[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<ExamChecklist | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    system_name: '',
    steps: '',
    tips: '',
    common_findings: '',
    presentation_template: ''
  })

  useEffect(() => {
    fetchItems()
  }, [page])

  async function fetchItems() {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/checklists?page=${page}&limit=20`)
      const data = await response.json()
      setItems(data.checklists || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch checklists:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      system_name: '',
      steps: '',
      tips: '',
      common_findings: '',
      presentation_template: ''
    })
    setEditingItem(null)
    setShowForm(false)
  }

  function handleEdit(item: ExamChecklist) {
    // Format steps as "step|details" per line
    const stepsText = item.steps?.map(s => s.details ? `${s.step}|${s.details}` : s.step).join('\n') || ''

    setFormData({
      system_name: item.system_name,
      steps: stepsText,
      tips: item.tips || '',
      common_findings: item.common_findings?.join('\n') || '',
      presentation_template: item.presentation_template || ''
    })
    setEditingItem(item)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      // Parse steps (format: step|details per line, details optional)
      const steps = formData.steps
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [step, details] = line.split('|')
          return { step: step?.trim() || '', ...(details && { details: details.trim() }) }
        })

      const payload = {
        ...(editingItem && { id: editingItem.id }),
        system_name: formData.system_name,
        steps,
        tips: formData.tips || null,
        common_findings: formData.common_findings.split('\n').filter(f => f.trim()),
        presentation_template: formData.presentation_template || null
      }

      const response = await fetch('/api/admin/checklists', {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        resetForm()
        fetchItems()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this checklist?')) return

    try {
      const response = await fetch('/api/admin/checklists', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        fetchItems()
      } else {
        alert('Failed to delete')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Examination Checklists</h1>
          <p className="text-gray-500">{total} checklists total</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add New
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingItem ? 'Edit Checklist' : 'Add Checklist'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Name *</label>
                <input
                  type="text"
                  value={formData.system_name}
                  onChange={(e) => setFormData({ ...formData, system_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                  placeholder="e.g., Respiratory Examination"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Steps (one per line, format: step|details - details optional)
                </label>
                <textarea
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  rows={10}
                  placeholder="Wash hands|Introduce yourself and confirm patient identity&#10;Position patient|Sitting at 45 degrees, chest exposed&#10;General inspection|Look for respiratory distress, oxygen, inhalers&#10;Examine hands|Clubbing, cyanosis, tar staining"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tips</label>
                <textarea
                  value={formData.tips}
                  onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="General tips for this examination..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Common Findings (one per line)</label>
                <textarea
                  value={formData.common_findings}
                  onChange={(e) => setFormData({ ...formData, common_findings: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="COPD&#10;Pulmonary fibrosis&#10;Pleural effusion&#10;Consolidation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Presentation Template</label>
                <textarea
                  value={formData.presentation_template}
                  onChange={(e) => setFormData({ ...formData, presentation_template: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={5}
                  placeholder="On examination of the respiratory system, I found a [age] [sex] patient who was [comfortable/distressed] at rest. On general inspection... On palpation... On percussion... On auscultation..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
          </div>
        ) : items.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">System</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Steps</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Findings</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{item.system_name}</p>
                      {item.tips && (
                        <p className="text-sm text-gray-500 line-clamp-1">{item.tips}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        {item.steps?.length || 0} steps
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {item.common_findings?.length || 0} findings
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
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
            <p>No checklists yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Add your first one
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
