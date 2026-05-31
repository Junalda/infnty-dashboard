// Plain supabase-js client — no @supabase/ssr wrapper.
// The SSR wrapper hard-codes flowType:'pkce' which triggers GoTrue's
// redirect URL validation on every auth operation, causing
// "Invalid path specified in request URL" for signup AND login.
// Plain createClient defaults to flowType:'implicit' — no redirect validation.
import { createClient as _createClient } from '@supabase/supabase-js'

export function createClient() {
  return _createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
