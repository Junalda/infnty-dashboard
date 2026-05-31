import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getPillarColor, formatCurrency } from '@/lib/utils'

export const metadata = { title: 'Rooms — Admin — INFNTY Studio' }

export default async function AdminRoomsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .order('pillar', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Rooms</h1>
        <p className="text-zinc-400 mt-1">Manage studio spaces and availability</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rooms?.map(room => (
          <Card key={room.id} className="hover:border-zinc-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg">{room.name}</h3>
                    <Badge className={room.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}>
                      {room.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className={`text-sm font-medium mb-2 capitalize ${getPillarColor(room.pillar)}`}>{room.pillar}</p>
                  {room.description && <p className="text-zinc-400 text-sm">{room.description}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-black text-white">{formatCurrency(room.hourly_rate)}</p>
                  <p className="text-xs text-zinc-500">per hour</p>
                  <p className="text-xs text-zinc-500 mt-1">Capacity: {room.capacity}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
