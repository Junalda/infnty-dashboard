'use server'

import { createClient } from '@/lib/supabase/server'

function serializeError(err: unknown): string {
  if (err instanceof Error) {
    const parts: string[] = [`${err.name}: ${err.message}`]
    if ((err as NodeJS.ErrnoException).code) parts.push(`code=${(err as NodeJS.ErrnoException).code}`)
    if (err.cause) parts.push(`cause=(${serializeError(err.cause)})`)
    return parts.join(' ')
  }
  return String(err)
}

export async function signUpAction(data: {
  email: string
  password: string
  full_name: string
}): Promise<{ error?: string; detail?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('[signUpAction] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ?? '(not set)')
  console.log('[signUpAction] NEXT_PUBLIC_SUPABASE_ANON_KEY present:', !!supabaseKey)

  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
    const msg = 'NEXT_PUBLIC_SUPABASE_URL is not set or is still the placeholder value.'
    console.error('[signUpAction]', msg)
    return { error: msg }
  }
  if (!supabaseKey) {
    const msg = 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.'
    console.error('[signUpAction]', msg)
    return { error: msg }
  }

  // Connectivity pre-check: can the server reach Supabase at all?
  const healthUrl = `${supabaseUrl}/auth/v1/health`
  try {
    const probe = await fetch(healthUrl, { method: 'GET' })
    console.log('[signUpAction] Supabase health probe — status:', probe.status, 'url:', healthUrl)
  } catch (probeErr) {
    const detail = serializeError(probeErr)
    console.error('[signUpAction] Supabase health probe FAILED:', detail)
    return {
      error: `Server cannot reach Supabase at ${supabaseUrl}. Check that NEXT_PUBLIC_SUPABASE_URL is correct and the project is not paused.`,
      detail,
    }
  }

  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch (clientErr) {
    const detail = serializeError(clientErr)
    console.error('[signUpAction] createClient() threw:', detail)
    return { error: 'Failed to initialise Supabase client on the server.', detail }
  }

  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
      },
    })

    if (error) {
      console.error('[signUpAction] Supabase auth error — status:', error.status, '| message:', error.message, '| full:', error)
      return { error: error.message }
    }

    console.log('[signUpAction] Success — confirmation email dispatched to', data.email)
    return {}
  } catch (signUpErr) {
    const detail = serializeError(signUpErr)
    console.error('[signUpAction] supabase.auth.signUp() threw:', detail)
    return {
      error: `Signup request to Supabase failed: ${signUpErr instanceof Error ? signUpErr.message : String(signUpErr)}`,
      detail,
    }
  }
}
