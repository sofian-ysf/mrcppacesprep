'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'

interface SubscriptionState {
  hasAccess: boolean
  loading: boolean
}

export function useSubscription() {
  const { user, loading: authLoading } = useAuth()
  const [state, setState] = useState<SubscriptionState>({
    hasAccess: false,
    loading: true
  })

  const checkAccess = useCallback(async () => {
    if (authLoading) return

    if (!user) {
      setState({
        hasAccess: false,
        loading: false
      })
      return
    }

    try {
      const response = await fetch('/api/stripe/check-access')
      const data = await response.json()

      setState({
        hasAccess: data.hasAccess || false,
        loading: false
      })
    } catch (error) {
      console.error('Failed to check subscription:', error)
      setState({
        hasAccess: false,
        loading: false
      })
    }
  }, [user, authLoading])

  useEffect(() => {
    checkAccess()
  }, [checkAccess])

  return {
    ...state,
    isLoggedIn: !!user,
    user,
    refetch: checkAccess
  }
}
