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
    title: locale === 'nl' ? 'Over ons — INFNTY Studio Rotterdam' : 'About — INFNTY Studio Rotterdam',
    description: locale === 'nl'
      ? 'Ontdek het verhaal achter INFNTY Studio. Gebouwd door muzikanten voor muzikanten in Rotterdam.'
      : 'Discover the story behind INFNTY Studio. Built by musicians for musicians in Rotterdam.',
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  const tr = t[locale as Locale]
  const a = tr.about

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'INFNTY Studio', href: `/${locale}` },
        { name: a.hero.badge, href: `/${locale}/about` },
      ]} />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/15 to-black" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{a.hero.badge}</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mt-4 mb-6 leading-[0.95]">
            {a.hero.title.split('\n').map((line: string, i: number) => (
              <span key={i} className={i === 1 ? 'block text-rose-400' : 'block'}>
                {line}
              </span>
            ))}
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed">{a.hero.subtitle}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-white mb-8">{a.story.title}</h2>
          {a.story.body.split('\n\n').map((para: string, i: number) => (
            <p key={i} className="text-zinc-400 text-lg leading-relaxed mb-6">{para}</p>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{a.mission.badge}</span>
            <h2 className="text-4xl font-black text-white mt-3 mb-4">{a.mission.title}</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">{a.mission.body}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(a.mission.values as Array<{ title: string; desc: string }>).map((v) => (
              <div key={v.title} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h3 className="font-bold text-white text-lg mb-2">{v.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{a.community.badge}</span>
          <h2 className="text-4xl font-black text-white mt-3 mb-6">{a.community.title}</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">{a.community.body}</p>
        </div>
      </section>

      {/* Visual placeholder */}
      <section className="py-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              'from-rose-900/40 to-zinc-900',
              'from-amber-900/30 to-zinc-900',
              'from-rose-900/20 to-zinc-950',
            ].map((grad, i) => (
              <div key={i} className={`aspect-video rounded-2xl bg-gradient-to-br ${grad} border border-zinc-800 flex items-center justify-center`}>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-white/30 text-xl">∞</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">{a.cta.title}</h2>
          <p className="text-zinc-400 mb-8">{a.cta.subtitle}</p>
          <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-500 text-white h-14 px-10">
            <Link href={`/${locale}/contact`}>{a.cta.button} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
