import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/dashboard/stats-card'
import {
  Clock, CalendarDays, CheckCircle, Plus, ArrowRight, Mic, Music2
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatTime, getMonthYear } from '@/lib/utils'
import type { Booking, HourBalance } from '@/types'

export const metadata = { title: 'Rehearsal — INFNTY Studio' }

export default async function RehearsalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: profile },
    { data: allBookings },
    { data: hourBalance },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase
      .from('bookings')
      .select('*, room:rooms(*)')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })
      .limit(20),
    supabase
      .from('hour_balances')
      .select('*')
      .eq('user_id', user.id)
      .eq('month_year', getMonthYear())
      .single(),
  ])

  const bookings = (allBookings ?? []) as Booking[]
  const balance = hourBalance as HourBalance | null

  const upcomingBookings = bookings.filter(
    b => new Date(b.start_time) > new Date() && b.status !== 'cancelled'
  ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  const pastBookings = bookings
    .filter(b => b.status === 'completed')
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())

  const hoursUsed = balance?.used_hours ?? 0
  const hoursIncluded = balance?.included_hours ?? 0
  const hoursRollover = balance?.rollover_hours ?? 0
  const hoursTotal = hoursIncluded + hoursRollover
  const hoursRemaining = Math.max(0, hoursTotal - hoursUsed)
  const progressPct = hoursTotal > 0 ? Math.min(100, (hoursUsed / hoursTotal) * 100) : 0

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{firstName}&apos;s Rehearsal Hub</h1>
            <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20">Rehearsal Member</Badge>
          </div>
          <p className="text-zinc-400">Manage your rehearsal sessions and hour balance</p>
        </div>
        <Button asChild className="bg-rose-500 hover:bg-rose-400 text-white">
          <Link href="/bookings/new">
            <Plus className="h-4 w-4" />
            Book Session
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Hours Used"
          value={`${hoursUsed}h`}
          subtitle="this month"
          icon={Clock}
          accent="rose"
        />
        <StatsCard
          title="Hours Remaining"
          value={`${hoursRemaining}h`}
          subtitle={`of ${hoursTotal}h included`}
          icon={Music2}
          accent="emerald"
        />
        <StatsCard
          title="Upcoming Sessions"
          value={upcomingBookings.length}
          subtitle="booked"
          icon={CalendarDays}
          accent="blue"
        />
        <StatsCard
          title="Completed"
          value={pastBookings.length}
          subtitle="sessions total"
          icon={CheckCircle}
          accent="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — bookings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Upcoming Sessions</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/bookings" className="text-zinc-400 hover:text-white text-sm">
                  View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CalendarDays className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-400 mb-4">No upcoming sessions booked</p>
                  <Button asChild className="bg-rose-500 hover:bg-rose-400">
                    <Link href="/bookings/new"><Plus className="h-4 w-4" /> Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map(booking => (
                  <BookingItem key={booking.id} booking={booking} upcoming />
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="font-semibold text-white mb-4">Recent Sessions</h2>
              <div className="space-y-3">
                {pastBookings.slice(0, 5).map(booking => (
                  <BookingItem key={booking.id} booking={booking} upcoming={false} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — hours meter + quick actions */}
        <div className="space-y-6">
          {/* Hours meter */}
          <Card className="border-rose-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
                <Clock className="h-4 w-4 text-rose-400" />
                Hour Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Circular progress */}
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      strokeWidth="10"
                      className="stroke-zinc-800"
                    />
                    <circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      strokeWidth="10"
                      strokeLinecap="round"
                      stroke="#f43f5e"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - progressPct / 100)}`}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{hoursUsed}h</span>
                    <span className="text-xs text-zinc-500">used</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Included</span>
                  <span className="text-white">{hoursIncluded}h</span>
                </div>
                {hoursRollover > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Rollover</span>
                    <span className="text-amber-400">+{hoursRollover}h</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-zinc-800 pt-1.5">
                  <span className="text-zinc-400">Remaining</span>
                  <span className="text-rose-400 font-semibold">{hoursRemaining}h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {[
                { label: 'Book New Session', href: '/bookings/new', color: 'text-rose-400' },
                { label: 'View All Bookings', href: '/bookings', color: 'text-zinc-300' },
                { label: 'Buy Extra Hours', href: '/settings/billing', color: 'text-amber-400' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-zinc-800 transition-colors group"
                >
                  <span className={`text-sm font-medium ${item.color}`}>{item.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function BookingItem({ booking, upcoming }: { booking: Booking; upcoming: boolean }) {
  const start = new Date(booking.start_time)
  const end = new Date(booking.end_time)
  const durationH = ((end.getTime() - start.getTime()) / 3600000).toFixed(1)

  return (
    <Card className={upcoming ? 'border-rose-500/20' : 'border-zinc-800'}>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${upcoming ? 'bg-rose-500/10' : 'bg-zinc-800'}`}>
            <Mic className={`h-5 w-5 ${upcoming ? 'text-rose-400' : 'text-zinc-500'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{(booking.room as any)?.name ?? 'Rehearsal Room'}</p>
            <p className="text-xs text-zinc-500">
              {formatDate(booking.start_time)} · {formatTime(booking.start_time)}–{formatTime(booking.end_time)} · {durationH}h
            </p>
            {booking.notes && (
              <p className="text-xs text-zinc-600 mt-0.5 truncate max-w-xs">{booking.notes}</p>
            )}
          </div>
        </div>
        <Badge className={upcoming
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shrink-0'
          : 'bg-blue-500/10 text-blue-400 border-blue-500/20 shrink-0'
        }>
          {upcoming ? 'Confirmed' : 'Completed'}
        </Badge>
      </CardContent>
    </Card>
  )
}
