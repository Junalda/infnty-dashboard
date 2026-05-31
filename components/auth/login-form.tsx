'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { setSessionAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

const DEMO_USERS = [
  { label: 'Admin', email: 'admin@infntystudio.com', color: 'text-rose-400' },
  { label: 'Rehearsal', email: 'rehearsal@infntystudio.com', color: 'text-amber-400' },
  { label: 'Content', email: 'content@infntystudio.com', color: 'text-blue-400' },
  { label: 'Sound Lab', email: 'soundlab@infntystudio.com', color: 'text-purple-400' },
]
const DEMO_PASSWORD = 'Demo2024!'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function doLogin(loginEmail: string, loginPassword: string) {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })

    if (signInError || !data.session) {
      setError(signInError?.message ?? 'Sign in failed')
      setLoading(false)
      return
    }

    const { error: sessionError } = await setSessionAction(
      data.session.access_token,
      data.session.refresh_token
    )

    if (sessionError) {
      setError(sessionError)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.session.user.id)
      .single()

    const role = profile?.role ?? 'customer'
    router.push(role === 'admin' ? '/admin' : '/dashboard')
    router.refresh()
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    doLogin(email, password)
  }

  return (
    <div className="space-y-6">
      {/* Demo login buttons */}
      <div>
        <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">Demo accounts</p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_USERS.map((u) => (
            <button
              key={u.email}
              type="button"
              disabled={loading}
              onClick={() => doLogin(u.email, DEMO_PASSWORD)}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              <span className={u.color}>{u.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-xs text-zinc-600">or sign in with email</span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Signing in...</> : 'Sign In'}
        </Button>

        <p className="text-center text-sm text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-rose-400 hover:text-rose-300 font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
