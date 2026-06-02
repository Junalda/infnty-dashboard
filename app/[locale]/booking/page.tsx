import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LOCALES, t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/i18n/translations'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
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
    title: locale === 'nl' ? 'Boeken — Oefenruimte Rotterdam' : 'Booking — Rehearsal Studio Rotterdam',
    description: locale === 'nl'
      ? 'Boek je repetitiesessie bij INFNTY Studio Rotterdam. Ledenboekingen via het portaal, losse boekingen mogelijk.'
      : 'Book your rehearsal session at INFNTY Studio Rotterdam. Member bookings via the portal, casual bookings available.',
  }
}

const accentMap: Record<string, string> = {
  rose: 'bg-rose-500/10 border-rose-500/20',
  amber: 'bg-amber-500/10 border-amber-500/20',
  zinc: 'bg-zinc-900 border-zinc-700',
}
const accentBtnMap: Record<string, string> = {
  rose: 'bg-rose-600 hover:bg-rose-500 text-white',
  amber: 'bg-amber-500 hover:bg-amber-400 text-black',
  zinc: 'border-zinc-700 text-zinc-300 hover:bg-zinc-800',
}

export default async function BookingPage({ params }: Props) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  const tr = t[locale as Locale]
  const b = tr.booking

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'INFNTY Studio', href: `/${locale}` },
        { name: b.hero.badge, href: `/${locale}/booking` },
      ]} />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/15 to-black" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{b.hero.badge}</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mt-4 mb-6 leading-[0.95]">
            {b.hero.title.split('\n').map((line: string, i: number) => (
              <span key={i} className={i === 1 ? 'block text-rose-400' : 'block'}>{line}</span>
            ))}
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl">{b.hero.subtitle}</p>
        </div>
      </section>

      {/* Booking types */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {b.types.map((type) => (
              <div key={type.title} className={`p-8 rounded-2xl border ${accentMap[type.accent] ?? 'bg-zinc-900 border-zinc-800'} flex flex-col`}>
                <h2 className="text-xl font-bold text-white mb-3">{type.title}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-6">{type.desc}</p>
                <Button asChild className={accentBtnMap[type.accent]} variant={type.accent === 'zinc' ? 'outline' : 'default'}>
                  <Link href={type.href}>{type.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing table */}
      <section className="py-16 bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-white text-center mb-8">{b.pricing.title}</h2>
          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            {b.pricing.rows.map((row, i) => (
              <div key={row.label} className={`flex items-center justify-between px-6 py-4 ${i % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-900/60'} ${i < b.pricing.rows.length - 1 ? 'border-b border-zinc-800' : ''}`}>
                <div>
                  <p className="text-sm font-medium text-white">{row.label}</p>
                  <p className="text-xs text-zinc-500">{row.note}</p>
                </div>
                <span className="text-rose-400 font-bold text-sm">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-4">{b.cta.title}</h2>
          <p className="text-zinc-400 mb-8">{b.cta.subtitle}</p>
          <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-500 text-white h-14 px-10">
            <Link href={`/${locale}/memberships`}>{b.cta.button} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
