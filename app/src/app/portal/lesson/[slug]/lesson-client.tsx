'use client'

import { useEffect, useMemo, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { getLessonBySlug, getNextLesson, getPreviousLesson } from '@/lib/course-content'
import { supabase, unlockAtFromNow, UNLOCK_DELAY_HOURS } from '@/lib/supabase'

type AuthState = { userId: string | null; email: string; enrolled: boolean }
type ProgressRow = { status: string; unlock_at: string | null; journal_text: string | null }

function isPreviousUnlocked(progress: ProgressRow | null) {
  if (!progress?.unlock_at) return false
  return new Date(progress.unlock_at).getTime() <= Date.now()
}

export function LessonClient({ slug }: { slug: string }) {
  const lesson = getLessonBySlug(slug)
  const nextLesson = lesson ? getNextLesson(lesson) : null
  const previousLesson = lesson ? getPreviousLesson(lesson) : null
  const [videoDone, setVideoDone] = useState(false)
  const [showTask, setShowTask] = useState(true)
  const [showJournal, setShowJournal] = useState(false)
  const [complete, setComplete] = useState(false)
  const [authState, setAuthState] = useState<AuthState>({ userId: null, email: '', enrolled: false })
  const [journal, setJournal] = useState('')
  const [status, setStatus] = useState('Loading…')
  const [loading, setLoading] = useState(true)
  const [locked, setLocked] = useState(false)

  const unlockText = useMemo(() => `${UNLOCK_DELAY_HOURS} hours`, [])

  useEffect(() => {
    if (!lesson) return

    const currentLesson = lesson
    let active = true
    async function load() {
      try {
        const authRes = await supabase.auth.getUser()
        const user = authRes.data.user
        if (!user) {
          if (active) {
            setStatus('You need to log in first.')
            setLoading(false)
          }
          return
        }

        const profileRes = await supabase.from('profiles').select('id, email, enrolled').eq('id', user.id).maybeSingle()
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
          setJournal(window.localStorage.getItem(`mhq_${currentLesson.id}_journal`) || '')
        }

        if (!profile.enrolled) {
          if (active) {
            setStatus('Your account exists, but access is not enrolled yet.')
            setLoading(false)
          }
          return
        }

        if (previousLesson) {
          const previousRes = await supabase
            .from('lesson_progress')
            .select('status, unlock_at, journal_text')
            .eq('user_id', profile.id)
            .eq('lesson_id', previousLesson.id)
            .maybeSingle()
          if (previousRes.error || !isPreviousUnlocked((previousRes.data || null) as ProgressRow | null)) {
            if (active) {
              setLocked(true)
              setStatus(`Day ${currentLesson.dayNumber} unlocks after Day ${previousLesson.dayNumber} is completed and its integration window has passed.`)
              setLoading(false)
            }
            return
          }
        }

        const progressRes = await supabase
          .from('lesson_progress')
          .select('status, journal_text, unlock_at')
          .eq('user_id', profile.id)
          .eq('lesson_id', currentLesson.id)
          .maybeSingle()

        if (!progressRes.error && progressRes.data?.journal_text && active) setJournal(progressRes.data.journal_text)
        if (!progressRes.error && progressRes.data?.status === 'complete' && active) setComplete(true)

        if (active) {
          setStatus('')
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        if (active) {
          setStatus('Lesson loading hit an error.')
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      active = false
    }
  }, [lesson, previousLesson])

  async function saveJournal(nextStatus = complete ? 'complete' : 'in_progress') {
    if (!lesson || !authState.userId || !authState.enrolled) {
      setStatus('Login and enrollment are required before journal entries can sync.')
      return false
    }

    const payload = {
      user_id: authState.userId,
      lesson_id: lesson.id,
      status: nextStatus,
      completed_at: nextStatus === 'complete' ? new Date().toISOString() : null,
      unlock_at: nextStatus === 'complete' ? unlockAtFromNow() : null,
      journal_text: journal || null,
    }

    const { error } = await supabase.from('lesson_progress').upsert(payload, { onConflict: 'user_id,lesson_id' })
    if (error) {
      console.error(error)
      setStatus('Could not save progress yet.')
      return false
    }

    window.localStorage.setItem(`mhq_${lesson.id}_journal`, journal)
    setStatus(nextStatus === 'complete' ? 'Progress synced.' : 'Journal saved.')
    return true
  }

  async function markComplete() {
    setComplete(true)
    const saved = await saveJournal('complete')
    if (!saved) return
    setTimeout(() => {
      window.location.href = nextLesson ? `/portal/complete?next=${nextLesson.slug}` : '/portal/complete'
    }, 220)
  }

  if (!lesson) {
    return (
      <main className="min-h-screen px-4 py-12 text-[#f4eadc]"><div className="mx-auto max-w-2xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.84)] p-8">Lesson not found. <a className="text-[#efc578]" href="/portal">Return to portal.</a></div></main>
    )
  }

  if (loading) {
    return <main className="min-h-screen px-4 py-10 text-[#f4eadc]"><div className="relative mx-auto w-full max-w-3xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(19,24,20,0.94),rgba(20,15,12,0.84))] p-8"><HeartCornerMark />Loading lesson…</div></main>
  }

  if (!authState.userId || !authState.enrolled || locked) {
    return (
      <main className="min-h-screen px-4 py-12 text-[#f4eadc]">
        <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(19,24,20,0.94),rgba(20,15,12,0.84))] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
          <HeartCornerMark />
          <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em]">{locked ? 'Lesson locked' : authState.userId ? 'Access not active yet' : 'Login required'}</h1>
          <p className="mb-6 text-[rgba(244,234,220,0.72)]">{status}</p>
          <a href={authState.userId ? '/portal' : '/auth'} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">{authState.userId ? 'Return to portal' : 'Go to login'}</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-10 text-[#f4eadc]">
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <HeartCornerMark />
        <div className="pr-16 md:pr-24">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Day {lesson.dayNumber} · {lesson.arc}</p>
          <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">{lesson.title}</h1>
          <p className="mb-2 text-[rgba(244,234,220,0.72)]">{authState.email}</p>
          <p className="mb-6 max-w-2xl text-[rgba(244,234,220,0.72)]">{lesson.theme}</p>
        </div>

        <div className="mb-6 flex h-80 items-end rounded-[24px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(11,18,13,0.16),rgba(10,9,8,0.4)),url('https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-4">
          <span className="rounded-[14px] border border-[rgba(239,197,120,0.14)] bg-[rgba(16,12,10,0.55)] px-3 py-2">Video area · {lesson.videoLabel}</span>
        </div>

        <div className="flex flex-col items-start gap-3">
          <button onClick={() => setVideoDone(true)} disabled={videoDone} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 text-base font-bold text-[#f4eadc] disabled:opacity-80">{videoDone ? 'Video complete ✓' : 'Video complete'}</button>
          <button onClick={() => setShowTask(!showTask)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-4 text-base font-bold text-[#2d1b10]">{showTask ? 'Hide reflection/task' : 'Reveal reflection/task'}</button>

          {showTask && (
            <div className="w-full rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[linear-gradient(180deg,rgba(31,43,34,0.44),rgba(31,23,18,0.56))] p-5">
              <h2 className="mb-3 text-2xl font-semibold">Reflect on these questions</h2>
              <ol className="mb-4 list-decimal space-y-3 pl-5 text-[rgba(244,234,220,0.72)]">{lesson.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ol>
              <p className="text-[rgba(244,234,220,0.72)]"><strong className="text-[#f4eadc]">Best practice</strong><br />{lesson.practice}</p>
            </div>
          )}

          <button onClick={() => setShowJournal(!showJournal)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 text-base font-bold text-[#f4eadc]">Digital journal</button>

          {showJournal && (
            <div className="w-full rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[linear-gradient(180deg,rgba(31,43,34,0.44),rgba(31,23,18,0.56))] p-5">
              <p className="mb-3 text-[rgba(244,234,220,0.72)]">For your convenience, you can write here and sync your notes to your portal progress.</p>
              <textarea value={journal} onChange={(e) => setJournal(e.target.value)} className="min-h-44 w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] p-4 text-[#f4eadc] outline-none" placeholder="Write what comes..." />
              <div className="mt-3"><button onClick={() => saveJournal()} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 text-base font-bold text-[#f4eadc]">Save journal</button></div>
            </div>
          )}

          <button onClick={markComplete} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-4 text-base font-bold text-[#2d1b10]">{complete ? 'Mark day complete ✓' : 'Mark day complete'}</button>
          {status ? <div className="mt-2 w-full rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5 text-[rgba(244,234,220,0.72)]">{status}</div> : null}
          {complete && <div className="mt-2 w-full rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5 text-[rgba(244,234,220,0.72)]">{nextLesson ? `Next lesson unlocks in ${unlockText}.` : 'Quest complete. Return to the portal to review your full map.'}</div>}
        </div>
      </div>
    </main>
  )
}
