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
  const target_user_id = formData.get('user_id') as string

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '')
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Generate a temporary password — in production, send via email
  const tempPassword = `Temp${Math.random().toString(36).slice(2, 10)}!`

  await fetch(`${supabaseUrl}/auth/v1/admin/users/${target_user_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({ password: tempPassword }),
  })

  await supabase.from('audit_logs').insert({
    admin_id: user.id,
    admin_email: user.email,
    action: 'password_reset',
    target_type: 'profile',
    target_id: target_user_id as any,
    details: { note: 'Password reset by super admin' },
  })

  return NextResponse.redirect(new URL('/admin/users?success=password_reset', request.url))
}
