import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Music2, ArrowLeft, ExternalLink, Disc, Zap } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Distribution — INFNTY Studio' }

const PLATFORM_META: Record<string, { label: string; color: string; textColor: string }> = {
  spotify: { label: 'Spotify', color: 'bg-green-500/10 border-green-500/20', textColor: 'text-green-400' },
  apple_music: { label: 'Apple Music', color: 'bg-pink-500/10 border-pink-500/20', textColor: 'text-pink-400' },
  youtube_music: { label: 'YouTube Music', color: 'bg-red-500/10 border-red-500/20', textColor: 'text-red-400' },
  tidal: { label: 'Tidal', color: 'bg-blue-500/10 border-blue-500/20', textColor: 'text-blue-400' },
  amazon_music: { label: 'Amazon Music', color: 'bg-amber-500/10 border-amber-500/20', textColor: 'text-amber-400' },
  cdbaby: { label: 'CD Baby', color: 'bg-purple-500/10 border-purple-500/20', textColor: 'text-purple-400' },
}

const STATUS_META: Record<string, { label: string; badge: string; dot: string }> = {
  not_submitted: { label: 'Not submitted', badge: 'bg-zinc-500/10 text-zinc-500 border-zinc-700', dot: 'bg-zinc-700' },
  pending: { label: 'Pending', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-500' },
  live: { label: 'Live', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' },
  rejected: { label: 'Rejected', badge: 'bg-red-500/10 text-red-400 border-red-500/20', dot: 'bg-red-500' },
}

const PLATFORMS = ['spotify', 'apple_music', 'youtube_music', 'tidal', 'amazon_music', 'cdbaby']

export default async function DistributionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: songs } = await supabase
    .from('song_projects')
    .select('*, distribution:distribution_status(*)')
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
          <h1 className="text-2xl font-bold text-white">Distribution</h1>
          <p className="text-zinc-400 mt-0.5">Status of your songs across streaming platforms</p>
        </div>
      </div>

      {allSongs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Disc className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400">No songs to distribute yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {allSongs.map((song) => {
            const distMap: Record<string, any> = {}
            ;(song.distribution ?? []).forEach((d: any) => { distMap[d.platform] = d })

            const liveCount = Object.values(distMap).filter((d: any) => d?.status === 'live').length
            const notSubmittedCount = PLATFORMS.filter(p => !distMap[p] || distMap[p]?.status === 'not_submitted').length

            return (
              <Card key={song.id} className="border-purple-500/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Music2 className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-white">{song.title}</CardTitle>
                        <p className="text-xs text-zinc-500">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {liveCount > 0 && (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          {liveCount} live
                        </Badge>
                      )}
                      {notSubmittedCount > 0 && song.status === 'delivered' && (
                        <Button size="sm" className="h-7 text-xs bg-purple-500 hover:bg-purple-400 text-white">
                          Submit to Distribution
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PLATFORMS.map(platform => {
                      const dist = distMap[platform]
                      const status = dist?.status ?? 'not_submitted'
                      const meta = PLATFORM_META[platform]
                      const statusMeta = STATUS_META[status]

                      return (
                        <div
                          key={platform}
                          className={`rounded-xl border p-3 flex flex-col gap-2 ${meta.color}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-semibold ${meta.textColor}`}>{meta.label}</span>
                            <div className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
                          </div>
                          <Badge className={`self-start text-xs ${statusMeta.badge}`}>
                            {statusMeta.label}
                          </Badge>
                          {dist?.url && status === 'live' && (
                            <a
                              href={dist.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-1 text-xs ${meta.textColor} hover:underline`}
                            >
                              <ExternalLink className="h-3 w-3" />
                              Listen
                            </a>
                          )}
                          {!dist || status === 'not_submitted' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className={`h-6 text-xs border-current ${meta.textColor}`}
                              disabled={song.status !== 'delivered'}
                            >
                              Submit
                            </Button>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Future integrations */}
      <Card className="border-dashed border-zinc-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-amber-400" />
            <h2 className="font-semibold text-white">Coming Soon</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              'Direct CD Baby Integration',
              'Spotify for Artists Dashboard',
              'Apple Music for Artists',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="text-xs text-zinc-500">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
