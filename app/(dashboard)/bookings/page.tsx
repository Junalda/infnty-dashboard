import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BookingCard } from '@/components/dashboard/booking-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarDays, Plus } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { Booking } from '@/types'

export const metadata = { title: 'Bookings — INFNTY Studio' }

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, room:rooms(*)')
    .eq('user_id', user.id)
    .order('start_time', { ascending: false })

  const typedBookings = (bookings ?? []) as Booking[]
  const now = new Date()

  const upcoming = typedBookings.filter(
    b => new Date(b.start_time) > now && b.status !== 'cancelled'
  )
  const past = typedBookings.filter(
    b => new Date(b.start_time) <= now || b.status === 'completed'
  )
  const cancelled = typedBookings.filter(b => b.status === 'cancelled')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-zinc-400 mt-1">Manage your studio sessions</p>
        </div>
        <Button asChild>
          <Link href="/bookings/new">
            <Plus className="h-4 w-4" /> New Booking
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
            Past ({past.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <CalendarDays className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 mb-4">No upcoming sessions</p>
                <Button asChild>
                  <Link href="/bookings/new"><Plus className="h-4 w-4" /> Book a Session</Link>
                </Button>
              </CardContent>
            </Card>
          ) : upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
        </TabsContent>

        <TabsContent value="past" className="mt-4 space-y-3">
          {past.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">No past sessions</p>
          ) : past.map(b => <BookingCard key={b.id} booking={b} />)}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-4 space-y-3">
          {cancelled.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">No cancelled bookings</p>
          ) : cancelled.map(b => <BookingCard key={b.id} booking={b} />)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
