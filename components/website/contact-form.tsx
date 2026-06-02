'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle } from 'lucide-react'
import { t } from '@/lib/i18n/translations'
import type { Locale } from '@/lib/i18n/translations'

export function ContactForm({ locale }: { locale: Locale }) {
  const f = t[locale].contact.form
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // Simulate send — integrate with Resend in production
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="p-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
        <CheckCircle className="h-12 w-12 text-rose-400 mx-auto mb-4" />
        <p className="text-white font-semibold text-lg">{f.success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">{f.name}</Label>
          <Input id="name" name="name" required placeholder="Jane Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{f.email}</Label>
          <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">{f.subject}</Label>
        <select
          id="subject"
          name="subject"
          className="w-full h-10 rounded-xl bg-zinc-800 border border-zinc-700 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
        >
          {f.subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{f.message}</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none"
          placeholder={locale === 'nl' ? 'Schrijf hier je bericht...' : 'Write your message here...'}
        />
      </div>
      <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white h-12" disabled={loading}>
        {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />{locale === 'nl' ? 'Bezig...' : 'Sending...'}</> : f.submit}
      </Button>
    </form>
  )
}
