import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Video, Users, CheckSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Content Management — Admin — INFNTY Studio' }

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  revision_requested: 'bg-red-500/10 text-red-400 border-red-500/20',
  delivered: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

const PLATFORM_BADGE: Record<string, string> = {
  instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  tiktok: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20',
  linkedin: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  youtube: 'bg-red-500/15 text-red-400 border-red-500/20',
  general: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
}

export default async function AdminContentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, admin_role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')
  const adminRole = profile?.admin_role as string | null
  if (adminRole && adminRole !== 'super_admin' && adminRole !== 'content_admin') {
    redirect('/admin/no-access')
  }

  const adminSupabase = await createAdminClient()

  const [
    { data: projects },
    { data: deliverables },
    { data: profiles },
  ] = await Promise.all([
    adminSupabase
      .from('content_projects')
      .select('*')
      .order('created_at', { ascending: false }),
    adminSupabase
      .from('content_deliverables')
      .select('*')
      .order('created_at', { ascending: false }),
    adminSupabase
      .from('profiles')
      .select('id, full_name, email'),
  ])

  const allProjects = projects ?? []
  const allDeliverables = deliverables ?? []
  const profileMap: Record<string, any> = {}
  ;(profiles ?? []).forEach((p: any) => { profileMap[p.id] = p })

  // Group deliverables by project
  const deliverablesByProject: Record<string, any[]> = {}
  allDeliverables.forEach((d: any) => {
    if (!deliverablesByProject[d.project_id]) deliverablesByProject[d.project_id] = []
    deliverablesByProject[d.project_id].push(d)
  })

  const totalPending = allDeliverables.filter(d => d.status === 'review').length
  const totalRevisions = allDeliverables.filter(d => d.status === 'revision_requested').length

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Management</h1>
        <p className="text-zinc-400 mt-1">Manage content projects and deliverables for all users</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: allProjects.length, color: 'text-white' },
          { label: 'Total Deliverables', value: allDeliverables.length, color: 'text-white' },
          { label: 'Pending Approval', value: totalPending, color: 'text-amber-400' },
          { label: 'Revision Requests', value: totalRevisions, color: 'text-red-400' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects list */}
      <div>
        <h2 className="font-semibold text-white mb-4">All Content Projects</h2>
        {allProjects.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Video className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400">No content projects yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {allProjects.map((project: any) => {
              const user = profileMap[project.user_id]
              const projectDeliverables = deliverablesByProject[project.id] ?? []
              const pendingCount = projectDeliverables.filter(d => d.status === 'review').length
              const approvedCount = projectDeliverables.filter(d => d.status === 'approved').length

              return (
                <Card key={project.id} className="border-zinc-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-base text-white">{project.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="h-3.5 w-3.5 text-zinc-500" />
                          <span className="text-xs text-zinc-500">
                            {user?.full_name ?? 'Unknown'} ({user?.email ?? ''})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                          {projectDeliverables.length} deliverables
                        </Badge>
                        {pendingCount > 0 && (
                          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                            {pendingCount} pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {projectDeliverables.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-zinc-800">
                              <th className="text-left text-xs text-zinc-500 font-medium py-2 pr-4">Title</th>
                              <th className="text-left text-xs text-zinc-500 font-medium py-2 pr-4">Platform</th>
                              <th className="text-left text-xs text-zinc-500 font-medium py-2 pr-4">Type</th>
                              <th className="text-left text-xs text-zinc-500 font-medium py-2 pr-4">Status</th>
                              <th className="text-left text-xs text-zinc-500 font-medium py-2">File</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/50">
                            {projectDeliverables.map((d: any) => (
                              <tr key={d.id} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="py-2.5 pr-4">
                                  <span className="text-zinc-300 text-xs">{d.title}</span>
                                </td>
                                <td className="py-2.5 pr-4">
                                  <Badge className={`text-xs ${PLATFORM_BADGE[d.platform] ?? ''}`}>{d.platform}</Badge>
                                </td>
                                <td className="py-2.5 pr-4">
                                  <span className="text-xs text-zinc-500">{d.type}</span>
                                </td>
                                <td className="py-2.5 pr-4">
                                  <Badge className={`text-xs ${STATUS_COLORS[d.status] ?? ''}`}>
                                    {d.status.replace('_', ' ')}
                                  </Badge>
                                </td>
                                <td className="py-2.5">
                                  {d.file_url ? (
                                    <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-400 hover:underline">
                                      View file
                                    </a>
                                  ) : (
                                    <span className="text-xs text-zinc-700">No file</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-600 py-2">No deliverables for this project.</p>
                    )}

                    {/* Upload form placeholder */}
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <UploadForm projectId={project.id} userId={project.user_id} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function UploadForm({ projectId, userId }: { projectId: string; userId: string }) {
  return (
    <details className="group">
      <summary className="cursor-pointer text-xs text-amber-400 hover:text-amber-300 list-none flex items-center gap-1">
        <CheckSquare className="h-3.5 w-3.5" />
        Add deliverable to this project
      </summary>
      <form className="mt-3 space-y-3" action="/api/admin/upload-deliverable" method="post">
        <input type="hidden" name="project_id" value={projectId} />
        <input type="hidden" name="user_id" value={userId} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Title</label>
            <input
              name="title"
              className="w-full text-xs bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
              placeholder="Content piece title"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">File URL</label>
            <input
              name="file_url"
              className="w-full text-xs bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/50"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Platform</label>
            <select name="platform" className="w-full text-xs bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white">
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Type</label>
            <select name="type" className="w-full text-xs bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white">
              <option value="reel">Reel</option>
              <option value="short">Short</option>
              <option value="post">Post</option>
              <option value="story">Story</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Status</label>
            <select name="status" className="w-full text-xs bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white">
              <option value="pending">Pending</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
        <Button type="submit" size="sm" className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold">
          Add Deliverable
        </Button>
      </form>
    </details>
  )
}
