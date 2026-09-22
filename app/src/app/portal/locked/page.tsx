'use client'

import { useEffect, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { AdminMenu } from '@/components/admin-menu'
import { useSiteContent } from '@/lib/site-content-store'
import { supabase } from '@/lib/supabase'

type LoadState = 'loading' | 'login_required' | 'no_progress' | 'ready' | 'error'

export default function LockedPage() {
  const { content } = useSiteContent()
  const backToPortalLabel = content.locked.backToPortalLabel || 'Back to portal'
  const [whenText, setWhenText] = useState('')
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [detail, setDetail] = useState('Loading…')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const params = new URLSearchParams(window.location.search)
        const previousSlug = params.get('previous')
        const previousLesson = previousSlug ? content.lessons.find((lesson) => lesson.slug === previousSlug) : null

        const authRes = await supabase.auth.getUser()
        const user = authRes.data.user
        if (!user) {
          if (active) {
            setLoadState('login_required')
            setDetail('Login required.')
          }
          return
        }

        if (!previousLesson) {
          if (active) {
            setLoadState('no_progress')
            setDetail('No previous lesson was specified for this lock screen yet.')
          }
          return
        }

        const progressRes = await supabase
          .from('lesson_progress')
          .select('unlock_at')
          .eq('user_id', user.id)
          .eq('lesson_id', previousLesson.id)
          .maybeSingle()

        if (progressRes.error) {
          if (active) {
            setLoadState('error')
            setDetail('Could not load locked state yet.')
          }
          return
        }

        if (!progressRes.data?.unlock_at) {
          if (active) {
            setLoadState('no_progress')
            setDetail('The previous lesson video has not been marked complete yet.')
          }
          return
        }

        if (active) {
          setWhenText(new Date(progressRes.data.unlock_at).toLocaleString())
          setLoadState('ready')
          setDetail('')
        }
      } catch (err) {
        console.error(err)
        if (active) {
          setLoadState('error')
          setDetail('Unexpected error while loading locked state.')
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
      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <HeartCornerMark />
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">{content.locked.eyebrow}</p>
        <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">{content.locked.title}</h1>
        <p className="mx-auto max-w-2xl text-[rgba(244,234,220,0.72)]">{content.locked.body}</p>
        <div className="mx-auto mt-6 max-w-xl rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5">
          <strong className="mb-1 block text-lg">{content.locked.cardHeading}</strong>
          <p className="text-[rgba(244,234,220,0.72)]">{loadState === 'ready' ? whenText : detail}</p>
        </div>
        <div className="mt-6">
          <a href="/portal" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-4 text-[#f4eadc]">{backToPortalLabel}</a>
        </div>
      </div>
    </main>
  )
}
