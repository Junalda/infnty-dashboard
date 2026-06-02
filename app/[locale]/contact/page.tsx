import { notFound } from 'next/navigation'
import { LOCALES, t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/i18n/translations'
import { BreadcrumbSchema } from '@/components/website/schema'
import { ContactForm } from '@/components/website/contact-form'
import type { Metadata } from 'next'
import { MessageSquare, Mail, MapPin } from 'lucide-react'

interface Props { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) return {}
  return {
    title: locale === 'nl' ? 'Contact — INFNTY Studio Rotterdam' : 'Contact — INFNTY Studio Rotterdam',
    description: locale === 'nl'
      ? 'Neem contact op met INFNTY Studio Rotterdam. Bel, WhatsApp of stuur een e-mail voor vragen over lidmaatschappen en boekingen.'
      : 'Contact INFNTY Studio Rotterdam. WhatsApp or email us for questions about memberships and bookings.',
  }
}

const methodIcons = { whatsapp: MessageSquare, email: Mail, location: MapPin }

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  const tr = t[locale as Locale]
  const c = tr.contact

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'INFNTY Studio', href: `/${locale}` },
        { name: c.hero.badge, href: `/${locale}/contact` },
      ]} />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">{c.hero.badge}</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mt-4 mb-6">{c.hero.title}</h1>
          <p className="text-zinc-400 text-lg">{c.hero.subtitle}</p>
        </div>
      </section>

      {/* Contact methods */}
      <section className="py-8 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {c.methods.map((method) => {
              const Icon = methodIcons[method.type as keyof typeof methodIcons] ?? Mail
              return (
                <div key={method.type} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-rose-400" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">{method.label}</p>
                  <p className="font-semibold text-white text-sm mb-1">{method.value}</p>
                  <p className="text-zinc-500 text-xs leading-relaxed">{method.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-white mb-8 text-center">{c.form.title}</h2>
          <ContactForm locale={locale as Locale} />
        </div>
      </section>
    </>
  )
}
