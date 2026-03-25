'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  resource_count: number
  post_count: number
  published_count: number
  draft_count: number
}

interface Post {
  id: string
  title: string
  slug: string
  status: string
  created_at: string
  blog_categories: { name: string }
}

interface Job {
  id: string
  topic: string
  status: string
  created_at: string
  blog_categories: { name: string }
}

export default function BlogDashboardPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, postsRes, jobsRes] = await Promise.all([
          fetch('/api/admin/blog/categories'),
          fetch('/api/admin/blog/posts?limit=5'),
          fetch('/api/admin/blog/generate'),
        ])

        const [categoriesData, postsData, jobsData] = await Promise.all([
          categoriesRes.json(),
          postsRes.json(),
          jobsRes.json(),
        ])

        setCategories(categoriesData.categories || [])
        setRecentPosts(postsData.posts || [])
        setRecentJobs(jobsData.jobs || [])
      } catch (error) {
        console.error('Failed to fetch blog data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const totalPosts = categories.reduce((sum, c) => sum + c.post_count, 0)
  const totalPublished = categories.reduce((sum, c) => sum + c.published_count, 0)
  const totalDrafts = categories.reduce((sum, c) => sum + c.draft_count, 0)
  const totalResources = categories.reduce((sum, c) => sum + c.resource_count, 0)

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Total Posts</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalPosts}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Published</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{totalPublished}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Drafts</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{totalDrafts}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Resources</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalResources}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/blog/generate"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Generate New Post
        </Link>
        <Link
          href="/admin/blog/categories"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Manage Resources
        </Link>
        <Link
          href="/admin/blog/posts"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          All Posts
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Posts</h2>
            <Link href="/admin/blog/posts" className="text-sm text-gray-600 hover:text-gray-900">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPosts.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No posts yet. Generate your first blog post!
              </div>
            ) : (
              recentPosts.map((post) => (
                <div key={post.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <Link href={`/admin/blog/posts/${post.id}`} className="font-medium text-gray-900 hover:text-gray-600">
                      {post.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {post.blog_categories?.name} &middot; {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    post.status === 'published' ? 'bg-green-100 text-green-700' :
                    post.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {post.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Generation Jobs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Generations</h2>
            <Link href="/admin/blog/generate" className="text-sm text-gray-600 hover:text-gray-900">
              Generate new
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentJobs.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No generation jobs yet.
              </div>
            ) : (
              recentJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{job.topic}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {job.blog_categories?.name} &middot; {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    job.status === 'completed' ? 'bg-green-100 text-green-700' :
                    job.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    job.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Blog Categories</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resources</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.resource_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.post_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.published_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/admin/blog/generate?category=${category.id}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Generate
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
