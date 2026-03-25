'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

interface Post {
  id: string
  title: string
  slug: string
  status: string
  created_at: string
  published_at?: string
  blog_categories: { id: string; name: string }
}

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [page, statusFilter, categoryFilter])

  async function fetchCategories() {
    try {
      const response = await fetch('/api/admin/blog/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  async function fetchPosts() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '20')
      if (statusFilter) params.set('status', statusFilter)
      if (categoryFilter) params.set('category', categoryFilter)

      const response = await fetch(`/api/admin/blog/posts?${params}`)
      const data = await response.json()

      setPosts(data.posts || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(postId: string, newStatus: string) {
    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  async function handleDelete(postId: string) {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">All Blog Posts</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and publish your blog content</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/blog/generate"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Generate Post
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No posts found. Generate your first blog post!
                      </td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4">
                          <Link href={`/admin/blog/posts/${post.id}`} className="font-medium text-gray-900 hover:text-gray-600">
                            {post.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">/{post.slug}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.blog_categories?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={post.status}
                            onChange={(e) => handleStatusChange(post.id, e.target.value)}
                            className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${
                              post.status === 'published' ? 'bg-green-100 text-green-700' :
                              post.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                              post.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}
                          >
                            <option value="draft">Draft</option>
                            <option value="review">Review</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString()
                            : new Date(post.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/admin/blog/posts/${post.id}`}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Edit
                            </Link>
                            {post.status === 'published' && (
                              <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900"
                              >
                                View
                              </a>
                            )}
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
