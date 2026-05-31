import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, CalendarDays, DollarSign, AlertCircle, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils'

export const metadata = { title: 'Admin Overview — INFNTY Studio' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const [
    { count: totalUsers },
    { count: totalBookings },
    { data: recentBookings },
    { data: payments },
    { data: upcomingBookings },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase
      .from('bookings')
      .select('*, room:rooms(name), user:profiles!bookings_user_id_fkey(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('payments').select('amount, status'),
    supabase
      .from('bookings')
      .select('*, room:rooms(name), user:profiles!bookings_user_id_fkey(full_name)')
      .eq('status', 'confirmed')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(5),
  ])

  const totalRevenue = payments?.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const pendingCount = payments?.filter(p => p.status === 'pending').length ?? 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
          <p className="text-zinc-400 mt-1">Manage all INFNTY Studio operations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/users">Users</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/bookings">All Bookings</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Users', value: totalUsers ?? 0, icon: Users, accent: 'text-rose-400', bg: 'bg-rose-500/10' },
          { title: 'Total Bookings', value: totalBookings ?? 0, icon: CalendarDays, accent: 'text-blue-400', bg: 'bg-blue-500/10' },
          { title: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { title: 'Pending Payments', value: pendingCount, icon: AlertCircle, accent: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map(s => {
          const Icon = s.icon
          return (
            <Card key={s.title}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{s.title}</p>
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${s.accent}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Sessions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/bookings" className="text-zinc-400 text-xs">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {upcomingBookings?.length === 0 ? (
              <p className="text-zinc-500 text-sm py-4 text-center">No upcoming sessions</p>
            ) : upcomingBookings?.map(b => (
              <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-zinc-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{b.user?.full_name ?? 'Unknown'}</p>
                  <p className="text-xs text-zinc-500">{b.room?.name} · {formatDateTime(b.start_time)}</p>
                </div>
                <Badge className={getStatusColor(b.status)}>{b.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {recentBookings?.map(b => (
              <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-zinc-800 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{b.user?.full_name ?? b.user?.email ?? 'Unknown'}</p>
                  <p className="text-xs text-zinc-500">{b.room?.name} · {b.hours_used}h · {formatCurrency(b.total_price)}</p>
                </div>
                <Badge className={`ml-2 shrink-0 ${getStatusColor(b.status)}`}>{b.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Manage Users', href: '/admin/users', icon: Users },
              { label: 'All Bookings', href: '/admin/bookings', icon: CalendarDays },
              { label: 'Revenue Report', href: '/admin/revenue', icon: TrendingUp },
              { label: 'Manage Rooms', href: '/admin/rooms', icon: Clock },
            ].map(action => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                    <Icon className="h-5 w-5 text-rose-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-300 text-center">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
