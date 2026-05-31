'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getMonthYear } from '@/lib/utils'
import type { HourBalance } from '@/types'

export function useHours(userId?: string) {
  const [balance, setBalance] = useState<HourBalance | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const supabase = createClient()

    async function fetchBalance() {
      const monthYear = getMonthYear()
      const { data } = await supabase
        .from('hour_balances')
        .select('*')
        .eq('user_id', userId)
        .eq('month_year', monthYear)
        .single()

      setBalance(data)
      setLoading(false)
    }

    fetchBalance()
  }, [userId])

  const totalAvailable = balance
    ? balance.included_hours + balance.rollover_hours - balance.used_hours
    : 0

  const percentUsed = balance && balance.included_hours > 0
    ? Math.min(100, (balance.used_hours / (balance.included_hours + balance.rollover_hours)) * 100)
    : 0

  return { balance, loading, totalAvailable, percentUsed }
}
