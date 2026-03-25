'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'

interface TrialInfo {
  questionsUsed: number
  questionsRemaining: number
  daysRemaining: number
  expiresAt: string
  isExpired: boolean
  isExhausted: boolean
  status: string
}

interface SubscriptionState {
  hasAccess: boolean
  loading: boolean
  accessType: 'trial' | 'subscription' | 'none'
  subscription: {
    status: string
    stripeStatus: string | null
  } | null
  trial: TrialInfo | null
  isOnTrial: boolean
}

export function useSubscription() {
  const { user, loading: authLoading } = useAuth()
  const [state, setState] = useState<SubscriptionState>({
    hasAccess: false,
    loading: true,
    accessType: 'none',
    subscription: null,
    trial: null,
    isOnTrial: false
  })

  const checkAccess = useCallback(async () => {
    if (authLoading) return

    if (!user) {
      setState({
        hasAccess: false,
        loading: false,
        accessType: 'none',
        subscription: null,
        trial: null,
        isOnTrial: false
      })
      return
    }

    try {
      const response = await fetch('/api/stripe/check-access')
      const data = await response.json()

      setState({
        hasAccess: data.hasAccess || false,
        loading: false,
        accessType: data.accessType || 'none',
        subscription: data.accessType === 'subscription' ? {
          status: 'active',
          stripeStatus: data.subscription?.status || null
        } : null,
        trial: data.trial || null,
        isOnTrial: data.accessType === 'trial'
      })
    } catch (error) {
      console.error('Failed to check subscription:', error)
      setState({
        hasAccess: false,
        loading: false,
        accessType: 'none',
        subscription: null,
        trial: null,
        isOnTrial: false
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
