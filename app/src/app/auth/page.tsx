'use client'

import { useMemo, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { supabase } from '@/lib/supabase'

type AuthMode = 'magic-link' | 'password'

type ResolveResponse = {
  ok: boolean
  email?: string
  fullName?: string | null
  error?: string
}

type ResolveLoginProfileRow = {
  email: string
  full_name: string | null
}

function getRedirectTarget(path = '/portal') {
  if (typeof window === 'undefined') return `https://masculineheart.vercel.app${path}`
  return `${window.location.origin}${path}`
}

function isEmailLike(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function resolveLoginIdentifier(identifier: string): Promise<ResolveResponse> {
  const normalized = identifier.trim().toLowerCase()
  if (!normalized) {
    return { ok: false, error: 'Enter your email or full name.' }
  }

  if (isEmailLike(normalized)) {
    return { ok: true, email: normalized, fullName: null }
  }

  const { data, error } = await supabase.rpc('resolve_login_profile', { login_name: identifier })
  if (error) {
    return { ok: false, error: 'We could not look up that login name yet. Please try your email or a magic link.' }
  }

  const rows = ((data as ResolveLoginProfileRow[] | null) || []).filter((row) => row?.email)
  if (rows.length === 0) {
    return { ok: false, error: 'We could not find that name. Try your email or use a magic link.' }
  }

  const uniqueEmails = Array.from(new Set(rows.map((row) => row.email.trim().toLowerCase())))
  if (uniqueEmails.length > 1) {
    return { ok: false, error: 'More than one account matches that name. Please use your email or a magic link.' }
  }

  return {
    ok: true,
    email: uniqueEmails[0],
    fullName: rows[0]?.full_name || null,
  }
}

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('magic-link')
  const [email, setEmail] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const redirectTo = useMemo(() => getRedirectTarget('/portal'), [])
  const resetRedirectTo = useMemo(() => getRedirectTarget('/auth/reset'), [])

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    const normalizedEmail = email.trim().toLowerCase()
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      setStatus(error.message)
    } else {
      window.localStorage.setItem('mhq_email', normalizedEmail)
      setStatus('Magic link sent. Check your email and return through the link.')
    }

    setLoading(false)
  }

  async function signInWithPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    const resolved = await resolveLoginIdentifier(identifier)
    if (!resolved.ok || !resolved.email) {
      setStatus(resolved.error || 'We could not match that login name yet. Try your email or use a magic link.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: resolved.email,
      password,
    })

    if (error) {
      setStatus(error.message)
      setLoading(false)
      return
    }

    window.localStorage.setItem('mhq_email', resolved.email)
    window.location.href = '/portal'
  }

  async function sendPasswordReset() {
    setLoading(true)
    setStatus('')

    const source = identifier.trim() || email.trim()
    if (!source) {
      setStatus('Enter your email or full name first so we know where to send the password link.')
      setLoading(false)
      return
    }

    const resolved = await resolveLoginIdentifier(source)
    if (!resolved.ok || !resolved.email) {
      setStatus(resolved.error || 'We could not match that login name yet. Try your email or use a magic link.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(resolved.email, {
      redirectTo: resetRedirectTo,
    })

    if (error) {
      setStatus(error.message)
    } else {
      window.localStorage.setItem('mhq_email', resolved.email)
      setStatus('Password setup link sent. Check your email, then return through that link to set or reset your password.')
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
          <p className="mb-6 text-[rgba(244,234,220,0.72)]">
            Choose how you want to enter the course portal. You can use a magic link, or sign in with your name and password.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 rounded-[22px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.42)] p-2">
          <button
            type="button"
            onClick={() => {
              setMode('magic-link')
              setStatus('')
            }}
            className={`min-h-11 rounded-[16px] px-4 text-sm font-semibold transition ${mode === 'magic-link' ? 'bg-[linear-gradient(180deg,#efc578,#dca453)] text-[#2d1b10]' : 'text-[rgba(244,234,220,0.76)] hover:bg-[rgba(255,255,255,0.04)]'}`}
          >
            Magic link
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('password')
              setStatus('')
            }}
            className={`min-h-11 rounded-[16px] px-4 text-sm font-semibold transition ${mode === 'password' ? 'bg-[linear-gradient(180deg,#efc578,#dca453)] text-[#2d1b10]' : 'text-[rgba(244,234,220,0.76)] hover:bg-[rgba(255,255,255,0.04)]'}`}
          >
            Name + password
          </button>
        </div>

        {mode === 'magic-link' ? (
          <form onSubmit={sendMagicLink} className="space-y-4">
            <p className="text-sm text-[rgba(244,234,220,0.72)]">Use your email to receive a secure sign-in link.</p>
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
        ) : (
          <form onSubmit={signInWithPassword} className="space-y-4">
            <p className="text-sm text-[rgba(244,234,220,0.72)]">Sign in with your full name and password. Email also works if you prefer.</p>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Full name or email"
              autoComplete="username"
              className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none"
            />
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={loading} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10] disabled:opacity-80">
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
              <button type="button" disabled={loading} onClick={sendPasswordReset} className="text-sm font-semibold text-[#efc578] disabled:opacity-80">
                Set or reset password
              </button>
            </div>
          </form>
        )}

        {status ? <div className="mt-4 rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-[rgba(244,234,220,0.72)]">{status}</div> : null}

        <div className="mt-6 rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.42)] p-4 text-sm text-[rgba(244,234,220,0.72)]">
          <p className="font-semibold text-[#efc578]">Admin access</p>
          <p className="mt-1">Course admin uses a separate login page from the normal buyer portal.</p>
          <a href="/admin-login" className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(239,197,120,0.22)] px-4 font-semibold text-[#efc578] transition hover:bg-[rgba(255,255,255,0.04)]">
            Go to admin login
          </a>
        </div>
      </div>
    </main>
  )
}
