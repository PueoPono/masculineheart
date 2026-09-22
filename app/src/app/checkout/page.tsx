import Link from 'next/link'
import { EmbeddedCheckoutShell } from '@/components/embedded-checkout-shell'

type CheckoutPageProps = {
  searchParams?: Promise<{
    email?: string
    promo?: string
  }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const resolvedParams = (await searchParams) || {}
  const email = resolvedParams.email?.trim() || ''
  const promo = resolvedParams.promo?.trim().toUpperCase() || ''

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(54,89,69,0.28),transparent_0),linear-gradient(180deg,#060504,#0d0f0b_20%,#14110f_68%,#090807)] px-4 py-10 text-[#f4eadc] md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[rgba(244,234,220,0.72)]">
          <Link href="/" className="hover:text-white">
            ← Back to landing page
          </Link>
          <Link href="/portal" className="hover:text-white">
            Already purchased? Open the portal
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className="rounded-[28px] border border-[rgba(228,183,103,0.14)] bg-[linear-gradient(180deg,rgba(18,20,17,0.92),rgba(20,15,12,0.82))] p-6 shadow-[0_22px_54px_rgba(0,0,0,0.28)] md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#efc578]">On-site checkout</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74] md:text-5xl">
              Complete your entry into the quest
            </h1>
            <p className="mt-5 max-w-xl text-[rgba(244,234,220,0.78)]">
              This page keeps the Stripe checkout experience inside the Masculine Heart site while Stripe still handles payment security, promotion codes, and confirmation.
            </p>

            <div className="mt-8 rounded-[22px] border border-[rgba(239,197,120,0.12)] bg-[rgba(11,9,8,0.42)] p-5 text-sm text-[rgba(244,234,220,0.74)]">
              <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">Purchase details</p>
              <dl className="mt-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <dt>Course</dt>
                  <dd className="text-right text-white">Masculine Heart Quest</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt>Checkout style</dt>
                  <dd className="text-right text-white">Embedded Stripe Checkout</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt>Email</dt>
                  <dd className="text-right text-white">{email || 'Collected during checkout'}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt>Promotion codes</dt>
                  <dd className="text-right text-white">{promo || 'Accepted in the embedded form'}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt>Drip timing</dt>
                  <dd className="text-right text-white">Midnight in a confirmed time zone, otherwise 20 hours after completion</dd>
                </div>
              </dl>
            </div>
          </div>

          <div>
            <EmbeddedCheckoutShell initialEmail={email} promotionCode={promo} />
          </div>
        </section>
      </div>
    </main>
  )
}
