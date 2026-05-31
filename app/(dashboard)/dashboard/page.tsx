import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/dashboard/stats-card'
import { HoursMeter } from '@/components/dashboard/hours-meter'
import { BookingCard } from '@/components/dashboard/booking-card'
import { SubscriptionCard } from '@/components/dashboard/subscription-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, Clock, CreditCard, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getMonthYear, formatCurrency } from '@/lib/utils'
import type { Booking, Subscription, HourBalance } from '@/types'

export const metadata = {
  title: 'Dashboard — INFNTY Studio',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [
    { data: profile },
    { data: bookings },
    { data: subscriptions },
    { data: hourBalance },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('bookings')
      .select('*, room:rooms(*)')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })
      .limit(20),
    supabase
      .from('subscriptions')
      .select('*, plan:subscription_plans(*)')
      .eq('user_id', user.id)
      .eq('status', 'active'),
    supabase
      .from('hour_balances')
      .select('*')
      .eq('user_id', user.id)
      .eq('month_year', getMonthYear())
      .single(),
  ])

  const typedBookings = (bookings ?? []) as Booking[]
  const typedSubscriptions = (subscriptions ?? []) as Subscription[]
  const typedBalance = hourBalance as HourBalance | null

  const upcomingBookings = typedBookings.filter(
    b => new Date(b.start_time) > new Date() && b.status !== 'cancelled'
  )
  const completedBookings = typedBookings.filter(b => b.status === 'completed')
  const hoursUsed = typedBalance?.used_hours ?? 0
  const hoursRemaining = typedBalance
    ? typedBalance.included_hours + typedBalance.rollover_hours - typedBalance.used_hours
    : 0

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-zinc-400 mt-1">Here&apos;s what&apos;s happening at your studio</p>
        </div>
        <Button asChild size="lg">
          <Link href="/bookings/new">
            <Plus className="h-4 w-4" />
            New Booking
          </Link>
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Upcoming Bookings"
          value={upcomingBookings.length}
          subtitle="sessions scheduled"
          icon={CalendarDays}
          accent="rose"
        />
        <StatsCard
          title="Hours Used"
          value={`${hoursUsed}h`}
          subtitle="this month"
          icon={Clock}
          accent="gold"
        />
        <StatsCard
          title="Hours Remaining"
          value={hoursRemaining > 0 ? `${hoursRemaining}h` : '—'}
          subtitle={typedBalance?.included_hours ? `of ${typedBalance.included_hours}h included` : 'no active plan'}
          icon={TrendingUp}
          accent="emerald"
        />
        <StatsCard
          title="Active Plans"
          value={typedSubscriptions.length}
          subtitle="subscriptions"
          icon={CreditCard}
          accent="blue"
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming bookings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Upcoming Sessions</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/bookings" className="text-zinc-400 hover:text-white">
                  View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CalendarDays className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-400 mb-4">No upcoming sessions</p>
                  <Button asChild>
                    <Link href="/bookings/new"><Plus className="h-4 w-4" /> Book a Session</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.slice(0, 3).map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>

          {/* Recent activity */}
          {completedBookings.length > 0 && (
            <div>
              <h2 className="font-semibold text-white mb-4">Recent Sessions</h2>
              <div className="space-y-3">
                {completedBookings.slice(0, 3).map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Hour balance */}
          <HoursMeter balance={typedBalance} />

          {/* Active subscriptions */}
          {typedSubscriptions.length > 0 && (
            <div>
              <h2 className="font-semibold text-white mb-4">Your Plans</h2>
              <div className="space-y-4">
                {typedSubscriptions.map(sub => (
                  <SubscriptionCard key={sub.id} subscription={sub} />
                ))}
              </div>
            </div>
          )}

          {typedSubscriptions.length === 0 && (
            <Card className="border-dashed border-zinc-700">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-400 mb-3">No active subscription</p>
                <Button variant="gold" size="sm" asChild>
                  <Link href="/#pricing">View Plans</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {[
                { label: 'Book Rehearsal Room', href: '/bookings/new', color: 'text-rose-400' },
                { label: 'Content Projects', href: '/content', color: 'text-amber-400' },
                { label: 'Sound Lab Projects', href: '/soundlab', color: 'text-purple-400' },
                { label: 'My Files', href: '/files', color: 'text-blue-400' },
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
