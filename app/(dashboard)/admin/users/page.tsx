import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Users — Admin — INFNTY Studio' }

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: users } = await supabase
    .from('profiles')
    .select('*, subscriptions(status, plan:subscription_plans(name, pillar))')
    .order('created_at', { ascending: false })

  const roleColors: Record<string, string> = {
    admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    partner: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    customer: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-zinc-400 mt-1">{users?.length ?? 0} registered members</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Users</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Name</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Email</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Role</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Subscription</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map(u => {
                const activeSub = u.subscriptions?.find((s: { status: string }) => s.status === 'active')
                return (
                  <tr key={u.id} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-2 text-white font-medium">{u.full_name ?? '—'}</td>
                    <td className="py-3 px-2 text-zinc-400">{u.email}</td>
                    <td className="py-3 px-2">
                      <Badge className={roleColors[u.role]}>{u.role}</Badge>
                    </td>
                    <td className="py-3 px-2">
                      {activeSub ? (
                        <span className="text-emerald-400 text-xs">{activeSub.plan?.name} ({activeSub.plan?.pillar})</span>
                      ) : (
                        <span className="text-zinc-600 text-xs">Free</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-zinc-500">{formatDate(u.created_at)}</td>
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
