import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure consistent URL structure (no trailing slashes)
  trailingSlash: false,

  // Image optimization for better Core Web Vitals
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // SEO redirects for old/alternate URLs
  async redirects() {
    return [
      // Redirect non-www to www for canonical URL consistency
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'mrcppacesprep.com' }],
        destination: 'https://www.mrcppacesprep.com/:path*',
        permanent: true,
      },
      // Redirect old URLs to new canonical URLs
      {
        source: '/gphc-practice-tests',
        destination: '/mock-exams',
        permanent: true,
      },
      {
        source: '/gphc-calculation-questions',
        destination: '/question-bank',
        permanent: true,
      },
      // Redirect removed calculations page
      {
        source: '/calculations',
        destination: '/question-bank',
        permanent: true,
      },
      {
        source: '/gphc-revision-notes',
        destination: '/resources',
        permanent: true,
      },
      // Common misspellings/variations
      {
        source: '/prereg-exam',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pre-reg-exam',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Security headers for better SEO signals
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://*.supabase.co wss://*.supabase.co; frame-src 'self' https://www.youtube.com https://youtube.com; frame-ancestors 'none';",
          },
        ],
      },
    ]
  },
};

export default nextConfig;
