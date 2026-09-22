import { NextResponse } from 'next/server'
import { getBaseUrl, getStripePriceId, getStripePriceLookupKey, stripeConfig } from '@/lib/stripe-config'
import { isValidTimeZone, normalizeTimeZone } from '@/lib/unlock-schedule'

export const runtime = 'nodejs'

type CheckoutUiMode = 'embedded' | 'hosted'

type ResolvedPromotion = {
  code: string
  id: string
}

function isValidEmail(value: unknown) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function getUiMode(value: unknown): CheckoutUiMode {
  return value === 'hosted' ? 'hosted' : 'embedded'
}

function normalizePromotionCode(value: unknown) {
  if (typeof value !== 'string') return undefined

  const code = value.trim().toUpperCase()
  return code ? code : undefined
}

function getTimeZone(value: unknown) {
  const timeZone = normalizeTimeZone(value)
  return timeZone && isValidTimeZone(timeZone) ? timeZone : undefined
}

function getTimeZoneConfirmed(value: unknown) {
  return value === true
}

export async function POST(request: Request) {
  const directPriceId = getStripePriceId()
  const priceLookupKey = getStripePriceLookupKey()

  if (!process.env.STRIPE_SECRET_KEY || (!directPriceId && !priceLookupKey)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'stripe_not_configured',
        message:
          'Stripe is not configured yet. Add STRIPE_SECRET_KEY plus STRIPE_PRICE_ID or STRIPE_PRICE_LOOKUP_KEY to enable checkout.',
      },
      { status: 400 },
    )
  }

  const body = await request.json().catch(() => ({}))
  const email = isValidEmail(body?.email) ? String(body.email).trim().toLowerCase() : undefined
  const uiMode = getUiMode(body?.uiMode)
  const promotionCode = normalizePromotionCode(body?.promotionCode)
  const timeZone = getTimeZone(body?.timeZone)
  const timeZoneConfirmed = getTimeZoneConfirmed(body?.timeZoneConfirmed) && !!timeZone

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const baseUrl = getBaseUrl()
  let priceId = directPriceId

  if (!priceId && priceLookupKey) {
    const prices = await stripe.prices.list({
      lookup_keys: [priceLookupKey],
      active: true,
      limit: 1,
    })

    priceId = prices.data[0]?.id || ''
  }

  if (!priceId) {
    return NextResponse.json(
      {
        ok: false,
        error: 'stripe_price_not_found',
        message: 'Stripe could not find an active price for this product yet.',
      },
      { status: 400 },
    )
  }

  let resolvedPromotion: ResolvedPromotion | undefined

  if (promotionCode) {
    const promotionCodes = await stripe.promotionCodes.list({
      code: promotionCode,
      active: true,
      limit: 1,
    })

    const match = promotionCodes.data[0]

    if (!match) {
      return NextResponse.json(
        {
          ok: false,
          error: 'promotion_code_not_found',
          message: `Stripe could not find an active promotion code named ${promotionCode}.`,
        },
        { status: 400 },
      )
    }

    resolvedPromotion = {
      code: promotionCode,
      id: match.id,
    }
  }

  const sessionBase = {
    mode: stripeConfig.mode,
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    customer_creation: 'always' as const,
    ...(resolvedPromotion
      ? { discounts: [{ promotion_code: resolvedPromotion.id }] }
      : { allow_promotion_codes: true }),
    metadata: {
      product_slug: stripeConfig.productSlug,
      product: stripeConfig.productName,
      buyer_email: email || '',
      promotion_code: resolvedPromotion?.code || '',
      time_zone: timeZone || '',
      time_zone_confirmed: timeZoneConfirmed ? 'true' : 'false',
    },
  }

  if (uiMode === 'hosted') {
    const hostedSession = await stripe.checkout.sessions.create({
      ...sessionBase,
      success_url: `${baseUrl}${stripeConfig.successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${stripeConfig.cancelPath}`,
    })

    return NextResponse.json({ ok: true, uiMode, url: hostedSession.url })
  }

  const embeddedSession = await stripe.checkout.sessions.create({
    ...sessionBase,
    ui_mode: 'embedded_page',
    return_url: `${baseUrl}${stripeConfig.successPath}?session_id={CHECKOUT_SESSION_ID}`,
    redirect_on_completion: 'if_required',
  })

  if (!embeddedSession.client_secret) {
    return NextResponse.json(
      {
        ok: false,
        error: 'stripe_client_secret_missing',
        message: 'Stripe did not return an embedded checkout client secret.',
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    ok: true,
    uiMode,
    clientSecret: embeddedSession.client_secret,
    sessionId: embeddedSession.id,
  })
}
