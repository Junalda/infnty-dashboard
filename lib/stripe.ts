import Stripe from 'stripe'

let _stripe: Stripe | null = null
export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
      apiVersion: '2026-05-27.dahlia',
      typescript: true,
    })
  }
  return _stripe
}

export const stripe = {
  checkout: { sessions: { create: (...args: Parameters<Stripe['checkout']['sessions']['create']>) => getStripe().checkout.sessions.create(...args) } },
  billingPortal: { sessions: { create: (...args: Parameters<Stripe['billingPortal']['sessions']['create']>) => getStripe().billingPortal.sessions.create(...args) } },
  webhooks: { constructEvent: (body: string, sig: string, secret: string) => getStripe().webhooks.constructEvent(body, sig, secret) },
  subscriptions: { retrieve: (id: string) => getStripe().subscriptions.retrieve(id) },
}

export const PRICING_PLANS = {
  rehearsal: [
    {
      name: 'Starter',
      tier: 'starter',
      price: 200,
      hours: 40,
      features: [
        '40 hours/month rehearsal time',
        'Standard rooms',
        'Online booking',
        'Email support',
        'Up to 25% hour rollover',
      ],
    },
    {
      name: 'Performer',
      tier: 'performer',
      price: 300,
      hours: 65,
      popular: true,
      features: [
        '65 hours/month rehearsal time',
        'Priority room access',
        'Online booking',
        'Priority support',
        'Up to 25% hour rollover',
        'Locker storage',
      ],
    },
    {
      name: 'Unlimited',
      tier: 'unlimited',
      price: 400,
      hours: null,
      features: [
        'Unlimited rehearsal hours',
        'All rooms access',
        'Online booking',
        'Dedicated support',
        'Free hour rollover',
        'Locker storage',
        'Guest passes (2/month)',
      ],
    },
  ],
  content: [
    {
      name: 'Starter',
      tier: 'starter',
      price: 750,
      features: [
        '2 content shoots/month',
        'Basic editing',
        'Social media package',
        '3 revisions per video',
        'Content calendar',
      ],
    },
    {
      name: 'Growth',
      tier: 'growth',
      price: 1500,
      popular: true,
      features: [
        '4 content shoots/month',
        'Advanced editing + color grade',
        'Multi-platform optimization',
        'Unlimited revisions',
        'Content strategy session',
        'Analytics report',
      ],
    },
    {
      name: 'Authority',
      tier: 'authority',
      price: 2700,
      features: [
        '8 content shoots/month',
        'Full production team',
        'All platforms covered',
        'Unlimited revisions',
        'Dedicated content strategist',
        'Monthly performance review',
        'Priority scheduling',
      ],
    },
  ],
  soundlab: [
    {
      name: 'Song Starter',
      tier: 'song_starter',
      price: 300,
      features: [
        '1 song production/month',
        'AI-assisted production',
        'Professional mix',
        '2 revisions',
        'Stems delivery',
      ],
    },
    {
      name: 'Artist Builder',
      tier: 'artist_builder',
      price: 750,
      popular: true,
      features: [
        '3 songs/month',
        'Full AI + live production',
        'Mastering included',
        'Unlimited revisions',
        'Distribution ready files',
        'Artist development session',
      ],
    },
    {
      name: 'Artist Accelerator',
      tier: 'artist_accelerator',
      price: 1500,
      features: [
        '6 songs/month',
        'Full production suite',
        'Mastering + stems',
        'Unlimited revisions',
        'Distribution support',
        'Monthly strategy session',
        'Priority scheduling',
        'Music video consultation',
      ],
    },
  ],
}

export async function createCheckoutSession({
  priceId,
  userId,
  customerEmail,
  successUrl,
  cancelUrl,
}: {
  priceId: string
  userId: string
  customerEmail: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card', 'ideal'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: customerEmail,
    metadata: { userId },
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: { userId },
    },
  })
  return session
}

export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return session
}
