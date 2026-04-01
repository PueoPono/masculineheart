'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type DebugData = {
  user: string | null
  profile: Record<string, unknown> | null
  progress: Record<string, unknown>[] | null
}

export default function DebugCurrentStatePage() {
  const [data, setData] = useState<DebugData | null>(null)
  const [status, setStatus] = useState('Loading…')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const authRes = await supabase.auth.getUser()
        const user = authRes.data.user
        if (!user) {
          if (active) setStatus('Login required.')
          return
        }

        const profileRes = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
        const progressRes = await supabase.from('lesson_progress').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })

        if (active) {
          setData({ user: user.email ?? null, profile: profileRes.data ?? null, progress: (progressRes.data as Record<string, unknown>[] | null) ?? null })
          setStatus('')
        }
      } catch (err) {
        console.error(err)
        if (active) setStatus('Unexpected error while loading debug state.')
      }
    }
    load()
    return () => { active = false }
  }, [])

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0c0908,#17110f_60%,#0d0908)] px-4 py-10 text-[#f4eadc]">
      <div className="mx-auto w-full max-w-5xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <h1 className="mb-4 text-4xl font-semibold tracking-[-0.04em]">Debug current state</h1>
        {status ? <p className="text-[rgba(244,234,220,0.72)]">{status}</p> : null}
        {data ? <pre className="overflow-auto rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-sm text-[rgba(244,234,220,0.82)]">{JSON.stringify(data, null, 2)}</pre> : null}
      </div>
    </main>
  )
}
