import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LOCALES, t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/i18n/translations'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, MapPin } from 'lucide-react'
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
    title: locale === 'nl' ? 'Studio — Oefenruimte Rotterdam 24/7' : 'Studio — Rehearsal Room Rotterdam 24/7',
    description: locale === 'nl'
      ? 'Volledig uitgeruste repetitieruimte in Rotterdam met 24/7 toegang via smart lock. Professioneel drumstel, PA-systeem, gitaar- en basversterkers.'
      : 'Fully equipped rehearsal room in Rotterdam with 24/7 smart lock access. Professional drum kit, PA system, guitar and bass amplifiers.',
    keywords: locale === 'nl'
      ? 'oefenruimte Rotterdam, repetitieruimte Rotterdam uitgerust, muziekstudio Rotterdam 24/7'
      : 'rehearsal room Rotterdam, rehearsal studio Rotterdam equipment, music studio Rotterdam 24/7',
  }
}

export default async function StudioPage({ params }: Props) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  const tr = t[locale as Locale]
  const s = tr.studio

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'INFNTY Studio', href: `/${locale}` },
        { name: s.hero.badge, href: `/${locale}/studio` },
      ]} />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-black" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{s.hero.badge}</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mt-4 mb-6 leading-[0.95]">
            {s.hero.title.split('\n').map((line: string, i: number) => (
              <span key={i} className={i === 1 ? 'block text-rose-400' : 'block'}>{line}</span>
            ))}
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl">{s.hero.subtitle}</p>
        </div>
      </section>

      {/* Room hero visual */}
      <section className="py-4 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="aspect-[16/7] rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-zinc-800 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-950/20 to-transparent" />
            <div className="text-center relative">
              <span className="text-7xl font-black text-white/10">∞</span>
              <p className="text-zinc-600 text-sm mt-2">{locale === 'nl' ? 'Repetitieruimte Rotterdam' : 'Rehearsal Room Rotterdam'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{s.room.badge}</span>
            <h2 className="text-4xl font-black text-white mt-3 mb-4">{s.room.title}</h2>
            <p className="text-zinc-400 text-lg max-w-2xl">{s.room.body}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {s.room.equipment.map((cat) => (
              <div key={cat.category} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h3 className="font-bold text-white text-lg mb-4 pb-3 border-b border-zinc-800">{cat.category}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-400">
                      <Check className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 24/7 Access */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{s.access.badge}</span>
              <h2 className="text-4xl font-black text-white mt-3 mb-6">{s.access.title}</h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">{s.access.body}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {s.access.features.map((f) => (
                  <div key={f.title} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <h4 className="font-semibold text-white text-sm mb-1">{f.title}</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-rose-950/30 to-zinc-900 border border-zinc-800 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-black text-white">24/7</p>
                <p className="text-rose-400 text-sm font-semibold mt-2">{locale === 'nl' ? 'Altijd toegang' : 'Always access'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{s.location.badge}</span>
            <h2 className="text-4xl font-black text-white mt-3 mb-2">{s.location.title}</h2>
          </div>
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-rose-400" />
              </div>
              <div>
                <p className="font-bold text-white">{s.location.address}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {s.location.details.map((d) => (
                <div key={d} className="flex items-center gap-2.5 text-sm text-zinc-400">
                  <Check className="h-4 w-4 text-rose-400 shrink-0" />
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">{s.cta.title}</h2>
          <p className="text-zinc-400 mb-8">{s.cta.subtitle}</p>
          <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-500 text-white h-14 px-10">
            <Link href={`/${locale}/contact`}>{s.cta.button} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
