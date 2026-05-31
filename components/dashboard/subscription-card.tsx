import { formatDate, getPillarLabel, getPillarColor, getStatusColor, cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import type { Subscription } from '@/types'

interface SubscriptionCardProps {
  subscription: Subscription
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const plan = subscription.plan
  const pillarColor = getPillarColor(plan?.pillar ?? '')
  const statusStyle = getStatusColor(subscription.status)

  const StatusIcon =
    subscription.status === 'active' ? CheckCircle2
    : subscription.status === 'trialing' ? Clock
    : XCircle

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className={cn('text-xs font-semibold mb-1', pillarColor)}>
              {getPillarLabel(plan?.pillar ?? '')}
            </p>
            <h3 className="font-bold text-white">{plan?.name ?? 'Unknown Plan'}</h3>
          </div>
          <div className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', statusStyle)}>
            <StatusIcon className="h-3 w-3" />
            {subscription.status}
          </div>
        </div>

        <div className="text-2xl font-bold text-white mb-1">
          €{plan?.price_monthly ?? 0}
          <span className="text-sm font-normal text-zinc-500">/mo</span>
        </div>

        {plan?.included_hours && (
          <p className="text-sm text-zinc-400 mb-4">
            {plan.included_hours}h included per month
          </p>
        )}

        <div className="border-t border-zinc-800 pt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Current period</span>
            <span className="text-zinc-300">
              {formatDate(subscription.current_period_start)} – {formatDate(subscription.current_period_end)}
            </span>
          </div>
        </div>

        {plan?.features && plan.features.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {plan.features.slice(0, 3).map((feature: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
