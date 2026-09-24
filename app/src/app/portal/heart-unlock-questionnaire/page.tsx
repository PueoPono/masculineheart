'use client'

import { FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AdminMenu } from '@/components/admin-menu'
import { HeartCornerMark } from '@/components/heart-mark'
import { supabase } from '@/lib/supabase'

type FieldType = 'text' | 'textarea' | 'choice'
type QuestionField = {
  id: string
  label: string
  type: FieldType
  options?: string[]
}

type Answers = Record<string, string>

const fields: QuestionField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'completedSevenDays', label: 'Did you complete the 7-days, stepping down into the Heart?', type: 'choice', options: ['Yes', 'No'] },
  { id: 'daysFromStartToFinish', label: 'How many days did you take from start to finish?', type: 'text' },
  { id: 'learnedAboutSelf', label: 'What did you learn about yourself during the course?', type: 'textarea' },
  { id: 'confusingOrSuggestions', label: 'Was there anything confusing about the course, or any suggestion you would have that could have made it better?', type: 'textarea' },
  { id: 'nextStep', label: 'What do you think the next step is for you, in understanding your Heart?', type: 'text' },
  { id: 'emotionsOpened', label: 'Did you feel your emotions open up in new ways? If so, how?', type: 'textarea' },
  { id: 'criticalToFeel', label: "Why do you think it's critical to allow yourself to feel?", type: 'textarea' },
  { id: 'mostImportantTakeaway', label: 'What is your most important take away from this mini-course?', type: 'textarea' },
]

const emptyAnswers = Object.fromEntries(fields.map((field) => [field.id, ''])) as Answers
const localStorageKey = 'mhq-heart-unlock-questionnaire'

export default function HeartUnlockQuestionnairePage() {
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [status, setStatus] = useState('Loading your saved answers…')
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const loaded = useRef(false)

  const completedCount = useMemo(() => fields.filter((field) => answers[field.id]?.trim()).length, [answers])

  const requestSave = useCallback(async (nextAnswers: Answers, submit = false) => {
    const sessionRes = await supabase.auth.getSession()
    const token = sessionRes.data.session?.access_token
    if (!token) {
      localStorage.setItem(localStorageKey, JSON.stringify(nextAnswers))
      setHasSession(false)
      setStatus('Answers saved on this device. Sign in to save them to your course account and submit.')
      return { ok: true, localOnly: true }
    }

    setHasSession(true)
    const res = await fetch('/api/heart-unlock-questionnaire', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ answers: nextAnswers, submit }),
    })
    const result = await res.json().catch(() => null) as { ok?: boolean; error?: string; submitted?: boolean; emailQueued?: boolean } | null
    if (!res.ok || !result?.ok) throw new Error(result?.error || 'Could not save answers yet.')
    localStorage.setItem(localStorageKey, JSON.stringify(nextAnswers))
    if (submit) {
      setSubmitted(Boolean(result.submitted))
      setStatus(result.emailQueued ? 'Questionnaire submitted. Paul has been notified.' : 'Questionnaire submitted.')
    } else {
      setStatus('Answers saved to your course account.')
    }
    return result
  }, [])

  useEffect(() => {
    async function loadAnswers() {
      const localAnswers = localStorage.getItem(localStorageKey)
      if (localAnswers) {
        try { setAnswers({ ...emptyAnswers, ...JSON.parse(localAnswers) }) } catch {}
      }
      const sessionRes = await supabase.auth.getSession()
      const token = sessionRes.data.session?.access_token
      if (!token) {
        setHasSession(false)
        setStatus('You can draft answers here. Sign in to save them to your course account and submit.')
        loaded.current = true
        return
      }
      setHasSession(true)
      const res = await fetch('/api/heart-unlock-questionnaire', { headers: { authorization: `Bearer ${token}` } })
      const result = await res.json().catch(() => null) as { ok?: boolean; answers?: Answers; submitted?: boolean } | null
      if (res.ok && result?.ok) {
        const merged = { ...emptyAnswers, ...(result.answers || {}) }
        setAnswers(merged)
        localStorage.setItem(localStorageKey, JSON.stringify(merged))
        setSubmitted(Boolean(result.submitted))
        setStatus(result.submitted ? 'Questionnaire already submitted. You can still review your answers.' : 'Your saved answers are loaded.')
      } else {
        setStatus('Could not load account answers yet. You can keep writing; this device will remember your answers.')
      }
      loaded.current = true
    }
    loadAnswers()
  }, [])

  const scheduleSave = useCallback((nextAnswers: Answers) => {
    if (!loaded.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      try { await requestSave(nextAnswers) }
      catch (error) { setStatus(error instanceof Error ? error.message : 'Could not save answers yet.') }
      finally { setSaving(false) }
    }, 700)
  }, [requestSave])

  function updateAnswer(id: string, value: string) {
    const nextAnswers = { ...answers, [id]: value }
    setAnswers(nextAnswers)
    localStorage.setItem(localStorageKey, JSON.stringify(nextAnswers))
    scheduleSave(nextAnswers)
  }

  async function flushSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaving(true)
    try { await requestSave(answers) }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Could not save answers yet.') }
    finally { setSaving(false) }
  }

  function saveOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      flushSave()
      ;(event.currentTarget as HTMLInputElement).blur()
    }
  }

  async function submitQuestionnaire(event: FormEvent) {
    event.preventDefault()
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSubmitting(true)
    try { await requestSave(answers, true) }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Could not submit questionnaire yet.') }
    finally { setSubmitting(false) }
  }

  return (
    <main className="min-h-screen px-4 py-10 text-[#f4eadc]">
      <AdminMenu portalHref="/portal" adminHref="/admin" />
      <div className="mx-auto max-w-4xl">
        <section className="relative overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(7,12,20,0.74),rgba(12,10,9,0.58) 42%,rgba(12,10,9,0.9)),url('/images/part-one-heart-locks-fence.jpg')] bg-cover bg-center p-6 shadow-[0_24px_60px_rgba(0,0,0,0.34)] md:p-8">
          <HeartCornerMark />
          <div className="relative z-[1]">
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Heart Unlock</p>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74] md:text-5xl">Part 1 - Heart Unlock - Questionnaire</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[rgba(244,234,220,0.84)]">Congratulations, on taking a few days, to step down into your Heart. The things we avoid, end up being the things that control our life... so we have to take time to see what we've been avoiding.</p>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[rgba(244,234,220,0.84)]">Heart work doesn't stop here, this is just the first step. There is so much more we can do to create a Healthy, Thriving, Heart.</p>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[rgba(244,234,220,0.84)]">Please take a minute for these questions!</p>
          </div>
        </section>

        <form onSubmit={submitQuestionnaire} className="mt-6 rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
          <p className="rounded-[20px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-[rgba(244,234,220,0.78)]">“The privilege of a lifetime is to become who you truly are” - Carl Jung.</p>
          <div className="mt-6 grid gap-5">
            {fields.map((field) => (
              <label key={field.id} className="block rounded-[22px] border border-[rgba(228,183,103,0.12)] bg-[rgba(255,255,255,0.03)] p-4">
                <span className="text-sm font-semibold text-[#efc578]">{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea value={answers[field.id] || ''} onChange={(event) => updateAnswer(field.id, event.target.value)} onBlur={flushSave} rows={7} className="mt-3 min-h-44 w-full resize-y whitespace-pre-wrap rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-3 leading-7 text-[#f4eadc] outline-none" />
                ) : field.type === 'choice' ? (
                  <select value={answers[field.id] || ''} onChange={(event) => updateAnswer(field.id, event.target.value)} onBlur={flushSave} className="mt-3 min-h-12 w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[#151412] px-4 py-3 text-[#f4eadc] outline-none">
                    <option value="">Choose…</option>
                    {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : (
                  <input value={answers[field.id] || ''} onChange={(event) => updateAnswer(field.id, event.target.value)} onBlur={flushSave} onKeyDown={saveOnEnter} className="mt-3 min-h-12 w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[#f4eadc] outline-none" />
                )}
              </label>
            ))}
          </div>

          <div className="mt-6 rounded-[20px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-[rgba(244,234,220,0.78)]">
            <p>As we step down into our Hearts, we step into newness in life - we learn how to feel again, and with that how to play again, how to have fun - we gain skills to create life more consciously and intentionally, and tools to thrive. We start with Heart so we can thrive in the ways that matter most. I'm here, as your advocate for your Heart. -Paul</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={flushSave} disabled={saving || submitting} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-5 font-semibold text-[#f4eadc] disabled:opacity-60">{saving ? 'Saving…' : 'Save answers'}</button>
            <button type="submit" disabled={!hasSession || submitting} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10] disabled:opacity-60">{submitting ? 'Submitting…' : submitted ? 'Submit again' : 'Submit questionnaire'}</button>
            <a href="/portal/lesson/heart-day-7" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-5 font-semibold text-[#f4eadc]">Return to course</a>
          </div>
          <p className="mt-4 text-sm text-[rgba(244,234,220,0.68)]">{completedCount} of {fields.length} answers started. {status}</p>
        </form>
      </div>
    </main>
  )
}
