'use client'

import { useEffect, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { AdminMenu } from '@/components/admin-menu'
import { useSiteContent } from '@/lib/site-content-store'
import { supabase } from '@/lib/supabase'

type LoadState = 'loading' | 'login_required' | 'no_progress' | 'ready' | 'error'

export default function CompletePage() {
  const { content } = useSiteContent()
  const backToPortalLabel = content.complete.backToPortalLabel || 'Back to portal'
  const [whenText, setWhenText] = useState('')
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [detail, setDetail] = useState('Loading…')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const params = new URLSearchParams(window.location.search)
        const fromSlug = params.get('from')
        const fromLesson = fromSlug ? content.lessons.find((lesson) => lesson.slug === fromSlug) : null
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

  return (
    <main className="min-h-screen px-4 py-12 text-[#f4eadc]">
      <AdminMenu portalHref="/portal" adminHref="/admin" />
      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <HeartCornerMark />
        <div className="mx-auto mb-5 grid h-22 w-22 place-items-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] text-3xl font-extrabold text-[#2d1b10]">✓</div>
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">{content.complete.eyebrow}</p>
        <h1 className="mb-3 text-5xl font-semibold tracking-[-0.04em] text-[#e6bd74]">{content.complete.title}</h1>
        <p className="mx-auto mb-6 max-w-2xl text-[rgba(244,234,220,0.72)]">{content.complete.body}</p>
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
