'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'
import { Menu, X, LayoutDashboard, CalendarDays, Video, Music2, FolderOpen, Settings, Users, BarChart3, DoorOpen, Shield, Briefcase, UserCheck } from 'lucide-react'

const customerNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Bookings', href: '/bookings', icon: CalendarDays },
  { label: 'Content Engine', href: '/content', icon: Video },
  { label: 'Sound Lab', href: '/soundlab', icon: Music2 },
  { label: 'Files', href: '/files', icon: FolderOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const partnerNav = [
  { label: 'Partner Hub', href: '/partner', icon: Briefcase },
  { label: 'My Clients', href: '/partner/clients', icon: UserCheck },
  { label: 'Projects', href: '/partner/projects', icon: FolderOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const adminNav = [
  { label: 'Admin Overview', href: '/admin', icon: Shield },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Bookings', href: '/admin/bookings', icon: CalendarDays },
  { label: 'Revenue', href: '/admin/revenue', icon: BarChart3 },
  { label: 'Rooms', href: '/admin/rooms', icon: DoorOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
]

interface MobileNavProps {
  role?: UserRole
}

export function MobileNav({ role = 'customer' }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = role === 'admin' ? adminNav : role === 'partner' ? partnerNav : customerNav

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={() => setOpen(false)} />
          <nav className="absolute left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-zinc-800 p-4 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6 p-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">∞</span>
              </div>
              <span className="font-bold text-white">INFNTY Studio</span>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
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
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
