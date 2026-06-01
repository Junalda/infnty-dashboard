import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Music2, Users, Disc, RotateCcw } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Songs Management — Admin — INFNTY Studio' }

const STATUS_COLORS: Record<string, string> = {
  in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  mix_ready: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  master_ready: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  revision: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const STATUS_LABELS: Record<string, string> = {
  in_progress: 'In Progress',
  mix_ready: 'Mix Ready',
  master_ready: 'Master Ready',
  delivered: 'Delivered',
  revision: 'Revision',
}

const DIST_STATUS_COLORS: Record<string, string> = {
  not_submitted: 'bg-zinc-500/10 text-zinc-500 border-zinc-700',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  live: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const PLATFORMS = ['spotify', 'apple_music', 'youtube_music', 'tidal', 'amazon_music', 'cdbaby']

export default async function AdminSongsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, admin_role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')
  const adminRole = profile?.admin_role as string | null
  if (adminRole && adminRole !== 'super_admin' && adminRole !== 'producer_admin') {
    redirect('/admin/no-access')
  }

  const adminSupabase = await createAdminClient()

  const [
    { data: songs },
    { data: profiles },
    { data: distribution },
    { data: revisions },
  ] = await Promise.all([
    adminSupabase
      .from('song_projects')
      .select('*')
      .order('created_at', { ascending: false }),
    adminSupabase.from('profiles').select('id, full_name, email'),
    adminSupabase.from('distribution_status').select('*'),
    adminSupabase.from('song_revisions').select('*').order('created_at', { ascending: false }),
  ])

  const profileMap: Record<string, any> = {}
  ;(profiles ?? []).forEach((p: any) => { profileMap[p.id] = p })

  const distBySong: Record<string, Record<string, any>> = {}
  ;(distribution ?? []).forEach((d: any) => {
    if (!distBySong[d.song_id]) distBySong[d.song_id] = {}
    distBySong[d.song_id][d.platform] = d
  })

  const revisionsBySong: Record<string, any[]> = {}
  ;(revisions ?? []).forEach((r: any) => {
    if (!revisionsBySong[r.song_id]) revisionsBySong[r.song_id] = []
    revisionsBySong[r.song_id].push(r)
  })

  const allSongs = songs ?? []

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Songs Management</h1>
        <p className="text-zinc-400 mt-1">Manage all song projects, uploads, and distribution</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Songs', value: allSongs.length },
          { label: 'In Progress', value: allSongs.filter((s: any) => s.status === 'in_progress').length },
          { label: 'Delivered', value: allSongs.filter((s: any) => s.status === 'delivered').length },
          { label: 'Live on Platforms', value: (distribution ?? []).filter((d: any) => d.status === 'live').length },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Songs list */}
      <div className="space-y-6">
        {allSongs.map((song: any) => {
          const owner = profileMap[song.user_id]
          const dist = distBySong[song.id] ?? {}
          const songRevisions = revisionsBySong[song.id] ?? []

          return (
            <Card key={song.id} className="border-purple-500/10">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Music2 className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-white">{song.title}</CardTitle>
                      <p className="text-xs text-zinc-500">
                        {song.artist} · {song.genre ?? '—'}
                        {song.bpm ? ` · ${song.bpm} BPM` : ''}
                        {song.key ? ` · ${song.key}` : ''}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Users className="h-3 w-3 text-zinc-600" />
                        <span className="text-xs text-zinc-600">
                          {owner?.full_name ?? 'Unknown'} ({owner?.email ?? ''})
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`shrink-0 ${STATUS_COLORS[song.status] ?? ''}`}>
                    {STATUS_LABELS[song.status] ?? song.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Status & URL update form */}
                <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-4">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Update Project</p>
                  <form className="space-y-3" action="/api/admin/update-song" method="post">
                    <input type="hidden" name="song_id" value={song.id} />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Status</label>
                        <select
                          name="status"
                          defaultValue={song.status}
                          className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                        >
                          {Object.entries(STATUS_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: 'demo_url', label: 'Demo URL', current: song.demo_url },
                        { name: 'mix_url', label: 'Mix URL', current: song.mix_url },
                        { name: 'master_url', label: 'Master URL', current: song.master_url },
                        { name: 'stems_url', label: 'Stems URL', current: song.stems_url },
                      ].map(({ name, label, current }) => (
                        <div key={name}>
                          <label className="text-xs text-zinc-500 mb-1 block">{label}</label>
                          <input
                            name={name}
                            defaultValue={current ?? ''}
                            className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500/50"
                            placeholder="https://..."
                          />
                        </div>
                      ))}
                    </div>
                    <Button type="submit" size="sm" className="bg-purple-500 hover:bg-purple-400 text-white text-xs font-semibold">
                      Update Song
                    </Button>
                  </form>
                </div>

                {/* Distribution status */}
                <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Disc className="h-4 w-4 text-zinc-500" />
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Distribution</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PLATFORMS.map(platform => {
                      const d = dist[platform]
                      const status = d?.status ?? 'not_submitted'
                      return (
                        <div key={platform} className="flex items-center justify-between rounded-lg bg-zinc-800 px-3 py-2">
                          <span className="text-xs text-zinc-400 capitalize">{platform.replace('_', ' ')}</span>
                          <Badge className={`text-xs ${DIST_STATUS_COLORS[status] ?? ''}`}>
                            {status.replace('_', ' ')}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Add revision form */}
                <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <RotateCcw className="h-4 w-4 text-zinc-500" />
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                      Revisions ({song.revisions_used}/{song.revisions_included} used)
                    </p>
                  </div>
                  {songRevisions.length > 0 && (
                    <div className="space-y-1.5 mb-3">
                      {songRevisions.map((rev: any) => (
                        <div key={rev.id} className="flex items-start gap-2 text-xs">
                          <span className="text-zinc-600 shrink-0">R{rev.round}.</span>
                          <span className="text-zinc-400">{rev.notes ?? '—'}</span>
                          <Badge className={`ml-auto shrink-0 text-xs ${
                            rev.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                            rev.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-zinc-500/10 text-zinc-400'
                          }`}>{rev.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  <form className="flex gap-2" action="/api/admin/add-revision" method="post">
                    <input type="hidden" name="song_id" value={song.id} />
                    <input
                      name="notes"
                      className="flex-1 text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500/50"
                      placeholder="Revision notes..."
                    />
                    <Button type="submit" size="sm" variant="outline" className="text-xs border-zinc-700 text-zinc-300 shrink-0">
                      Add
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
