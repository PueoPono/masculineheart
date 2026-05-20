export const stripeConfig = {
  productName: 'Masculine Heart Quest',
  mode: 'payment' as const,
  currency: 'usd',
  successPath: '/purchase/success',
  cancelPath: '/purchase/cancel',
}

export function getStripePriceId() {
  return process.env.STRIPE_PRICE_ID || ''
}

export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
