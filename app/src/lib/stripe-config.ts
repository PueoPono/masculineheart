export const stripeConfig = {
  productName: 'Masculine Heart Quest',
  productSlug: 'masculine-heart-quest',
  mode: 'payment' as const,
  currency: 'usd',
  successPath: '/purchase/success',
  cancelPath: '/purchase/cancel',
}

export function getStripePriceId() {
  return process.env.STRIPE_PRICE_ID || ''
}

export function getStripePriceLookupKey() {
  return process.env.STRIPE_PRICE_LOOKUP_KEY || ''
}

export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
