'use server'

import { createClient } from '@/lib/supabase/server'

export async function signUpAction(data: {
  email: string
  password: string
  full_name: string
}): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { full_name: data.full_name },
    },
  })

  if (error) {
    console.error('[signUpAction] Supabase error — status:', error.status, '| message:', error.message)
    return { error: error.message }
  }

  return {}
}
