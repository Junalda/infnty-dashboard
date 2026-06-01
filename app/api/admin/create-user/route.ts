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
  const email    = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const role     = (formData.get('role') as string) || 'customer'
  const adminRole = formData.get('admin_role') as string | null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '')
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({
      email,
      password,
      user_metadata: { full_name },
      email_confirm: true,
    }),
  })

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({})) as any
    const msg = err.msg ?? err.message ?? `HTTP ${createRes.status}`
    return NextResponse.redirect(new URL(`/admin/users?error=${encodeURIComponent(msg)}`, request.url))
  }

  const newUser = await createRes.json()

  // Update profile role + admin_role
  const updates: Record<string, any> = { role, full_name, email }
  if (adminRole) updates.admin_role = adminRole

  await supabase.from('profiles').update(updates).eq('id', newUser.id)

  // Audit log
  await supabase.from('audit_logs').insert({
    admin_id: user.id,
    admin_email: user.email,
    action: 'user_created',
    target_type: 'profile',
    target_id: newUser.id,
    details: { email, role, admin_role: adminRole ?? null },
  })

  return NextResponse.redirect(new URL('/admin/users?success=created', request.url))
}
