import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  let urlHost: string | null = null
  let urlValid = false
  try {
    const parsed = new URL(supabaseUrl)
    urlHost = parsed.host
    urlValid = true
  } catch {
    urlHost = null
    urlValid = false
  }

  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: {
      set: supabaseUrl.length > 0,
      placeholder: supabaseUrl === 'https://your-project.supabase.co',
      host: urlHost,
      valid_url: urlValid,
      length: supabaseUrl.length,
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      set: anonKey.length > 0,
      length: anonKey.length,
      prefix: anonKey.slice(0, 8) || null,
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
