'use client'

import { useMemo, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { supabase } from '@/lib/supabase'

function getRedirectTarget() {
  if (typeof window === 'undefined') return 'https://masculineheart.vercel.app/portal'
  return window.location.hostname === 'localhost'
    ? 'http://localhost:3000/portal'
    : 'https://masculineheart.vercel.app/portal'
}

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const redirectTo = useMemo(() => getRedirectTarget(), [])

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      setStatus(error.message)
    } else {
      window.localStorage.setItem('mhq_email', email)
      setStatus('Magic link sent. Check your email and return through the link.')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen px-4 py-12 text-[#f4eadc]">
      <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <HeartCornerMark />
        <div className="pr-16 md:pr-24">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Access</p>
          <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">Enter the Quest</h1>
          <p className="mb-6 text-[rgba(244,234,220,0.72)]">Use your email to receive a magic link. Once authenticated, the portal will load your progress and quest state.</p>
        </div>
        <form onSubmit={sendMagicLink} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none"
          />
          <button type="submit" disabled={loading} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10] disabled:opacity-80">
            {loading ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
        {status ? <div className="mt-4 rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-[rgba(244,234,220,0.72)]">{status}</div> : null}
      </div>
    </main>
  )
}
