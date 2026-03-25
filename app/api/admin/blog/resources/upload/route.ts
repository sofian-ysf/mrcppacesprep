import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    const allowedExtensions = ['pdf', 'txt', 'md', 'docx']
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      return NextResponse.json({
        error: 'Invalid file type. Allowed: PDF, TXT, MD, DOCX'
      }, { status: 400 })
    }

    // Generate unique file path
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `blog-resources/${categoryId}/${timestamp}_${safeName}`

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Create database record for the uploaded file
    const { data: resource, error: dbError } = await supabase
      .from('blog_resources')
      .insert({
        category_id: categoryId,
        file_name: file.name,
        file_path: filePath,
        file_type: fileExtension || 'pdf',
        file_size_bytes: file.size,
        uploaded_by: user.id,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Try to clean up uploaded file
      await supabase.storage.from('documents').remove([filePath])
      throw new Error(`Database error: ${dbError.message}`)
    }

    return NextResponse.json({
      success: true,
      resourceId: resource.id,
      filePath
    })
  } catch (error) {
    console.error('Blog resource upload error:', error)
    return NextResponse.json({
      error: (error as Error).message || 'Failed to upload resource'
    }, { status: 500 })
  }
}
