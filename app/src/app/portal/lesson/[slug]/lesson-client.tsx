'use client'

import { useEffect, useMemo, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { AdminMenu } from '@/components/admin-menu'
import { useSiteContent } from '@/lib/site-content-store'
import { supabase } from '@/lib/supabase'
import { getLessonHeaderBackgroundStyle, getNextLesson, getPreviousLesson, shouldUnlockNextImmediately } from '@/lib/site-content'
import { getUnlockAtForProfile, getVideoCompleteStatus, type UnlockProfilePreference } from '@/lib/unlock-schedule'

type LessonProgress = {
  status: string
  unlock_at: string | null
  completed_at: string | null
  journal_text?: string | null
}

type ProfilePreferenceRow = UnlockProfilePreference

export function LessonClient({ slug }: { slug: string }) {
  const { content } = useSiteContent()
  const lesson = useMemo(() => content.lessons.find((entry) => entry.slug === slug), [content.lessons, slug])
  const nextLesson = useMemo(() => (lesson ? getNextLesson(lesson, content) : null), [content, lesson])
  const previousLesson = useMemo(() => (lesson ? getPreviousLesson(lesson, content) : null), [content, lesson])
  const [videoDone, setVideoDone] = useState(false)
  const [status, setStatus] = useState('')
  const [savingVideo, setSavingVideo] = useState(false)
  const [savingComplete, setSavingComplete] = useState(false)
  const [savingReflection, setSavingReflection] = useState(false)
  const [reflectionDraft, setReflectionDraft] = useState('')
  const [unlockAt, setUnlockAt] = useState<string | null>(null)
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [profilePreference, setProfilePreference] = useState<ProfilePreferenceRow | null>(null)

  useEffect(() => {
    let active = true
    async function loadProgress() {
      if (!lesson) return

      const adminResponse = await fetch('/api/admin/session', { cache: 'no-store' }).catch(() => null)
      const adminData = adminResponse && adminResponse.ok ? await adminResponse.json() as { adminEmail?: string | null } : { adminEmail: null }
      const isAdminUser = !!adminData.adminEmail
      if (active) setAdminUnlocked(isAdminUser)

      const authRes = await supabase.auth.getUser()
      const user = authRes.data.user
      if (!user) {
        if (active && !isAdminUser) setStatus('Login required to save lesson progress.')
        return
      }

      const [progressRes, profileRes] = await Promise.all([
        supabase
          .from('lesson_progress')
          .select('status, unlock_at, completed_at, journal_text')
          .eq('user_id', user.id)
          .eq('lesson_id', lesson.id)
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('time_zone, time_zone_confirmed')
          .eq('id', user.id)
          .maybeSingle(),
      ])

      if (!progressRes.error && progressRes.data && active) {
        const row = progressRes.data as LessonProgress
        setVideoDone(row.status === 'video_complete' || row.status === 'complete')
        setUnlockAt(row.unlock_at)
        setReflectionDraft(row.journal_text || '')
      }

      if (!profileRes.error && active) {
        setProfilePreference((profileRes.data as ProfilePreferenceRow | null) || null)
      }
    }

    loadProgress()
    return () => {
      active = false
    }
  }, [lesson])

  if (!lesson) {
    return (
      <main className="min-h-screen px-4 py-12 text-[#f4eadc]">
        <AdminMenu portalHref="/portal" adminHref="/admin" />
        <div className="mx-auto max-w-2xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.8)] p-8 text-center">
          Lesson not found.
        </div>
      </main>
    )
  }

  async function saveVideoComplete() {
    if (!lesson) return
    const currentLesson = lesson
    setSavingVideo(true)
    setStatus('')
    try {
      const authRes = await supabase.auth.getUser()
      const user = authRes.data.user
      if (!user) {
        setStatus(adminUnlocked ? 'Admin preview mode can view lessons, but does not save buyer progress.' : 'Login required to save progress.')
        return
      }

      const unlockAtValue = nextLesson ? (shouldUnlockNextImmediately(currentLesson) ? new Date().toISOString() : getUnlockAtForProfile(profilePreference)) : null
      const existingRes = await supabase
        .from('lesson_progress')
        .select('status, completed_at, unlock_at')
        .eq('user_id', user.id)
        .eq('lesson_id', currentLesson.id)
        .maybeSingle()

      const existing = existingRes.data as LessonProgress | null
      const completedAt = existing?.completed_at || new Date().toISOString()
      const isIntro = shouldUnlockNextImmediately(currentLesson)
      const payload = {
        user_id: user.id,
        lesson_id: currentLesson.id,
        status: isIntro ? 'complete' : existing?.status === 'complete' ? 'complete' : 'video_complete',
        completed_at: completedAt,
        unlock_at: existing?.unlock_at || unlockAtValue,
      }

      const upsertRes = await supabase.from('lesson_progress').upsert(payload, { onConflict: 'user_id,lesson_id' })
      if (upsertRes.error) {
        setStatus(isIntro ? 'Could not open the next lesson yet.' : 'Could not save video completion yet.')
        return
      }

      setVideoDone(true)
      setUnlockAt(payload.unlock_at)
      if (isIntro && nextLesson) {
        window.location.href = `/portal/lesson/${nextLesson.slug}`
        return
      }
      setStatus(
        nextLesson
          ? getVideoCompleteStatus(nextLesson.title, profilePreference)
          : 'Video complete. Final lesson reached.',
      )
    } finally {
      setSavingVideo(false)
    }
  }

  async function markComplete() {
    if (!lesson) return
    const currentLesson = lesson
    setSavingComplete(true)
    setStatus('')
    try {
      const sessionRes = await supabase.auth.getSession()
      const token = sessionRes.data.session?.access_token
      const user = sessionRes.data.session?.user
      if (!user || !token) {
        setStatus(adminUnlocked ? 'Admin preview mode can view lessons, but does not save buyer completion.' : 'Login required to save completion.')
        return
      }

      const unlockAtValue = nextLesson
        ? unlockAt || (shouldUnlockNextImmediately(currentLesson) ? new Date().toISOString() : getUnlockAtForProfile(profilePreference))
        : null
      const completedAt = new Date().toISOString()
      const upsertRes = await supabase.from('lesson_progress').upsert(
        {
          user_id: user.id,
          lesson_id: currentLesson.id,
          status: 'complete',
          completed_at: completedAt,
          unlock_at: unlockAtValue,
        },
        { onConflict: 'user_id,lesson_id' },
      )

      if (upsertRes.error) {
        setStatus('Could not save completion yet.')
        return
      }

      if (nextLesson) {
        window.location.href = `/portal/complete?from=${lesson.slug}&next=${nextLesson.slug}`
      } else {
        const reflectionEmailRes = await fetch('/api/course-reflections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fromLessonId: currentLesson.id }),
        })
        const reflectionEmailResult = await reflectionEmailRes.json().catch(() => null) as { ok?: boolean; emailQueued?: boolean; reflectionCount?: number; error?: string } | null
        if (!reflectionEmailRes.ok || !reflectionEmailResult?.ok) {
          setStatus('Course completion saved, but your reflection email could not be queued yet. Please try completing the final lesson again in a moment.')
          return
        }
        window.location.href = `/portal/complete?from=${lesson.slug}&reflections=${reflectionEmailResult.emailQueued ? 'queued' : 'none'}`
      }
    } finally {
      setSavingComplete(false)
    }
  }

  async function saveReflection() {
    if (!lesson) return
    const currentLesson = lesson
    setSavingReflection(true)
    setStatus('')
    try {
      const sessionRes = await supabase.auth.getSession()
      const token = sessionRes.data.session?.access_token
      if (!token) {
        setStatus(adminUnlocked ? 'Admin preview mode can view reflection writing, but does not save buyer reflections.' : 'Login required to save your reflection.')
        return
      }

      const saveRes = await fetch('/api/lesson-reflection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          lessonLabel: currentLesson.stepLabel,
          lessonTitle: currentLesson.title,
          reflection: reflectionDraft,
        }),
      })
      const result = await saveRes.json().catch(() => null) as { ok?: boolean; saved?: boolean; error?: string } | null
      if (!saveRes.ok || !result?.ok) {
        setStatus('Could not save your reflection yet.')
        return
      }

      setStatus('Reflection saved to your account. Your saved reflections will be emailed to you after you complete the full course.')
    } finally {
      setSavingReflection(false)
    }
  }

  const isIntro = shouldUnlockNextImmediately(lesson)
  const lessonHeaderStyle = getLessonHeaderBackgroundStyle(lesson.arc)

  return (
    <main className="min-h-screen px-4 py-10 text-[#f4eadc]">
      <AdminMenu portalHref="/portal" adminHref="/admin" extraLinks={lesson ? [{ href: `/portal/lesson/${lesson.slug}`, label: 'Refresh this lesson' }] : []} />
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.34)] md:p-8" style={lessonHeaderStyle}>
          <HeartCornerMark />
          <div className="relative z-[1]">
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">{lesson.arc}</p>
            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[#e6bd74]">{lesson.stepLabel} · {lesson.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[rgba(244,234,220,0.8)]">{lesson.theme}</p>
          </div>
        </section>

        <section className="mt-6 grid gap-6">
          <div className="rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
            <div className="mb-5 rounded-[22px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{lesson.supportingTextHeading || 'Todays Steps'}</p>
              <ul className="mt-4 space-y-3 text-[rgba(244,234,220,0.74)]">
                {lesson.supportingPoints.map((point) => (
                  <li key={point} className="rounded-[18px] border border-[rgba(228,183,103,0.12)] bg-[rgba(255,255,255,0.03)] px-4 py-3">{point}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{lesson.videoLabel}</p>
                <h2 className="mt-1 text-2xl font-semibold">{lesson.videoHeading || 'Lesson video'}</h2>
              </div>
            </div>
            <div className="overflow-hidden rounded-[22px] border border-[rgba(239,197,120,0.14)] bg-[linear-gradient(180deg,rgba(33,43,34,0.8),rgba(20,15,12,0.92))]">
              {lesson.videoUrl ? (
                <div className="aspect-video">
                  <iframe src={lesson.videoUrl} title={lesson.title} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                </div>
              ) : (
                <div className="grid aspect-video place-items-center px-6 text-center text-[rgba(244,234,220,0.7)]">
                  <div>
                    <p className="text-sm uppercase tracking-[0.14em] text-[#efc578]">Video placeholder</p>
                    <p className="mt-3 max-w-md">Add the final embed URL in the admin copy editor and this lesson will render the hosted video here.</p>
                  </div>
                </div>
              )}
            </div>
            {lesson.videoSupport ? <p className="mt-4 text-[rgba(244,234,220,0.74)]">{lesson.videoSupport}</p> : null}
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <button onClick={saveVideoComplete} disabled={savingVideo} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 text-center font-bold text-[#2d1b10] disabled:opacity-60 sm:w-auto">
                {savingVideo ? 'Saving…' : videoDone ? (lesson.videoCompleteSavedLabel || 'Video completion saved') : (lesson.markVideoCompleteLabel || 'Mark video complete')}
              </button>
              {!isIntro ? (
                <button onClick={markComplete} disabled={savingComplete} className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-5 text-center font-semibold text-[#f4eadc] disabled:opacity-60 sm:w-auto">
                  {savingComplete ? 'Saving…' : nextLesson ? (lesson.completeLessonLabel || 'Complete lesson') : (lesson.completeFinalLessonLabel || 'Complete final lesson')}
                </button>
              ) : null}
            </div>
            {status ? <div className="mt-4 rounded-[18px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-[rgba(244,234,220,0.74)]">{status}</div> : null}
          </div>
        </section>

        {!isIntro ? (
          <section className="mt-6 grid gap-6">
            <div className="rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
              <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{lesson.reflectionPromptsHeading || 'Heart Fitness Exercise'}</p>
              <div className="mt-4 rounded-[18px] border border-[rgba(228,183,103,0.12)] bg-[rgba(255,255,255,0.03)] p-5 text-[rgba(244,234,220,0.8)]">
                {lesson.practice ? <p>{lesson.practice}</p> : null}
                {lesson.journalPrompt ? <p className={lesson.practice ? 'mt-3' : ''}>{lesson.journalPrompt}</p> : null}
                {lesson.prompts.length ? (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#efc578]">{lesson.promptLabelPrefix || 'Reflection'}</p>
                    <ul className="mt-3 space-y-3">
                      {lesson.prompts.map((prompt) => (
                        <li key={prompt}>{prompt}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              <textarea value={reflectionDraft} onChange={(event) => setReflectionDraft(event.target.value)} rows={8} className="mt-5 min-h-40 w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[#f4eadc] outline-none" placeholder="Type your reflection here..." />
              <button onClick={saveReflection} disabled={savingReflection} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10] disabled:opacity-60">
                {savingReflection ? 'Saving…' : 'Save reflection'}
              </button>
            </div>
          </section>
        ) : null}

        <section className="mt-6 rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
          <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">Lesson rhythm</p>
          {nextLesson ? (
            <p className="mt-3 text-[rgba(244,234,220,0.74)]">
              {shouldUnlockNextImmediately(lesson)
                ? `${nextLesson.title} is available after you complete this lesson.`
                : unlockAt
                  ? `Next lesson available: ${new Date(unlockAt).toLocaleString()}.`
                  : 'Next lesson available after you complete this lesson at your account unlock time.'}
            </p>
          ) : (
            <p className="mt-3 text-[rgba(244,234,220,0.74)]">{lesson.integrationBody}</p>
          )}
          {adminUnlocked ? <p className="mt-3 text-sm text-[#efc578]">Admin unlocked view active on lesson pages.</p> : null}
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {previousLesson ? <a href={`/portal/lesson/${previousLesson.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-4 text-[#f4eadc]">Previous lesson</a> : null}
            <a href="/portal" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-4 text-[#f4eadc]">Back to portal</a>
            {nextLesson ? <a href={`/portal/lesson/${nextLesson.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-4 text-[#f4eadc]">Next lesson</a> : null}
          </div>
        </section>
      </div>
    </main>
  )
}
