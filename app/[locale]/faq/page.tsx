import { notFound } from 'next/navigation'
import { LOCALES, t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/i18n/translations'
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
    title: locale === 'nl' ? 'Veelgestelde vragen — INFNTY Studio Rotterdam' : 'FAQ — INFNTY Studio Rotterdam',
    description: locale === 'nl'
      ? 'Antwoorden op al je vragen over lidmaatschappen, boekingen, toegang en betalingen bij INFNTY Studio Rotterdam.'
      : 'Answers to all your questions about memberships, bookings, access, and payments at INFNTY Studio Rotterdam.',
  }
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  const tr = t[locale as Locale]
  const f = tr.faq

  const allItems = f.categories.flatMap((cat) => cat.items)

  return (
    <>
      <FAQSchema items={allItems} />
      <BreadcrumbSchema items={[
        { name: 'INFNTY Studio', href: `/${locale}` },
        { name: f.hero.badge, href: `/${locale}/faq` },
      ]} />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{f.hero.badge}</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mt-4 mb-6 leading-[0.95]">
            {f.hero.title.split('\n').map((line: string, i: number) => (
              <span key={i} className={i === 0 ? 'block' : 'block text-rose-400'}>{line}</span>
            ))}
          </h1>
          <p className="text-zinc-400 text-lg">{f.hero.subtitle}</p>
        </div>
      </section>

      {/* FAQ categories */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-16">
          {f.categories.map((cat) => (
            <div key={cat.title}>
              <h2 className="text-2xl font-black text-white mb-6 pb-4 border-b border-zinc-800">{cat.title}</h2>
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <details key={item.q} className="group rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                      <span className="font-semibold text-white pr-4 text-sm sm:text-base">{item.q}</span>
                      <span className="shrink-0 text-zinc-500 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            {locale === 'nl' ? 'Staat jouw vraag er niet bij?' : "Don't see your question?"}
          </h2>
          <p className="text-zinc-400 mb-8">
            {locale === 'nl'
              ? 'Neem contact met ons op via WhatsApp of e-mail. We reageren snel.'
              : 'Contact us via WhatsApp or email. We respond quickly.'}
          </p>
          <a
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-colors"
          >
            {locale === 'nl' ? 'Contact opnemen' : 'Get in touch'}
          </a>
        </div>
      </section>
    </>
  )
}
