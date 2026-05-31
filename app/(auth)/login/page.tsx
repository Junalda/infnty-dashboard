import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'

export const metadata = {
  title: 'Sign In — INFNTY Studio',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-black via-zinc-950 to-black">
      {/* Background orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-900/50">
              <span className="text-white font-bold text-lg">∞</span>
            </div>
            <span className="text-xl font-bold text-white">INFNTY Studio</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-zinc-400 text-sm">Sign in to your creative hub</p>
        </div>

        {/* Form card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          By signing in, you agree to our{' '}
          <Link href="/#terms" className="text-zinc-500 hover:text-zinc-300">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/#privacy" className="text-zinc-500 hover:text-zinc-300">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
