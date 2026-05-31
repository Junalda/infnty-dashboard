'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SubscriptionCard } from '@/components/dashboard/subscription-card'
import { ExternalLink, CreditCard } from 'lucide-react'
import type { Subscription } from '@/types'

interface BillingSectionProps {
  subscriptions: Subscription[]
}

export function BillingSection({ subscriptions }: BillingSectionProps) {
  const [loading, setLoading] = useState(false)

  const handlePortal = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400 mb-4">No active subscriptions</p>
              <Button variant="gold" asChild>
                <a href="/#pricing">Browse Plans</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map(sub => (
                <SubscriptionCard key={sub.id} subscription={sub} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400 mb-4">
            Manage your payment methods, view invoices, and update billing information through the Stripe billing portal.
          </p>
          <Button variant="secondary" onClick={handlePortal} disabled={loading}>
            <ExternalLink className="h-4 w-4" />
            {loading ? 'Opening...' : 'Open Billing Portal'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
