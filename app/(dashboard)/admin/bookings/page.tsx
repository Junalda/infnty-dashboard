import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateTime, formatCurrency, getStatusColor, getPillarColor } from '@/lib/utils'

export const metadata = { title: 'Bookings — Admin — INFNTY Studio' }

export default async function AdminBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, room:rooms(name, pillar), user:profiles!bookings_user_id_fkey(full_name, email)')
    .order('start_time', { ascending: false })
    .limit(100)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All Bookings</h1>
        <p className="text-zinc-400 mt-1">{bookings?.length ?? 0} bookings total</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking Log</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Client</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Room</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Start</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Hours</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Type</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Price</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map(b => (
                <tr key={b.id} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-2">
                    <p className="text-white font-medium">{b.user?.full_name ?? '—'}</p>
                    <p className="text-xs text-zinc-500">{b.user?.email}</p>
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-zinc-300">{b.room?.name ?? '—'}</p>
                    <p className={`text-xs capitalize ${getPillarColor(b.room?.pillar ?? '')}`}>{b.room?.pillar}</p>
                  </td>
                  <td className="py-3 px-2 text-zinc-400">{formatDateTime(b.start_time)}</td>
                  <td className="py-3 px-2 text-zinc-300">{b.hours_used}h</td>
                  <td className="py-3 px-2">
                    <Badge className={b.booking_type === 'subscription' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}>
                      {b.booking_type}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-white font-medium">{formatCurrency(b.total_price)}</td>
                  <td className="py-3 px-2">
                    <Badge className={getStatusColor(b.status)}>{b.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
