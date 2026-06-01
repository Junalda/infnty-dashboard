import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollText, Shield } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { AdminRole } from '@/lib/admin-permissions'

export const metadata = { title: 'Audit Log — Admin — INFNTY Studio' }

const ACTION_COLORS: Record<string, string> = {
  system_init:         'bg-blue-500/10 text-blue-400 border-blue-500/20',
  assignment_created:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  assignment_removed:  'bg-red-500/10 text-red-400 border-red-500/20',
  user_created:        'bg-purple-500/10 text-purple-400 border-purple-500/20',
  user_role_changed:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  password_reset:      'bg-rose-500/10 text-rose-400 border-rose-500/20',
  hours_adjusted:      'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  subscription_change: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
}

export default async function AuditLogPage() {
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
  if (adminRole !== 'super_admin' && adminRole !== 'operations_admin') {
    redirect('/admin/no-access')
  }

  const adminSupabase = await createAdminClient()

  const { data: logs } = await adminSupabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  const allLogs = logs ?? []

  const actionCounts: Record<string, number> = {}
  allLogs.forEach((l: any) => {
    actionCounts[l.action] = (actionCounts[l.action] ?? 0) + 1
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
          <ScrollText className="h-5 w-5 text-zinc-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Log</h1>
          <p className="text-zinc-400 mt-0.5">{allLogs.length} actions recorded</p>
        </div>
      </div>

      {/* Summary */}
      {Object.keys(actionCounts).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(actionCounts).map(([action, count]) => (
            <div key={action} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs ${ACTION_COLORS[action] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
              <span className="font-medium">{action.replace(/_/g, ' ')}</span>
              <span className="opacity-70">×{count}</span>
            </div>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {allLogs.length === 0 ? (
            <div className="py-10 text-center">
              <Shield className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">No audit entries yet.</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-zinc-900">
              {allLogs.map((log: any) => (
                <div key={log.id} className="py-4 flex items-start gap-4 hover:bg-zinc-900/30 transition-colors px-2 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="h-3.5 w-3.5 text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`text-xs ${ACTION_COLORS[log.action] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                      {log.target_type && (
                        <span className="text-xs text-zinc-600">on {log.target_type}</span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-300 mt-1">
                      By <span className="text-white font-medium">{log.admin_email ?? 'Unknown'}</span>
                    </p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <p className="text-xs text-zinc-600 mt-1 font-mono">
                        {JSON.stringify(log.details)}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 shrink-0 whitespace-nowrap">
                    {formatDateTime(log.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
