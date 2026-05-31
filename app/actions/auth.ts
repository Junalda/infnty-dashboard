'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function signUpAction(data: {
  email: string
  password: string
  full_name: string
}): Promise<{ error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !anonKey) {
    return { error: '[env] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.' }
  }
  if (!serviceRoleKey) {
    return { error: '[env] SUPABASE_SERVICE_ROLE_KEY is not set in Vercel environment variables.' }
  }

  // Step 1: raw POST to admin users endpoint — zero supabase-js wrapping,
  // no PKCE, no redirect URL injection of any kind.
  const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      user_metadata: { full_name: data.full_name },
      email_confirm: true,
    }),
  })

  if (!createRes.ok) {
    const body = await createRes.json().catch(() => ({}))
    const msg = (body as { msg?: string; message?: string }).msg
      ?? (body as { msg?: string; message?: string }).message
      ?? `HTTP ${createRes.status}`
    return { error: `[step1/createUser] ${msg}` }
  }

  // Step 2: raw POST to token endpoint to sign in and get a session.
  const tokenRes = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ email: data.email, password: data.password }),
    },
  )

  if (!tokenRes.ok) {
    const body = await tokenRes.json().catch(() => ({}))
    const msg = (body as { error_description?: string; msg?: string }).error_description
      ?? (body as { error_description?: string; msg?: string }).msg
      ?? `HTTP ${tokenRes.status}`
    return { error: `[step2/signIn] ${msg}` }
  }

  const session = await tokenRes.json() as {
    access_token: string
    refresh_token: string
  }

  if (!session.access_token || !session.refresh_token) {
    return { error: '[step2/signIn] Token response missing access_token or refresh_token.' }
  }

  // Step 3: write the session into SSR cookies so the middleware sees it.
  try {
    const cookieStore = await cookies()
    const ssrClient = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })
    await ssrClient.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    })
  } catch (e) {
    return { error: `[step3/setSession] ${e instanceof Error ? e.message : String(e)}` }
  }

  return {}
}
