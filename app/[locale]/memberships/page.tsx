import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LOCALES, t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/i18n/translations'
import { Button } from '@/components/ui/button'
import { Check, X, ArrowRight } from 'lucide-react'
import { FAQSchema, BreadcrumbSchema } from '@/components/website/schema'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) return {}
  return {
    title: locale === 'nl' ? 'Lidmaatschappen — Oefenruimte Rotterdam' : 'Memberships — Rehearsal Studio Rotterdam',
    description: locale === 'nl'
      ? 'Bekijk onze flexibele repetitielidmaatschappen: Starter €200, Pro €300, Unlimited €400. 24/7 toegang, geen lange contracten.'
      : 'View our flexible rehearsal memberships: Starter €200, Pro €300, Unlimited €400. 24/7 access, no long-term contracts.',
    keywords: locale === 'nl'
      ? 'lidmaatschap oefenruimte Rotterdam, repetitieruimte abonnement, oefenruimte huren Rotterdam'
      : 'rehearsal membership Rotterdam, rehearsal room membership, rehearsal studio subscription Rotterdam',
  }
}

export default async function MembershipsPage({ params }: Props) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  const tr = t[locale as Locale]
  const m = tr.memberships

  const allFaqItems = m.faq.items

  return (
    <>
      <FAQSchema items={allFaqItems} />
      <BreadcrumbSchema items={[
        { name: 'INFNTY Studio', href: `/${locale}` },
        { name: m.hero.badge, href: `/${locale}/memberships` },
      ]} />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/20 to-black" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{m.hero.badge}</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mt-4 mb-6 leading-[0.95]">
            {m.hero.title.split('\n').map((line: string, i: number) => (
              <span key={i} className={i === 1 ? 'block bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent' : 'block'}>
                {line}
              </span>
            ))}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">{m.hero.subtitle}</p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {m.plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-10 flex flex-col ${
                  plan.popular
                    ? 'bg-gradient-to-b from-rose-950/50 to-zinc-900 border-2 border-rose-500/40 shadow-2xl shadow-rose-500/10'
                    : 'bg-zinc-900 border border-zinc-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg">
                      {locale === 'nl' ? 'Populairste keuze' : 'Most Popular'}
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
                  <p className="text-zinc-500 text-sm mb-5">{plan.description}</p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-5xl font-black text-white">€{plan.price}</span>
                    <span className="text-zinc-500 text-sm mb-2">/month</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                    <span className="text-rose-400 text-sm font-bold">{plan.hours}h</span>
                    <span className="text-zinc-500 text-xs">{locale === 'nl' ? 'per maand inbegrepen' : 'per month included'}</span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button asChild size="lg" className={`w-full ${plan.popular ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'}`} variant={plan.popular ? 'default' : 'outline'}>
                  <Link href="/signup">
                    {locale === 'nl' ? 'Begin nu' : 'Get Started'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra hours */}
      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{m.extraHours.title}</h3>
            <p className="text-zinc-400 leading-relaxed">{m.extraHours.body}</p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-white text-center mb-12">{m.comparison.title}</h2>
          <div className="overflow-x-auto rounded-2xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th className="text-left py-4 px-5 text-zinc-400 font-semibold w-1/2">{locale === 'nl' ? 'Functie' : 'Feature'}</th>
                  {m.plans.map((p) => (
                    <th key={p.name} className={`text-center py-4 px-5 font-bold ${p.popular ? 'text-rose-400' : 'text-white'}`}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {m.comparison.features.map((row) => (
                  <tr key={row.label} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-4 px-5 text-zinc-300">{row.label}</td>
                    {['starter', 'pro', 'unlimited'].map((key) => {
                      const val = row[key as keyof typeof row]
                      return (
                        <td key={key} className="text-center py-4 px-5">
                          {val === true ? (
                            <Check className="h-4 w-4 text-rose-400 mx-auto" />
                          ) : val === false ? (
                            <X className="h-4 w-4 text-zinc-700 mx-auto" />
                          ) : (
                            <span className="text-zinc-300 text-xs">{val}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Membership FAQ */}
      <section className="py-20 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-white text-center mb-10">{m.faq.title}</h2>
          <div className="space-y-4">
            {m.faq.items.map((item) => (
              <details key={item.q} className="group rounded-2xl bg-zinc-900 border border-zinc-800">
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">{m.cta.title}</h2>
          <p className="text-zinc-400 mb-8">{m.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-500 text-white h-14 px-10">
              <Link href="/signup">{m.cta.button} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 h-14 px-10">
              <Link href={`/${locale}/contact`}>{m.cta.secondary}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
