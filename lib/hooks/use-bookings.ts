'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Booking } from '@/types'

export function useBookings(userId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    setLoading(true)

    const { data, error } = await supabase
      .from('bookings')
      .select('*, room:rooms(*)')
      .eq('user_id', userId)
      .order('start_time', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setBookings(data || [])
    }

    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const cancelBooking = async (bookingId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', bookingId)

    if (!error) {
      await fetchBookings()
    }
    return { error }
  }

  return { bookings, loading, error, refetch: fetchBookings, cancelBooking }
}

export function useAllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchAll() {
      const { data } = await supabase
        .from('bookings')
        .select('*, room:rooms(*), user:profiles(*)')
        .order('start_time', { ascending: false })
        .limit(100)

      setBookings(data || [])
      setLoading(false)
    }

    fetchAll()
  }, [])

  return { bookings, loading }
}
