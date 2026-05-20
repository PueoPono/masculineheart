import { NextResponse } from 'next/server'
import { getBaseUrl, getStripePriceId, stripeConfig } from '@/lib/stripe-config'

function isValidEmail(value: unknown) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
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

  const body = await request.json().catch(() => ({}))
  const email = isValidEmail(body?.email) ? String(body.email).trim().toLowerCase() : undefined

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const baseUrl = getBaseUrl()

  const session = await stripe.checkout.sessions.create({
    mode: stripeConfig.mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}${stripeConfig.successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}${stripeConfig.cancelPath}`,
    customer_email: email,
    allow_promotion_codes: true,
    metadata: {
      product: stripeConfig.productName,
      buyer_email: email || '',
    },
  })

  return NextResponse.json({ ok: true, url: session.url })
}
