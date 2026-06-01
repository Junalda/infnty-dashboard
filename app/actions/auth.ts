'use server'

import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// ─── helpers ────────────────────────────────────────────────────────────────

function ssrClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  )
}

// ─── signUpAction ────────────────────────────────────────────────────────────
// Uses the admin REST API directly — no supabase-js, no PKCE, no redirect URLs.

export async function signUpAction(data: {
  email: string
  password: string
  full_name: string
}): Promise<{ error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !anonKey)
    return { error: '[env] NEXT_PUBLIC_SUPABASE_URL or ANON_KEY not set.' }
  if (!serviceRoleKey)
    return { error: '[env] SUPABASE_SERVICE_ROLE_KEY not set in Vercel environment variables.' }

  // Step 1: create + auto-confirm via supabase-js admin API.
  // Plain createClient (not @supabase/ssr) — no PKCE, no redirect URL validation.
  // Only pass: email, password, email_confirm, user_metadata. Nothing else.
  const adminClient = createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { error: createError } = await adminClient.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: { full_name: data.full_name },
  })

  if (createError) {
    return { error: `[step1/createUser] ${createError.message}` }
  }

  // Step 2: sign in to get session tokens
  const tokenRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ email: data.email, password: data.password }),
  })

  if (!tokenRes.ok) {
    const body = (await tokenRes.json().catch(() => ({}))) as {
      error_description?: string
      msg?: string
    }
    return {
      error: `[step2/signIn] ${body.error_description ?? body.msg ?? `HTTP ${tokenRes.status}`}`,
    }
  }

  const session = (await tokenRes.json()) as {
    access_token: string
    refresh_token: string
  }

  // Step 3: write session to SSR cookies so server components can read it
  const cookieStore = await cookies()
  const client = ssrClient(cookieStore)
  await client.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  })

  return {}
}

// ─── setSessionAction ─────────────────────────────────────────────────────────
// Called from the browser login form after a successful signInWithPassword.
// Writes the session into SSR cookies so the server layout can verify auth.

export async function setSessionAction(
  access_token: string,
  refresh_token: string
): Promise<{ error?: string }> {
  try {
    const cookieStore = await cookies()
    const client = ssrClient(cookieStore)
    const { error } = await client.auth.setSession({ access_token, refresh_token })
    if (error) return { error: error.message }
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) }
  }
}

// ─── signOutAction ────────────────────────────────────────────────────────────

export async function signOutAction(): Promise<void> {
  const cookieStore = await cookies()
  const client = ssrClient(cookieStore)
  await client.auth.signOut()
}
