import type { MetadataRoute } from 'next'

const BASE_URL = 'https://infntystudio.com'
const LOCALES = ['en', 'nl']
const PAGES = ['', '/about', '/studio', '/memberships', '/booking', '/community', '/faq', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    for (const page of PAGES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : page === '/memberships' ? 0.9 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}${page}`])
          ),
        },
      })
    }
  }

  return entries
}
