'use client'

import { useState } from 'react'

export function PurchaseButton({ className = '', label = 'Purchase access' }: { className?: string; label?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function beginCheckout(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim() || undefined }),
      })
      const data = await response.json()
      if (!response.ok || !data.url) {
        setStatus(data.message || 'Checkout is not available yet.')
        return
      }
      window.location.href = data.url
    } catch (err) {
      console.error(err)
      setStatus('Checkout could not start. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={beginCheckout} className={`space-y-3 ${className}`}>
      <label className="block text-sm text-[rgba(244,234,220,0.72)]" htmlFor="purchase-email">
        Email for purchase receipt and portal access
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="purchase-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-h-12 flex-1 rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-5 text-[#f4eadc] outline-none placeholder:text-[rgba(244,234,220,0.42)]"
        />
        <button type="submit" disabled={loading} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-6 font-bold text-[#2d1b10] shadow-[0_18px_30px_rgba(160,112,46,0.25)] disabled:opacity-80">
          {loading ? 'Opening checkout…' : label}
        </button>
      </div>
      {status ? <div className="rounded-[16px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-3 text-sm text-[rgba(244,234,220,0.78)]">{status}</div> : null}
    </form>
  )
}
