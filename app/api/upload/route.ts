import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['partner', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Only partners and admins can upload files' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const projectType = formData.get('project_type') as string
  const projectId = formData.get('project_id') as string
  const targetUserId = formData.get('user_id') as string

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (!projectType || !['content', 'soundlab'].includes(projectType)) {
    return NextResponse.json({ error: 'Invalid project type' }, { status: 400 })
  }
  if (!targetUserId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large (max 500MB)' }, { status: 413 })
  }

  const bucket = projectType === 'content' ? 'content-files' : 'soundlab-files'
  const ext = file.name.split('.').pop()
  const fileName = `${targetUserId}/${projectId || 'general'}/${Date.now()}_${file.name}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  // Store metadata in uploaded_files
  const { data: record, error: dbError } = await supabase
    .from('uploaded_files')
    .insert({
      user_id: targetUserId,
      uploaded_by: user.id,
      project_type: projectType,
      project_id: projectId || null,
      file_name: file.name,
      file_url: publicUrl,
      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single()

  if (dbError) {
    // Cleanup storage on DB failure
    await supabase.storage.from(bucket).remove([fileName])
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json(record, { status: 201 })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const projectType = searchParams.get('project_type')
  const projectId = searchParams.get('project_id')
  const targetUserId = searchParams.get('user_id') || user.id

  let query = supabase
    .from('uploaded_files')
    .select('*')
    .eq('user_id', targetUserId)
    .order('created_at', { ascending: false })

  if (projectType) query = query.eq('project_type', projectType)
  if (projectId) query = query.eq('project_id', projectId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['partner', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get('id')
  if (!fileId) return NextResponse.json({ error: 'Missing file id' }, { status: 400 })

  const { data: file } = await supabase
    .from('uploaded_files')
    .select('*')
    .eq('id', fileId)
    .single()

  if (!file) return NextResponse.json({ error: 'File not found' }, { status: 404 })

  const bucket = file.project_type === 'content' ? 'content-files' : 'soundlab-files'
  const path = new URL(file.file_url).pathname.split(`/${bucket}/`)[1]
  if (path) {
    await supabase.storage.from(bucket).remove([path])
  }

  await supabase.from('uploaded_files').delete().eq('id', fileId)
  return NextResponse.json({ success: true })
}
