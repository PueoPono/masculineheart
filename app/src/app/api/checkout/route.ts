import { NextResponse } from 'next/server'
import { getBaseUrl, getStripePriceId, stripeConfig } from '@/lib/stripe-config'

export async function POST() {
  const priceId = getStripePriceId()

  if (!process.env.STRIPE_SECRET_KEY || !priceId) {
    return NextResponse.json(
      {
        ok: false,
        error: 'stripe_not_configured',
        message: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID to enable checkout.',
      },
      { status: 400 },
    )
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const baseUrl = getBaseUrl()

  const session = await stripe.checkout.sessions.create({
    mode: stripeConfig.mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}${stripeConfig.successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}${stripeConfig.cancelPath}`,
    metadata: {
      product: stripeConfig.productName,
    },
  })

  return NextResponse.json({ ok: true, url: session.url })
}
