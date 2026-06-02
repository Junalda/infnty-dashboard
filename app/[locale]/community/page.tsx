import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LOCALES, t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/i18n/translations'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/website/schema'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) return {}
  return {
    title: locale === 'nl' ? 'Community — INFNTY Studio Rotterdam' : 'Community — INFNTY Studio Rotterdam',
    description: locale === 'nl'
      ? 'Maak deel uit van Rotterdams muziekcommunity. Jamsessies, workshops, samenwerkingen en meer bij INFNTY Studio.'
      : "Join Rotterdam's music community. Jam sessions, workshops, collaborations and more at INFNTY Studio.",
  }
}

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  const tr = t[locale as Locale]
  const c = tr.community

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'INFNTY Studio', href: `/${locale}` },
        { name: c.hero.badge, href: `/${locale}/community` },
      ]} />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/15 to-black" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">{c.hero.badge}</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mt-4 mb-6 leading-[0.95]">
            {c.hero.title.split('\n').map((line: string, i: number) => (
              <span key={i} className={i === 1 ? 'block text-amber-400' : 'block'}>{line}</span>
            ))}
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl">{c.hero.subtitle}</p>
        </div>
      </section>

      {/* Events */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">{c.events.badge}</span>
            <h2 className="text-4xl font-black text-white mt-3">{c.events.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {c.events.items.map((event) => (
              <div key={event.title} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <h3 className="font-bold text-white text-xl mb-3">{event.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration */}
      <section className="py-20 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-amber-400" />
          </div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">{c.collab.badge}</span>
          <h2 className="text-4xl font-black text-white mt-3 mb-6">{c.collab.title}</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">{c.collab.body}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">{c.cta.title}</h2>
          <p className="text-zinc-400 mb-8">{c.cta.subtitle}</p>
          <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-500 text-white h-14 px-10">
            <Link href={`/${locale}/memberships`}>{c.cta.button} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
