'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface SpotDiagnosis {
  id: string
  image_url: string | null
  youtube_id: string | null
  media_type: 'image' | 'video'
  diagnosis: string
  description: string | null
  key_features: string[]
  exam_tips: string | null
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category_id: string | null
  created_at: string
}

export default function SpotDiagnosisAdmin() {
  const [items, setItems] = useState<SpotDiagnosis[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<SpotDiagnosis | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    media_type: 'image' as 'image' | 'video',
    image_url: '',
    youtube_url: '',
    diagnosis: '',
    description: '',
    key_features: '',
    exam_tips: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard'
  })

  useEffect(() => {
    fetchItems()
  }, [page])

  async function fetchItems() {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/spot-diagnosis?page=${page}&limit=20`)
      const data = await response.json()
      setItems(data.spotDiagnoses || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch spot diagnoses:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      media_type: 'image',
      image_url: '',
      youtube_url: '',
      diagnosis: '',
      description: '',
      key_features: '',
      exam_tips: '',
      difficulty: 'Medium'
    })
    setEditingItem(null)
    setShowForm(false)
  }

  function extractYouTubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  function handleEdit(item: SpotDiagnosis) {
    setFormData({
      media_type: item.media_type || 'image',
      image_url: item.image_url || '',
      youtube_url: item.youtube_id ? `https://youtube.com/watch?v=${item.youtube_id}` : '',
      diagnosis: item.diagnosis,
      description: item.description || '',
      key_features: item.key_features?.join('\n') || '',
      exam_tips: item.exam_tips || '',
      difficulty: item.difficulty
    })
    setEditingItem(item)
    setShowForm(true)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('folder', 'spot-diagnosis')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, image_url: data.url }))
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      let youtube_id: string | null = null
      let image_url: string | null = null

      if (formData.media_type === 'video') {
        youtube_id = extractYouTubeId(formData.youtube_url)
        if (!youtube_id) {
          alert('Invalid YouTube URL')
          setSaving(false)
          return
        }
      } else {
        if (!formData.image_url) {
          alert('Please upload an image or provide an image URL')
          setSaving(false)
          return
        }
        image_url = formData.image_url
      }

      const payload = {
        ...(editingItem && { id: editingItem.id }),
        media_type: formData.media_type,
        image_url,
        youtube_id,
        diagnosis: formData.diagnosis,
        description: formData.description || null,
        key_features: formData.key_features.split('\n').filter(f => f.trim()),
        exam_tips: formData.exam_tips || null,
        difficulty: formData.difficulty
      }

      const response = await fetch('/api/admin/spot-diagnosis', {
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
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch('/api/admin/spot-diagnosis', {
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
          <h1 className="text-2xl font-bold text-gray-900">Spot Diagnosis</h1>
          <p className="text-gray-500">{total} items total</p>
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingItem ? 'Edit Spot Diagnosis' : 'Add Spot Diagnosis'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Media Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Type *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="media_type"
                      value="image"
                      checked={formData.media_type === 'image'}
                      onChange={(e) => setFormData({ ...formData, media_type: e.target.value as 'image' | 'video' })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Image</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="media_type"
                      value="video"
                      checked={formData.media_type === 'video'}
                      onChange={(e) => setFormData({ ...formData, media_type: e.target.value as 'image' | 'video' })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">YouTube Video</span>
                  </label>
                </div>
              </div>

              {/* Image Upload Section */}
              {formData.media_type === 'image' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Image *</label>

                  {/* File Upload */}
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </label>
                    <span className="text-sm text-gray-500">or</span>
                  </div>

                  {/* URL Input */}
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Or paste image URL: https://example.com/image.jpg"
                  />

                  {/* Image Preview */}
                  {formData.image_url && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Preview:</p>
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="max-h-48 rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* YouTube URL Section */}
              {formData.media_type === 'video' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">YouTube URL *</label>
                  <input
                    type="url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://youtube.com/watch?v=xxxxx or https://youtu.be/xxxxx"
                  />

                  {/* YouTube Preview */}
                  {formData.youtube_url && extractYouTubeId(formData.youtube_url) && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Preview:</p>
                      <div className="aspect-video max-w-md rounded-lg overflow-hidden border border-gray-200">
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId(formData.youtube_url)}`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="e.g., Rheumatoid Arthritis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Brief description of the condition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Features (one per line)</label>
                <textarea
                  value={formData.key_features}
                  onChange={(e) => setFormData({ ...formData, key_features: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Symmetrical joint involvement&#10;Swan neck deformity&#10;Ulnar deviation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Tips</label>
                <textarea
                  value={formData.exam_tips}
                  onChange={(e) => setFormData({ ...formData, exam_tips: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Tips for recognizing in the exam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
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
                  disabled={saving || uploading}
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Media</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Diagnosis</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Difficulty</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {item.media_type === 'video' && item.youtube_id ? (
                        <div className="h-12 w-16 bg-red-100 rounded-lg flex items-center justify-center">
                          <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </div>
                      ) : (
                        <img
                          src={item.image_url || 'https://via.placeholder.com/48?text=No+Image'}
                          alt={item.diagnosis}
                          className="h-12 w-12 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=No+Image'
                          }}
                        />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{item.diagnosis}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.media_type === 'video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.media_type === 'video' ? 'Video' : 'Image'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.difficulty}
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
            <p>No spot diagnoses yet</p>
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
