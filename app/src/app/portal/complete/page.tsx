'use client'

import { UNLOCK_DELAY_HOURS } from '@/lib/supabase'

function getStoredUnlockText() {
  if (typeof window === 'undefined') return ''
  const stored = window.localStorage.getItem('mhq_day1_unlock_at')
  if (!stored) return ''
  const d = new Date(stored)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString()
}

export default function CompletePage() {
  const whenText = getStoredUnlockText()

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0c0908,#17110f_60%,#0d0908)] px-4 py-12 text-[#f4eadc]">
      <div className="mx-auto w-full max-w-3xl rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <div className="mx-auto mb-5 grid h-22 w-22 place-items-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] text-3xl font-extrabold text-[#2d1b10]">✓</div>
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Quest Rhythm</p>
        <h1 className="mb-3 text-5xl font-semibold tracking-[-0.04em]">Day complete.</h1>
        <p className="mx-auto mb-6 max-w-2xl text-[rgba(244,234,220,0.72)]">You’ve taken the first step into the quest. Let it settle. Let it work on you a little.</p>
        <div className="mx-auto mb-6 grid max-w-3xl grid-cols-7 gap-2 md:grid-cols-21">
          {Array.from({ length: 21 }).map((_, i) => (
            <div key={i} className={`h-2.5 rounded-full border ${i < 2 ? 'border-transparent bg-[linear-gradient(180deg,#efc578,#dca453)]' : 'border-[rgba(239,197,120,0.08)] bg-[rgba(255,255,255,0.08)]'}`} />
          ))}
        </div>
        <div className="mx-auto max-w-xl rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5">
          <strong className="mb-1 block text-lg">Next lesson unlocks in {UNLOCK_DELAY_HOURS} hours</strong>
          <div className="text-[rgba(244,234,220,0.72)]">{whenText || 'Unlock time will appear here after live save is wired.'}</div>
        </div>
      </div>
    </main>
  )
}
