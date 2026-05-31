'use client'

import { Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { HourBalance } from '@/types'

interface HoursMeterProps {
  balance: HourBalance | null
  loading?: boolean
}

export function HoursMeter({ balance, loading }: HoursMeterProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-zinc-800 rounded w-32" />
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-zinc-800 rounded w-24 mb-4" />
          <div className="h-3 bg-zinc-800 rounded" />
        </CardContent>
      </Card>
    )
  }

  if (!balance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-rose-400" />
            Hour Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 text-sm">No active subscription this month.</p>
        </CardContent>
      </Card>
    )
  }

  const totalAvailable = balance.included_hours + balance.rollover_hours
  const remaining = totalAvailable - balance.used_hours
  const percentUsed = totalAvailable > 0 ? Math.min(100, (balance.used_hours / totalAvailable) * 100) : 0
  const isUnlimited = balance.included_hours === 0 && balance.rollover_hours === 0

  const color = percentUsed > 80 ? 'rose' : percentUsed > 60 ? 'amber' : 'emerald'

  return (
    <Card className="overflow-hidden">
      <div className={`h-1 w-full bg-gradient-to-r ${color === 'rose' ? 'from-rose-600 to-rose-400' : color === 'amber' ? 'from-amber-600 to-amber-400' : 'from-emerald-600 to-emerald-400'}`} style={{ width: `${percentUsed}%` }} />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-rose-400" />
          Hour Balance
        </CardTitle>
        <p className="text-xs text-zinc-500">{balance.month_year}</p>
      </CardHeader>
      <CardContent>
        {isUnlimited ? (
          <div>
            <p className="text-3xl font-bold text-white">∞</p>
            <p className="text-sm text-zinc-400 mt-1">Unlimited hours</p>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold text-white">{remaining.toFixed(1)}</span>
              <span className="text-zinc-500 text-sm mb-1">/ {totalAvailable}h remaining</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  color === 'rose'
                    ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                    : color === 'amber'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-sm font-semibold text-white">{balance.used_hours}h</p>
                <p className="text-xs text-zinc-500">Used</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{balance.included_hours}h</p>
                <p className="text-xs text-zinc-500">Included</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-400">{balance.rollover_hours}h</p>
                <p className="text-xs text-zinc-500">Rollover</p>
              </div>
            </div>

            {balance.rollover_expiry && balance.rollover_hours > 0 && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400/70">
                <TrendingUp className="h-3 w-3" />
                Rollover expires {new Date(balance.rollover_expiry).toLocaleDateString()}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
