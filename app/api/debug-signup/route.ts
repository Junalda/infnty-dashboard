import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const nextPublicAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const vercelUrl = process.env.VERCEL_URL ?? ''

  // Replicate the exact emailRedirectTo construction from app/actions/auth.ts
  const appUrl =
    nextPublicAppUrl.replace(/\/$/, '') ||
    (vercelUrl ? `https://${vercelUrl}` : null) ||
    (supabaseUrl ? new URL(supabaseUrl).origin.replace('.supabase.co', '.vercel.app') : '')

  const emailRedirectTo = `${appUrl}/auth/callback`

  // Exact signUp payload (minus password)
  const signUpPayload = {
    email: '(user_email)',
    password: '(redacted)',
    options: {
      data: { full_name: '(user_full_name)' },
      emailRedirectTo,
    },
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_APP_URL: nextPublicAppUrl || '(not set)',
      NEXT_PUBLIC_APP_URL_length: nextPublicAppUrl.length,
      VERCEL_URL: vercelUrl || '(not set)',
      NEXT_PUBLIC_SUPABASE_URL_host: supabaseUrl ? new URL(supabaseUrl).host : '(not set)',
    },
    construction: {
      step1_NEXT_PUBLIC_APP_URL_trimmed: nextPublicAppUrl.replace(/\/$/, '') || '(empty)',
      step2_VERCEL_URL_prefixed: vercelUrl ? `https://${vercelUrl}` : '(not used)',
      appUrl_selected: appUrl,
    },
    emailRedirectTo_exact: emailRedirectTo,
    emailRedirectTo_length: emailRedirectTo.length,
    emailRedirectTo_chars: [...emailRedirectTo].map((c, i) => ({ i, c, code: c.charCodeAt(0) })),
    signUpPayload,
  })
}
