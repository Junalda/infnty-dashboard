'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'
import {
  LayoutDashboard,
  CalendarDays,
  Video,
  Music2,
  FolderOpen,
  Settings,
  Users,
  BarChart3,
  DoorOpen,
  Shield,
  Briefcase,
  UserCheck,
  Mic,
  Calendar,
  CheckSquare,
  Download,
  Disc,
  ListMusic,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const baseNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
]

const rehearsalNav: NavItem[] = [
  { label: 'Rehearsal', href: '/rehearsal', icon: Mic },
  { label: 'Book Session', href: '/bookings/new', icon: CalendarDays },
  { label: 'My Bookings', href: '/bookings', icon: CalendarDays },
]

const contentNav: NavItem[] = [
  { label: 'Content Hub', href: '/content', icon: Video },
  { label: 'Calendar', href: '/content/calendar', icon: Calendar },
  { label: 'Approvals', href: '/content/approvals', icon: CheckSquare },
  { label: 'Downloads', href: '/files', icon: Download },
]

const soundlabNav: NavItem[] = [
  { label: 'Sound Lab', href: '/soundlab', icon: Music2 },
  { label: 'Projects', href: '/soundlab/projects', icon: ListMusic },
  { label: 'Distribution', href: '/soundlab/distribution', icon: Disc },
  { label: 'Downloads', href: '/files', icon: Download },
]

const settingsNav: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: Settings },
]

const genericCustomerNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Bookings', href: '/bookings', icon: CalendarDays },
  { label: 'Content Engine', href: '/content', icon: Video },
  { label: 'Sound Lab', href: '/soundlab', icon: Music2 },
  { label: 'Files', href: '/files', icon: FolderOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const partnerNav: NavItem[] = [
  { label: 'Partner Hub', href: '/partner', icon: Briefcase },
  { label: 'My Clients', href: '/partner/clients', icon: UserCheck },
  { label: 'Projects', href: '/partner/projects', icon: FolderOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const adminNav: NavItem[] = [
  { label: 'Admin Overview', href: '/admin', icon: Shield },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Bookings', href: '/admin/bookings', icon: CalendarDays },
  { label: 'Revenue', href: '/admin/revenue', icon: BarChart3 },
  { label: 'Rooms', href: '/admin/rooms', icon: DoorOpen },
  { label: 'Content Mgmt', href: '/admin/content', icon: Video },
  { label: 'Songs', href: '/admin/songs', icon: Music2 },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const pillarMeta: Record<string, { label: string; color: string; dot: string }> = {
  rehearsal: { label: 'Rehearsal', color: 'text-rose-400', dot: 'bg-rose-500' },
  content: { label: 'Content Engine', color: 'text-amber-400', dot: 'bg-amber-500' },
  soundlab: { label: 'Sound Lab', color: 'text-purple-400', dot: 'bg-purple-500' },
}

interface SidebarProps {
  role?: UserRole
  pillars?: string[]
}

export function Sidebar({ role = 'customer', pillars = [] }: SidebarProps) {
  const pathname = usePathname()

  let navItems: NavItem[]
  if (role === 'admin') {
    navItems = adminNav
  } else if (role === 'partner') {
    navItems = partnerNav
  } else if (pillars.length === 0) {
    navItems = genericCustomerNav
  } else {
    navItems = [...baseNav]
    if (pillars.includes('rehearsal')) navItems.push(...rehearsalNav)
    if (pillars.includes('content')) navItems.push(...contentNav)
    if (pillars.includes('soundlab')) navItems.push(...soundlabNav)
    // Deduplicate (e.g. Downloads appears in both content and soundlab)
    navItems = navItems.filter((item, idx, arr) => arr.findIndex(i => i.href === item.href) === idx)
    navItems.push(...settingsNav)
  }

  const activePillars = role === 'admin'
    ? ['rehearsal', 'content', 'soundlab']
    : pillars.length > 0 ? pillars : []

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-zinc-800 bg-black/50 backdrop-blur-xl h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center">
          <span className="text-white font-bold text-sm">∞</span>
        </div>
        <div>
          <p className="font-bold text-white text-sm">INFNTY Studio</p>
          <p className="text-xs text-zinc-500 capitalize">{role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Pillars badge */}
      <div className="p-4 border-t border-zinc-800">
        <div className="rounded-xl bg-zinc-900 p-3 space-y-2">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Three Pillars</p>
          <div className="flex flex-col gap-1.5">
            {(['rehearsal', 'content', 'soundlab'] as const).map((p) => {
              const meta = pillarMeta[p]
              const isActive = activePillars.includes(p)
              return (
                <div key={p} className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', meta.dot, !isActive && 'opacity-30')} />
                  <span className={cn('text-xs', isActive ? meta.color : 'text-zinc-600')}>{meta.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
