import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const { data: profile } = await supabase.from('profiles').select('role, admin_role').eq('id', user.id).single()
  if (profile?.role !== 'admin' || profile?.admin_role !== 'super_admin') {
    return NextResponse.redirect(new URL('/admin/no-access', request.url))
  }

  const formData = await request.formData()
  const admin_id      = formData.get('admin_id') as string
  const subscriber_id = formData.get('subscriber_id') as string
  const pillar        = formData.get('pillar') as string
  const notes         = formData.get('notes') as string | null

  const { error } = await supabase.from('admin_assignments').insert({
    admin_id,
    subscriber_id,
    pillar,
    assigned_by: user.id,
    notes: notes || null,
  })

  if (!error) {
    await supabase.from('audit_logs').insert({
      admin_id: user.id,
      admin_email: user.email,
      action: 'assignment_created',
      target_type: 'admin_assignment',
      details: { admin_id, subscriber_id, pillar },
    })
  }

  return NextResponse.redirect(new URL('/admin/assignments', request.url))
}
