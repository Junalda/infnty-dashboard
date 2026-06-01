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
  const assignment_id = formData.get('assignment_id') as string

  const { data: assignment } = await supabase.from('admin_assignments').select('*').eq('id', assignment_id).single()

  await supabase.from('admin_assignments').delete().eq('id', assignment_id)

  await supabase.from('audit_logs').insert({
    admin_id: user.id,
    admin_email: user.email,
    action: 'assignment_removed',
    target_type: 'admin_assignment',
    target_id: assignment_id as any,
    details: assignment ?? {},
  })

  return NextResponse.redirect(new URL('/admin/assignments', request.url))
}
