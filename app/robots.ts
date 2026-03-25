import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.mrcppacesprep.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
      // AI Crawlers - Allow for AI Optimization (AIO)
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      {
        userAgent: 'Claude-Web',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      {
        userAgent: 'anthropic-ai',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      {
        userAgent: 'Perplexity-User',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      {
        userAgent: 'PerplexityBot',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      {
        userAgent: 'Bytespider',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      {
        userAgent: 'cohere-ai',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      // Google's AI training crawler
      {
        userAgent: 'Google-Extended',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      // Meta's AI crawler
      {
        userAgent: 'Meta-ExternalAgent',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      // Common Crawl (used by many AI projects)
      {
        userAgent: 'CCBot',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      // Amazon's AI crawler
      {
        userAgent: 'Amazonbot',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
      // Apple's AI crawler (Applebot-Extended for AI features)
      {
        userAgent: 'Applebot-Extended',
        allow: [
          '/',
          '/llms.txt',
          '/ai.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}