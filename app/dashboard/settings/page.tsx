'use client'

import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { getDaysUntilExam, formatDaysUntilExam } from '@/app/lib/readiness/calculator'
import { DashboardLayout } from '@/app/components/dashboard'

interface UserSettings {
  exam_date: string | null
  daily_question_goal: number
  daily_flashcard_goal: number
  weekly_mock_exam_goal: number
}

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [settings, setSettings] = useState<UserSettings>({
    exam_date: null,
    daily_question_goal: 20,
    daily_flashcard_goal: 50,
    weekly_mock_exam_goal: 2
  })

  useEffect(() => {
    if (user) {
      fetchSettings()
    }
  }, [user])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/user/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          setSettings({
            exam_date: data.settings.exam_date,
            daily_question_goal: data.settings.daily_question_goal || 20,
            daily_flashcard_goal: data.settings.daily_flashcard_goal || 50,
            weekly_mock_exam_goal: data.settings.weekly_mock_exam_goal || 2
          })
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save settings')
      }
    } catch (err) {
      console.error('Error saving settings:', err)
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const daysUntilExam = settings.exam_date ? getDaysUntilExam(settings.exam_date) : null

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf4]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to access settings</h2>
          <Link href="/login" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
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
        { label: 'Settings' }
      ]}
    >
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Study Settings</h1>
          <p className="text-gray-600 mt-1">Configure your exam date and daily study goals</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Exam Date Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Date</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When is your MRCP PACES exam?
                </label>
                <input
                  type="date"
                  value={settings.exam_date || ''}
                  onChange={(e) => setSettings({ ...settings, exam_date: e.target.value || null })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {daysUntilExam !== null && (
                <div className={`p-4 rounded-lg ${
                  daysUntilExam <= 7 ? 'bg-red-50 border border-red-200' :
                  daysUntilExam <= 30 ? 'bg-orange-50 border border-orange-200' :
                  daysUntilExam <= 60 ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      daysUntilExam <= 7 ? 'bg-red-100 text-red-600' :
                      daysUntilExam <= 30 ? 'bg-orange-100 text-orange-600' :
                      daysUntilExam <= 60 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        daysUntilExam <= 7 ? 'text-red-800' :
                        daysUntilExam <= 30 ? 'text-orange-800' :
                        daysUntilExam <= 60 ? 'text-yellow-800' :
                        'text-green-800'
                      }`}>
                        {formatDaysUntilExam(daysUntilExam)}
                      </p>
                      <p className={`text-sm ${
                        daysUntilExam <= 7 ? 'text-red-600' :
                        daysUntilExam <= 30 ? 'text-orange-600' :
                        daysUntilExam <= 60 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {daysUntilExam <= 7 ? 'Final push - focus on revision!' :
                         daysUntilExam <= 30 ? 'Time to intensify your study schedule' :
                         daysUntilExam <= 60 ? 'Stay consistent with your daily goals' :
                         'Great time to build a strong foundation'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Daily Goals Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Study Goals</h2>
              <p className="text-sm text-gray-600 mb-6">Set achievable daily targets to build consistent study habits</p>

              <div className="space-y-6">
                {/* Questions Goal */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Questions per day
                    </label>
                    <span className="text-sm font-semibold text-gray-900">{settings.daily_question_goal}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={settings.daily_question_goal}
                    onChange={(e) => setSettings({ ...settings, daily_question_goal: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Flashcards Goal */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Flashcards per day
                    </label>
                    <span className="text-sm font-semibold text-gray-900">{settings.daily_flashcard_goal}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="10"
                    value={settings.daily_flashcard_goal}
                    onChange={(e) => setSettings({ ...settings, daily_flashcard_goal: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10</span>
                    <span>100</span>
                    <span>200</span>
                  </div>
                </div>

                {/* Mock Exams Goal */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mock exams per week
                    </label>
                    <span className="text-sm font-semibold text-gray-900">{settings.weekly_mock_exam_goal}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    step="1"
                    value={settings.weekly_mock_exam_goal}
                    onChange={(e) => setSettings({ ...settings, weekly_mock_exam_goal: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>4</span>
                    <span>7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between">
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              {saved && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Settings saved!
                </p>
              )}
              {!error && !saved && <div></div>}
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
