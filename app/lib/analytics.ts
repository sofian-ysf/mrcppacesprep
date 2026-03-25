// Analytics tracking library for Google Analytics 4 and Google Ads conversion tracking
// Use this to track events across the application

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

// Core event tracking function
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Signup events
export const trackSignupStarted = (source?: string) => {
  trackEvent('signup_started', {
    event_category: 'engagement',
    event_label: source || 'direct',
  })
}

export const trackSignupCompleted = (userId?: string) => {
  trackEvent('signup_completed', {
    event_category: 'conversion',
    user_id: userId,
  })
}

// Free trial events
export const trackFreeTrialStarted = (source?: string) => {
  trackEvent('free_trial_started', {
    event_category: 'conversion',
    event_label: source || 'direct',
  })
}

// Pricing events
export const trackPricingViewed = (source?: string) => {
  trackEvent('pricing_viewed', {
    event_category: 'engagement',
    event_label: source || 'direct',
  })
}

export const trackPlanSelected = (planType: 'monthly' | 'annual') => {
  trackEvent('plan_selected', {
    event_category: 'engagement',
    plan_type: planType,
    value: planType === 'annual' ? 300 : 30,
    currency: 'GBP',
  })
}

// Checkout events
export const trackCheckoutStarted = (planType: 'monthly' | 'annual') => {
  trackEvent('begin_checkout', {
    event_category: 'ecommerce',
    plan_type: planType,
    value: planType === 'annual' ? 300 : 30,
    currency: 'GBP',
  })
}

export const trackCheckoutCompleted = (
  planType: 'monthly' | 'annual',
  transactionId?: string
) => {
  trackEvent('purchase', {
    event_category: 'ecommerce',
    plan_type: planType,
    transaction_id: transactionId,
    value: planType === 'annual' ? 300 : 30,
    currency: 'GBP',
  })

  // Also trigger Google Ads conversion
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17903779734/CONVERSION_ID', // Replace CONVERSION_ID with actual conversion ID
      'value': planType === 'annual' ? 300 : 30,
      'currency': 'GBP',
      'transaction_id': transactionId,
    })
  }
}

// Question practice events
export const trackQuestionAnswered = (params: {
  questionId?: string
  category?: string
  isCorrect: boolean
  timeSpent?: number
}) => {
  trackEvent('question_answered', {
    event_category: 'engagement',
    question_id: params.questionId,
    category: params.category,
    is_correct: params.isCorrect,
    time_spent: params.timeSpent,
  })
}

export const trackMockExamStarted = () => {
  trackEvent('mock_exam_started', {
    event_category: 'engagement',
  })
}

export const trackMockExamCompleted = (score?: number) => {
  trackEvent('mock_exam_completed', {
    event_category: 'engagement',
    score: score,
  })
}

// Page view tracking (for SPA navigation)
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  })
}

// CTA click tracking
export const trackCTAClick = (ctaName: string, location?: string) => {
  trackEvent('cta_click', {
    event_category: 'engagement',
    cta_name: ctaName,
    location: location,
  })
}

// Resource download tracking
export const trackResourceDownload = (resourceName: string) => {
  trackEvent('file_download', {
    event_category: 'engagement',
    file_name: resourceName,
  })
}

// Blog engagement
export const trackBlogRead = (postSlug: string, postTitle?: string) => {
  trackEvent('blog_read', {
    event_category: 'engagement',
    post_slug: postSlug,
    post_title: postTitle,
  })
}

// User engagement milestones
export const trackMilestone = (milestone: string, value?: number) => {
  trackEvent('milestone_reached', {
    event_category: 'engagement',
    milestone_name: milestone,
    milestone_value: value,
  })
}
