'use server'

import { createClient } from '@supabase/supabase-js'

export async function signUpAction(data: {
  email: string
  password: string
  full_name: string
}): Promise<{ error?: string; emailConfirmationRequired?: boolean }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return { error: 'Server configuration error: Supabase credentials are not set.' }
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: result, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { full_name: data.full_name },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Email confirmation is ON: session is null, user exists but is unconfirmed
  if (!result.session) {
    return { emailConfirmationRequired: true }
  }

  // Email confirmation is OFF: session is returned immediately
  return {}
}
