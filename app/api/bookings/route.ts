import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addMinutes } from 'date-fns'
import { sendBookingConfirmation } from '@/lib/resend'
import { getMonthYear } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get('room_id')
  const date = searchParams.get('date')

  if (roomId && date) {
    // Return bookings for a specific room + date (for availability check)
    const start = new Date(`${date}T00:00:00Z`)
    const end = new Date(`${date}T23:59:59Z`)

    const { data, error } = await supabase
      .from('bookings')
      .select('start_time, end_time, buffer_end_time')
      .eq('room_id', roomId)
      .neq('status', 'cancelled')
      .gte('start_time', start.toISOString())
      .lte('start_time', end.toISOString())

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  // Return all bookings for the current user
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let query = supabase
    .from('bookings')
    .select('*, room:rooms(*), user:profiles!bookings_user_id_fkey(full_name, email)')
    .order('start_time', { ascending: false })

  if (profile?.role !== 'admin') {
    query = query.eq('user_id', user.id)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    room_id,
    start_time,
    end_time,
    hours_used,
    booking_type,
    total_price,
    notes,
  } = body

  if (!room_id || !start_time || !end_time || !hours_used) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const startDate = new Date(start_time)
  const endDate = new Date(end_time)

  if (startDate >= endDate) {
    return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 })
  }

  if (startDate < new Date()) {
    return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 })
  }

  const bufferEndTime = addMinutes(endDate, 15)

  // Check hour balance for subscription bookings
  if (booking_type === 'subscription') {
    const monthYear = getMonthYear(startDate)
    const { data: balance } = await supabase
      .from('hour_balances')
      .select('*')
      .eq('user_id', user.id)
      .eq('month_year', monthYear)
      .single()

    if (!balance) {
      return NextResponse.json({ error: 'No hour balance for this month. Please check your subscription.' }, { status: 400 })
    }

    const available = balance.rollover_hours + balance.included_hours - balance.used_hours
    if (available < hours_used) {
      return NextResponse.json({
        error: `Insufficient hours. You have ${available.toFixed(1)}h available but need ${hours_used}h.`,
      }, { status: 400 })
    }
  }

  // Create booking (DB constraint handles double-booking prevention)
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      room_id,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      buffer_end_time: bufferEndTime.toISOString(),
      status: 'confirmed',
      booking_type,
      hours_used,
      total_price: total_price ?? 0,
      notes,
    })
    .select('*, room:rooms(*)')
    .single()

  if (error) {
    if (error.code === '23P01') {
      return NextResponse.json({
        error: 'This time slot conflicts with an existing booking. Please choose a different time.',
      }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Deduct hours from balance for subscription bookings
  if (booking_type === 'subscription') {
    const monthYear = getMonthYear(startDate)
    const { data: balance } = await supabase
      .from('hour_balances')
      .select('used_hours')
      .eq('user_id', user.id)
      .eq('month_year', monthYear)
      .single()
    if (balance) {
      await supabase
        .from('hour_balances')
        .update({ used_hours: balance.used_hours + hours_used, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('month_year', monthYear)
    }
  }

  // Send confirmation email
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  if (profile && booking.room) {
    const startFormatted = new Date(start_time).toLocaleString('nl-NL', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Amsterdam' })
    const endFormatted = new Date(end_time).toLocaleString('nl-NL', { timeStyle: 'short', timeZone: 'Europe/Amsterdam' })

    await sendBookingConfirmation({
      to: profile.email,
      name: profile.full_name || 'there',
      roomName: booking.room.name,
      startTime: startFormatted,
      endTime: endFormatted,
      bookingId: booking.id,
    }).catch(() => { /* non-blocking */ })

    // Log email notification
    await supabase.from('email_notifications').insert({
      user_id: user.id,
      type: 'booking_confirmation',
      subject: `Booking Confirmed – ${booking.room.name}`,
      status: 'sent',
    })
  }

  return NextResponse.json(booking, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, status } = body

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
  }

  // Fetch the booking to verify ownership / refund hours
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, room:rooms(*)')
    .eq('id', id)
    .single()

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'

  if (booking.user_id !== user.id && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: updated, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Refund subscription hours on cancellation
  if (status === 'cancelled' && booking.booking_type === 'subscription') {
    const monthYear = getMonthYear(new Date(booking.start_time))
    const { data: balance } = await supabase
      .from('hour_balances')
      .select('used_hours')
      .eq('user_id', booking.user_id)
      .eq('month_year', monthYear)
      .single()

    if (balance) {
      await supabase
        .from('hour_balances')
        .update({
          used_hours: Math.max(0, balance.used_hours - booking.hours_used),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', booking.user_id)
        .eq('month_year', monthYear)
    }
  }

  return NextResponse.json(updated)
}
