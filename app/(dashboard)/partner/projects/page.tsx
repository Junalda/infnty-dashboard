import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, getStatusColor } from '@/lib/utils'

export const metadata = { title: 'Projects — Partner — INFNTY Studio' }

export default async function PartnerProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['partner', 'admin'].includes(profile.role)) redirect('/dashboard')

  const [{ data: contentProjects }, { data: soundlabProjects }] = await Promise.all([
    supabase
      .from('content_projects')
      .select('*, user:profiles!content_projects_user_id_fkey(full_name)')
      .eq('partner_id', user.id)
      .order('production_day', { ascending: true }),
    supabase
      .from('soundlab_projects')
      .select('*, user:profiles!soundlab_projects_user_id_fkey(full_name)')
      .eq('partner_id', user.id)
      .order('updated_at', { ascending: false }),
  ])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <p className="text-zinc-400 mt-1">All your client projects</p>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="content" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            Content Engine ({contentProjects?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="soundlab" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Sound Lab ({soundlabProjects?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4 space-y-3">
          {contentProjects?.map(p => (
            <Card key={p.id} className="hover:border-amber-500/20 transition-colors">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{p.title}</p>
                  <p className="text-sm text-zinc-500">{p.user?.full_name}</p>
                  {p.production_day && <p className="text-xs text-amber-400 mt-1">Production: {formatDate(p.production_day)}</p>}
                  {p.notes && <p className="text-xs text-zinc-500 mt-1 max-w-sm truncate">{p.notes}</p>}
                </div>
                <Badge className={getStatusColor(p.status)}>{p.status}</Badge>
              </CardContent>
            </Card>
          ))}
          {contentProjects?.length === 0 && (
            <p className="text-zinc-500 text-center py-8">No content projects</p>
          )}
        </TabsContent>

        <TabsContent value="soundlab" className="mt-4 space-y-3">
          {soundlabProjects?.map(p => (
            <Card key={p.id} className="hover:border-purple-500/20 transition-colors">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{p.title}</p>
                  <p className="text-sm text-zinc-500">{p.user?.full_name}</p>
                  {p.genre && <p className="text-xs text-purple-400 mt-1">{p.genre}</p>}
                  {p.notes && <p className="text-xs text-zinc-500 mt-1 max-w-sm truncate">{p.notes}</p>}
                </div>
                <Badge className={getStatusColor(p.status)}>{p.status.replace('_', ' ')}</Badge>
              </CardContent>
            </Card>
          ))}
          {soundlabProjects?.length === 0 && (
            <p className="text-zinc-500 text-center py-8">No Sound Lab projects</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
