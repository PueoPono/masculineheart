# Stripe setup for Masculine Heart Quest

## Best payment method for this product

For this product, the best primary payment flow is **Stripe Checkout** for a **one-time payment**.

Why this is the best fit:
- hosted checkout means less custom payment code and lower maintenance
- Stripe can automatically offer the fastest supported methods for the buyer and browser
- cards, Link, Apple Pay, and Google Pay can all flow through the same checkout when enabled in Stripe
- promo codes are already supported in the app checkout session
- webhook-based enrollment fits the current Supabase portal model

## Recommended payment methods to enable in Stripe

### Primary
- Cards
- Link
- Apple Pay
- Google Pay

### Optional, only if wanted for conversion testing
Enable these from the Stripe Dashboard only if they fit Pauko's audience and region:
- Afterpay / Clearpay
- Klarna
- Cash App Pay

For a guided digital course, I recommend **starting with cards + Link + Apple Pay + Google Pay** and adding buy-now-pay-later methods only if Pauko explicitly wants them.

## Current app implementation status

Already wired in the app:
- `POST /api/checkout` creates a Stripe Checkout session
- landing page purchase form posts buyer email into checkout
- `POST /api/stripe/webhook` listens for `checkout.session.completed`
- successful webhook enrollment creates or updates the buyer in Supabase and unlocks Day 1
- Stripe package is installed and `npm run build` passes locally

Additional setup added in code:
- checkout can now use either `STRIPE_PRICE_ID` or `STRIPE_PRICE_LOOKUP_KEY`
- checkout forces Stripe customer creation for cleaner records
- webhook now logs successful enrollment details server-side

## Environment variables required

Set these in local `.env.local` and in Vercel project env:

- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID` **or** `STRIPE_PRICE_LOOKUP_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

Already documented in `.env.local.example`.

## Stripe dashboard steps

1. Create or choose the Stripe account for this product.
2. Create a **Product** named `Masculine Heart Quest`.
3. Create a **one-time Price** for that product in USD.
4. Either copy the generated `price_...` ID, or set a stable lookup key such as `masculine-heart-quest`.
5. Enable desired payment methods in Stripe Dashboard.
6. In Stripe, create a webhook endpoint pointing to:
   - local/dev: `http://localhost:3000/api/stripe/webhook`
   - production: `https://masculineheart.vercel.app/api/stripe/webhook`
7. Subscribe the webhook to at least:
   - `checkout.session.completed`
8. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## Vercel env values to set

Production/project env should include:
- `NEXT_PUBLIC_SITE_URL=https://masculineheart.vercel.app`
- `STRIPE_SECRET_KEY=...`
- `STRIPE_PRICE_ID=price_...` or `STRIPE_PRICE_LOOKUP_KEY=masculine-heart-quest`
- `STRIPE_WEBHOOK_SECRET=whsec_...`
- `SUPABASE_SERVICE_ROLE_KEY=...`

## What still depends on Pauko

I cannot finish the live account linkage without Pauko providing or entering these values in the correct account/project context:
- the Stripe account to use
- the one-time product price amount
- the Stripe secret key for that account
- the Stripe price ID or chosen lookup key
- the Stripe webhook secret after webhook creation
- confirmation of the production site URL/domain if it will differ from `masculineheart.vercel.app`

## Recommended first live configuration

- one-time payment
- USD
- cards + Link + Apple Pay + Google Pay
- Stripe-hosted checkout
- promo codes enabled
- webhook enrollment into Supabase

That is the simplest, strongest launch-ready path for this digital course/portal.
