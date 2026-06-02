import Link from 'next/link'
import { Camera, Play, Music } from 'lucide-react'
import type { Locale } from '@/lib/i18n/translations'
import { t } from '@/lib/i18n/translations'

export function WebFooter({ locale }: { locale: Locale }) {
  const tr = t[locale].footer
  const nav = t[locale].nav

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center">
                <span className="text-white font-black text-base leading-none">∞</span>
              </div>
              <span className="font-bold text-white text-sm tracking-tight">INFNTY Studio</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">{tr.tagline}</p>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Camera, href: '#', label: 'Instagram' },
                { icon: Play, href: '#', label: 'YouTube' },
                { icon: Music, href: '#', label: 'Music' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Studio links */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">{tr.links.studio.title}</p>
            <ul className="space-y-3">
              {tr.links.studio.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Membership links */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">{tr.links.memberships.title}</p>
            <ul className="space-y-3">
              {tr.links.memberships.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">{tr.legal}</p>
          <div className="flex items-center gap-4">
            <Link
              href={locale === 'en' ? '/nl' : '/en'}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {locale === 'en' ? 'Nederlands' : 'English'}
            </Link>
            <span className="text-zinc-800">·</span>
            <Link href={`/${locale}/faq`} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              {nav.faq}
            </Link>
            <span className="text-zinc-800">·</span>
            <Link href={`/${locale}/contact`} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              {nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
