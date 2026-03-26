'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Differential {
  id: string
  sign_name: string
  category: string | null
  differentials_list: {
    common: string[]
    less_common: string[]
    rare_but_important: string[]
  }
  memory_aid: string | null
  exam_relevance: string | null
  created_at: string
}

export default function DifferentialsAdmin() {
  const [items, setItems] = useState<Differential[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Differential | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [saving, setSaving] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    sign_name: '',
    category: '',
    common: '',
    less_common: '',
    rare_but_important: '',
    memory_aid: '',
    exam_relevance: ''
  })

  useEffect(() => {
    fetchItems()
  }, [page, categoryFilter])

  async function fetchItems() {
    setLoading(true)
    try {
      let url = `/api/admin/differentials?page=${page}&limit=20`
      if (categoryFilter) {
        url += `&category=${encodeURIComponent(categoryFilter)}`
      }
      const response = await fetch(url)
      const data = await response.json()
      setItems(data.differentials || [])
      setCategories(data.categories || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch differentials:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      sign_name: '',
      category: '',
      common: '',
      less_common: '',
      rare_but_important: '',
      memory_aid: '',
      exam_relevance: ''
    })
    setEditingItem(null)
    setShowForm(false)
  }

  function handleEdit(item: Differential) {
    setFormData({
      sign_name: item.sign_name,
      category: item.category || '',
      common: item.differentials_list?.common?.join('\n') || '',
      less_common: item.differentials_list?.less_common?.join('\n') || '',
      rare_but_important: item.differentials_list?.rare_but_important?.join('\n') || '',
      memory_aid: item.memory_aid || '',
      exam_relevance: item.exam_relevance || ''
    })
    setEditingItem(item)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        ...(editingItem && { id: editingItem.id }),
        sign_name: formData.sign_name,
        category: formData.category || null,
        differentials_list: {
          common: formData.common.split('\n').filter(s => s.trim()),
          less_common: formData.less_common.split('\n').filter(s => s.trim()),
          rare_but_important: formData.rare_but_important.split('\n').filter(s => s.trim())
        },
        memory_aid: formData.memory_aid || null,
        exam_relevance: formData.exam_relevance || null
      }

      const response = await fetch('/api/admin/differentials', {
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
    if (!confirm('Are you sure you want to delete this differential?')) return

    try {
      const response = await fetch('/api/admin/differentials', {
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
          <h1 className="text-2xl font-bold text-gray-900">Differentials</h1>
          <p className="text-gray-500">{total} cards total</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add New
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingItem ? 'Edit Differential' : 'Add Differential'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sign Name *</label>
                <input
                  type="text"
                  value={formData.sign_name}
                  onChange={(e) => setFormData({ ...formData, sign_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                  placeholder="e.g., Clubbing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Respiratory, Cardiovascular"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Common Causes (one per line)</label>
                <textarea
                  value={formData.common}
                  onChange={(e) => setFormData({ ...formData, common: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Lung cancer&#10;Bronchiectasis&#10;Idiopathic pulmonary fibrosis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Less Common Causes (one per line)</label>
                <textarea
                  value={formData.less_common}
                  onChange={(e) => setFormData({ ...formData, less_common: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Mesothelioma&#10;Chronic empyema"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rare but Important (one per line)</label>
                <textarea
                  value={formData.rare_but_important}
                  onChange={(e) => setFormData({ ...formData, rare_but_important: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Atrial myxoma&#10;Familial clubbing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Memory Aid</label>
                <textarea
                  value={formData.memory_aid}
                  onChange={(e) => setFormData({ ...formData, memory_aid: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                  placeholder="Mnemonic or memory trick..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Relevance</label>
                <textarea
                  value={formData.exam_relevance}
                  onChange={(e) => setFormData({ ...formData, exam_relevance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                  placeholder="Why this is commonly examined..."
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sign Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Differentials</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{item.sign_name}</p>
                      {item.memory_aid && (
                        <p className="text-sm text-gray-500 line-clamp-1">{item.memory_aid}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {item.category || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                          {item.differentials_list?.common?.length || 0} common
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                          {item.differentials_list?.less_common?.length || 0} less common
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                          {item.differentials_list?.rare_but_important?.length || 0} rare
                        </span>
                      </div>
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
            <p>No differentials yet</p>
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
