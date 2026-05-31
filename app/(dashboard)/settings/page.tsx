import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, CreditCard, Bell, Shield } from 'lucide-react'
import { formatDate, getStatusColor } from '@/lib/utils'

export const metadata = { title: 'Settings — INFNTY Studio' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: subscriptions }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('subscriptions')
      .select('*, plan:subscription_plans(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <User className="h-4 w-4 text-rose-400" />
          </div>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500 mb-1">Full Name</p>
              <p className="text-white font-medium">{profile?.full_name ?? '—'}</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Email</p>
              <p className="text-white font-medium">{profile?.email}</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Phone</p>
              <p className="text-white font-medium">{profile?.phone ?? '—'}</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Role</p>
              <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 capitalize">{profile?.role}</Badge>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">Member Since</p>
              <p className="text-white font-medium">{profile?.created_at ? formatDate(profile.created_at) : '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-amber-400" />
          </div>
          <CardTitle className="text-base">Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {subscriptions?.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-zinc-500 text-sm mb-3">No active subscriptions</p>
              <Button variant="gold" size="sm" asChild>
                <a href="/#pricing">Browse Plans</a>
              </Button>
            </div>
          ) : subscriptions?.map(sub => (
            <div key={sub.id} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
              <div>
                <p className="text-white font-medium">{sub.plan?.name}</p>
                <p className="text-xs text-zinc-500 capitalize">{sub.plan?.pillar} · €{sub.plan?.price_monthly}/month</p>
                <p className="text-xs text-zinc-600 mt-0.5">Renews {formatDate(sub.current_period_end)}</p>
              </div>
              <Badge className={getStatusColor(sub.status)}>{sub.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Shield className="h-4 w-4 text-blue-400" />
          </div>
          <CardTitle className="text-base">Security</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-white">Password</p>
              <p className="text-xs text-zinc-500">Change your account password</p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Bell className="h-4 w-4 text-purple-400" />
          </div>
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 text-sm">
            {[
              'Booking confirmations',
              'Session reminders (24h before)',
              'Session end reminders',
              'Payment confirmations',
              'File delivery notifications',
              'Subscription renewal reminders',
            ].map(item => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                <span className="text-zinc-300">{item}</span>
                <span className="text-emerald-400 text-xs font-medium">On</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
