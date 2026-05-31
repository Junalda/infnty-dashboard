import { SignupForm } from '@/components/auth/signup-form'
import Link from 'next/link'

export const metadata = {
  title: 'Create Account — INFNTY Studio',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-black via-zinc-950 to-black">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-900/50">
              <span className="text-white font-bold text-lg">∞</span>
            </div>
            <span className="text-xl font-bold text-white">INFNTY Studio</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-zinc-400 text-sm">Join Rotterdam&apos;s creative hub for music, content and production.</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <SignupForm />
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          By signing up, you agree to our{' '}
          <Link href="/#terms" className="text-zinc-500 hover:text-zinc-300">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/#privacy" className="text-zinc-500 hover:text-zinc-300">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
