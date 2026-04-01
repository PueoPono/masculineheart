'use client'

import { useMemo, useState } from 'react'
import { supabase, unlockAtFromNow, UNLOCK_DELAY_HOURS } from '@/lib/supabase'
import { dayOnePrompts } from '@/lib/prototype-data'

export default function DayOneLessonPage() {
  const [videoDone, setVideoDone] = useState(false)
  const [showTask, setShowTask] = useState(false)
  const [showJournal, setShowJournal] = useState(false)
  const [complete, setComplete] = useState(false)
  const [email, setEmail] = useState(() => (typeof window !== 'undefined' ? window.localStorage.getItem('mhq_email') || '' : ''))
  const [journal, setJournal] = useState(() => (typeof window !== 'undefined' ? window.localStorage.getItem('mhq_day1_journal') || '' : ''))
  const [status, setStatus] = useState('')

  const unlockText = useMemo(() => `${UNLOCK_DELAY_HOURS} hours`, [])


  async function saveJournal() {
    if (!email.trim()) {
      setStatus('Enter your email first so your journal can be saved later.')
      return
    }
    window.localStorage.setItem('mhq_email', email)
    window.localStorage.setItem('mhq_day1_journal', journal)
    setStatus('Journal saved locally. Supabase save will be fully wired in the next pass.')
  }

  async function markComplete() {
    setComplete(true)
    if (!email.trim()) {
      setStatus('Day marked complete locally. Add your email next so progress can sync across devices.')
      return
    }

    window.localStorage.setItem('mhq_email', email)

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      setStatus('Auth is not wired yet. Completion is saved locally for now.')
      window.localStorage.setItem('mhq-day1-complete', 'true')
      setTimeout(() => {
        window.location.href = '/portal/complete'
      }, 220)
      return
    }

    const userId = userData.user.id
    const payload = {
      user_id: userId,
      lesson_id: 'day-1',
      status: 'complete',
      completed_at: new Date().toISOString(),
      unlock_at: unlockAtFromNow(),
      journal_text: journal || null,
    }

    const { error } = await supabase
      .from('lesson_progress')
      .upsert(payload, { onConflict: 'user_id,lesson_id' })

    if (error) {
      console.error(error)
      setStatus('Could not sync progress yet. Saved locally for now.')
      window.localStorage.setItem('mhq-day1-complete', 'true')
      window.localStorage.setItem('mhq_day1_unlock_at', unlockAtFromNow())
    } else {
      setStatus('Progress synced.')
      window.localStorage.setItem('mhq-day1-complete', 'true')
      window.localStorage.setItem('mhq_day1_unlock_at', unlockAtFromNow())
    }

    setTimeout(() => {
      window.location.href = '/portal/complete'
    }, 220)
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0c0908,#17110f_60%,#0d0908)] px-4 py-10 text-[#f4eadc]">
      <div className="mx-auto w-full max-w-4xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Day 1 · Unlock the Heart</p>
        <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em]">Welcome to the Heart</h1>
        <p className="mb-6 text-[rgba(244,234,220,0.72)]">The quest begins. First watch the intro video, then day 1 video. Last honestly spend time with the reflection questions that follow.</p>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm text-[rgba(244,234,220,0.72)]">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none"
          />
        </label>

        <div className="mb-6 flex h-80 items-end rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-cover bg-center p-4" style={{ backgroundImage: "linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02)), url('https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80')" }}>
          <span className="rounded-[14px] border border-[rgba(239,197,120,0.14)] bg-[rgba(16,12,10,0.55)] px-3 py-2">Video area · Intro + Day 1 lesson</span>
        </div>

        <div className="flex flex-col items-start gap-3">
          <button onClick={() => setVideoDone(true)} disabled={videoDone} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 text-base font-bold text-[#f4eadc] disabled:opacity-80" title="Use this after you’ve watched the intro and day 1 video.">
            {videoDone ? 'Video complete ✓' : 'Video complete'}
          </button>

          <button onClick={() => setShowTask(!showTask)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-4 text-base font-bold text-[#2d1b10]" title="Reveal the reflection questions and best-practice guidance.">
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

          <button onClick={() => setShowJournal(!showJournal)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 text-base font-bold text-[#f4eadc]" title="Open an in-page writing area if you want to journal here instead.">
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

          <button onClick={markComplete} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-4 text-base font-bold text-[#2d1b10]" title="Mark this day complete and move into the waiting/unlock state.">
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
