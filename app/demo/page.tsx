import Link from 'next/link'
import { ArrowRight, Music2, Video, Mic, Shield } from 'lucide-react'

export const metadata = { title: 'Demo Login — INFNTY Studio' }

const demoUsers = [
  {
    key: 'marcus',
    name: 'Marcus Johnson',
    email: 'marcus@demo.infnty.studio',
    role: 'Rehearsal Member',
    pillar: 'rehearsal',
    description: 'Explores the Rehearsal pillar — bookings, hour balance, upcoming sessions.',
    icon: Mic,
    accent: 'rose',
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/20',
    accentText: 'text-rose-400',
    accentBtn: 'bg-rose-500 hover:bg-rose-400',
    dot: 'bg-rose-500',
  },
  {
    key: 'sarah',
    name: 'Sarah Williams',
    email: 'sarah@demo.infnty.studio',
    role: 'Content Engine Member',
    pillar: 'content',
    description: 'Explores the Content Engine pillar — deliverables, calendar, approvals.',
    icon: Video,
    accent: 'amber',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/20',
    accentText: 'text-amber-400',
    accentBtn: 'bg-amber-500 hover:bg-amber-400',
    dot: 'bg-amber-500',
  },
  {
    key: 'daniel',
    name: 'Daniel Chen',
    email: 'daniel@demo.infnty.studio',
    role: 'Sound Lab Member',
    pillar: 'soundlab',
    description: 'Explores the Sound Lab pillar — song projects, revisions, distribution.',
    icon: Music2,
    accent: 'purple',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/20',
    accentText: 'text-purple-400',
    accentBtn: 'bg-purple-500 hover:bg-purple-400',
    dot: 'bg-purple-500',
  },
  {
    key: 'admin',
    name: 'Admin User',
    email: 'admin@demo.infnty.studio',
    role: 'Studio Admin',
    pillar: 'admin',
    description: 'Full admin access — users, bookings, revenue, content management, songs.',
    icon: Shield,
    accent: 'zinc',
    accentBg: 'bg-zinc-500/10',
    accentBorder: 'border-zinc-500/20',
    accentText: 'text-zinc-300',
    accentBtn: 'bg-zinc-600 hover:bg-zinc-500',
    dot: 'bg-zinc-400',
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-rose-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <span className="text-white font-bold text-xl">∞</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-white text-xl tracking-tight">INFNTY Studio</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Demo Environment</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Explore the Dashboard
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Log in as any demo user to see the full member experience. Each user unlocks a different pillar.
          </p>
        </div>

        {/* Demo cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {demoUsers.map((u) => {
            const Icon = u.icon
            return (
              <div
                key={u.key}
                className={`relative rounded-2xl border bg-zinc-900/50 backdrop-blur-sm p-6 flex flex-col gap-4 ${u.accentBorder}`}
              >
                {/* Pillar dot */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full ${u.accentBg} border ${u.accentBorder}`}>
                    <div className={`w-2 h-2 rounded-full ${u.dot}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${u.accentText}`}>{u.role}</span>
                  </div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${u.accentBg}`}>
                    <Icon className={`h-5 w-5 ${u.accentText}`} />
                  </div>
                </div>

                {/* Name & description */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{u.name}</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">{u.description}</p>
                </div>

                {/* Credentials */}
                <div className="rounded-xl bg-black/40 border border-zinc-800 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Email</span>
                    <span className="text-xs text-zinc-300 font-mono">{u.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Password</span>
                    <span className="text-xs text-zinc-300 font-mono">Demo2024!</span>
                  </div>
                </div>

                {/* Login button */}
                <Link
                  href={`/api/demo-login?user=${u.key}`}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors ${u.accentBtn}`}
                >
                  Login as {u.name.split(' ')[0]}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-zinc-600">
          Demo data is pre-seeded. No real bookings or payments are made.
        </p>
      </div>
    </div>
  )
}
