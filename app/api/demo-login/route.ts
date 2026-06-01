import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface DemoUser {
  email: string
  password: string
  role: string
  admin_role?: string
  redirect: string
}

const DEMO_USERS: Record<string, DemoUser> = {
  admin: {
    email: 'admin@infntystudio.com',
    password: 'Admin123!',
    role: 'admin',
    admin_role: 'super_admin',
    redirect: '/admin',
  },
  producer: {
    email: 'producer@infntystudio.com',
    password: 'Producer123!',
    role: 'admin',
    admin_role: 'producer_admin',
    redirect: '/admin/soundlab',
  },
  content: {
    email: 'content@infntystudio.com',
    password: 'Content123!',
    role: 'admin',
    admin_role: 'content_admin',
    redirect: '/admin/content',
  },
  operations: {
    email: 'operations@infntystudio.com',
    password: 'Operations123!',
    role: 'admin',
    admin_role: 'operations_admin',
    redirect: '/admin/operations',
  },
  rehearsal: {
    email: 'rehearsal@infntystudio.com',
    password: 'Demo2024!',
    role: 'customer',
    redirect: '/dashboard',
  },
  soundlab: {
    email: 'soundlab@infntystudio.com',
    password: 'Demo2024!',
    role: 'customer',
    redirect: '/dashboard',
  },
}

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
      password: demoUser.password,
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
    body: JSON.stringify({ email: demoUser.email, password: demoUser.password }),
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

  return NextResponse.redirect(new URL(demoUser.redirect, request.url))
}
