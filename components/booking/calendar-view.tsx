'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Booking } from '@/types'

interface CalendarViewProps {
  bookings: Booking[]
  onSelectDate?: (date: Date) => void
}

export function CalendarView({ bookings, onSelectDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calStart, end: calEnd })
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const getBookingsForDay = (day: Date) => {
    return bookings.filter(b => isSameDay(new Date(b.start_time), day))
  }

  const handleSelectDate = (day: Date) => {
    setSelectedDate(day)
    onSelectDate?.(day)
  }

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-white text-lg">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-zinc-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayBookings = getBookingsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const isTodayDate = isToday(day)
          const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleSelectDate(day)}
              disabled={isPast && !dayBookings.length}
              className={cn(
                'relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl text-sm transition-all',
                !isCurrentMonth && 'opacity-25',
                isPast && !dayBookings.length && 'cursor-not-allowed',
                isSelected && 'bg-rose-500 text-white',
                !isSelected && isTodayDate && 'ring-2 ring-rose-500/50',
                !isSelected && !isPast && 'hover:bg-zinc-800 cursor-pointer',
                !isSelected && 'text-zinc-300'
              )}
            >
              <span className={cn(
                'font-medium leading-none',
                isTodayDate && !isSelected && 'text-rose-400'
              )}>
                {format(day, 'd')}
              </span>
              {dayBookings.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {dayBookings.slice(0, 3).map((b, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-1 h-1 rounded-full',
                        b.status === 'confirmed' ? 'bg-emerald-400' :
                        b.status === 'pending' ? 'bg-amber-400' :
                        b.status === 'cancelled' ? 'bg-red-400' : 'bg-zinc-500'
                      )}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          Confirmed
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          Pending
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          Cancelled
        </div>
      </div>
    </div>
  )
}
