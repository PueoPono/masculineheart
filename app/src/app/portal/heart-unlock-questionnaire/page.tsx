'use client'

import { FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AdminMenu } from '@/components/admin-menu'
import { HeartCornerMark } from '@/components/heart-mark'
import { supabase } from '@/lib/supabase'
import { useSiteContent } from '@/lib/site-content-store'

type FieldType = 'text' | 'textarea' | 'choice'
type QuestionField = {
  id: string
  label: string
  type: FieldType
  options?: string[]
}

type Answers = Record<string, string>

const localStorageKey = 'mhq-heart-unlock-questionnaire'

export default function HeartUnlockQuestionnairePage() {
  const { content } = useSiteContent()
  const questionnaire = content.questionnaire
  const fields = useMemo(() => questionnaire.fields as QuestionField[], [questionnaire.fields])
  const emptyAnswers = useMemo(() => Object.fromEntries(fields.map((field) => [field.id, ''])) as Answers, [fields])
  const [answers, setAnswers] = useState<Answers>({})
  const [status, setStatus] = useState(questionnaire.loadingStatus)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const loaded = useRef(false)

  const completedCount = useMemo(() => fields.filter((field) => answers[field.id]?.trim()).length, [answers, fields])

  const requestSave = useCallback(async (nextAnswers: Answers, submit = false) => {
    const sessionRes = await supabase.auth.getSession()
    const token = sessionRes.data.session?.access_token
    if (!token) {
      localStorage.setItem(localStorageKey, JSON.stringify(nextAnswers))
      setHasSession(false)
      setStatus(questionnaire.localOnlyStatus)
      return { ok: true, localOnly: true }
    }

    setHasSession(true)
    const res = await fetch('/api/heart-unlock-questionnaire', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ answers: nextAnswers, submit }),
    })
    const result = await res.json().catch(() => null) as { ok?: boolean; error?: string; submitted?: boolean; emailQueued?: boolean } | null
    if (!res.ok || !result?.ok) throw new Error(result?.error || questionnaire.saveErrorStatus)
    localStorage.setItem(localStorageKey, JSON.stringify(nextAnswers))
    if (submit) {
      setSubmitted(Boolean(result.submitted))
      setStatus(result.emailQueued ? questionnaire.submittedNotifiedStatus : questionnaire.submittedStatus)
    } else {
      setStatus(questionnaire.savedStatus)
    }
    return result
  }, [questionnaire])

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
        setStatus(questionnaire.draftStatus)
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
        setStatus(result.submitted ? questionnaire.alreadySubmittedStatus : questionnaire.savedStatus)
      } else {
        setStatus(questionnaire.loadErrorStatus)
      }
      loaded.current = true
    }
    loadAnswers()
  }, [emptyAnswers, questionnaire])

  const scheduleSave = useCallback((nextAnswers: Answers) => {
    if (!loaded.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      try { await requestSave(nextAnswers) }
      catch (error) { setStatus(error instanceof Error ? error.message : questionnaire.saveErrorStatus) }
      finally { setSaving(false) }
    }, 700)
  }, [requestSave, questionnaire.saveErrorStatus])

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
    catch (error) { setStatus(error instanceof Error ? error.message : questionnaire.saveErrorStatus) }
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
    catch (error) { setStatus(error instanceof Error ? error.message : questionnaire.submitErrorStatus) }
    finally { setSubmitting(false) }
  }

  return (
    <main className="min-h-screen px-4 py-10 text-[#f4eadc]">
      <AdminMenu portalHref="/portal" adminHref="/admin" />
      <div className="mx-auto max-w-4xl">
        <section className="relative overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(7,12,20,0.74),rgba(12,10,9,0.58) 42%,rgba(12,10,9,0.9)),url('/images/part-one-heart-locks-fence.jpg')] bg-cover bg-center p-6 shadow-[0_24px_60px_rgba(0,0,0,0.34)] md:p-8">
          <HeartCornerMark />
          <div className="relative z-[1]">
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">{questionnaire.eyebrow}</p>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74] md:text-5xl">{questionnaire.title}</h1>
            {questionnaire.introLines.map((line) => (
              <p key={line} className="mt-4 max-w-3xl text-lg leading-8 text-[rgba(244,234,220,0.84)]">{line}</p>
            ))}
          </div>
        </section>

        <form onSubmit={submitQuestionnaire} className="mt-6 rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
          <p className="rounded-[20px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-[rgba(244,234,220,0.78)]">{questionnaire.quote}</p>
          <div className="mt-6 grid gap-5">
            {fields.map((field) => (
              <label key={field.id} className="block rounded-[22px] border border-[rgba(228,183,103,0.12)] bg-[rgba(255,255,255,0.03)] p-4">
                <span className="text-sm font-semibold text-[#efc578]">{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea value={answers[field.id] || ''} onChange={(event) => updateAnswer(field.id, event.target.value)} onBlur={flushSave} rows={7} className="mt-3 min-h-44 w-full resize-y whitespace-pre-wrap rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-3 leading-7 text-[#f4eadc] outline-none" />
                ) : field.type === 'choice' ? (
                  <select value={answers[field.id] || ''} onChange={(event) => updateAnswer(field.id, event.target.value)} onBlur={flushSave} className="mt-3 min-h-12 w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[#151412] px-4 py-3 text-[#f4eadc] outline-none">
                    <option value="">{questionnaire.choosePlaceholder}</option>
                    {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : (
                  <input value={answers[field.id] || ''} onChange={(event) => updateAnswer(field.id, event.target.value)} onBlur={flushSave} onKeyDown={saveOnEnter} className="mt-3 min-h-12 w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[#f4eadc] outline-none" />
                )}
              </label>
            ))}
          </div>

          <div className="mt-6 rounded-[20px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-[rgba(244,234,220,0.78)]">
            <p>{questionnaire.closingBody}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={flushSave} disabled={saving || submitting} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-5 font-semibold text-[#f4eadc] disabled:opacity-60">{saving ? questionnaire.savingButton : questionnaire.saveButton}</button>
            <button type="submit" disabled={!hasSession || submitting} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10] disabled:opacity-60">{submitting ? questionnaire.submittingButton : submitted ? questionnaire.submitAgainButton : questionnaire.submitButton}</button>
            <Link href="/portal/lesson/heart-day-7" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-5 font-semibold text-[#f4eadc]">{questionnaire.returnToCourseLabel}</Link>
          </div>
          <p className="mt-4 text-sm text-[rgba(244,234,220,0.68)]">{completedCount} of {fields.length} {questionnaire.progressSuffix} {status}</p>
        </form>
      </div>
    </main>
  )
}
