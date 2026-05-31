import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckSquare } from 'lucide-react'

export const metadata = { title: 'Content Approvals — INFNTY Studio' }

const PLATFORM_GRADIENTS: Record<string, string> = {
  instagram: 'from-pink-500/30 to-purple-500/30',
  tiktok: 'from-zinc-600 to-zinc-900',
  linkedin: 'from-blue-500/30 to-blue-700/30',
  youtube: 'from-red-500/30 to-red-700/30',
  general: 'from-zinc-700/30 to-zinc-900/30',
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'IG',
  tiktok: 'TT',
  linkedin: 'LI',
  youtube: 'YT',
  general: 'GN',
}

const PLATFORM_BADGE: Record<string, string> = {
  instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  tiktok: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20',
  linkedin: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  youtube: 'bg-red-500/15 text-red-400 border-red-500/20',
  general: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
}

export default async function ContentApprovalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: deliverables } = await supabase
    .from('content_deliverables')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['review', 'revision_requested'])
    .order('created_at', { ascending: false })

  const items = deliverables ?? []
  const reviewItems = items.filter(d => d.status === 'review')
  const revisionItems = items.filter(d => d.status === 'revision_requested')

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white">Content Approvals</h1>
          {items.length > 0 && (
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">{items.length} pending</Badge>
          )}
        </div>
        <p className="text-zinc-400">Review and approve your content deliverables</p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckSquare className="h-12 w-12 text-emerald-500/30 mx-auto mb-3" />
            <p className="text-white font-medium mb-1">All caught up!</p>
            <p className="text-zinc-500 text-sm">No deliverables waiting for your review.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {reviewItems.length > 0 && (
            <div>
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Awaiting Your Approval ({reviewItems.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviewItems.map(d => (
                  <DeliverableCard key={d.id} item={d} />
                ))}
              </div>
            </div>
          )}

          {revisionItems.length > 0 && (
            <div>
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Revision Requested ({revisionItems.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {revisionItems.map(d => (
                  <DeliverableCard key={d.id} item={d} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function DeliverableCard({ item }: { item: any }) {
  const isRevision = item.status === 'revision_requested'

  return (
    <Card className={`border-zinc-800 hover:border-amber-500/20 transition-colors overflow-hidden`}>
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className={`h-32 bg-gradient-to-br ${PLATFORM_GRADIENTS[item.platform] ?? 'from-zinc-700 to-zinc-900'} flex items-center justify-center`}>
          <span className="text-white/20 text-5xl font-black">{PLATFORM_LABELS[item.platform]}</span>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-white leading-tight">{item.title}</p>
            <Badge className={isRevision
              ? 'shrink-0 bg-red-500/10 text-red-400 border-red-500/20 text-xs'
              : 'shrink-0 bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs'
            }>
              {isRevision ? 'Revision' : 'Review'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${PLATFORM_BADGE[item.platform] ?? ''}`}>{item.platform}</Badge>
            <Badge className="text-xs bg-zinc-800 text-zinc-400 border-zinc-700">{item.type}</Badge>
            {item.duration_seconds && (
              <span className="text-xs text-zinc-600">{item.duration_seconds}s</span>
            )}
          </div>

          {item.notes && isRevision && (
            <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-2.5">
              <p className="text-xs text-red-300/80 leading-relaxed">{item.notes}</p>
            </div>
          )}

          {!isRevision && (
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-8 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                Request Revision
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
