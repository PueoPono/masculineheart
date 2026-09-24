'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { AdminMenu } from '@/components/admin-menu'
import { useSiteContent } from '@/lib/site-content-store'
import { courseTracks } from '@/lib/site-content'
import { supabase } from '@/lib/supabase'

type LoadState = 'loading' | 'login_required' | 'no_progress' | 'ready' | 'error'

export default function CompletePage() {
  const { content } = useSiteContent()
  const backToPortalLabel = content.complete.backToPortalLabel || 'Back to portal'
  const [whenText, setWhenText] = useState('')
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [detail, setDetail] = useState('Loading…')
  const [ceremony, setCeremony] = useState<{ label: string; title: string; isCourseComplete: boolean } | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const params = new URLSearchParams(window.location.search)
        const fromSlug = params.get('from')
        const fromLesson = fromSlug ? content.lessons.find((lesson) => lesson.slug === fromSlug) : null
        const completedTrack = fromLesson ? courseTracks.find((track) => track.lessonIds[track.lessonIds.length - 1] === fromLesson.id) : null
        const nextSlug = params.get('next')
        const reflectionState = params.get('reflections')

        const authRes = await supabase.auth.getUser()
        const user = authRes.data.user
        if (!user) {
          if (active) {
            setLoadState('login_required')
            setDetail('Login required.')
          }
          return
        }

        if (!fromLesson) {
          if (active) {
            setLoadState('no_progress')
            setDetail('Completion saved. Return to the portal to continue.')
          }
          return
        }

        const progressRes = await supabase
          .from('lesson_progress')
          .select('unlock_at, completed_at')
          .eq('user_id', user.id)
          .eq('lesson_id', fromLesson.id)
          .maybeSingle()

        if (progressRes.error) {
          if (active) {
            setLoadState('error')
            setDetail('Could not load completion state yet.')
          }
          return
        }

        if (!progressRes.data?.unlock_at) {
          if (active) {
            if (!nextSlug && progressRes.data?.completed_at) {
              setLoadState('ready')
              setWhenText(
                reflectionState === 'queued'
                  ? 'Course complete. Your saved reflection answers have been queued to email to you.'
                  : 'Course complete. Return to the portal whenever you want to review.',
              )
              setCeremony(completedTrack ? { label: completedTrack.label, title: completedTrack.title, isCourseComplete: true } : null)
            } else {
              setLoadState('no_progress')
              setDetail('No saved completion/unlock row found yet.')
            }
          }
          return
        }

        const unlockAt = new Date(progressRes.data.unlock_at)
        if (active) {
          setWhenText(unlockAt.toLocaleString())
          setCeremony(completedTrack ? { label: completedTrack.label, title: completedTrack.title, isCourseComplete: false } : null)
          setLoadState('ready')
          setDetail('')
        }
      } catch (err) {
        console.error(err)
        if (active) {
          setLoadState('error')
          setDetail('Unexpected error while loading completion state.')
        }
      }
    }
    load()
    return () => {
      active = false
    }
  }, [content.lessons])

  const confettiPieces = Array.from({ length: 80 })

  return (
    <main className="min-h-screen px-4 py-12 text-[#f4eadc]">
      <style>{`
        @keyframes mhq-confetti-fall {
          0% { transform: translate3d(0, -14vh, 0) rotate(0deg); opacity: 0; }
          8% { opacity: 1; }
          100% { transform: translate3d(var(--mhq-drift), 112vh, 0) rotate(760deg); opacity: 0; }
        }
        @keyframes mhq-ceremony-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(239,197,120,0); }
          50% { transform: scale(1.04); box-shadow: 0 0 48px rgba(239,197,120,0.24); }
        }
      `}</style>
      {ceremony ? (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
          {confettiPieces.map((_, index) => {
            const colors = ['#efc578', '#dca453', '#f4eadc', '#78a15f', '#63a7a7', '#b87a58']
            const left = (index * 37) % 100
            const delay = (index % 16) * 0.12
            const duration = 3.6 + (index % 7) * 0.28
            const drift = ((index % 11) - 5) * 14
            return (
              <span
                key={index}
                className="absolute top-0 rounded-[3px]"
                style={{
                  left: `${left}%`,
                  width: `${6 + (index % 4) * 2}px`,
                  height: `${10 + (index % 5) * 3}px`,
                  backgroundColor: colors[index % colors.length],
                  animation: `mhq-confetti-fall ${duration}s ease-in ${delay}s both`,
                  '--mhq-drift': `${drift}vw`,
                } as CSSProperties}
              />
            )
          })}
        </div>
      ) : null}
      <AdminMenu portalHref="/portal" adminHref="/admin" />
      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <HeartCornerMark />
        <div className="mx-auto mb-5 grid h-22 w-22 place-items-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] text-3xl font-extrabold text-[#2d1b10]">✓</div>
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">{content.complete.eyebrow}</p>
        <h1 className="mb-3 text-5xl font-semibold tracking-[-0.04em] text-[#e6bd74]">{content.complete.title}</h1>
        <p className="mx-auto mb-6 max-w-2xl text-[rgba(244,234,220,0.72)]">{content.complete.body}</p>
        {ceremony ? (
          <div className="mx-auto mb-6 max-w-2xl rounded-[24px] border border-[rgba(239,197,120,0.24)] bg-[rgba(239,197,120,0.08)] p-5" style={{ animation: 'mhq-ceremony-pulse 1.8s ease-in-out 2' }}>
            <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{ceremony.isCourseComplete ? 'Full Quest complete' : `${ceremony.label} complete`}</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#f4eadc]">{ceremony.title}</h2>
            <p className="mt-3 text-lg leading-8 text-[rgba(244,234,220,0.82)]">Awesome. This kind of work is truly how we create a happy and healthy life.</p>
          </div>
        ) : null}
        <div className="mx-auto mb-6 grid max-w-3xl grid-cols-7 gap-2 md:grid-cols-21">
          {Array.from({ length: 21 }).map((_, i) => (
            <div key={i} className={`h-2.5 rounded-full border ${i < 2 ? 'border-transparent bg-[linear-gradient(180deg,#efc578,#dca453)]' : 'border-[rgba(239,197,120,0.08)] bg-[rgba(255,255,255,0.08)]'}`} />
          ))}
        </div>
        <div className="mx-auto max-w-xl rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5">
          <strong className="mb-1 block text-lg">{content.complete.cardHeading}</strong>
          <div className="text-[rgba(244,234,220,0.72)]">{loadState === 'ready' ? whenText : detail}</div>
        </div>
        <div className="mt-6">
          <a href="/portal" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-4 text-[#f4eadc]">{backToPortalLabel}</a>
        </div>
      </div>
    </main>
  )
}
