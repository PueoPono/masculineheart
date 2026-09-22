'use client'

import { useEffect, useMemo, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { supabase } from '@/lib/supabase'

function getPortalHref() {
  if (typeof window === 'undefined') return 'https://masculineheart.vercel.app/portal'
  return `${window.location.origin}/portal`
}

export default function AuthResetPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('Checking your reset link…')
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const portalHref = useMemo(() => getPortalHref(), [])

  useEffect(() => {
    let active = true

    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (!active) return
      if (data.session?.user) {
        setReady(true)
        setStatus('Set your new password below.')
      } else {
        setReady(false)
        setStatus('Open this page through the password email link so we can securely set your password.')
      }
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session?.user) {
        setReady(true)
        setStatus('Set your new password below.')
      }
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function updatePassword(event: React.FormEvent) {
    event.preventDefault()

    if (password.length < 8) {
      setStatus('Use at least 8 characters for your password.')
      return
    }

    if (password !== confirmPassword) {
      setStatus('Your password entries do not match yet.')
      return
    }

    setLoading(true)
    setStatus('Saving your new password…')

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setStatus(error.message)
      setLoading(false)
      return
    }

    setStatus('Password saved. You can open the portal now.')
    setLoading(false)
  }

  return (
    <main className="min-h-screen px-4 py-12 text-[#f4eadc]">
      <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <HeartCornerMark />
        <div className="pr-16 md:pr-24">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Password</p>
          <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">Set your quest password</h1>
          <p className="mb-6 text-[rgba(244,234,220,0.72)]">This page lets you create or reset the password for your course login.</p>
        </div>

        <form onSubmit={updatePassword} className="space-y-4">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            disabled={!ready || loading}
            className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none disabled:opacity-60"
          />
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm password"
            autoComplete="new-password"
            disabled={!ready || loading}
            className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none disabled:opacity-60"
          />
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={!ready || loading} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10] disabled:opacity-80">
              {loading ? 'Saving…' : 'Save password'}
            </button>
            <a href={portalHref} className="text-sm font-semibold text-[#efc578]">Open portal</a>
          </div>
        </form>

        {status ? <div className="mt-4 rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-[rgba(244,234,220,0.72)]">{status}</div> : null}
      </div>
    </main>
  )
}
