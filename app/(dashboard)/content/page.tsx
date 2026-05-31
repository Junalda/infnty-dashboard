import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/dashboard/stats-card'
import {
  Video, Calendar, CheckSquare, Clock, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Content Engine — INFNTY Studio' }

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  tiktok: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20',
  linkedin: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  youtube: 'bg-red-500/15 text-red-400 border-red-500/20',
  general: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
}

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  revision_requested: 'bg-red-500/10 text-red-400 border-red-500/20',
  delivered: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

const PLATFORM_ICONS: Record<string, string> = {
  instagram: 'IG',
  tiktok: 'TT',
  linkedin: 'LI',
  youtube: 'YT',
  general: 'GN',
}

export default async function ContentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: profile },
    { data: projects },
    { data: deliverables },
    { data: calendarItems },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase
      .from('content_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('content_deliverables')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .from('content_calendar')
      .select('*')
      .eq('user_id', user.id)
      .gte('scheduled_at', new Date().toISOString())
      .lte('scheduled_at', new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(10),
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const allDeliverables = deliverables ?? []
  const pendingApprovals = allDeliverables.filter(d => d.status === 'review').length
  const revisions = allDeliverables.filter(d => d.status === 'revision_requested').length
  const nextProject = (projects ?? [])[0]
  const nextProductionDay = nextProject?.production_day ? formatDate(nextProject.production_day) : '—'

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">Content Engine</h1>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Growth Package</Badge>
          </div>
          <p className="text-zinc-400">Hey {firstName} — here&apos;s your content overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/content/calendar">
              <Calendar className="h-4 w-4" />
              Calendar
            </Link>
          </Button>
          <Button asChild className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
            <Link href="/content/approvals">
              <CheckSquare className="h-4 w-4" />
              Approvals
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Deliverables"
          value={allDeliverables.length}
          subtitle="this month"
          icon={Video}
          accent="gold"
        />
        <StatsCard
          title="Pending Approval"
          value={pendingApprovals}
          subtitle="awaiting your review"
          icon={CheckSquare}
          accent="blue"
        />
        <StatsCard
          title="Revisions"
          value={revisions}
          subtitle="requested"
          icon={Clock}
          accent="rose"
        />
        <StatsCard
          title="Next Production"
          value={nextProductionDay}
          subtitle="production day"
          icon={Calendar}
          accent="purple"
        />
      </div>

      {/* Deliverables grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Your Deliverables</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/content/approvals" className="text-zinc-400 hover:text-white text-sm">
              View approvals <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
        {allDeliverables.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Video className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400">No deliverables yet.</p>
              <p className="text-sm text-zinc-500 mt-1">Your team will upload content here soon.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allDeliverables.map(d => (
              <Card key={d.id} className="border-zinc-800 hover:border-amber-500/20 transition-colors">
                <CardContent className="p-4">
                  {/* Gradient thumbnail */}
                  <div className={`w-full h-28 rounded-xl mb-3 flex items-center justify-center text-2xl font-bold ${
                    d.platform === 'instagram' ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20' :
                    d.platform === 'tiktok' ? 'bg-gradient-to-br from-zinc-700 to-zinc-900' :
                    d.platform === 'linkedin' ? 'bg-gradient-to-br from-blue-500/20 to-blue-700/20' :
                    d.platform === 'youtube' ? 'bg-gradient-to-br from-red-500/20 to-red-700/20' :
                    'bg-gradient-to-br from-zinc-700/20 to-zinc-900/20'
                  }`}>
                    <span className="text-white/30 text-4xl font-black">{PLATFORM_ICONS[d.platform]}</span>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-white leading-tight">{d.title}</p>
                    <Badge className={`shrink-0 text-xs ${STATUS_COLORS[d.status] ?? ''}`}>
                      {d.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`text-xs ${PLATFORM_COLORS[d.platform] ?? ''}`}>{d.platform}</Badge>
                    <Badge className="text-xs bg-zinc-800 text-zinc-400 border-zinc-700">{d.type}</Badge>
                    {d.duration_seconds && (
                      <span className="text-xs text-zinc-500">{d.duration_seconds}s</span>
                    )}
                  </div>

                  {d.notes && d.status === 'revision_requested' && (
                    <p className="text-xs text-zinc-400 bg-red-500/5 border border-red-500/10 rounded-lg p-2 mb-3 line-clamp-2">
                      {d.notes}
                    </p>
                  )}

                  {d.status === 'review' && (
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-7">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs h-7 border-amber-500/30 text-amber-400">
                        Revise
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Calendar preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Next 7 Days</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/content/calendar" className="text-zinc-400 hover:text-white text-sm">
              Full calendar <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
        {(calendarItems ?? []).length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-zinc-500 text-sm">Nothing scheduled in the next 7 days.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {(calendarItems ?? []).map(item => {
              const scheduledDate = new Date(item.scheduled_at)
              return (
                <Card key={item.id} className="border-zinc-800">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 text-center shrink-0">
                      <p className="text-xs text-zinc-500 uppercase">
                        {scheduledDate.toLocaleDateString('en', { weekday: 'short' })}
                      </p>
                      <p className="text-lg font-bold text-white leading-none">{scheduledDate.getDate()}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.title}</p>
                      <p className="text-xs text-zinc-500">
                        {scheduledDate.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Badge className={`shrink-0 ${PLATFORM_COLORS[item.platform] ?? ''}`}>
                      {item.platform}
                    </Badge>
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
