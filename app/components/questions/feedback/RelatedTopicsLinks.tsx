'use client'

interface RelatedTopicsLinksProps {
  topics: string[] | undefined
}

export default function RelatedTopicsLinks({ topics }: RelatedTopicsLinksProps) {
  if (!topics || topics.length === 0) return null

  // Convert slug to display name
  const formatTopicName = (slug: string): string => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Related Topics</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer"
            title={`Study more about ${formatTopicName(topic)}`}
          >
            {formatTopicName(topic)}
          </span>
        ))}
      </div>
    </div>
  )
}
