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
  title: 'INFNTY Studio — 24/7 Rehearsal Studio Rotterdam',
  description: 'Rotterdam\'s premier rehearsal studio. Open 24/7. Membership-based access with professional acoustics, backline, and a music community.',
  openGraph: {
    title: 'INFNTY Studio Rotterdam',
    description: '24/7 Rehearsal Memberships · Professional Studio · Rotterdam',
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
