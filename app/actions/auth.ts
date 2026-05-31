'use server'

// Deliberately NOT using @supabase/ssr createServerClient here.
// createServerClient forces flowType:'pkce', which requires GoTrue to validate
// a redirect URL on every signUp call — causing "Invalid path specified in
// request URL" when no emailRedirectTo is provided and the Site URL fails
// GoTrue's internal path validation.
//
// @supabase/supabase-js standalone defaults to flowType:'implicit', which
// does not perform that redirect URL validation on signUp.
import { createClient } from '@supabase/supabase-js'

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
}): Promise<{ error?: string; detail?: string; emailRedirectTo?: string }> {
  // These are resolved from the server's process.env at runtime — not baked
  // into the client bundle at build time like NEXT_PUBLIC_* vars are.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('[signUpAction] handler=app/actions/auth.ts')
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

  // Plain supabase-js client — no SSR wrapper, no forced PKCE
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Construct emailRedirectTo from server-side env vars so GoTrue never falls
  // back to the Site URL (which fails its internal path validation).
  // Priority: NEXT_PUBLIC_APP_URL → VERCEL_URL → supabaseUrl origin as last resort.
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    new URL(supabaseUrl).origin.replace('.supabase.co', '.vercel.app')

  const emailRedirectTo = `${appUrl}/auth/callback`
  console.log('[signUpAction] emailRedirectTo:', emailRedirectTo)

  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo,
      },
    })

    if (error) {
      console.error('[signUpAction] Supabase auth error — status:', error.status, '| message:', error.message)
      return { error: error.message, emailRedirectTo }
    }

    console.log('[signUpAction] Success — confirmation email dispatched to', data.email)
    return {}
  } catch (err) {
    const detail = serializeError(err)
    console.error('[signUpAction] signUp threw:', detail)
    return {
      error: err instanceof Error ? err.message : String(err),
      detail,
    }
  }
}
