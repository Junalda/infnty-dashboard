import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link2, Users, Music2, Video } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { AdminRole } from '@/lib/admin-permissions'

export const metadata = { title: 'Assignments — Admin — INFNTY Studio' }

export default async function AssignmentsPage() {
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

  // producer/content admins can only see their own assignments
  const isSuperAdmin = adminRole === 'super_admin'

  const adminSupabase = await createAdminClient()

  const [
    { data: assignments },
    { data: adminProfiles },
    { data: subscriberProfiles },
  ] = await Promise.all([
    isSuperAdmin
      ? adminSupabase
          .from('admin_assignments')
          .select('*')
          .order('assigned_at', { ascending: false })
      : adminSupabase
          .from('admin_assignments')
          .select('*')
          .eq('admin_id', user.id)
          .order('assigned_at', { ascending: false }),
    // Admins list (for super admin assignment form)
    adminSupabase
      .from('profiles')
      .select('id, full_name, email, admin_role')
      .eq('role', 'admin')
      .in('admin_role', ['producer_admin', 'content_admin']),
    // Subscribers list
    adminSupabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'customer'),
  ])

  const allAssignments = assignments ?? []
  const adminMap: Record<string, any> = {}
  ;(adminProfiles ?? []).forEach((p: any) => { adminMap[p.id] = p })
  const subMap: Record<string, any> = {}
  ;(subscriberProfiles ?? []).forEach((p: any) => { subMap[p.id] = p })

  const pillarColor = (pillar: string) =>
    pillar === 'soundlab' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
    'bg-amber-500/10 text-amber-400 border-amber-500/20'

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Assignments</h1>
          <p className="text-zinc-400 mt-1">
            {isSuperAdmin ? 'Assign subscribers to producer and content admins' : 'Your assigned subscribers'}
          </p>
        </div>
      </div>

      {/* Create assignment form — super admin only */}
      {isSuperAdmin && (
        <Card className="border-rose-500/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="h-4 w-4 text-rose-400" />
              Create Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action="/api/admin/create-assignment" method="post" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block font-medium">Admin</label>
                  <select
                    name="admin_id"
                    required
                    className="w-full text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="">Select admin...</option>
                    {(adminProfiles ?? []).map((a: any) => (
                      <option key={a.id} value={a.id}>
                        {a.full_name ?? a.email} ({a.admin_role === 'producer_admin' ? 'Producer' : 'Content'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block font-medium">Subscriber</label>
                  <select
                    name="subscriber_id"
                    required
                    className="w-full text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="">Select subscriber...</option>
                    {(subscriberProfiles ?? []).map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name ?? s.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1.5 block font-medium">Pillar</label>
                  <select
                    name="pillar"
                    required
                    className="w-full text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="soundlab">Sound Lab</option>
                    <option value="content">Content Engine</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block font-medium">Notes (optional)</label>
                <input
                  name="notes"
                  className="w-full text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-rose-500/50"
                  placeholder="e.g. Primary producer for this client"
                />
              </div>
              <Button type="submit" size="sm" className="bg-rose-500 hover:bg-rose-400 text-white">
                Create Assignment
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Assignment list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-zinc-400" />
            {isSuperAdmin ? 'All Assignments' : 'My Assignments'} ({allAssignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {allAssignments.length === 0 ? (
            <div className="py-10 text-center">
              <Link2 className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">No assignments yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {allAssignments.map((a: any) => {
                const admin = adminMap[a.admin_id]
                const subscriber = subMap[a.subscriber_id]
                return (
                  <div key={a.id} className="py-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Pillar icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        a.pillar === 'soundlab' ? 'bg-purple-500/10' : 'bg-amber-500/10'
                      }`}>
                        {a.pillar === 'soundlab'
                          ? <Music2 className="h-4 w-4 text-purple-400" />
                          : <Video className="h-4 w-4 text-amber-400" />
                        }
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={pillarColor(a.pillar)}>{a.pillar}</Badge>
                          {isSuperAdmin && (
                            <span className="text-xs text-zinc-400">
                              Admin: <span className="text-white">{admin?.full_name ?? admin?.email ?? a.admin_id}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-white mt-1">
                          {subscriber?.full_name ?? subscriber?.email ?? a.subscriber_id}
                        </p>
                        {subscriber?.email && subscriber?.full_name && (
                          <p className="text-xs text-zinc-500">{subscriber.email}</p>
                        )}
                        {a.notes && (
                          <p className="text-xs text-zinc-600 mt-1 italic">{a.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-zinc-600">{formatDate(a.assigned_at)}</p>
                      {isSuperAdmin && (
                        <form action="/api/admin/remove-assignment" method="post" className="mt-2">
                          <input type="hidden" name="assignment_id" value={a.id} />
                          <button
                            type="submit"
                            className="text-xs text-red-500 hover:text-red-400 transition-colors"
                          >
                            Remove
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
