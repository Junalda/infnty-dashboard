'use client'

import { formatDateTime, formatTime, getStatusColor, getPillarColor, getPillarLabel, cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, X } from 'lucide-react'
import type { Booking } from '@/types'

interface BookingCardProps {
  booking: Booking
  onCancel?: (id: string) => void
  showUser?: boolean
}

export function BookingCard({ booking, onCancel, showUser }: BookingCardProps) {
  const statusColors = getStatusColor(booking.status)
  const pillarColor = getPillarColor(booking.room?.pillar ?? '')
  const isPast = new Date(booking.end_time) < new Date()
  const isCancellable = !isPast && booking.status !== 'cancelled' && booking.status !== 'completed'

  return (
    <Card className="hover:border-zinc-700 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn('text-xs font-semibold', pillarColor)}>
                {getPillarLabel(booking.room?.pillar ?? '')}
              </span>
              <span className="text-zinc-700">•</span>
              <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold', statusColors)}>
                {booking.status}
              </span>
              {booking.booking_type === 'subscription' && (
                <Badge variant="gold" className="text-xs">Sub</Badge>
              )}
            </div>

            <h3 className="font-semibold text-white truncate">
              {booking.room?.name ?? 'Unknown Room'}
            </h3>

            {showUser && booking.user && (
              <p className="text-sm text-zinc-400 mt-0.5">
                {booking.user.full_name ?? booking.user.email}
              </p>
            )}

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>{formatDateTime(booking.start_time)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>{formatTime(booking.start_time)} – {formatTime(booking.end_time)}</span>
                <span className="text-zinc-600">({booking.hours_used}h)</span>
              </div>
              {booking.room?.description && (
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{booking.room.description}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <p className="text-lg font-bold text-white">
              €{booking.total_price.toFixed(0)}
            </p>
            {isCancellable && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCancel(booking.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-7"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        {booking.notes && (
          <p className="mt-3 text-sm text-zinc-500 border-t border-zinc-800 pt-3">
            {booking.notes}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
