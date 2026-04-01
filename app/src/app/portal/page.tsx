'use client'

import { useEffect, useMemo, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { supabase } from '@/lib/supabase'

type LessonRow = {
  id: string
  day_number: number
  arc: string
  title: string
  slug: string
}

type ProgressRow = {
  lesson_id: string
  status: string
  unlock_at: string | null
  completed_at: string | null
}

type ProfileRow = {
  id: string
  email: string
  enrolled: boolean
}

function isUnlocked(dayNumber: number, progress: Record<string, ProgressRow>) {
  if (dayNumber === 1) return true
  const previous = progress[`day-${dayNumber - 1}`]
  if (!previous?.unlock_at) return false
  return new Date(previous.unlock_at).getTime() <= Date.now()
}

function getStateForLesson(lesson: LessonRow, progress: Record<string, ProgressRow>) {
  const row = progress[lesson.id]
  if (row?.status === 'complete') return 'done'
  if (isUnlocked(lesson.day_number, progress)) return 'active'
  return 'locked'
}

export default function PortalPage() {
  const [email, setEmail] = useState('')
  const [lessons, setLessons] = useState<LessonRow[]>([])
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({})
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [authReady, setAuthReady] = useState(false)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      const authRes = await supabase.auth.getUser()
      const user = authRes.data.user

      if (!user) {
        if (active) {
          setStatus('Login required.')
          setLoading(false)
          setAuthReady(false)
        }
        return
      }

      if (active) {
        setAuthReady(true)
        setEmail(user.email || '')
        window.localStorage.setItem('mhq_email', user.email || '')
      }

      const profileRes = await supabase
        .from('profiles')
        .select('id, email, enrolled')
        .eq('id', user.id)
        .single()

      if (profileRes.error || !profileRes.data) {
        console.error(profileRes.error)
        if (active) {
          setStatus('Could not load your profile yet.')
          setLoading(false)
        }
        return
      }

      const profile = profileRes.data as ProfileRow
      if (active) setEnrolled(!!profile.enrolled)

      if (!profile.enrolled) {
        if (active) {
          setStatus('Your account exists, but course access is not enrolled yet.')
          setLoading(false)
        }
        return
      }

      const lessonsRes = await supabase
        .from('lessons')
        .select('id, day_number, arc, title, slug')
        .eq('is_published', true)
        .order('day_number', { ascending: true })

      if (lessonsRes.error) {
        console.error(lessonsRes.error)
        if (active) {
          setStatus('Lessons are not loading yet.')
          setLoading(false)
        }
        return
      }

      if (active) setLessons((lessonsRes.data || []) as LessonRow[])

      const progressRes = await supabase
        .from('lesson_progress')
        .select('lesson_id, status, unlock_at, completed_at')
        .eq('user_id', user.id)

      if (progressRes.error) {
        console.error(progressRes.error)
      } else if (active) {
        const map: Record<string, ProgressRow> = {}
        for (const row of progressRes.data || []) map[row.lesson_id] = row as ProgressRow
        setProgress(map)
      }

      if (active) {
        setStatus('')
        setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const completionCount = useMemo(() => Object.values(progress).filter((p) => p.status === 'complete').length, [progress])
  const nextAvailable = useMemo(() => {
    const next = lessons.find((lesson) => getStateForLesson(lesson, progress) === 'active')
    return next || null
  }, [lessons, progress])

  if (!loading && !authReady) {
    return (
      <main className="min-h-screen px-4 py-12 text-[#f4eadc]">
        <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(19,24,20,0.94),rgba(20,15,12,0.84))] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
          <HeartCornerMark />
          <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em]">Login required</h1>
          <p className="mb-6 text-[rgba(244,234,220,0.72)]">{status}</p>
          <a href="/auth" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">Go to login</a>
        </div>
      </main>
    )
  }

  if (!loading && authReady && !enrolled) {
    return (
      <main className="min-h-screen px-4 py-12 text-[#f4eadc]">
        <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(19,24,20,0.94),rgba(20,15,12,0.84))] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
          <HeartCornerMark />
          <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em]">Access not active yet</h1>
          <p className="mb-2 text-[rgba(244,234,220,0.72)]">{email}</p>
          <p className="mb-6 text-[rgba(244,234,220,0.72)]">Your account is recognized, but enrollment has not been activated yet.</p>
          <div className="rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-[rgba(244,234,220,0.72)]">
            If this should already be active, contact support and we’ll enable your access.
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-10 text-[#f4eadc]">
      <div className="mx-auto w-full max-w-6xl">
        <section className="relative overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.34)] md:p-8">
          <HeartCornerMark />
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 pr-16 md:pr-24">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Quest Dashboard</p>
              <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[#e6bd74]">Portal</h1>
              <p className="mt-2 text-[rgba(244,234,220,0.72)]">{email}</p>
            </div>
            <div className="rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] px-4 py-3 text-sm text-[rgba(244,234,220,0.78)]">
              <strong className="text-[#f4eadc]">Progress</strong>
              <br />
              {completionCount} / 21 days complete
            </div>
          </div>

          {nextAvailable ? (
            <div className="mb-6 rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(32,44,35,0.52),rgba(20,15,12,0.78))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
              <div className="text-xs uppercase tracking-[0.16em] text-[#efc578]">Next available</div>
              <div className="mt-1 text-2xl font-semibold">Day {nextAvailable.day_number} · {nextAvailable.title}</div>
              <div className="mt-2 text-[rgba(244,234,220,0.72)]">Continue the quest where it is currently open.</div>
              <div className="mt-4">
                <a href={nextAvailable.id === 'day-1' ? '/portal/lesson/day-1' : '/portal/locked'} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">Open current lesson</a>
              </div>
            </div>
          ) : null}

          {status ? (
            <div className="mb-6 rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-5 text-[rgba(244,234,220,0.78)]">{status}</div>
          ) : null}

          <section className="rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
            <div className="mb-5">
              <h2 className="text-3xl font-semibold tracking-[-0.03em]">Quest map</h2>
              <p className="text-[rgba(244,234,220,0.72)]">Live lessons + progress state. Locked lessons open as unlock times are reached.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
              {lessons.map((lesson) => {
                const p = progress[lesson.id]
                const state = getStateForLesson(lesson, progress)
                const href = state === 'locked' ? '/portal/locked' : lesson.id === 'day-1' ? '/portal/lesson/day-1' : '/portal/locked'
                return (
                  <a
                    key={lesson.id}
                    href={href}
                    className={`min-h-28 rounded-[18px] border p-4 no-underline transition-transform duration-150 hover:-translate-y-0.5 ${state === 'done' ? 'border-[rgba(228,183,103,0.18)] bg-[rgba(131,95,34,0.18)] text-[#f4eadc]' : state === 'active' ? 'border-[#dca453] bg-[rgba(51,82,63,0.28)] text-[#f4eadc]' : 'border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] text-[#f4eadc] opacity-80'}`}
                  >
                    <small className="mb-1 block text-[#efc578]">Day {lesson.day_number}</small>
                    <strong>{lesson.title}</strong>
                    {p?.status === 'complete' ? <div className="mt-2 text-sm text-[rgba(244,234,220,0.72)]">Complete ✓</div> : state === 'locked' ? <div className="mt-2 text-sm text-[rgba(244,234,220,0.72)]">Locked</div> : <div className="mt-2 text-sm text-[rgba(244,234,220,0.72)]">Available</div>}
                  </a>
                )
              })}
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}
