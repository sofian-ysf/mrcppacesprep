'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PacesStation {
  id: string
  station_number: 1 | 2 | 3 | 4 | 5
  station_type: string
  title: string
  scenario_text: string
  patient_info: string | null
  task_instructions: string
  time_limit_seconds: number
  model_answer: string | null
  marking_criteria: { criterion: string; marks: number }[]
  examiner_questions: { question: string; ideal_answer: string }[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  created_at: string
}

const STATION_TYPES: Record<number, string[]> = {
  1: ['respiratory', 'abdominal'],
  2: ['history'],
  3: ['cardiovascular', 'neurological'],
  4: ['communication', 'ethics'],
  5: ['brief_consultation']
}

export default function StationsAdmin() {
  const [items, setItems] = useState<PacesStation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<PacesStation | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [saving, setSaving] = useState(false)
  const [stationFilter, setStationFilter] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    station_number: 1 as 1 | 2 | 3 | 4 | 5,
    station_type: 'respiratory',
    title: '',
    scenario_text: '',
    patient_info: '',
    task_instructions: '',
    time_limit_seconds: 420,
    model_answer: '',
    marking_criteria: '',
    examiner_questions: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard'
  })

  useEffect(() => {
    fetchItems()
  }, [page, stationFilter])

  async function fetchItems() {
    setLoading(true)
    try {
      let url = `/api/admin/stations?page=${page}&limit=20`
      if (stationFilter) {
        url += `&station_number=${stationFilter}`
      }
      const response = await fetch(url)
      const data = await response.json()
      setItems(data.stations || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch stations:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      station_number: 1,
      station_type: 'respiratory',
      title: '',
      scenario_text: '',
      patient_info: '',
      task_instructions: '',
      time_limit_seconds: 420,
      model_answer: '',
      marking_criteria: '',
      examiner_questions: '',
      difficulty: 'Medium'
    })
    setEditingItem(null)
    setShowForm(false)
  }

  function handleEdit(item: PacesStation) {
    setFormData({
      station_number: item.station_number,
      station_type: item.station_type,
      title: item.title,
      scenario_text: item.scenario_text,
      patient_info: item.patient_info || '',
      task_instructions: item.task_instructions,
      time_limit_seconds: item.time_limit_seconds,
      model_answer: item.model_answer || '',
      marking_criteria: item.marking_criteria?.map(c => `${c.criterion}|${c.marks}`).join('\n') || '',
      examiner_questions: item.examiner_questions?.map(q => `${q.question}|${q.ideal_answer}`).join('\n') || '',
      difficulty: item.difficulty
    })
    setEditingItem(item)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      // Parse marking criteria (format: criterion|marks per line)
      const marking_criteria = formData.marking_criteria
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [criterion, marks] = line.split('|')
          return { criterion: criterion?.trim() || '', marks: parseInt(marks) || 1 }
        })

      // Parse examiner questions (format: question|answer per line)
      const examiner_questions = formData.examiner_questions
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [question, ideal_answer] = line.split('|')
          return { question: question?.trim() || '', ideal_answer: ideal_answer?.trim() || '' }
        })

      const payload = {
        ...(editingItem && { id: editingItem.id }),
        station_number: formData.station_number,
        station_type: formData.station_type,
        title: formData.title,
        scenario_text: formData.scenario_text,
        patient_info: formData.patient_info || null,
        task_instructions: formData.task_instructions,
        time_limit_seconds: formData.time_limit_seconds,
        model_answer: formData.model_answer || null,
        marking_criteria,
        examiner_questions,
        difficulty: formData.difficulty
      }

      const response = await fetch('/api/admin/stations', {
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
    if (!confirm('Are you sure you want to delete this station?')) return

    try {
      const response = await fetch('/api/admin/stations', {
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
          <h1 className="text-2xl font-bold text-gray-900">PACES Stations</h1>
          <p className="text-gray-500">{total} stations total</p>
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
          value={stationFilter}
          onChange={(e) => { setStationFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Stations</option>
          <option value="1">Station 1</option>
          <option value="2">Station 2</option>
          <option value="3">Station 3</option>
          <option value="4">Station 4</option>
          <option value="5">Station 5</option>
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingItem ? 'Edit Station' : 'Add Station'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station Number *</label>
                  <select
                    value={formData.station_number}
                    onChange={(e) => {
                      const num = parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5
                      setFormData({
                        ...formData,
                        station_number: num,
                        station_type: STATION_TYPES[num][0]
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>Station {n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station Type *</label>
                  <select
                    value={formData.station_type}
                    onChange={(e) => setFormData({ ...formData, station_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {STATION_TYPES[formData.station_number].map(type => (
                      <option key={type} value={type}>{type.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                  placeholder="e.g., Chronic Obstructive Pulmonary Disease"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scenario Text *</label>
                <textarea
                  value={formData.scenario_text}
                  onChange={(e) => setFormData({ ...formData, scenario_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  required
                  placeholder="The clinical scenario presented to the candidate..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Information</label>
                <textarea
                  value={formData.patient_info}
                  onChange={(e) => setFormData({ ...formData, patient_info: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                  placeholder="Brief patient details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Instructions *</label>
                <textarea
                  value={formData.task_instructions}
                  onChange={(e) => setFormData({ ...formData, task_instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  required
                  placeholder="What the candidate is asked to do..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (seconds)</label>
                  <input
                    type="number"
                    value={formData.time_limit_seconds}
                    onChange={(e) => setFormData({ ...formData, time_limit_seconds: parseInt(e.target.value) || 420 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min={60}
                    max={900}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model Answer</label>
                <textarea
                  value={formData.model_answer}
                  onChange={(e) => setFormData({ ...formData, model_answer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="The ideal approach/answer..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marking Criteria (format: criterion|marks per line)
                </label>
                <textarea
                  value={formData.marking_criteria}
                  onChange={(e) => setFormData({ ...formData, marking_criteria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  rows={4}
                  placeholder="Appropriate introduction|2&#10;Correct examination technique|3&#10;Clear presentation|2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Examiner Questions (format: question|ideal_answer per line)
                </label>
                <textarea
                  value={formData.examiner_questions}
                  onChange={(e) => setFormData({ ...formData, examiner_questions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  rows={4}
                  placeholder="What are the causes of clubbing?|Respiratory: lung cancer, bronchiectasis..."
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Station</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Difficulty</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-medium">
                        {item.station_number}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.scenario_text}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                      {item.station_type.replace('_', ' ')}
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
            <p>No stations yet</p>
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
