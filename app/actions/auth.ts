'use server'

import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function signUpAction(data: {
  email: string
  password: string
  full_name: string
}): Promise<{ error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !anonKey) {
    return { error: '[env] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.' }
  }
  if (!serviceRoleKey) {
    return { error: '[env] SUPABASE_SERVICE_ROLE_KEY is not set in Vercel environment variables.' }
  }

  // Step 1: admin createUser bypasses GoTrue redirect URL validation
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    user_metadata: { full_name: data.full_name },
    email_confirm: true,
  })

  if (createError) {
    return { error: `[step1/createUser] ${createError.message}` }
  }
  if (!created.user) {
    return { error: '[step1/createUser] No user returned from admin API.' }
  }

  // Step 2: sign in to get a session
  const anonClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (signInError) {
    return { error: `[step2/signIn] ${signInError.message}` }
  }
  if (!signInData.session) {
    return { error: '[step2/signIn] Sign-in succeeded but no session was returned.' }
  }

  // Step 3: write session into SSR cookies
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
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    })
  } catch (e) {
    // Session cookie write failed — user is created and signed in but
    // the cookie won't be set; redirect to login as fallback
    return { error: `[step3/setSession] ${e instanceof Error ? e.message : String(e)}` }
  }

  return {}
}
