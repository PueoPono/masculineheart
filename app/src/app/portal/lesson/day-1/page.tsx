'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase, unlockAtFromNow, UNLOCK_DELAY_HOURS } from '@/lib/supabase'
import { dayOnePrompts } from '@/lib/prototype-data'

type AuthState = {
  userId: string | null
  email: string
  enrolled: boolean
}

export default function DayOneLessonPage() {
  const [videoDone, setVideoDone] = useState(false)
  const [showTask, setShowTask] = useState(false)
  const [showJournal, setShowJournal] = useState(false)
  const [complete, setComplete] = useState(false)
  const [authState, setAuthState] = useState<AuthState>({ userId: null, email: '', enrolled: false })
  const [journal, setJournal] = useState(() => (typeof window !== 'undefined' ? window.localStorage.getItem('mhq_day1_journal') || '' : ''))
  const [status, setStatus] = useState('Loading…')
  const [loading, setLoading] = useState(true)

  const unlockText = useMemo(() => `${UNLOCK_DELAY_HOURS} hours`, [])

  useEffect(() => {
    let active = true
    async function load() {
      const authRes = await supabase.auth.getUser()
      const user = authRes.data.user
      if (!user) {
        if (active) {
          setStatus('You need to log in first.')
          setLoading(false)
        }
        return
      }

      const profileRes = await supabase
        .from('profiles')
        .select('id, email, enrolled')
        .eq('id', user.id)
        .single()

      if (profileRes.error || !profileRes.data) {
        if (active) {
          setStatus('Could not load your profile yet.')
          setLoading(false)
        }
        return
      }

      const profile = profileRes.data as { id: string; email: string; enrolled: boolean }
      if (active) {
        setAuthState({ userId: profile.id, email: profile.email, enrolled: !!profile.enrolled })
        window.localStorage.setItem('mhq_email', profile.email || '')
      }

      if (!profile.enrolled) {
        if (active) {
          setStatus('Your account exists, but access is not enrolled yet.')
          setLoading(false)
        }
        return
      }

      const progressRes = await supabase
        .from('lesson_progress')
        .select('status, journal_text')
        .eq('user_id', profile.id)
        .eq('lesson_id', 'day-1')
        .maybeSingle()

      if (!progressRes.error && progressRes.data?.journal_text && active) {
        setJournal(progressRes.data.journal_text)
      }

      if (!progressRes.error && progressRes.data?.status === 'complete' && active) {
        setComplete(true)
      }

      if (active) {
        setStatus('')
        setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [])

  async function saveJournal() {
    if (!authState.userId || !authState.enrolled) {
      setStatus('Login and enrollment are required before journal entries can sync.')
      return
    }

    const payload = {
      user_id: authState.userId,
      lesson_id: 'day-1',
      status: complete ? 'complete' : 'in_progress',
      completed_at: complete ? new Date().toISOString() : null,
      unlock_at: complete ? unlockAtFromNow() : null,
      journal_text: journal || null,
    }

    const { error } = await supabase
      .from('lesson_progress')
      .upsert(payload, { onConflict: 'user_id,lesson_id' })

    if (error) {
      console.error(error)
      setStatus('Could not save journal yet.')
    } else {
      window.localStorage.setItem('mhq_day1_journal', journal)
      setStatus('Journal saved.')
    }
  }

  async function markComplete() {
    if (!authState.userId || !authState.enrolled) {
      setStatus('Login and active enrollment are required before completing a lesson.')
      return
    }

    setComplete(true)

    const unlockAt = unlockAtFromNow()
    const payload = {
      user_id: authState.userId,
      lesson_id: 'day-1',
      status: 'complete',
      completed_at: new Date().toISOString(),
      unlock_at: unlockAt,
      journal_text: journal || null,
    }

    const { error } = await supabase
      .from('lesson_progress')
      .upsert(payload, { onConflict: 'user_id,lesson_id' })

    if (error) {
      console.error(error)
      setStatus('Could not sync completion yet.')
      return
    }

    window.localStorage.setItem('mhq-day1-complete', 'true')
    window.localStorage.setItem('mhq_day1_unlock_at', unlockAt)
    setStatus('Progress synced.')

    setTimeout(() => {
      window.location.href = '/portal/complete'
    }, 220)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#0c0908,#17110f_60%,#0d0908)] px-4 py-10 text-[#f4eadc]">
        <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">Loading lesson…</div>
      </main>
    )
  }

  if (!authState.userId) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#0c0908,#17110f_60%,#0d0908)] px-4 py-12 text-[#f4eadc]">
        <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
          <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em]">Login required</h1>
          <p className="mb-6 text-[rgba(244,234,220,0.72)]">{status}</p>
          <a href="/auth" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">Go to login</a>
        </div>
      </main>
    )
  }

  if (!authState.enrolled) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#0c0908,#17110f_60%,#0d0908)] px-4 py-12 text-[#f4eadc]">
        <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
          <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em]">Access not active yet</h1>
          <p className="mb-2 text-[rgba(244,234,220,0.72)]">{authState.email}</p>
          <p className="text-[rgba(244,234,220,0.72)]">Your account is recognized, but course access is not enrolled yet.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0c0908,#17110f_60%,#0d0908)] px-4 py-10 text-[#f4eadc]">
      <div className="mx-auto w-full max-w-4xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Day 1 · Unlock the Heart</p>
        <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em]">Welcome to the Heart</h1>
        <p className="mb-2 text-[rgba(244,234,220,0.72)]">{authState.email}</p>
        <p className="mb-6 text-[rgba(244,234,220,0.72)]">The quest begins. First watch the intro video, then day 1 video. Last honestly spend time with the reflection questions that follow.</p>

        <div className="mb-6 flex h-80 items-end rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-cover bg-center p-4" style={{ backgroundImage: "linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02)), url('https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80')" }}>
          <span className="rounded-[14px] border border-[rgba(239,197,120,0.14)] bg-[rgba(16,12,10,0.55)] px-3 py-2">Video area · Intro + Day 1 lesson</span>
        </div>

        <div className="flex flex-col items-start gap-3">
          <button onClick={() => setVideoDone(true)} disabled={videoDone} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 text-base font-bold text-[#f4eadc] disabled:opacity-80">
            {videoDone ? 'Video complete ✓' : 'Video complete'}
          </button>

          <button onClick={() => setShowTask(!showTask)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-4 text-base font-bold text-[#2d1b10]">
            {showTask ? 'Hide reflection/task' : 'Reveal reflection/task'}
          </button>

          {showTask && (
            <div className="w-full rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5">
              <h2 className="mb-3 text-2xl font-semibold">Reflect on these questions</h2>
              <ol className="mb-4 list-decimal space-y-3 pl-5 text-[rgba(244,234,220,0.72)]">
                {dayOnePrompts.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ol>
              <p className="text-[rgba(244,234,220,0.72)]"><strong className="text-[#f4eadc]">Best practice</strong><br />Get a pen and piece of paper. Write what comes. The act of writing these questions down, even if you write nothing but the question, will start a process within.</p>
            </div>
          )}

          <button onClick={() => setShowJournal(!showJournal)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 text-base font-bold text-[#f4eadc]">
            Digital journal
          </button>

          {showJournal && (
            <div className="w-full rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5">
              <p className="mb-3 text-[rgba(244,234,220,0.72)]">For your convenience, you can also write some answers here, and your journaling will be emailed to you at the end.</p>
              <textarea value={journal} onChange={(e) => setJournal(e.target.value)} className="min-h-44 w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] p-4 text-[#f4eadc] outline-none" placeholder="Write what comes..." />
              <div className="mt-3">
                <button onClick={saveJournal} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 text-base font-bold text-[#f4eadc]">Save journal</button>
              </div>
            </div>
          )}

          <button onClick={markComplete} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-4 text-base font-bold text-[#2d1b10]">
            {complete ? 'Mark day complete ✓' : 'Mark day complete'}
          </button>

          {status ? (
            <div className="mt-2 w-full rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5 text-[rgba(244,234,220,0.72)]">
              {status}
            </div>
          ) : null}

          {complete && !status ? (
            <div className="mt-2 w-full rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5 text-[rgba(244,234,220,0.72)]">
              Next lesson unlocks in {unlockText}.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
