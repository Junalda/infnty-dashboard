import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, CalendarDays, Clock, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDateTime, formatDate, getStatusColor } from '@/lib/utils'
import type { AdminRole } from '@/lib/admin-permissions'

export const metadata = { title: 'Operations — Admin — INFNTY Studio' }

export default async function OperationsAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, admin_role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const adminRole = (profile?.admin_role ?? null) as AdminRole | null
  if (adminRole !== 'operations_admin' && adminRole !== 'super_admin') {
    redirect('/admin/no-access')
  }

  const [
    { count: totalMembers },
    { count: activeSubscriptions },
    { data: recentBookings },
    { data: upcomingBookings },
    { data: hourBalances },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase
      .from('bookings')
      .select('*, room:rooms(name), user:profiles!bookings_user_id_fkey(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('bookings')
      .select('*, room:rooms(name), user:profiles!bookings_user_id_fkey(full_name)')
      .eq('status', 'confirmed')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(8),
    supabase
      .from('hour_balances')
      .select('*, user:profiles!hour_balances_user_id_fkey(full_name, email)')
      .order('used_hours', { ascending: false })
      .limit(10),
    supabase
      .from('profiles')
      .select('*, subscriptions(status, plan:subscription_plans(name, pillar))')
      .eq('role', 'customer')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const totalHoursUsed = (hourBalances ?? []).reduce((s: number, b: any) => s + Number(b.used_hours ?? 0), 0)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Operations</h1>
          <p className="text-zinc-400 mt-1">Bookings, members, and operational oversight</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/users">All Users</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/bookings">All Bookings</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Members', value: totalMembers ?? 0, icon: Users, accent: 'text-rose-400', bg: 'bg-rose-500/10' },
          { title: 'Active Subs', value: activeSubscriptions ?? 0, icon: TrendingUp, accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { title: 'Hours Used (all)', value: `${totalHoursUsed}h`, icon: Clock, accent: 'text-blue-400', bg: 'bg-blue-500/10' },
          { title: 'Upcoming Sessions', value: upcomingBookings?.length ?? 0, icon: CalendarDays, accent: 'text-amber-400', bg: 'bg-amber-500/10' },
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
        {/* Upcoming sessions */}
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
            ) : upcomingBookings?.map((b: any) => (
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

        {/* Hour balances */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hour Balances</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {(hourBalances ?? []).map((b: any) => {
              const remaining = b.included_hours + b.rollover_hours - b.used_hours
              const pct = b.included_hours > 0 ? Math.min(100, (b.used_hours / b.included_hours) * 100) : 0
              return (
                <div key={b.id} className="py-2.5 border-b border-zinc-800 last:border-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-white">{b.user?.full_name ?? '—'}</p>
                    <span className="text-xs text-zinc-500">{b.used_hours}h / {b.included_hours}h</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">{remaining}h remaining · {b.month_year}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Client</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Room</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Date</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Hours</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings?.map((b: any) => (
                <tr key={b.id} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-2">
                    <p className="text-white font-medium">{b.user?.full_name ?? '—'}</p>
                    <p className="text-xs text-zinc-500">{b.user?.email}</p>
                  </td>
                  <td className="py-3 px-2 text-zinc-300">{b.room?.name ?? '—'}</td>
                  <td className="py-3 px-2 text-zinc-400 text-xs">{formatDateTime(b.start_time)}</td>
                  <td className="py-3 px-2 text-zinc-300">{b.hours_used}h</td>
                  <td className="py-3 px-2">
                    <Badge className={getStatusColor(b.status)}>{b.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Recent members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Members</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users" className="text-zinc-400 text-xs">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Name</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Email</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Subscription</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers?.map((u: any) => {
                const activeSub = u.subscriptions?.find((s: any) => s.status === 'active')
                return (
                  <tr key={u.id} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-2 text-white font-medium">{u.full_name ?? '—'}</td>
                    <td className="py-3 px-2 text-zinc-400">{u.email}</td>
                    <td className="py-3 px-2">
                      {activeSub ? (
                        <span className="text-emerald-400 text-xs">{activeSub.plan?.name}</span>
                      ) : (
                        <span className="text-zinc-600 text-xs">Free</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-zinc-500 text-xs">{formatDate(u.created_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
