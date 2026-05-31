import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/booking/booking-form'
import { HoursMeter } from '@/components/dashboard/hours-meter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'
import { getMonthYear } from '@/lib/utils'
import type { HourBalance } from '@/types'

export const metadata = { title: 'New Booking — INFNTY Studio' }

export default async function NewBookingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: hourBalance } = await supabase
    .from('hour_balances')
    .select('*')
    .eq('user_id', user.id)
    .eq('month_year', getMonthYear())
    .single()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Booking</h1>
        <p className="text-zinc-400 mt-1">Reserve your studio time · 24/7 availability</p>
      </div>

      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex gap-3 text-sm text-zinc-400">
            <CalendarDays className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-zinc-300 mb-1">Booking Rules</p>
              <ul className="space-y-1 text-xs text-zinc-500">
                <li>• Studio open 24/7 — book any time, any day</li>
                <li>• 15-minute buffer automatically added after each session</li>
                <li>• Subscription hours are used first, then €25/hr for extras</li>
                <li>• Rollover hours are used before monthly included hours</li>
                <li>• Loose bookings must be paid immediately</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Book a Session</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingForm userId={user.id} hourBalance={hourBalance as HourBalance | null} />
            </CardContent>
          </Card>
        </div>
        <div>
          <HoursMeter balance={hourBalance as HourBalance | null} />
        </div>
      </div>
    </div>
  )
}
