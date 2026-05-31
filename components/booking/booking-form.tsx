'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addMinutes, format, addHours, setHours, setMinutes, startOfDay } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Euro } from 'lucide-react'
import type { Room, HourBalance } from '@/types'

const bookingSchema = z.object({
  room_id: z.string().min(1, 'Please select a room'),
  date: z.string().min(1, 'Please select a date'),
  start_hour: z.string().min(1, 'Please select a start time'),
  duration: z.string().min(1, 'Please select duration'),
  notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingFormProps {
  userId: string
  hourBalance?: HourBalance | null
  onSuccess?: () => void
}

export function BookingForm({ userId, hourBalance, onSuccess }: BookingFormProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [cost, setCost] = useState({ subscriptionHours: 0, extraHours: 0, extraCost: 0 })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  const watchRoomId = watch('room_id')
  const watchDuration = watch('duration')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('rooms').select('*').eq('is_active', true).then(({ data }) => {
      setRooms(data || [])
    })
  }, [])

  useEffect(() => {
    if (watchRoomId) {
      const room = rooms.find(r => r.id === watchRoomId)
      setSelectedRoom(room || null)
    }
  }, [watchRoomId, rooms])

  useEffect(() => {
    if (watchDuration && selectedRoom) {
      const hours = parseFloat(watchDuration)
      const availableSubHours = hourBalance
        ? Math.max(0, hourBalance.rollover_hours + hourBalance.included_hours - hourBalance.used_hours)
        : 0
      const subHours = Math.min(hours, availableSubHours)
      const extraHours = Math.max(0, hours - subHours)
      setCost({
        subscriptionHours: subHours,
        extraHours,
        extraCost: extraHours * 25,
      })
    }
  }, [watchDuration, selectedRoom, hourBalance])

  const timeSlots = Array.from({ length: 24 }, (_, i) => ({
    value: String(i),
    label: `${String(i).padStart(2, '0')}:00`,
  }))

  const durations = [
    { value: '1', label: '1 hour' },
    { value: '1.5', label: '1.5 hours' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours' },
  ]

  const today = format(new Date(), 'yyyy-MM-dd')

  const onSubmit = async (data: BookingFormData) => {
    setLoading(true)
    setError(null)

    try {
      const startTime = new Date(`${data.date}T${data.start_hour.padStart(2, '0')}:00:00`)
      const durationHours = parseFloat(data.duration)
      const endTime = addHours(startTime, durationHours)
      const bufferEndTime = addMinutes(endTime, 15)

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: data.room_id,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          buffer_end_time: bufferEndTime.toISOString(),
          hours_used: durationHours,
          booking_type: cost.subscriptionHours > 0 ? 'subscription' : 'loose',
          total_price: cost.extraCost,
          notes: data.notes,
          user_id: userId,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to create booking')
      }

      setSuccess(true)
      onSuccess?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
          <p className="text-zinc-400">Your session has been booked. Check your email for confirmation.</p>
          <Button className="mt-6" onClick={() => { setSuccess(false) }}>Book Another</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Room selection */}
      <div className="space-y-2">
        <Label>Room</Label>
        <Select onValueChange={(val) => setValue('room_id', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a room..." />
          </SelectTrigger>
          <SelectContent>
            {rooms.map(room => (
              <SelectItem key={room.id} value={room.id}>
                {room.name} — €{room.hourly_rate}/hr
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.room_id && <p className="text-xs text-rose-400">{errors.room_id.message}</p>}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label>Date</Label>
        <input
          type="date"
          min={today}
          className="flex h-10 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          {...register('date')}
        />
        {errors.date && <p className="text-xs text-rose-400">{errors.date.message}</p>}
      </div>

      {/* Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Select onValueChange={(val) => setValue('start_hour', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Hour..." />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(slot => (
                <SelectItem key={slot.value} value={slot.value}>{slot.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.start_hour && <p className="text-xs text-rose-400">{errors.start_hour.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Duration</Label>
          <Select onValueChange={(val) => setValue('duration', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Duration..." />
            </SelectTrigger>
            <SelectContent>
              {durations.map(d => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.duration && <p className="text-xs text-rose-400">{errors.duration.message}</p>}
        </div>
      </div>

      {/* Cost preview */}
      {watchDuration && selectedRoom && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 space-y-2">
            <p className="text-sm font-semibold text-zinc-300">Booking Summary</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Duration</span>
                <span className="text-white">{watchDuration}h</span>
              </div>
              {cost.subscriptionHours > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subscription hours</span>
                  <span className="text-emerald-400">-{cost.subscriptionHours}h</span>
                </div>
              )}
              {cost.extraHours > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Extra hours (€25/hr)</span>
                  <span className="text-rose-400">€{cost.extraCost}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t border-zinc-800 pt-2">
                <span className="text-white">Total charge</span>
                <span className="text-white">€{cost.extraCost}</span>
              </div>
              <p className="text-xs text-zinc-500">+ 15 min buffer included after session</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label>Notes (optional)</Label>
        <Textarea
          placeholder="Any special requirements..."
          {...register('notes')}
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Creating booking...' : 'Confirm Booking'}
      </Button>
    </form>
  )
}
