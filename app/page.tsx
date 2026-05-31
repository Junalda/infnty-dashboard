import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Star, Mic2, Video, Music2, ChevronRight, Zap, Clock, Shield } from 'lucide-react'
import { PRICING_PLANS } from '@/lib/stripe'
import { formatCurrency } from '@/lib/utils'

export const metadata = {
  title: 'INFNTY Studio — 24/7 Creator, Music & Content Hub',
  description: 'Rotterdam\'s Premier Creative Hub — Open 24/7. Rehearsal, content production, and music creation.',
}

const pillars = [
  {
    id: 'rehearsal',
    label: 'Rehearsal',
    icon: Mic2,
    color: 'rose',
    gradient: 'from-rose-600 to-rose-900',
    border: 'border-rose-500/20',
    bg: 'bg-rose-500/5',
    accent: 'text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    description: 'One fully equipped rehearsal room for bands, musicians and performers. Available 24/7 for all members.',
  },
  {
    id: 'content',
    label: 'Content Engine',
    icon: Video,
    color: 'amber',
    gradient: 'from-amber-600 to-amber-900',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/5',
    accent: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Professional content production for creators, brands and entrepreneurs.',
  },
  {
    id: 'soundlab',
    label: 'Sound Lab',
    icon: Music2,
    color: 'purple',
    gradient: 'from-purple-600 to-purple-900',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/5',
    accent: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    description: 'AI-assisted music production, recording and mastering for independent artists.',
  },
]

type PillarKey = 'rehearsal' | 'content' | 'soundlab'
type Plan = {
  name: string
  tier: string
  price: number
  hours?: number | null
  popular?: boolean
  features: string[]
}

const pillarPlans: Record<PillarKey, Plan[]> = PRICING_PLANS as Record<PillarKey, Plan[]>

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-900/50">
              <span className="text-white font-bold text-base leading-none">∞</span>
            </div>
            <span className="font-bold text-white text-lg">INFNTY Studio</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#pillars" className="hover:text-white transition-colors">Pillars</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,63,94,0.08)_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-rose-600/3 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <Badge className="inline-flex mb-6 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold px-3 py-1.5">
            Rotterdam&apos;s Premier Creative Hub — Open 24/7
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
            Create without{' '}
            <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
              limits
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            INFNTY Studio is your 24/7 home for rehearsal, content production and music creation.
            Three pillars. One hub. Infinite possibilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" asChild>
              <Link href="/signup">
                Start for free <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <a href="#pricing">View pricing</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto">
            {[
              { label: 'Open', value: '24/7' },
              { label: 'Pillars', value: '3' },
              { label: 'Buffer', value: '0' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-sm text-zinc-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section id="pillars" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Three Pillars</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Everything you need to create, perform and grow under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map(pillar => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.id}
                  className={`relative rounded-3xl border ${pillar.border} ${pillar.bg} p-8 overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
                >
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${pillar.gradient} opacity-5 rounded-full -translate-y-12 translate-x-12 group-hover:opacity-10 transition-opacity`} />
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${pillar.accent}`}>{pillar.label}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{pillar.description}</p>
                  <a href="#pricing" className={`inline-flex items-center gap-1 text-sm font-medium mt-6 ${pillar.accent} hover:opacity-80 transition-opacity`}>
                    View plans <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why INFNTY */}
      <section className="py-20 px-4 sm:px-6 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Book 24/7',
                description: 'Our studios are always open. Book any time, any day, using our real-time booking system.',
              },
              {
                icon: Zap,
                title: 'Hour Rollover',
                description: 'Unused hours roll over to next month (up to 25%). Your time, your schedule.',
              },
              {
                icon: Shield,
                title: 'Flexible Plans',
                description: 'Start free. Upgrade anytime. Pay only for what you use with loose-hour bookings at €35/hr.',
              },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Pricing</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Choose a pillar and a plan that fits your creative ambitions.
            </p>
          </div>

          {/* Rehearsal */}
          <PricingSection
            pillar="rehearsal"
            label="Rehearsal"
            icon={Mic2}
            accent="rose"
            plans={pillarPlans.rehearsal}
          />

          {/* Content Engine */}
          <ContentEnginePricing />

          {/* Sound Lab */}
          <PricingSection
            pillar="soundlab"
            label="Sound Lab"
            icon={Music2}
            accent="purple"
            plans={pillarPlans.soundlab}
          />

          {/* Loose hours */}
          <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Just need a few hours?</h3>
            <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
              Book rehearsal time without a subscription. Loose hours are charged at <strong className="text-white">€35/hour</strong> and must be paid at booking.
            </p>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl bg-gradient-to-br from-rose-950/60 to-zinc-950 border border-rose-900/30 p-12">
            <h2 className="text-4xl font-black mb-4">Ready to create?</h2>
            <p className="text-zinc-400 text-lg mb-8">
              Join INFNTY Studio today. Free account, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" asChild>
                <Link href="/signup">Sign Up Free</Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">∞</span>
            </div>
            <span className="font-bold text-white">INFNTY Studio</span>
          </div>
          <p className="text-sm text-zinc-600">© {new Date().getFullYear()} INFNTY Studio. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const CONTENT_PLANS = {
  oneTime: [
    {
      id: 'content-day-lite',
      name: 'Content Day Lite',
      price: 350,
      billing: 'one-time',
      cta: 'Book Content Day',
      features: [
        '1 hour studio video recording',
        '5 short-form clips',
        'Content selection',
        'Export delivery',
      ],
    },
    {
      id: 'content-day-pro',
      name: 'Content Day Pro',
      price: 750,
      billing: 'one-time',
      cta: 'Book Pro Day',
      features: [
        '2 hours studio video recording',
        '10 short-form clips',
        'Content selection',
        'Export delivery',
      ],
    },
  ],
  monthly: [
    {
      id: 'content-engine-growth',
      name: 'Content Engine Growth',
      price: 1500,
      billing: 'month',
      popular: false,
      cta: 'Scale My Content',
      features: [
        'Monthly production day',
        '20–30 Shorts/Reels',
        'Photos',
        'Behind-the-scenes content',
        'Content planning',
        'Content distribution guidance',
      ],
    },
    {
      id: 'authority-engine',
      name: 'Authority Engine',
      price: 2700,
      billing: 'month',
      popular: true,
      cta: 'Build Authority',
      features: [
        'Podcast recording',
        '4 video recording sessions per month',
        '40 Shorts/Reels',
        'Content calendar',
        'Content distribution guidance',
        'Authority-building content strategy',
      ],
    },
  ],
}

function ContentEnginePricing() {
  return (
    <div className="mb-20">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
          <Video className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-amber-400">Content Creation Services</h3>
      </div>
      <p className="text-zinc-400 mb-10 ml-[52px]">Turn one recording session into weeks of content.</p>

      {/* Row 1 — One-time packages */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Single Sessions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CONTENT_PLANS.oneTime.map((plan) => (
            <div
              key={plan.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 flex flex-col"
            >
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-wider mb-1 text-amber-400">Content Engine</p>
                <h4 className="text-xl font-bold text-white">{plan.name}</h4>
              </div>
              <div className="mb-7">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">€{plan.price.toLocaleString()}</span>
                  <span className="text-zinc-500 text-sm">one-time</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-zinc-300">
                    <Check className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="w-full" variant="outline" asChild>
                <Link href={`/signup?plan=${plan.id}&pillar=content`}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Monthly Retainers</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Row 2 — Monthly retainers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {CONTENT_PLANS.monthly.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl border p-8 flex flex-col ${
              plan.popular
                ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/40 to-zinc-900/60'
                : 'border-zinc-800 bg-zinc-900/40'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-black flex items-center gap-1 whitespace-nowrap">
                <Star className="h-3 w-3" /> Most Popular
              </div>
            )}
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-wider mb-1 text-amber-400">Content Engine</p>
              <h4 className="text-xl font-bold text-white">{plan.name}</h4>
            </div>
            <div className="mb-7">
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-black ${plan.popular ? 'text-amber-300' : 'text-white'}`}>
                  €{plan.price.toLocaleString()}
                </span>
                <span className="text-zinc-500 text-sm">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-zinc-300">
                  <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.popular ? 'text-amber-400' : 'text-amber-400'}`} />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className={`w-full ${plan.popular ? 'bg-amber-500 hover:bg-amber-400 text-black font-bold' : ''}`}
              variant={plan.popular ? 'default' : 'outline'}
              asChild
            >
              <Link href={`/signup?plan=${plan.id}&pillar=content`}>{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

type AccentColor = 'rose' | 'amber' | 'purple'

function PricingSection({
  label,
  icon: Icon,
  accent,
  plans,
}: {
  pillar: string
  label: string
  icon: React.ElementType
  accent: AccentColor
  plans: Plan[]
}) {
  const accentClasses: Record<AccentColor, { text: string; border: string; bg: string; badge: string; popular: string; gradient: string }> = {
    rose: {
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/5',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      popular: 'bg-rose-600 text-white',
      gradient: 'from-rose-600 to-rose-800',
    },
    amber: {
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      popular: 'bg-amber-500 text-black',
      gradient: 'from-amber-600 to-amber-800',
    },
    purple: {
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/5',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      popular: 'bg-purple-600 text-white',
      gradient: 'from-purple-600 to-purple-800',
    },
  }
  const c = accentClasses[accent]

  return (
    <div className="mb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className={`text-2xl font-bold ${c.text}`}>{label}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.tier}
            className={`relative rounded-3xl border ${plan.popular ? c.border : 'border-zinc-800'} ${plan.popular ? c.bg : 'bg-zinc-900/40'} p-8 flex flex-col`}
          >
            {plan.popular && (
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${c.popular} flex items-center gap-1`}>
                <Star className="h-3 w-3" /> Most Popular
              </div>
            )}
            <div className="mb-6">
              <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${c.text}`}>{label}</p>
              <h4 className="text-xl font-bold text-white">{plan.name}</h4>
              {plan.hours !== undefined && plan.hours !== null && (
                <p className="text-xs text-zinc-500 mt-1">{plan.hours}h/month included</p>
              )}
              {plan.hours === null && (
                <p className="text-xs text-zinc-500 mt-1">Unlimited hours</p>
              )}
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">€{plan.price}</span>
                <span className="text-zinc-500">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-zinc-300">
                  <Check className={`h-4 w-4 shrink-0 mt-0.5 ${c.text}`} />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              className="w-full"
              variant={plan.popular ? 'default' : 'outline'}
              asChild
            >
              <Link href={`/signup?plan=${plan.tier}&pillar=${label.toLowerCase().replace(' ', '_')}`}>
                Get Started
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
