import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, UserPlus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { AdminRole } from '@/lib/admin-permissions'

export const metadata = { title: 'Users — Admin — INFNTY Studio' }

const ROLE_COLORS: Record<string, string> = {
  admin:    'bg-rose-500/10 text-rose-400 border-rose-500/20',
  partner:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  customer: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

const ADMIN_ROLE_COLORS: Record<string, string> = {
  super_admin:      'bg-rose-500/10 text-rose-400 border-rose-500/20',
  producer_admin:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
  content_admin:    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  operations_admin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

export default async function AdminUsersPage() {
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
  const isSuperAdmin = adminRole === 'super_admin'
  const isOperations = adminRole === 'operations_admin'

  if (!isSuperAdmin && !isOperations) redirect('/admin/no-access')

  const adminSupabase = await createAdminClient()

  const { data: users } = await adminSupabase
    .from('profiles')
    .select('*, subscriptions(status, plan:subscription_plans(name, pillar))')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-zinc-400 mt-1">{users?.length ?? 0} registered accounts</p>
        </div>
        {isSuperAdmin && (
          <Button size="sm" className="gap-2" asChild>
            <a href="#create-user">
              <UserPlus className="h-4 w-4" />
              Create User
            </a>
          </Button>
        )}
      </div>

      {/* Create user form — super admin only */}
      {isSuperAdmin && (
        <Card id="create-user" className="border-rose-500/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-rose-400" />
              Create New User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action="/api/admin/create-user" method="post" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block font-medium">Full Name</label>
                  <input
                    name="full_name"
                    required
                    className="w-full text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500/50"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block font-medium">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500/50"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block font-medium">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    className="w-full text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500/50"
                    placeholder="Min 8 chars"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block font-medium">Role</label>
                  <select
                    name="role"
                    className="w-full text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="customer">Customer</option>
                    <option value="partner">Partner</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block font-medium">Admin Role (if admin)</label>
                  <select
                    name="admin_role"
                    className="w-full text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="">— Not an admin —</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="producer_admin">Producer Admin</option>
                    <option value="content_admin">Content Admin</option>
                    <option value="operations_admin">Operations Admin</option>
                  </select>
                </div>
              </div>
              <Button type="submit" size="sm" className="bg-rose-500 hover:bg-rose-400 text-white">
                Create User
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* User table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-zinc-400" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Name</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Email</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Role</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Admin Role</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Subscription</th>
                <th className="text-left py-3 px-2 text-zinc-500 font-medium">Joined</th>
                {isSuperAdmin && <th className="text-left py-3 px-2 text-zinc-500 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users?.map((u: any) => {
                const activeSub = u.subscriptions?.find((s: any) => s.status === 'active')
                return (
                  <tr key={u.id} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-2 text-white font-medium">{u.full_name ?? '—'}</td>
                    <td className="py-3 px-2 text-zinc-400 text-xs">{u.email}</td>
                    <td className="py-3 px-2">
                      <Badge className={ROLE_COLORS[u.role] ?? ''}>{u.role}</Badge>
                    </td>
                    <td className="py-3 px-2">
                      {u.admin_role ? (
                        <Badge className={`text-xs ${ADMIN_ROLE_COLORS[u.admin_role] ?? ''}`}>
                          {u.admin_role.replace(/_/g, ' ')}
                        </Badge>
                      ) : (
                        <span className="text-zinc-700 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {activeSub ? (
                        <span className="text-emerald-400 text-xs">{activeSub.plan?.name} ({activeSub.plan?.pillar})</span>
                      ) : (
                        <span className="text-zinc-600 text-xs">Free</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-zinc-500 text-xs">{formatDate(u.created_at)}</td>
                    {isSuperAdmin && (
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <form action="/api/admin/reset-password" method="post">
                            <input type="hidden" name="user_id" value={u.id} />
                            <button type="submit" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                              Reset pwd
                            </button>
                          </form>
                        </div>
                      </td>
                    )}
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
