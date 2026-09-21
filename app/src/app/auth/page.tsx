'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { HeartCornerMark } from '@/components/heart-mark'
import { supabase } from '@/lib/supabase'

function safeNext(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/portal'
  return value
}

function getRedirectTarget(nextPath: string) {
  if (typeof window === 'undefined') return `https://masculineheart.vercel.app/auth?next=${encodeURIComponent(nextPath)}`
  return `${window.location.origin}/auth?next=${encodeURIComponent(nextPath)}`
}

async function establishAdminSessionIfNeeded(nextPath: string) {
  if (nextPath !== '/admin' && !nextPath.startsWith('/admin/')) return true
  const session = await supabase.auth.getSession()
  const token = session.data.session?.access_token
  if (!token) return false
  const response = await fetch('/api/admin/session', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.ok
}

function AuthContent() {
  const searchParams = useSearchParams()
  const nextPath = useMemo(() => safeNext(searchParams.get('next')), [searchParams])
  const redirectTo = useMemo(() => getRedirectTarget(nextPath), [nextPath])
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    async function finishExistingSession() {
      const session = await supabase.auth.getSession()
      if (!active || !session.data.session) return
      if (nextPath === '/admin' || nextPath.startsWith('/admin/')) {
        const ok = await establishAdminSessionIfNeeded(nextPath)
        if (!active) return
        if (!ok) {
          setStatus('Signed in, but this account is not configured for admin access.')
          return
        }
      }
      window.location.assign(nextPath)
    }
    finishExistingSession()
    return () => {
      active = false
    }
  }, [nextPath])

  async function signInWithPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    const identity = email.trim()

    if ((nextPath === '/admin' || nextPath.startsWith('/admin/')) && !identity.includes('@')) {
      const form = new FormData()
      form.set('username', identity)
      form.set('password', password)
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        body: form,
        redirect: 'manual',
      })

      if (response.type === 'opaqueredirect' || response.status === 0 || response.status === 303 || response.ok) {
        window.location.assign(nextPath)
        return
      }

      setStatus('Admin username or password was not accepted.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email: identity, password })
    if (error) {
      setStatus(error.message)
      setLoading(false)
      return
    }

    window.localStorage.setItem('mhq_email', identity)
    if (nextPath === '/admin' || nextPath.startsWith('/admin/')) {
      const ok = await establishAdminSessionIfNeeded(nextPath)
      if (!ok) {
        setStatus('Password accepted, but this account is not configured for admin access.')
        setLoading(false)
        return
      }
    }
    window.location.assign(nextPath)
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    const identity = email.trim()
    const { error } = await supabase.auth.signInWithOtp({
      email: identity,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      setStatus(error.message)
    } else {
      window.localStorage.setItem('mhq_email', identity)
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
          <p className="mb-6 text-[rgba(244,234,220,0.72)]">Sign in with your password or send a magic link. Admin access also starts here.</p>
        </div>

        <div className="mb-5 flex gap-2 rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] p-1">
          <button type="button" onClick={() => setMode('password')} className={`flex-1 rounded-full px-4 py-2 font-bold ${mode === 'password' ? 'bg-[linear-gradient(180deg,#efc578,#dca453)] text-[#2d1b10]' : 'text-[#f4eadc]'}`}>Password</button>
          <button type="button" onClick={() => setMode('magic')} className={`flex-1 rounded-full px-4 py-2 font-bold ${mode === 'magic' ? 'bg-[linear-gradient(180deg,#efc578,#dca453)] text-[#2d1b10]' : 'text-[#f4eadc]'}`}>Magic link</button>
        </div>

        <form onSubmit={mode === 'password' ? signInWithPassword : sendMagicLink} className="space-y-4">
          <input
            type={mode === 'password' ? 'text' : 'email'}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={mode === 'password' && (nextPath === '/admin' || nextPath.startsWith('/admin/')) ? 'Email or admin username' : 'you@example.com'}
            className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none"
          />
          {mode === 'password' ? (
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none"
            />
          ) : null}
          <button type="submit" disabled={loading} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10] disabled:opacity-80">
            {loading ? (mode === 'password' ? 'Signing in…' : 'Sending…') : (mode === 'password' ? 'Sign in' : 'Send magic link')}
          </button>
        </form>
        {nextPath === '/admin' || nextPath.startsWith('/admin/') ? <p className="mt-4 text-sm text-[rgba(244,234,220,0.62)]">Admin sign-in will open the admin editor after your account is verified.</p> : null}
        {status ? <div className="mt-4 rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-[rgba(244,234,220,0.72)]">{status}</div> : null}
      </div>
    </main>
  )
}


export default function AuthPage() {
  return (
    <Suspense fallback={<main className="min-h-screen px-4 py-12 text-[#f4eadc]" />}>
      <AuthContent />
    </Suspense>
  )
}
