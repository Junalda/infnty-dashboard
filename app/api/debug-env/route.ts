import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  let urlParsed: { host: string; origin: string; pathname: string } | null = null
  let urlError: string | null = null
  try {
    const p = new URL(supabaseUrl)
    urlParsed = { host: p.host, origin: p.origin, pathname: p.pathname }
  } catch (e) {
    urlError = String(e)
  }

  // Check for common formatting mistakes
  const warnings: string[] = []
  if (supabaseUrl.endsWith('/')) warnings.push('URL has a trailing slash')
  if (supabaseUrl !== supabaseUrl.trim()) warnings.push('URL has leading or trailing whitespace')
  if (supabaseUrl.includes(' ')) warnings.push('URL contains spaces')
  if (supabaseUrl.includes('\n') || supabaseUrl.includes('\r')) warnings.push('URL contains newline characters')

  return NextResponse.json({
    // NEXT_PUBLIC_SUPABASE_URL is intentionally public — safe to expose in full
    NEXT_PUBLIC_SUPABASE_URL: {
      value: supabaseUrl,          // full value for copy/paste comparison
      length: supabaseUrl.length,
      parsed: urlParsed,
      parse_error: urlError,
      warnings,
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      set: anonKey.length > 0,
      length: anonKey.length,
      first_8_chars: anonKey.slice(0, 8) || null,
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      set: serviceKey.length > 0,
      length: serviceKey.length,
    },
    VERCEL_URL: process.env.VERCEL_URL ?? null,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? null,
    NODE_ENV: process.env.NODE_ENV,
  })
}
