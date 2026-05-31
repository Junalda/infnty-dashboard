import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getMonthYear } from '@/lib/utils'
import { format, subMonths, addMonths, endOfMonth } from 'date-fns'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id') || user.id
  const monthYear = searchParams.get('month') || getMonthYear()

  // Only admins can query other users
  if (userId !== user.id) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const { data, error } = await supabase
    .from('hour_balances')
    .select('*')
    .eq('user_id', userId)
    .eq('month_year', monthYear)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || null)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Only admins can manually adjust hours
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { user_id, month_year, included_hours, used_hours, rollover_hours } = body

  if (!user_id || !month_year) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('hour_balances')
    .upsert({
      user_id,
      month_year,
      included_hours: included_hours ?? 0,
      used_hours: used_hours ?? 0,
      rollover_hours: rollover_hours ?? 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,month_year' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// Called at month start to provision hours and calculate rollover
export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const targetUserId: string = body.user_id

  const now = new Date()
  const currentMonthYear = getMonthYear(now)
  const prevMonthYear = format(subMonths(now, 1), 'yyyy-MM')

  // Fetch active subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, plan:subscription_plans(*)')
    .eq('user_id', targetUserId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!subscription) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 404 })
  }

  const includedHours = subscription.plan?.included_hours ?? 0

  // Calculate rollover from previous month
  const { data: prevBalance } = await supabase
    .from('hour_balances')
    .select('*')
    .eq('user_id', targetUserId)
    .eq('month_year', prevMonthYear)
    .single()

  let rolloverHours = 0
  if (prevBalance && includedHours > 0) {
    const unused = Math.max(0, prevBalance.included_hours - prevBalance.used_hours)
    const maxRollover = prevBalance.included_hours * 0.25
    rolloverHours = Math.min(unused, maxRollover)
  }

  const rolloverExpiry = rolloverHours > 0
    ? endOfMonth(addMonths(now, 1)).toISOString()
    : null

  const { data, error } = await supabase
    .from('hour_balances')
    .upsert({
      user_id: targetUserId,
      month_year: currentMonthYear,
      included_hours: includedHours,
      used_hours: 0,
      rollover_hours: rolloverHours,
      rollover_expiry: rolloverExpiry,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,month_year' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
