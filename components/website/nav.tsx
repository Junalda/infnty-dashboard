'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Menu, X, Globe } from 'lucide-react'
import type { Locale } from '@/lib/i18n/translations'
import { t } from '@/lib/i18n/translations'

interface NavProps {
  locale: Locale
}

export function WebNav({ locale }: NavProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const tr = t[locale].nav

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { label: tr.about, href: `/${locale}/about` },
    { label: tr.studio, href: `/${locale}/studio` },
    { label: tr.memberships, href: `/${locale}/memberships` },
    { label: tr.booking, href: `/${locale}/booking` },
    { label: tr.community, href: `/${locale}/community` },
    { label: tr.faq, href: `/${locale}/faq` },
    { label: tr.contact, href: `/${locale}/contact` },
  ]

  const otherLocale: Locale = locale === 'en' ? 'nl' : 'en'
  const otherLocaleHref = pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-zinc-800/80' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <span className="text-white font-black text-base leading-none">∞</span>
            </div>
            <span className="font-bold text-white text-sm tracking-tight">INFNTY Studio</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-white bg-zinc-800'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language switcher */}
            <Link
              href={otherLocaleHref}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              {otherLocale.toUpperCase()}
            </Link>
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-2">
              {tr.signIn}
            </Link>
            <Button asChild size="sm" className="bg-rose-600 hover:bg-rose-500 text-white">
              <Link href={`/${locale}/memberships`}>{tr.getStarted}</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href={otherLocaleHref}
              className="p-2 rounded-lg text-zinc-500 hover:text-white transition-colors"
            >
              <Globe className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label={tr.menu}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-white bg-zinc-800'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900">
                {tr.signIn}
              </Link>
              <Button asChild className="bg-rose-600 hover:bg-rose-500 text-white w-full">
                <Link href={`/${locale}/memberships`} onClick={() => setOpen(false)}>{tr.getStarted}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
