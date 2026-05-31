import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'INFNTY Studio — 24/7 Creator, Music & Content Hub',
  description: 'Rotterdam\'s Premier Creative Hub — Open 24/7. Book rehearsal space, grow your content, and produce your music with INFNTY Studio.',
  openGraph: {
    title: 'INFNTY Studio',
    description: 'Rehearsal · Content Engine · Sound Lab',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-zinc-100 font-sans">{children}</body>
    </html>
  )
}
