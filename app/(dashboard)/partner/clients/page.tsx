import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'My Clients — Partner — INFNTY Studio' }

export default async function PartnerClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['partner', 'admin'].includes(profile.role)) redirect('/dashboard')

  const [{ data: contentProjects }, { data: soundlabProjects }] = await Promise.all([
    supabase
      .from('content_projects')
      .select('user_id, user:profiles!content_projects_user_id_fkey(id, full_name, email)')
      .eq('partner_id', user.id),
    supabase
      .from('soundlab_projects')
      .select('user_id, user:profiles!soundlab_projects_user_id_fkey(id, full_name, email)')
      .eq('partner_id', user.id),
  ])

  const clientMap = new Map<string, { id: string; full_name: string | null; email: string; types: string[] }>()

  type ClientUser = { id: string; full_name: string | null; email: string }

  contentProjects?.forEach(p => {
    if (p.user) {
      const u = p.user as unknown as ClientUser
      const existing = clientMap.get(u.id) ?? { ...u, types: [] as string[] }
      if (!existing.types.includes('Content Engine')) existing.types.push('Content Engine')
      clientMap.set(u.id, existing)
    }
  })

  soundlabProjects?.forEach(p => {
    if (p.user) {
      const u = p.user as unknown as ClientUser
      const existing = clientMap.get(u.id) ?? { ...u, types: [] as string[] }
      if (!existing.types.includes('Sound Lab')) existing.types.push('Sound Lab')
      clientMap.set(u.id, existing)
    }
  })

  const clients = Array.from(clientMap.values())

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Clients</h1>
        <p className="text-zinc-400 mt-1">{clients.length} assigned clients</p>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-zinc-400">No clients assigned yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {clients.map(client => (
            <Card key={client.id}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{client.full_name ?? '—'}</p>
                  <p className="text-sm text-zinc-500">{client.email}</p>
                </div>
                <div className="flex gap-2">
                  {client.types.map(t => (
                    <Badge key={t} className={t === 'Content Engine' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}>
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
