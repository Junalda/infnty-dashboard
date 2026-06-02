import type { Locale } from '@/lib/i18n/translations'

export function LocalBusinessSchema({ locale }: { locale: Locale }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'MusicVenue'],
        '@id': 'https://infntystudio.com/#business',
        name: 'INFNTY Studio',
        alternateName: locale === 'nl' ? 'INFNTY Studio — Oefenruimte Rotterdam' : 'INFNTY Studio — Rehearsal Space Rotterdam',
        description: locale === 'nl'
          ? 'Professionele repetitieruimte in Rotterdam met flexibele lidmaatschappen en 24/7 toegang voor bands, muzikanten en zangers.'
          : 'Professional rehearsal studio in Rotterdam with flexible memberships and 24/7 access for bands, musicians, and singers.',
        url: 'https://infntystudio.com',
        telephone: '',
        email: 'info@infntystudio.com',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Rotterdam',
          addressCountry: 'NL',
        },
        geo: {
          '@type': 'GeoCoordinates',
          addressCountry: 'NL',
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
        priceRange: '€€',
        currenciesAccepted: 'EUR',
        paymentAccepted: 'Cash, Credit Card, iDEAL',
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: '24/7 Access', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Smart Lock System', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Professional Drum Kit', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'PA System', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Guitar Amplifiers', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Bass Amplifier', value: true },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: locale === 'nl' ? 'Lidmaatschappen' : 'Memberships',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Starter Membership',
              price: '200',
              priceCurrency: 'EUR',
              priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1M' },
              description: locale === 'nl' ? '8 uur per maand, 24/7 toegang' : '8 hours per month, 24/7 access',
            },
            {
              '@type': 'Offer',
              name: 'Pro Membership',
              price: '300',
              priceCurrency: 'EUR',
              priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1M' },
              description: locale === 'nl' ? '12 uur per maand, 24/7 toegang' : '12 hours per month, 24/7 access',
            },
            {
              '@type': 'Offer',
              name: 'Unlimited Membership',
              price: '400',
              priceCurrency: 'EUR',
              priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1M' },
              description: locale === 'nl' ? '16 uur per maand, 24/7 toegang' : '16 hours per month, 24/7 access',
            },
          ],
        },
        sameAs: ['https://www.instagram.com/infntystudio'],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema({ items }: { items: Array<{ q: string; a: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; href: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://infntystudio.com${item.href}`,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
