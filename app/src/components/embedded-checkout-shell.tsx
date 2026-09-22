'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { getDetectedTimeZone, isValidTimeZone, normalizeTimeZone } from '@/lib/unlock-schedule'

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

type EmbeddedCheckoutShellProps = {
  initialEmail?: string
  promotionCode?: string
}

export function EmbeddedCheckoutShell({ initialEmail = '', promotionCode = '' }: EmbeddedCheckoutShellProps) {
  const [checkoutError, setCheckoutError] = useState('')
  const [complete, setComplete] = useState(false)
  const [timeZone, setTimeZone] = useState(() => getDetectedTimeZone() || '')
  const [timeZoneConfirmed, setTimeZoneConfirmed] = useState(false)

  const normalizedTimeZone = normalizeTimeZone(timeZone)
  const timeZoneIsValid = !!normalizedTimeZone && isValidTimeZone(normalizedTimeZone)

  const options = useMemo(
    () => ({
      fetchClientSecret: async () => {
        setCheckoutError('')

        if (timeZoneConfirmed && !timeZoneIsValid) {
          const message = 'Please confirm a valid time zone or leave the confirmation unchecked.'
          setCheckoutError(message)
          throw new Error(message)
        }

        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            email: initialEmail || undefined,
            uiMode: 'embedded',
            promotionCode: promotionCode || undefined,
            timeZone: normalizedTimeZone || undefined,
            timeZoneConfirmed,
          }),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || !data.clientSecret) {
          const message = data.message || 'Checkout is not available yet.'
          setCheckoutError(message)
          throw new Error(message)
        }

        return data.clientSecret as string
      },
      onComplete: () => {
        setComplete(true)
      },
    }),
    [initialEmail, normalizedTimeZone, promotionCode, timeZoneConfirmed, timeZoneIsValid],
  )

  if (!publishableKey || !stripePromise) {
    return (
      <div className="rounded-[24px] border border-[rgba(239,197,120,0.14)] bg-[rgba(18,13,11,0.74)] p-6 text-[rgba(244,234,220,0.78)] shadow-[0_18px_44px_rgba(0,0,0,0.24)]">
        <p className="text-sm uppercase tracking-[0.16em] text-[#efc578]">Stripe setup needed</p>
        <p className="mt-3 text-sm leading-7">
          Embedded checkout needs <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> configured in the environment before this page can load the on-site Stripe form.
        </p>
      </div>
    )
  }

  if (complete) {
    return (
      <div className="rounded-[24px] border border-[rgba(239,197,120,0.14)] bg-[rgba(18,13,11,0.74)] p-6 text-[rgba(244,234,220,0.78)] shadow-[0_18px_44px_rgba(0,0,0,0.24)]">
        <p className="text-sm uppercase tracking-[0.16em] text-[#efc578]">Purchase complete</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Your access is being opened.</h2>
        <p className="mt-3 text-sm leading-7">
          Stripe marked the embedded checkout as complete. If your portal access does not appear immediately, give the enrollment webhook a moment and then open the portal.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/portal"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-6 font-bold text-[#2d1b10] shadow-[0_18px_30px_rgba(160,112,46,0.25)]"
          >
            Open the portal
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-6 font-bold text-[#f4eadc]"
          >
            Return home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-[rgba(239,197,120,0.14)] bg-[rgba(18,13,11,0.74)] p-5 text-sm text-[rgba(244,234,220,0.8)] shadow-[0_18px_44px_rgba(0,0,0,0.24)]">
        <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">Optional unlock timing</p>
        <label className="mt-4 block">
          <span className="mb-2 block text-[rgba(244,234,220,0.72)]">Time zone</span>
          <input
            value={timeZone}
            onChange={(event) => setTimeZone(event.target.value)}
            placeholder="America/Los_Angeles"
            className="w-full rounded-[16px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[#f4eadc] outline-none placeholder:text-[rgba(244,234,220,0.38)]"
          />
        </label>
        <label className="mt-4 flex items-start gap-3 rounded-[18px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4">
          <input
            type="checkbox"
            checked={timeZoneConfirmed}
            onChange={(event) => setTimeZoneConfirmed(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[rgba(228,183,103,0.34)] bg-transparent"
          />
          <span>
            Confirm time zone. <span className="text-[rgba(244,234,220,0.66)]">(so we can unlock lessons at midnight in your time zone, otherwise it&apos;s a 20 hour unlock after completion)</span>
          </span>
        </label>
        {normalizedTimeZone ? (
          <p className="mt-3 text-xs text-[rgba(244,234,220,0.62)]">
            {timeZoneIsValid ? `Time zone ready: ${normalizedTimeZone}` : 'That time zone was not recognized. You can still continue without confirming it.'}
          </p>
        ) : (
          <p className="mt-3 text-xs text-[rgba(244,234,220,0.62)]">Leave this blank if you prefer the standard 20-hour unlock after completion.</p>
        )}
      </div>
      {checkoutError ? (
        <div className="rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-sm text-[rgba(244,234,220,0.8)]">
          {checkoutError}
        </div>
      ) : null}
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <div className="overflow-hidden rounded-[24px] border border-[rgba(228,183,103,0.16)] bg-[rgba(11,9,8,0.6)] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
          <EmbeddedCheckout />
        </div>
      </EmbeddedCheckoutProvider>
    </div>
  )
}
