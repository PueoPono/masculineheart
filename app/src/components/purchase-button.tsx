'use client'

import { useRouter } from 'next/navigation'

type Props = {
  className?: string
  label?: string
  priceLabel?: string | null
  helperText?: string
  showMeta?: boolean
}

export function PurchaseButton({
  className = '',
  label = 'Start the quest',
  priceLabel,
  helperText = 'Email for purchase receipt and portal access',
  showMeta = true,
}: Props) {
  const router = useRouter()

  function beginCheckout() {
    router.push('/checkout')
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <button
        type="button"
        onClick={beginCheckout}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-6 font-bold text-[#2d1b10] shadow-[0_18px_30px_rgba(160,112,46,0.25)] disabled:opacity-80"
      >
        {label}
      </button>
      <p className="text-sm text-[rgba(244,234,220,0.62)]">{helperText}</p>
      {showMeta ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[rgba(244,234,220,0.58)]">
          <span>{priceLabel ? `Live price: ${priceLabel}` : 'Secure on-site checkout with Stripe'}</span>
          <span>Single purchase · portal access</span>
        </div>
      ) : null}
    </div>
  )
}
