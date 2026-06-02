import { notFound } from 'next/navigation'
import { LOCALES } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/i18n/translations'
import { WebNav } from '@/components/website/nav'
import { WebFooter } from '@/components/website/footer'
import { LocalBusinessSchema } from '@/components/website/schema'
import type { Metadata } from 'next'
import { t } from '@/lib/i18n/translations'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) return {}
  const tr = t[locale as Locale].meta
  const otherLocale = locale === 'en' ? 'nl' : 'en'

  return {
    metadataBase: new URL('https://infntystudio.com'),
    title: { default: tr.defaultTitle, template: `%s | INFNTY Studio` },
    description: tr.defaultDescription,
    openGraph: {
      siteName: tr.siteName,
      locale: locale === 'nl' ? 'nl_NL' : 'en_GB',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
    alternates: {
      canonical: `https://infntystudio.com/${locale}`,
      languages: {
        'en': 'https://infntystudio.com/en',
        'nl': 'https://infntystudio.com/nl',
        'x-default': 'https://infntystudio.com/en',
      },
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  return (
    <>
      <LocalBusinessSchema locale={locale as Locale} />
      <WebNav locale={locale as Locale} />
      <main>{children}</main>
      <WebFooter locale={locale as Locale} />
    </>
  )
}
