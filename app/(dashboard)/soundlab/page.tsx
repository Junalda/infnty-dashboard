import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Music2, Mic, Download, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Sound Lab — INFNTY Studio' }

const STATUS_STEPS = ['in_progress', 'mix_ready', 'master_ready', 'delivered'] as const
const STATUS_LABELS: Record<string, string> = {
  in_progress: 'Demo',
  mix_ready: 'Mix',
  master_ready: 'Master',
  delivered: 'Delivered',
  revision: 'Revision',
}

const STATUS_COLORS: Record<string, string> = {
  in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  mix_ready: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  master_ready: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  revision: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default async function SoundLabPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: profile },
    { data: songProjects },
    { data: subscriptions },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase
      .from('song_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('subscriptions')
      .select('plan:subscription_plans(*)')
      .eq('user_id', user.id)
      .eq('status', 'active'),
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const songs = songProjects ?? []
  const activeSongs = songs.filter(s => s.status !== 'delivered')
  const deliveredSongs = songs.filter(s => s.status === 'delivered')

  // Get plan info for songs included/remaining (simplified)
  const sub = ((subscriptions ?? []) as any[])[0]
  const planFeatures = sub?.plan?.features ?? []
  const songsPerMonth = 2 // from plan

  const revisionsRemaining = songs.reduce((acc: number, s: any) => {
    return acc + (s.revisions_included - s.revisions_used)
  }, 0)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">Sound Lab</h1>
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Song Starter</Badge>
          </div>
          <p className="text-zinc-400">Hey {firstName} — your music production hub</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/soundlab/projects">
              <Music2 className="h-4 w-4" />
              All Projects
            </Link>
          </Button>
          <Button asChild className="bg-purple-500 hover:bg-purple-400 text-white">
            <Link href="/soundlab/distribution">
              Distribution
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Songs This Month"
          value={songs.length}
          subtitle="produced"
          icon={Music2}
          accent="purple"
        />
        <StatsCard
          title="Songs Remaining"
          value={Math.max(0, songsPerMonth - songs.length)}
          subtitle={`of ${songsPerMonth} included`}
          icon={Mic}
          accent="blue"
        />
        <StatsCard
          title="Active Projects"
          value={activeSongs.length}
          subtitle="in production"
          icon={ArrowRight}
          accent="gold"
        />
        <StatsCard
          title="Revisions Remaining"
          value={revisionsRemaining}
          subtitle="across all projects"
          icon={RotateCcw}
          accent="rose"
        />
      </div>

      {/* Song Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Your Projects</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/soundlab/projects" className="text-zinc-400 hover:text-white text-sm">
              Detailed view <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        {songs.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Music2 className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400">No song projects yet.</p>
              <p className="text-sm text-zinc-500 mt-1">Your producer will create your first project.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {songs.map((song: any) => {
              const stepIndex = STATUS_STEPS.indexOf(song.status as typeof STATUS_STEPS[number])
              const revisionsLeft = song.revisions_included - song.revisions_used

              return (
                <Card key={song.id} className="border-purple-500/10 hover:border-purple-500/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                          <Mic className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{song.title}</h3>
                          <p className="text-xs text-zinc-500">{song.artist}{song.genre ? ` · ${song.genre}` : ''}</p>
                        </div>
                      </div>
                      <Badge className={`shrink-0 ${STATUS_COLORS[song.status] ?? ''}`}>
                        {STATUS_LABELS[song.status] ?? song.status}
                      </Badge>
                    </div>

                    {/* Progress steps */}
                    <div className="flex items-center mb-2">
                      {STATUS_STEPS.map((step, i) => {
                        const isDone = i <= stepIndex
                        const isActive = i === stepIndex
                        return (
                          <div key={step} className="flex-1 flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isActive ? 'bg-purple-500 text-white' :
                              isDone ? 'bg-emerald-600 text-white' :
                              'bg-zinc-800 text-zinc-600'
                            }`}>
                              {isDone && !isActive ? '✓' : i + 1}
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 ${i < stepIndex ? 'bg-emerald-600' : 'bg-zinc-800'}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-zinc-600 mb-4">
                      {STATUS_STEPS.map(s => <span key={s}>{STATUS_LABELS[s]}</span>)}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Revision tracker */}
                      <div className="flex items-center gap-2">
                        <RotateCcw className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="text-xs text-zinc-500">
                          Revisions: {song.revisions_used}/{song.revisions_included} used
                        </span>
                        <div className="flex gap-1">
                          {Array.from({ length: song.revisions_included }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${i < song.revisions_used ? 'bg-rose-500' : 'bg-zinc-700'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Downloads if delivered */}
                      {song.status === 'delivered' && (
                        <div className="flex gap-2">
                          {song.master_url && (
                            <Button size="sm" variant="outline" className="h-7 text-xs text-purple-400 border-purple-500/20" asChild>
                              <a href={song.master_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-3 w-3" /> Master
                              </a>
                            </Button>
                          )}
                          {song.stems_url && (
                            <Button size="sm" variant="outline" className="h-7 text-xs text-zinc-400 border-zinc-700" asChild>
                              <a href={song.stems_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-3 w-3" /> Stems
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {song.notes && (
                      <p className="mt-3 text-xs text-zinc-500 bg-zinc-900 rounded-xl p-3">{song.notes}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {[
            { label: 'View All Projects', href: '/soundlab/projects', color: 'text-purple-400' },
            { label: 'Distribution Status', href: '/soundlab/distribution', color: 'text-blue-400' },
            { label: 'Download Files', href: '/files', color: 'text-zinc-300' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-zinc-800 transition-colors group"
            >
              <span className={`text-sm font-medium ${item.color}`}>{item.label}</span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
