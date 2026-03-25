'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const GCLID_STORAGE_KEY = 'gclid'
const GCLID_TIMESTAMP_KEY = 'gclid_timestamp'
const GCLID_EXPIRY_DAYS = 90

export function GclidCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const gclid = searchParams.get('gclid')

    if (gclid) {
      // Store gclid with timestamp
      localStorage.setItem(GCLID_STORAGE_KEY, gclid)
      localStorage.setItem(GCLID_TIMESTAMP_KEY, Date.now().toString())
    }
  }, [searchParams])

  return null
}

// Helper function to get stored gclid (if not expired)
export function getStoredGclid(): string | null {
  if (typeof window === 'undefined') return null

  const gclid = localStorage.getItem(GCLID_STORAGE_KEY)
  const timestamp = localStorage.getItem(GCLID_TIMESTAMP_KEY)

  if (!gclid || !timestamp) return null

  // Check if gclid has expired (90 days)
  const storedTime = parseInt(timestamp, 10)
  const expiryTime = storedTime + GCLID_EXPIRY_DAYS * 24 * 60 * 60 * 1000

  if (Date.now() > expiryTime) {
    // Expired, clear storage
    localStorage.removeItem(GCLID_STORAGE_KEY)
    localStorage.removeItem(GCLID_TIMESTAMP_KEY)
    return null
  }

  return gclid
}
