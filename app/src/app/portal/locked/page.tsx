'use client'

import { useEffect, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { supabase, UNLOCK_DELAY_HOURS } from '@/lib/supabase'

type LoadState = 'loading' | 'login_required' | 'no_progress' | 'ready' | 'error'

export default function LockedPage() {
  const [whenText, setWhenText] = useState('')
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [detail, setDetail] = useState('Loading…')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const authRes = await supabase.auth.getUser()
        const user = authRes.data.user
        if (!user) {
          if (active) {
            setLoadState('login_required')
            setDetail('Login required.')
          }
          return
        }

        const progressRes = await supabase
          .from('lesson_progress')
          .select('unlock_at')
          .eq('user_id', user.id)
          .eq('lesson_id', 'day-1')
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
            setDetail('No unlock timestamp found yet.')
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
  }, [])

  return (
    <main className="min-h-screen px-4 py-12 text-[#f4eadc]">
      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <HeartCornerMark />
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Quest Rhythm</p>
        <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">The next lesson is still ripening.</h1>
        <p className="mx-auto max-w-2xl text-[rgba(244,234,220,0.72)]">Good work. The pacing is intentional. Let today settle before the next gate opens.</p>
        <div className="mx-auto mt-6 max-w-xl rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5">
          <strong className="mb-1 block text-lg">Next unlock: {UNLOCK_DELAY_HOURS} hours</strong>
          <p className="text-[rgba(244,234,220,0.72)]">{loadState === 'ready' ? whenText : detail}</p>
        </div>
      </div>
    </main>
  )
}
