'use client'

import { useEffect, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { AdminMenu } from '@/components/admin-menu'
import { useSiteContent } from '@/lib/site-content-store'
import { supabase } from '@/lib/supabase'
import { courseTracks, type LessonContent } from '@/lib/site-content'
import { getDripCadenceDescription } from '@/lib/unlock-schedule'

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

type CardState = 'done' | 'available' | 'integrating' | 'locked'

const partOneBoxBackground =
  "linear-gradient(135deg,rgba(7,12,20,0.72),rgba(12,10,9,0.6) 42%,rgba(12,10,9,0.86)),url('/images/part-one-heart-locks-fence.jpg')"

const partOneLessonBackground =
  "linear-gradient(135deg,rgba(7,12,20,0.7),rgba(12,10,9,0.56) 45%,rgba(12,10,9,0.9)),url('/images/part-one-heart-locks-fence.jpg')"

const partTwoBoxBackground =
  "linear-gradient(135deg,rgba(5,18,22,0.68),rgba(11,23,24,0.5) 42%,rgba(9,12,10,0.88)),url('/images/part-two-golden-pond.jpg')"

const partTwoLessonBackground =
  "linear-gradient(135deg,rgba(5,18,22,0.72),rgba(11,23,24,0.54) 42%,rgba(9,12,10,0.92)),url('/images/part-two-golden-pond.jpg')"

const partThreeBoxBackground =
  "linear-gradient(135deg,rgba(9,15,10,0.7),rgba(31,20,12,0.54) 42%,rgba(9,10,7,0.88)),url('/images/part-three-intentions-planting.jpg')"

const partThreeLessonBackground =
  "linear-gradient(135deg,rgba(9,15,10,0.74),rgba(31,20,12,0.58) 42%,rgba(9,10,7,0.92)),url('/images/part-three-intentions-planting.jpg')"

const partOneBackgroundStyle = {
  backgroundImage: partOneBoxBackground,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

const partOneLessonBackgroundStyle = {
  backgroundImage: partOneLessonBackground,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

const partTwoLessonBackgroundStyle = {
  backgroundImage: partTwoLessonBackground,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

const partTwoBackgroundStyle = {
  backgroundImage: partTwoBoxBackground,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

const partThreeBackgroundStyle = {
  backgroundImage: partThreeBoxBackground,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

const partThreeLessonBackgroundStyle = {
  backgroundImage: partThreeLessonBackground,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

function getPreviousLesson(lesson: LessonContent, lessons: LessonContent[]) {
  const index = lessons.findIndex((candidate) => candidate.id === lesson.id)
  return index > 0 ? lessons[index - 1] : null
}

function getLessonState(lesson: LessonContent, progress: Record<string, ProgressRow>, lessons: LessonContent[], currentTime: number, adminUnlocked: boolean): CardState {
  if (adminUnlocked) {
    const row = progress[lesson.id]
    return row?.status === 'complete' ? 'done' : 'available'
  }
  const row = progress[lesson.id]
  if (row?.status === 'complete') return 'done'
  if (!getPreviousLesson(lesson, lessons)) {
    return row?.status === 'video_complete' && row.unlock_at && new Date(row.unlock_at).getTime() > currentTime ? 'integrating' : 'available'
  }
  const previous = getPreviousLesson(lesson, lessons)
  if (!previous) return 'locked'
  const previousProgress = progress[previous.id]
  if (previousProgress?.unlock_at && new Date(previousProgress.unlock_at).getTime() <= currentTime) {
    return 'available'
  }
  if (previousProgress?.unlock_at) return 'integrating'
  return 'locked'
}

function formatUnlock(text?: string | null) {
  if (!text) return 'Awaiting video completion'
  const date = new Date(text)
  if (Number.isNaN(date.getTime())) return 'Awaiting video completion'
  return date.toLocaleString()
}

export default function PortalPage() {
  const { content } = useSiteContent()
  const lessons = content.lessons
  const portal = content.portal
  const [email, setEmail] = useState('')
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({})
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [authReady, setAuthReady] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now())
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [openUnlockCard, setOpenUnlockCard] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let active = true
    async function load() {
      const adminResponse = await fetch('/api/admin/session', { cache: 'no-store' }).catch(() => null)
      const adminData = adminResponse && adminResponse.ok ? await adminResponse.json() as { adminEmail?: string | null } : { adminEmail: null }
      const isAdminUser = !!adminData.adminEmail

      const authRes = await supabase.auth.getUser()
      const user = authRes.data.user

      if (active) setAdminUnlocked(isAdminUser)

      if (!user) {
        if (active) {
          if (isAdminUser) {
            setAuthReady(true)
            setEnrolled(true)
            setEmail(adminData.adminEmail || 'Admin preview')
            setStatus('')
          } else {
            setStatus('Login required.')
            setAuthReady(false)
          }
          setLoading(false)
        }
        return
      }

      if (active) {
        setAuthReady(true)
        setEmail(user.email || '')
        window.localStorage.setItem('mhq_email', user.email || '')
      }

      const profileRes = await supabase.from('profiles').select('id, email, enrolled').eq('id', user.id).single()
      if (profileRes.error || !profileRes.data) {
        if (active) {
          setStatus('Could not load your profile yet.')
          setLoading(false)
        }
        return
      }

      const profile = profileRes.data as ProfileRow
      if (active) setEnrolled(!!profile.enrolled || isAdminUser)
      if (!profile.enrolled && !isAdminUser) {
        if (active) {
          setStatus('Your account exists, but course access is not enrolled yet.')
          setLoading(false)
        }
        return
      }

      const progressRes = await supabase.from('lesson_progress').select('lesson_id, status, unlock_at, completed_at').eq('user_id', user.id)
      if (!progressRes.error && active) {
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

  const completionCount = Object.values(progress).filter((p) => p.status === 'complete').length
  const nextAvailable = lessons.find((lesson) => getLessonState(lesson, progress, lessons, currentTime, adminUnlocked) === 'available') || null
  const nextIntegration = adminUnlocked ? null : (() => {
    for (const lesson of lessons) {
      const previous = getPreviousLesson(lesson, lessons)
      if (!previous) continue
      const previousProgress = progress[previous.id]
      if (previousProgress?.unlock_at && new Date(previousProgress.unlock_at).getTime() > currentTime) {
        return { lesson, unlockAt: previousProgress.unlock_at }
      }
    }
    return null
  })()

  if (!loading && !authReady) {
    return (
      <main className="min-h-screen px-4 py-12 text-[#f4eadc]">
        <AdminMenu portalHref="/portal" adminHref="/admin" />
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
        <AdminMenu portalHref="/portal" adminHref="/admin" />
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
      <AdminMenu portalHref="/portal" adminHref="/admin" />
      <div className="mx-auto w-full max-w-7xl">
        <section className="relative overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.34)] md:p-8">
          <HeartCornerMark />
          <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-start">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">{portal.eyebrow}</p>
              <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[#e6bd74]">{portal.title}</h1>
              <p className="mt-2 text-[rgba(244,234,220,0.72)]">{email}</p>
              <p className="mt-5 max-w-2xl text-[rgba(244,234,220,0.78)]">{portal.mapBody}</p>
              {adminUnlocked ? <p className="mt-3 text-sm text-[#efc578]">Admin unlocked view: all course pages are navigable from here.</p> : null}
            </div>
            <div className="grid gap-3">
              <div className="rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-sm text-[rgba(244,234,220,0.78)]">
                <strong className="text-[#f4eadc]">Progress</strong>
                <div className="mt-2 text-3xl font-semibold text-[#e6bd74]">{completionCount} / {lessons.length}</div>
                <div className="mt-1">Completed lessons</div>
              </div>
              <div className="rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-sm text-[rgba(244,234,220,0.78)]">
                <strong className="text-[#f4eadc]">Drip cadence</strong>
                <div className="mt-2">{getDripCadenceDescription()}</div>
                <div className="mt-1">Your reflection can continue after the next lesson opens.</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(32,44,35,0.52),rgba(20,15,12,0.78))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
              <div className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{portal.nextAvailableEyebrow}</div>
              {nextAvailable ? (
                <>
                  <div className="mt-1 text-2xl font-semibold">{nextAvailable.stepLabel} · {nextAvailable.title}</div>
                  <div className="mt-2 text-[rgba(244,234,220,0.72)]">{nextAvailable.theme}</div>
                  <div className="mt-4">
                    <a href={`/portal/lesson/${nextAvailable.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">Open lesson</a>
                  </div>
                </>
              ) : (
                <div className="mt-2 text-[rgba(244,234,220,0.72)]">All available lessons are open. Continue from your lesson map below.</div>
              )}
            </div>

            <div className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
              <div className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{portal.integrationHeading}</div>
              {nextIntegration ? (
                <>
                  <div className="mt-1 text-2xl font-semibold">{nextIntegration.lesson.stepLabel} · {nextIntegration.lesson.title} opens next</div>
                  <div className="mt-2 text-[rgba(244,234,220,0.72)]">Unlocks {formatUnlock(nextIntegration.unlockAt)}</div>
                </>
              ) : (
                <div className="mt-2 text-[rgba(244,234,220,0.72)]">{adminUnlocked ? 'Admin view bypasses drip locks so you can inspect the full course experience.' : portal.integrationBody}</div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {courseTracks.map((track, index) => (
              <div
                key={track.id}
                className="relative overflow-hidden rounded-[22px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[rgba(244,234,220,0.76)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                style={
                  track.id === 'course-1'
                    ? partOneBackgroundStyle
                    : track.id === 'course-2'
                      ? partTwoBackgroundStyle
                      : track.id === 'course-3'
                        ? partThreeBackgroundStyle
                        : undefined
                }
              >
                <div className="relative z-[1]">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{track.label}</div>
                  <div className="mt-2 text-xl font-semibold text-[#f4eadc]">{track.title}</div>
                  <div className="mt-1 text-[rgba(244,234,220,0.6)]">{track.daysLabel}</div>
                  <p className="mt-3">{portal.trackNotes[index] || track.editorNote}</p>
                </div>
              </div>
            ))}
          </div>

          {status ? <div className="mt-6 rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-5 text-[rgba(244,234,220,0.78)]">{status}</div> : null}
        </section>

        <section className="mt-6 rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.03em]">{portal.mapHeading}</h2>
              <p className="text-[rgba(244,234,220,0.72)]">{portal.mapBody}</p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {courseTracks.map((track) => (
              <div
                key={track.id}
                className="relative overflow-hidden rounded-[24px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4"
                style={
                  track.id === 'course-1'
                    ? partOneBackgroundStyle
                    : track.id === 'course-2'
                      ? partTwoBackgroundStyle
                      : track.id === 'course-3'
                        ? partThreeBackgroundStyle
                        : undefined
                }
              >
                <div className="mb-1 text-xs uppercase tracking-[0.16em] text-[#efc578]">{track.label}</div>
                <div className="mb-4 text-lg font-semibold text-[#f4eadc]">{track.title}</div>
                <div className="grid gap-3">
                  {track.lessonIds
                    .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
                    .filter((lesson): lesson is LessonContent => !!lesson)
                    .map((lesson) => {
                      const lessonProgress = progress[lesson.id]
                      const state = getLessonState(lesson, progress, lessons, currentTime, adminUnlocked)
                      const previous = getPreviousLesson(lesson, lessons)
                      const lockHref = previous ? `/portal/locked?previous=${previous.slug}&next=${lesson.slug}` : '/portal/locked'
                      const href = state === 'locked' || state === 'integrating' ? lockHref : `/portal/lesson/${lesson.slug}`
                      const unlockAt = previous ? progress[previous.id]?.unlock_at : null
                      const hasExactUnlockTime = state === 'integrating' && !!unlockAt
                      const unlockTooltip =
                        state === 'integrating'
                          ? `Unlocks ${formatUnlock(unlockAt)}`
                          : state === 'locked'
                            ? 'You must complete the previous lesson first.'
                            : ''
                      const statusText =
                        lessonProgress?.status === 'complete'
                          ? 'Complete ✓'
                          : state === 'integrating'
                            ? `Unlocks ${formatUnlock(unlockAt)}`
                            : state === 'locked'
                              ? 'Locked until previous video is complete'
                              : lessonProgress?.status === 'video_complete'
                                ? 'Video complete · reflection still open'
                                : adminUnlocked
                                  ? 'Admin open'
                                  : 'Available'
                      return (
                        <div
                          key={lesson.id}
                          className={`group relative overflow-hidden rounded-[18px] border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-transform duration-150 hover:-translate-y-0.5 ${
                            state === 'done'
                              ? 'border-[rgba(228,183,103,0.18)] bg-[rgba(131,95,34,0.18)]'
                              : state === 'available'
                                ? 'border-[#dca453] bg-[rgba(51,82,63,0.28)]'
                                : 'border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] opacity-85'
                          }`}
                          style={
                            track.id === 'course-1'
                              ? partOneLessonBackgroundStyle
                              : track.id === 'course-2'
                                ? partTwoLessonBackgroundStyle
                                : track.id === 'course-3'
                                  ? partThreeLessonBackgroundStyle
                                  : undefined
                          }
                        >
                          <a
                            href={href}
                            title={unlockTooltip || undefined}
                            className="block rounded-[12px] no-underline focus:outline-none focus:ring-2 focus:ring-[#efc578]/60"
                          >
                            <small className="mb-1 block text-[#efc578]">{lesson.stepLabel}</small>
                            <strong className="block text-lg">{lesson.title}</strong>
                            <div className="mt-1 text-sm text-[rgba(244,234,220,0.72)]">{lesson.theme}</div>
                            <div className="mt-3 text-xs uppercase tracking-[0.14em] text-[rgba(244,234,220,0.6)]">{statusText}</div>
                          </a>
                          {unlockTooltip ? (
                            <div className="pointer-events-none absolute inset-x-4 top-4 z-10 hidden rounded-[16px] border border-[rgba(239,197,120,0.2)] bg-[rgba(12,10,9,0.96)] px-3 py-3 text-xs normal-case tracking-normal text-[rgba(244,234,220,0.88)] shadow-[0_18px_36px_rgba(0,0,0,0.34)] group-hover:block group-focus-within:block xl:block xl:opacity-0 xl:transition-opacity xl:duration-150 xl:group-hover:opacity-100 xl:group-focus-within:opacity-100">
                              <strong className="mb-1 block text-[#efc578]">{hasExactUnlockTime ? 'Next unlock time' : 'Unlock note'}</strong>
                              <span>{unlockTooltip}</span>
                            </div>
                          ) : null}
                          {unlockTooltip ? (
                            <button
                              type="button"
                              onClick={() => setOpenUnlockCard((current) => (current === lesson.id ? null : lesson.id))}
                              className="mt-3 inline-flex min-h-9 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-3 text-xs font-semibold text-[#f4eadc] xl:hidden"
                            >
                              {openUnlockCard === lesson.id ? 'Hide unlock time' : 'Show unlock time'}
                            </button>
                          ) : null}
                          {unlockTooltip && openUnlockCard === lesson.id ? (
                            <div className="mt-3 rounded-[16px] border border-[rgba(239,197,120,0.2)] bg-[rgba(12,10,9,0.88)] px-3 py-3 text-sm text-[rgba(244,234,220,0.88)] xl:hidden">
                              <strong className="mb-1 block text-[#efc578]">{hasExactUnlockTime ? 'Next unlock time' : 'Unlock note'}</strong>
                              <span>{unlockTooltip}</span>
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
