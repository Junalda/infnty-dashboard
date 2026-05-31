import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, FolderOpen, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDate, getStatusColor } from '@/lib/utils'

export const metadata = { title: 'Partner Hub — INFNTY Studio' }

export default async function PartnerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['partner', 'admin'].includes(profile.role)) redirect('/dashboard')

  const [
    { data: contentProjects },
    { data: soundlabProjects },
  ] = await Promise.all([
    supabase
      .from('content_projects')
      .select('*, user:profiles!content_projects_user_id_fkey(full_name, email)')
      .eq('partner_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(5),
    supabase
      .from('soundlab_projects')
      .select('*, user:profiles!soundlab_projects_user_id_fkey(full_name, email)')
      .eq('partner_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(5),
  ])

  const totalClients = new Set([
    ...(contentProjects?.map(p => p.user_id) ?? []),
    ...(soundlabProjects?.map(p => p.user_id) ?? []),
  ]).size

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Partner Hub</h1>
        <p className="text-zinc-400 mt-1">Manage your clients and project deliverables</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Clients', value: totalClients, icon: Users },
          { label: 'Content Projects', value: contentProjects?.length ?? 0, icon: FolderOpen },
          { label: 'Sound Lab Projects', value: soundlabProjects?.length ?? 0, icon: Calendar },
        ].map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-zinc-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {contentProjects && contentProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Content Projects</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/partner/projects" className="text-zinc-400 text-xs">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {contentProjects.map(p => (
              <Card key={p.id} className="hover:border-amber-500/20 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{p.title}</p>
                    <p className="text-xs text-zinc-500">{p.user?.full_name} · {p.production_day ? formatDate(p.production_day) : 'No date set'}</p>
                  </div>
                  <Badge className={getStatusColor(p.status)}>{p.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {soundlabProjects && soundlabProjects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Sound Lab Projects</h2>
          <div className="space-y-3">
            {soundlabProjects.map(p => (
              <Card key={p.id} className="hover:border-purple-500/20 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{p.title}</p>
                    <p className="text-xs text-zinc-500">{p.user?.full_name} · {p.genre ?? 'No genre'}</p>
                  </div>
                  <Badge className={getStatusColor(p.status)}>{p.status.replace('_', ' ')}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {contentProjects?.length === 0 && soundlabProjects?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400">No projects assigned yet.</p>
            <p className="text-sm text-zinc-500 mt-1">An admin will assign clients to you.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
