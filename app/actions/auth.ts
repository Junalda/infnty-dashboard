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
    return { error: 'Server configuration error: Supabase credentials are not set.' }
  }
  if (!serviceRoleKey) {
    return { error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is not set.' }
  }

  // Step 1: create + auto-confirm user via admin API.
  // This bypasses GoTrue redirect URL validation entirely.
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
    return { error: createError.message }
  }
  if (!created.user) {
    return { error: 'Account could not be created. Please try again.' }
  }

  // Step 2: sign the user in to obtain a session.
  const anonClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (signInError || !signInData.session) {
    // Account created but sign-in failed — ask user to log in manually
    return {}
  }

  // Step 3: persist the session in cookies so the middleware sees it.
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

  return {}
}
