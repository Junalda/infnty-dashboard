import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import type { UserRole } from '@/types'
import type { AdminRole } from '@/lib/admin-permissions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, admin_role')
    .eq('id', user.id)
    .single()

  const role = (profile?.role ?? 'customer') as UserRole
  const adminRole = (profile?.admin_role ?? null) as AdminRole | null

  const { data: subs } = await supabase
    .from('subscriptions')
    .select('plan:subscription_plans(pillar)')
    .eq('user_id', user.id)
    .eq('status', 'active')

  const pillars = [...new Set((subs ?? []).map((s: any) => (s.plan as any)?.pillar).filter(Boolean))] as string[]

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar role={role} adminRole={adminRole} pillars={pillars} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header role={role} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
