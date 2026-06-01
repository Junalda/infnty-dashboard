import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

export const metadata = { title: 'Revenue — Admin — INFNTY Studio' }

export default async function AdminRevenuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, admin_role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')
  if (profile?.admin_role && profile.admin_role !== 'super_admin') redirect('/admin/no-access')

  const { data: payments } = await supabase
    .from('payments')
    .select('*, user:profiles!payments_user_id_fkey(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(100)

  const totalPaid = payments?.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const totalPending = payments?.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const totalFailed = payments?.filter(p => p.status === 'failed').length ?? 0

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Revenue</h1>
        <p className="text-zinc-400 mt-1">Payment overview and financial reporting</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Total Collected</p>
            <p className="text-3xl font-black text-emerald-400">{formatCurrency(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Pending</p>
            <p className="text-3xl font-black text-amber-400">{formatCurrency(totalPending)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Failed Payments</p>
            <p className="text-3xl font-black text-red-400">{totalFailed}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Log</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Client</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Description</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Amount</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Method</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Date</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map(p => (
                <tr key={p.id} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-2">
                    <p className="text-white font-medium">{p.user?.full_name ?? '—'}</p>
                    <p className="text-xs text-zinc-500">{p.user?.email}</p>
                  </td>
                  <td className="py-3 px-2 text-zinc-400 max-w-[200px] truncate">{p.description ?? '—'}</td>
                  <td className="py-3 px-2 text-white font-bold">{formatCurrency(p.amount)}</td>
                  <td className="py-3 px-2 text-zinc-400 uppercase text-xs">{p.payment_method ?? '—'}</td>
                  <td className="py-3 px-2 text-zinc-500">{formatDate(p.created_at)}</td>
                  <td className="py-3 px-2">
                    <Badge className={getStatusColor(p.status)}>{p.status}</Badge>
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
