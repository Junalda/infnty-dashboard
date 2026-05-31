import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  accent?: 'rose' | 'gold' | 'emerald' | 'blue' | 'purple'
}

const accentStyles = {
  rose: {
    icon: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    gradient: 'from-rose-500/5 to-transparent',
  },
  gold: {
    icon: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    gradient: 'from-amber-500/5 to-transparent',
  },
  emerald: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    gradient: 'from-emerald-500/5 to-transparent',
  },
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    gradient: 'from-blue-500/5 to-transparent',
  },
  purple: {
    icon: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    gradient: 'from-purple-500/5 to-transparent',
  },
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, accent = 'rose' }: StatsCardProps) {
  const styles = accentStyles[accent]

  return (
    <Card className={cn('relative overflow-hidden', styles.border)}>
      <div className={cn('absolute inset-0 bg-gradient-to-br', styles.gradient)} />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && (
              <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className={cn('p-2.5 rounded-xl', styles.bg)}>
            <Icon className={cn('h-5 w-5', styles.icon)} />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1 text-xs">
            <span className={trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {trend.value >= 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="text-zinc-500">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
