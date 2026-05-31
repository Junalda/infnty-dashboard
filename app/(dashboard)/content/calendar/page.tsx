import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

export const metadata = { title: 'Content Calendar — INFNTY Studio' }

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  tiktok: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20',
  linkedin: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  youtube: 'bg-red-500/15 text-red-400 border-red-500/20',
  general: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
}

const PLATFORM_DOTS: Record<string, string> = {
  instagram: 'bg-pink-500',
  tiktok: 'bg-zinc-300',
  linkedin: 'bg-blue-500',
  youtube: 'bg-red-500',
  general: 'bg-zinc-500',
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default async function ContentCalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const { data: calendarItems } = await supabase
    .from('content_calendar')
    .select('*')
    .eq('user_id', user.id)
    .gte('scheduled_at', startOfMonth.toISOString())
    .lte('scheduled_at', new Date(endOfMonth.getTime() + 8 * 24 * 3600 * 1000).toISOString())
    .order('scheduled_at', { ascending: true })

  const items = calendarItems ?? []

  // Build calendar grid for current month
  const daysInMonth = endOfMonth.getDate()
  const firstDayOfWeek = startOfMonth.getDay() // 0=Sun

  // Group items by day
  const itemsByDay: Record<number, typeof items> = {}
  items.forEach(item => {
    const d = new Date(item.scheduled_at)
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      const day = d.getDate()
      if (!itemsByDay[day]) itemsByDay[day] = []
      itemsByDay[day].push(item)
    }
  })

  // This week
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)
  const thisWeekItems = items.filter(item => {
    const d = new Date(item.scheduled_at)
    return d >= startOfWeek && d < endOfWeek
  })

  const monthLabel = now.toLocaleDateString('en', { month: 'long', year: 'numeric' })

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Calendar</h1>
        <p className="text-zinc-400 mt-1">Your scheduled posts for {monthLabel}</p>
      </div>

      {/* Platform legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { platform: 'instagram', label: 'Instagram' },
          { platform: 'tiktok', label: 'TikTok' },
          { platform: 'linkedin', label: 'LinkedIn' },
          { platform: 'youtube', label: 'YouTube' },
        ].map(({ platform, label }) => (
          <div key={platform} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <div className={`w-2.5 h-2.5 rounded-full ${PLATFORM_DOTS[platform]}`} />
            <span className="text-xs text-zinc-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-amber-400" />
            {monthLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs text-zinc-600 text-center py-1 font-medium">{day}</div>
            ))}
          </div>
          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 rounded-lg" />
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayItems = itemsByDay[day] ?? []
              const isToday = day === now.getDate()
              return (
                <div
                  key={day}
                  className={`h-16 rounded-lg p-1.5 flex flex-col ${
                    isToday
                      ? 'bg-amber-500/10 border border-amber-500/20'
                      : 'bg-zinc-900/50 border border-zinc-800/50'
                  }`}
                >
                  <span className={`text-xs font-medium leading-none mb-1 ${isToday ? 'text-amber-400' : 'text-zinc-500'}`}>
                    {day}
                  </span>
                  <div className="flex flex-wrap gap-0.5">
                    {dayItems.slice(0, 4).map(item => (
                      <div
                        key={item.id}
                        className={`w-2 h-2 rounded-full ${PLATFORM_DOTS[item.platform] ?? 'bg-zinc-500'}`}
                        title={`${item.platform}: ${item.title}`}
                      />
                    ))}
                    {dayItems.length > 4 && (
                      <span className="text-xs text-zinc-600">+{dayItems.length - 4}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* This week list */}
      <div>
        <h2 className="font-semibold text-white mb-4">This Week&apos;s Schedule</h2>
        {thisWeekItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-zinc-500 text-sm">Nothing scheduled this week.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {thisWeekItems.map(item => {
              const d = new Date(item.scheduled_at)
              return (
                <Card key={item.id} className="border-zinc-800 hover:border-amber-500/20 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-14 text-center shrink-0">
                      <p className="text-xs text-zinc-500">{d.toLocaleDateString('en', { weekday: 'short' })}</p>
                      <p className="text-lg font-bold text-white leading-none">{d.getDate()}</p>
                      <p className="text-xs text-zinc-600">{d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className={`w-1 h-10 rounded-full shrink-0 ${PLATFORM_DOTS[item.platform] ?? 'bg-zinc-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      {item.caption && (
                        <p className="text-xs text-zinc-500 mt-0.5 truncate">{item.caption}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={PLATFORM_COLORS[item.platform] ?? ''}>{item.platform}</Badge>
                      <Badge className={STATUS_COLORS[item.status] ?? ''}>{item.status}</Badge>
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
