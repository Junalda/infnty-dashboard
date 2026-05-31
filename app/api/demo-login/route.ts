import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const DEMO_USERS: Record<string, { id: string; email: string; password: string }> = {
  marcus: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'marcus@demo.infnty.studio',
    password: 'Demo2024!',
  },
  sarah: {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'sarah@demo.infnty.studio',
    password: 'Demo2024!',
  },
  daniel: {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'daniel@demo.infnty.studio',
    password: 'Demo2024!',
  },
  admin: {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'admin@demo.infnty.studio',
    password: 'Demo2024!',
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userKey = searchParams.get('user') ?? ''
  const demoUser = DEMO_USERS[userKey]

  if (!demoUser) {
    return NextResponse.json({ error: 'Invalid demo user' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // 1. Try to create the auth user (idempotent — ignore 422)
  const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
    body: JSON.stringify({
      id: demoUser.id,
      email: demoUser.email,
      password: demoUser.password,
      email_confirm: true,
    }),
  })

  // 422 = user already exists, which is fine
  if (!createRes.ok && createRes.status !== 422) {
    const err = await createRes.text()
    return NextResponse.json({ error: `Failed to create user: ${err}` }, { status: 500 })
  }

  // 2. Sign in with email/password to get a session
  const tokenRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
    body: JSON.stringify({
      email: demoUser.email,
      password: demoUser.password,
    }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    return NextResponse.json({ error: `Failed to sign in: ${err}` }, { status: 500 })
  }

  const session = await tokenRes.json()

  // 3. Set session cookies via createServerClient
  const cookieStore = await cookies()
  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  })

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
