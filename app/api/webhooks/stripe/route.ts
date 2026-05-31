import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const supabase = await createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (!userId) break

      if (session.mode === 'subscription' && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        const priceId = subscription.items.data[0]?.price.id

        if (!priceId) break

        // Find matching plan
        const { data: plan } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('stripe_price_id', priceId)
          .single()

        if (!plan) break

        // Upsert subscription — cast to any to handle Stripe SDK version differences
        const sub = subscription as unknown as {
          id: string; status: string; customer: string;
          current_period_start: number; current_period_end: number;
        }
        await supabase.from('subscriptions').upsert({
          user_id: userId,
          plan_id: plan.id,
          status: sub.status === 'active' ? 'active' : sub.status,
          stripe_subscription_id: sub.id,
          stripe_customer_id: sub.customer,
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        }, { onConflict: 'stripe_subscription_id' })

        // Store Stripe customer ID on profile
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: sub.customer })
          .eq('id', userId)

        // Record payment
        if (session.payment_intent) {
          await supabase.from('payments').insert({
            user_id: userId,
            amount: (session.amount_total ?? 0) / 100,
            currency: session.currency?.toUpperCase() ?? 'EUR',
            status: 'paid',
            payment_method: session.payment_method_types?.[0] ?? 'card',
            stripe_session_id: session.id,
            description: `Subscription: ${plan.name}`,
          })
        }
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub2 = event.data.object as unknown as {
        id: string; status: string; current_period_start: number; current_period_end: number
      }
      await supabase
        .from('subscriptions')
        .update({
          status: sub2.status === 'active' ? 'active' : sub2.status,
          current_period_start: new Date(sub2.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub2.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', sub2.id)
      break
    }

    case 'customer.subscription.deleted': {
      const sub3 = event.data.object as unknown as { id: string }
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', sub3.id)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as unknown as { subscription?: string }
      if (invoice.subscription) {
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', invoice.subscription)
      }
      break
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const userId = paymentIntent.metadata?.userId

      if (userId) {
        await supabase
          .from('payments')
          .update({ status: 'paid' })
          .eq('stripe_payment_intent_id', paymentIntent.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
