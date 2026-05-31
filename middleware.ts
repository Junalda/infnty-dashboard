import { NextResponse, type NextRequest } from 'next/server'

// Middleware disabled — auth protection is handled in layout.tsx server-side.
// The @supabase/ssr middleware forced PKCE on every request and was causing
// "Invalid path specified in request URL" on all auth operations.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
