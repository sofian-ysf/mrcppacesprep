'use client'

import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/app/components/dashboard'

interface Note {
  id: string
  question_id: string | null
  flashcard_id: string | null
  content: string
  created_at: string
  updated_at: string
  questions?: {
    id: string
    question_text: string
    question_type: string
    difficulty: string
    question_categories?: {
      name: string
      slug: string
    }
  } | null
  flashcards?: {
    id: string
    front: string
    back: string
    flashcard_decks?: {
      name: string
      slug: string
    }
  } | null
}

export default function NotesPage() {
  const { user, loading: authLoading } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'questions' | 'flashcards'>('all')

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes?limit=100')
      if (res.ok) {
        const data = await res.json()
        setNotes(data.notes || [])
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const res = await fetch(`/api/notes?id=${noteId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setNotes(notes.filter(n => n.id !== noteId))
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const filteredNotes = notes.filter(note => {
    if (filterType === 'questions' && !note.question_id) return false
    if (filterType === 'flashcards' && !note.flashcard_id) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesContent = note.content.toLowerCase().includes(query)
      const matchesQuestion = note.questions?.question_text.toLowerCase().includes(query)
      const matchesFlashcard = note.flashcards?.front.toLowerCase().includes(query) ||
                              note.flashcards?.back.toLowerCase().includes(query)
      return matchesContent || matchesQuestion || matchesFlashcard
    }

    return true
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

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
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to view your notes</h2>
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
        { label: 'Notes' }
      ]}
    >
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Notes</h1>
          <p className="text-gray-600 mt-1">Review and manage your personal study notes</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterType === 'all'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('questions')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterType === 'questions'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Questions
              </button>
              <button
                onClick={() => setFilterType('flashcards')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterType === 'flashcards'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Flashcards
              </button>
            </div>
          </div>
        </div>

        {/* Notes List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Add notes while practicing to see them here'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {note.question_id ? (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Question</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Flashcard</span>
                    )}
                    {note.questions?.question_categories?.name && (
                      <span className="text-xs text-gray-500">{note.questions.question_categories.name}</span>
                    )}
                    {note.flashcards?.flashcard_decks?.name && (
                      <span className="text-xs text-gray-500">{note.flashcards.flashcard_decks.name}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete note"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Source Content Preview */}
                {note.questions && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 line-clamp-2">{note.questions.question_text}</p>
                  </div>
                )}
                {note.flashcards && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 line-clamp-2"
                       dangerouslySetInnerHTML={{ __html: note.flashcards.front }}
                    />
                  </div>
                )}

                {/* Note Content */}
                <div className="text-gray-800 whitespace-pre-wrap">{note.content}</div>

                {/* Metadata */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Updated {formatDate(note.updated_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
