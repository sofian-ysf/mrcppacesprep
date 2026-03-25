import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

const VALID_GUIDES = [
  'pharmaceutical-calculations',
  'clinical-pharmacy-therapeutics',
  'pharmacy-law-ethics',
  'pharmaceutics-formulation',
  'pharmacology-drug-mechanisms',
  'public-health-prevention',
] as const

type GuideSlug = typeof VALID_GUIDES[number]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const guide = searchParams.get('guide') as GuideSlug | null

    if (!guide || !VALID_GUIDES.includes(guide)) {
      return NextResponse.json(
        { error: 'Invalid guide specified' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has active subscription
    const { data: subscription, error: dbError } = await supabase
      .from('user_subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (dbError && dbError.code !== 'PGRST116') {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription required' },
        { status: 403 }
      )
    }

    // Generate signed URL for the PDF (valid for 1 hour)
    const fileName = `${guide}.pdf`
    const { data: signedUrlData, error: storageError } = await supabase.storage
      .from('study-guides')
      .createSignedUrl(fileName, 3600) // 1 hour expiry

    if (storageError || !signedUrlData?.signedUrl) {
      console.error('Storage error:', storageError)
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: signedUrlData.signedUrl })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
