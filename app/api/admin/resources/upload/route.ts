import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const categoryId = formData.get('categoryId') as string

    if (!file || !categoryId) {
      return NextResponse.json({ error: 'File and categoryId are required' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown']
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md')) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: PDF, TXT, MD' }, { status: 400 })
    }

    // Generate unique file path
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `resources/${categoryId}/${timestamp}_${safeName}`

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // If bucket doesn't exist, create it
      if (uploadError.message.includes('not found')) {
        return NextResponse.json({
          error: 'Storage bucket not configured. Please create a "documents" bucket in Supabase Storage.'
        }, { status: 500 })
      }
      throw uploadError
    }

    // Create resource record
    const { data: resource, error: dbError } = await supabase
      .from('category_resources')
      .insert({
        category_id: categoryId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.name.split('.').pop() || 'pdf',
        file_size_bytes: file.size,
        uploaded_by: user.id,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    return NextResponse.json({
      success: true,
      resourceId: resource.id,
      filePath
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
