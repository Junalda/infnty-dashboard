import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const DEMO_USERS: Record<string, { email: string; role: string }> = {
  admin: { email: 'admin@infntystudio.com', role: 'admin' },
  rehearsal: { email: 'rehearsal@infntystudio.com', role: 'customer' },
  content: { email: 'content@infntystudio.com', role: 'customer' },
  soundlab: { email: 'soundlab@infntystudio.com', role: 'customer' },
}

const DEMO_PASSWORD = 'Demo2024!'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userKey = searchParams.get('user') ?? ''
  const demoUser = DEMO_USERS[userKey]

  if (!demoUser) {
    return NextResponse.json({ error: 'Invalid demo user' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '')
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Ensure demo user exists (idempotent)
  const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
    body: JSON.stringify({
      email: demoUser.email,
      password: DEMO_PASSWORD,
      email_confirm: true,
    }),
  })

  if (!createRes.ok && createRes.status !== 422) {
    const err = await createRes.text()
    return NextResponse.json({ error: `Failed to create user: ${err}` }, { status: 500 })
  }

  // Sign in to get tokens
  const tokenRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ email: demoUser.email, password: DEMO_PASSWORD }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    return NextResponse.json({ error: `Failed to sign in: ${err}` }, { status: 500 })
  }

  const session = await tokenRes.json()

  // Write session to SSR cookies
  const cookieStore = await cookies()
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) =>
        toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
    },
  })

  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  })

  const dest = demoUser.role === 'admin' ? '/admin' : '/dashboard'
  return NextResponse.redirect(new URL(dest, request.url))
}
