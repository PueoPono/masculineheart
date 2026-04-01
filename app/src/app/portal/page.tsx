'use client'

import { useEffect, useState } from 'react'
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
          setStatus('You need to log in first.')
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

      if (profileRes.error) {
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
    return () => { active = false }
  }, [])

  if (!loading && !authReady) {
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

  if (!loading && authReady && !enrolled) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#0c0908,#17110f_60%,#0d0908)] px-4 py-12 text-[#f4eadc]">
        <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
          <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em]">Access not active yet</h1>
          <p className="mb-2 text-[rgba(244,234,220,0.72)]">{email}</p>
          <p className="text-[rgba(244,234,220,0.72)]">Your account is recognized, but enrollment has not been activated yet.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0c0908,#17110f_60%,#0d0908)] px-4 py-10 text-[#f4eadc]">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Quest Dashboard</p>
            <h1 className="text-5xl font-semibold tracking-[-0.04em]">Portal</h1>
            <p className="mt-2 text-[rgba(244,234,220,0.72)]">{email}</p>
          </div>
          <a href="/portal/lesson/day-1" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">Continue today’s lesson</a>
        </header>

        {status ? (
          <div className="mb-6 rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-5 text-[rgba(244,234,220,0.78)]">{status}</div>
        ) : null}

        <section className="rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
          <div className="mb-5">
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">Quest map</h2>
            <p className="text-[rgba(244,234,220,0.72)]">Live lessons + user-specific progress.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
            {lessons.map((lesson, idx) => {
              const p = progress[lesson.id]
              const state = p?.status === 'complete' ? 'done' : idx === 0 ? 'active' : 'locked'
              return (
                <div key={lesson.id} className={`min-h-28 rounded-[18px] border p-4 ${state === 'done' ? 'border-[rgba(228,183,103,0.18)] bg-[rgba(131,95,34,0.18)]' : state === 'active' ? 'border-[#dca453] bg-[rgba(220,164,83,0.12)]' : 'border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] opacity-80'}`}>
                  <small className="mb-1 block text-[#efc578]">Day {lesson.day_number}</small>
                  <strong>{lesson.title}</strong>
                  {p?.status === 'complete' ? <div className="mt-2 text-sm text-[rgba(244,234,220,0.72)]">Complete ✓</div> : null}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
