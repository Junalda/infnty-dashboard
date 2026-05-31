import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

  if (!supabaseUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_SUPABASE_URL is not set' }, { status: 500 })
  }

  const healthUrl = `${supabaseUrl}/auth/v1/health`
  const results: Record<string, unknown> = { supabase_host: new URL(supabaseUrl).host, healthUrl }

  // Health probe
  try {
    const res = await fetch(healthUrl, { method: 'GET', cache: 'no-store' })
    let body: unknown = null
    try { body = await res.json() } catch { body = await res.text().catch(() => null) }
    results.health = { status: res.status, ok: res.ok, body }
  } catch (err) {
    const e = err as Error & { code?: string; cause?: unknown }
    results.health = {
      threw: true,
      name: e.name,
      message: e.message,
      code: e.code ?? null,
      cause: e.cause ? String(e.cause) : null,
    }
  }

  // Auth settings probe (no credentials needed)
  const settingsUrl = `${supabaseUrl}/auth/v1/settings`
  try {
    const res = await fetch(settingsUrl, {
      method: 'GET',
      cache: 'no-store',
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '' },
    })
    let body: unknown = null
    try { body = await res.json() } catch { body = await res.text().catch(() => null) }
    results.settings = { status: res.status, ok: res.ok, body }
  } catch (err) {
    const e = err as Error & { code?: string; cause?: unknown }
    results.settings = {
      threw: true,
      name: e.name,
      message: e.message,
      code: e.code ?? null,
      cause: e.cause ? String(e.cause) : null,
    }
  }

  return NextResponse.json(results, { status: 200 })
}
