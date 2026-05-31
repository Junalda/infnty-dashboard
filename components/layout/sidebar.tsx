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
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const customerNav: NavItem[] = [
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
  { label: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  role?: UserRole
}

export function Sidebar({ role = 'customer' }: SidebarProps) {
  const pathname = usePathname()

  const navItems =
    role === 'admin' ? adminNav : role === 'partner' ? partnerNav : customerNav

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
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
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
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-xs text-zinc-400">Rehearsal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-zinc-400">Content Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs text-zinc-400">Sound Lab</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
