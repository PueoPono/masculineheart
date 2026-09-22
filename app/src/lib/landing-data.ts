import { getBaseUrl, getStripePriceId } from '@/lib/stripe-config'

export type LandingPriceInfo = {
  formatted: string | null
  amount: number | null
  currency: string | null
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

export async function getLandingPrice(): Promise<LandingPriceInfo> {
  const priceId = getStripePriceId()
  if (!process.env.STRIPE_SECRET_KEY || !priceId) {
    return { formatted: null, amount: null, currency: null }
  }

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const price = await stripe.prices.retrieve(priceId)

    if (!price.active || price.unit_amount == null || !price.currency) {
      return { formatted: null, amount: null, currency: null }
    }

    const amount = price.unit_amount / 100
    return {
      formatted: formatCurrency(amount, price.currency),
      amount,
      currency: price.currency.toUpperCase(),
    }
  } catch {
    return { formatted: null, amount: null, currency: null }
  }
}

export function getAbsoluteAssetUrl(path: string) {
  return `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
}
