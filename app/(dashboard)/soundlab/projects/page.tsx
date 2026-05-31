import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Music2, Mic, Download, RotateCcw, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Song Projects — INFNTY Studio' }

const STATUS_STEPS = ['in_progress', 'mix_ready', 'master_ready', 'delivered'] as const
const STATUS_LABELS: Record<string, string> = {
  in_progress: 'Demo',
  mix_ready: 'Mix Ready',
  master_ready: 'Master Ready',
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

const REVISION_STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-400',
  in_progress: 'text-blue-400',
  completed: 'text-emerald-400',
}

export default async function SoundLabProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: songs } = await supabase
    .from('song_projects')
    .select('*, revisions:song_revisions(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allSongs = (songs ?? []) as any[]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="text-zinc-400 hover:text-white">
          <Link href="/soundlab">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Song Projects</h1>
          <p className="text-zinc-400 mt-0.5">Detailed view of all your music productions</p>
        </div>
      </div>

      {allSongs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Music2 className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400">No song projects yet.</p>
            <p className="text-sm text-zinc-500 mt-1">Your producer will create your first project.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {allSongs.map((song) => {
            const stepIndex = STATUS_STEPS.indexOf(song.status as typeof STATUS_STEPS[number])
            const revisions = (song.revisions ?? []) as any[]
            const sortedRevisions = [...revisions].sort(
              (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            )

            return (
              <Card key={song.id} className="border-purple-500/10 overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Mic className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-white font-bold text-lg">{song.title}</h2>
                        <p className="text-sm text-zinc-400">{song.artist}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {song.genre && <span className="text-xs text-purple-400">{song.genre}</span>}
                          {song.bpm && <span className="text-xs text-zinc-500">BPM: {song.bpm}</span>}
                          {song.key && <span className="text-xs text-zinc-500">Key: {song.key}</span>}
                        </div>
                      </div>
                    </div>
                    <Badge className={`shrink-0 ${STATUS_COLORS[song.status] ?? ''}`}>
                      {STATUS_LABELS[song.status] ?? song.status}
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center mb-2">
                      {STATUS_STEPS.map((step, i) => {
                        const isDone = i <= stepIndex
                        const isActive = i === stepIndex
                        return (
                          <div key={step} className="flex-1 flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isActive ? 'bg-purple-500 text-white ring-4 ring-purple-500/20' :
                              isDone ? 'bg-emerald-600 text-white' :
                              'bg-zinc-800 text-zinc-600'
                            }`}>
                              {isDone && !isActive ? '✓' : i + 1}
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-1 mx-1 rounded-full ${i < stepIndex ? 'bg-emerald-600' : 'bg-zinc-800'}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-zinc-600 px-0">
                      {STATUS_STEPS.map(s => <span key={s}>{STATUS_LABELS[s]}</span>)}
                    </div>
                  </div>

                  {/* Revisions tracker */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 text-zinc-500" />
                      <span className="text-sm text-zinc-400">
                        Revisions: <span className="text-white font-medium">{song.revisions_used}/{song.revisions_included}</span> used
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {Array.from({ length: song.revisions_included }).map((_: any, i: number) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${i < song.revisions_used ? 'bg-rose-500' : 'bg-zinc-700'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* File downloads */}
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Files</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'Demo', url: song.demo_url, color: 'text-zinc-300 border-zinc-700' },
                        { label: 'Mix', url: song.mix_url, color: 'text-blue-400 border-blue-500/20' },
                        { label: 'Master', url: song.master_url, color: 'text-purple-400 border-purple-500/20' },
                        { label: 'Stems', url: song.stems_url, color: 'text-emerald-400 border-emerald-500/20' },
                      ].map(({ label, url, color }) => (
                        url ? (
                          <Button key={label} size="sm" variant="outline" className={`h-9 text-xs ${color}`} asChild>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-3 w-3" /> {label}
                            </a>
                          </Button>
                        ) : (
                          <div key={label} className="h-9 rounded-md border border-dashed border-zinc-800 flex items-center justify-center">
                            <span className="text-xs text-zinc-700">{label} —</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Revision history timeline */}
                  {sortedRevisions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Revision History</p>
                      <div className="space-y-2">
                        {sortedRevisions.map((rev: any, idx: number) => (
                          <div key={rev.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                                <span className="text-xs text-zinc-400">{idx + 1}</span>
                              </div>
                              {idx < sortedRevisions.length - 1 && (
                                <div className="w-px flex-1 bg-zinc-800 mt-1" />
                              )}
                            </div>
                            <div className="pb-3 flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs text-zinc-500">{formatDate(rev.created_at)}</span>
                                <span className={`text-xs font-medium ${REVISION_STATUS_COLORS[rev.status] ?? 'text-zinc-400'}`}>
                                  {rev.status.replace('_', ' ')}
                                </span>
                              </div>
                              {rev.notes && (
                                <p className="text-xs text-zinc-400 bg-zinc-900 rounded-lg p-2">{rev.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {song.notes && (
                    <p className="text-xs text-zinc-500 bg-zinc-900 rounded-xl p-3">{song.notes}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
