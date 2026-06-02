import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LOCALES, t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/i18n/translations'
import { Button } from '@/components/ui/button'
import { Check, Clock, Shield, Zap, Users, Star, ChevronRight, ArrowRight } from 'lucide-react'
import { FAQSchema } from '@/components/website/schema'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) return {}
  const tr = t[locale as Locale]
  return {
    title: tr.meta.defaultTitle,
    description: tr.meta.defaultDescription,
    keywords: locale === 'nl'
      ? 'oefenruimte Rotterdam, repetitieruimte Rotterdam, muziekstudio Rotterdam, oefenruimte huren Rotterdam'
      : 'rehearsal studio Rotterdam, rehearsal room Rotterdam, band rehearsal space Rotterdam, music rehearsal studio Rotterdam',
  }
}

const iconMap: Record<string, React.ElementType> = { clock: Clock, shield: Shield, zap: Zap, users: Users }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  const tr = t[locale as Locale]
  const h = tr.home
  const plans = tr.memberships.plans

  const allFaqItems = h.faq.items

  return (
    <>
      <FAQSchema items={allFaqItems} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/30 via-black to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-rose-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              {h.hero.badge}
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8">
              {h.hero.title.split('\n').map((line: string, i: number) => (
                <span key={i} className={i === 2 ? 'block bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent' : 'block'}>
                  {line}
                </span>
              ))}
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl mb-10">
              {h.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-500 text-white h-14 px-8 text-base font-semibold shadow-xl shadow-rose-500/20">
                <Link href={`/${locale}/memberships`}>
                  {h.hero.cta1}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 h-14 px-8 text-base">
                <Link href={`/${locale}/contact`}>{h.hero.cta2}</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {h.hero.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-zinc-600" />
          <div className="w-1 h-1 rounded-full bg-zinc-600" />
        </div>
      </section>

      {/* ── WHY ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{h.why.badge}</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">{h.why.title}</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">{h.why.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {h.why.items.map((item) => {
              const Icon = iconMap[item.icon] ?? Zap
              return (
                <div key={item.title} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-5 group-hover:bg-rose-500/20 transition-colors">
                    <Icon className="h-5 w-5 text-rose-400" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP OVERVIEW ──────────────────────────────────────────── */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{h.memberships.badge}</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">{h.memberships.title}</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">{h.memberships.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? 'bg-gradient-to-b from-rose-950/60 to-zinc-900 border border-rose-500/30 shadow-xl shadow-rose-500/10'
                    : 'bg-zinc-900 border border-zinc-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      {locale === 'nl' ? 'Populairste keuze' : 'Most Popular'}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-zinc-400 text-sm font-semibold uppercase tracking-widest mb-1">{plan.name}</p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-black text-white">€{plan.price}</span>
                    <span className="text-zinc-500 text-sm mb-1.5">/month</span>
                  </div>
                  <p className="text-rose-400 text-sm font-semibold">{plan.hours}h {locale === 'nl' ? 'per maand inbegrepen' : 'per month included'}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <Check className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild className={plan.popular ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'} variant={plan.popular ? 'default' : 'outline'}>
                  <Link href={`/${locale}/memberships`}>
                    {locale === 'nl' ? 'Meer info' : 'Learn more'}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href={`/${locale}/memberships`} className="text-rose-400 hover:text-rose-300 text-sm font-medium transition-colors inline-flex items-center gap-1">
              {h.memberships.cta} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BENEFITS STRIP ───────────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{h.benefits.badge}</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3">{h.benefits.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {h.benefits.items.map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <Check className="h-4 w-4 text-rose-400 shrink-0" />
                <span className="text-sm text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{h.testimonials.badge}</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3">{h.testimonials.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {h.testimonials.items.map((item) => (
              <div key={item.author} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-zinc-300 text-sm leading-relaxed mb-6">"{item.quote}"</blockquote>
                <div>
                  <p className="text-white font-semibold text-sm">{item.author}</p>
                  <p className="text-zinc-500 text-xs">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-black text-white text-center mb-12">{h.faq.title}</h2>
          <div className="space-y-4">
            {h.faq.items.map((item) => (
              <details key={item.q} className="group rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-white pr-4">{item.q}</span>
                  <span className="shrink-0 text-zinc-500 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href={`/${locale}/faq`} className="text-rose-400 hover:text-rose-300 text-sm font-medium transition-colors inline-flex items-center gap-1">
              {locale === 'nl' ? 'Alle veelgestelde vragen' : 'All FAQs'} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-950/20 to-amber-950/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-rose-600/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            {h.cta.title}
          </h2>
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed">{h.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-500 text-white h-14 px-10 text-base font-semibold shadow-xl shadow-rose-500/20">
              <Link href={`/${locale}/memberships`}>
                {h.cta.button}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 h-14 px-10 text-base">
              <Link href={`/${locale}/contact`}>{h.cta.secondary}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
