'use client'

import { useEffect, useMemo, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { SiteEditorPreview, type SiteEditorInteractionMode, type SiteEditorPreviewSelectionWithRect } from '@/components/site-editor-preview'
import { courseTracks } from '@/lib/site-content'
import { useEditableSiteContent, type ReferenceNotes, type SiteContentOverrides } from '@/lib/site-content-store'

type SectionKey = 'landing' | 'portal' | 'locked' | 'complete' | `lesson:${string}`

type Props = {
  adminEmail: string
}

type TextEditSelection = {
  itemKey: string
  itemLabel: string
  input: 'input' | 'textarea'
}

type ReferenceSelection = {
  itemKey: string
  itemLabel: string
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs uppercase tracking-[0.14em] text-[#efc578]">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="min-h-28 rounded-[16px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[#f4eadc] outline-none" />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 rounded-[16px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 text-sm text-[#f4eadc] outline-none" />
      )}
    </label>
  )
}

function toLines(lines: string[]) {
  return lines.join('\n')
}

function fromLines(value: string) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean)
}

function toInteractionButtonClass(active: boolean) {
  return active
    ? 'border-[rgba(159,184,255,0.34)] bg-[rgba(159,184,255,0.14)] text-white'
    : 'border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] text-[rgba(244,234,220,0.78)]'
}

function inferInputType(itemKey: string) {
  return /(body|theme|support|practice|prompt|points|title)$/i.test(itemKey) ? 'textarea' : 'input'
}

export function SiteEditor({ adminEmail }: Props) {
  const {
    content,
    referenceNotes,
    setReferenceNotes,
    updateLandingField,
    updatePortalField,
    updateStatusField,
    updateLesson,
    resetSection,
    save,
    clearAll,
    loading,
    saving,
    saveError,
    updatedAt,
    updatedBy,
  } = useEditableSiteContent()

  const [selected, setSelected] = useState<SectionKey>('landing')
  const [status, setStatus] = useState('')
  const [interactionMode, setInteractionMode] = useState<SiteEditorInteractionMode>('preview')
  const [selectedReference, setSelectedReference] = useState<ReferenceSelection | null>(null)
  const [selectedTextEdit, setSelectedTextEdit] = useState<TextEditSelection | null>(null)
  const [referenceDraft, setReferenceDraft] = useState('')
  const [textEditDraft, setTextEditDraft] = useState('')
  const [sectionReferenceDraft, setSectionReferenceDraft] = useState('')
  const [popoverRect, setPopoverRect] = useState<SiteEditorPreviewSelectionWithRect['rect'] | null>(null)
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [controlsCollapsed, setControlsCollapsed] = useState(false)

  const previewHref = useMemo(() => {
    if (selected === 'landing') return '/'
    if (selected === 'portal') return '/portal'
    if (selected === 'locked') return '/portal/locked?previous=heart-intro&next=heart-day-1'
    if (selected === 'complete') return '/portal/complete?from=heart-intro&next=heart-day-1'
    return `/portal/lesson/${selected.replace('lesson:', '')}`
  }, [selected])

  const activeLesson = selected.startsWith('lesson:') ? content.lessons.find((lesson) => lesson.slug === selected.replace('lesson:', '')) : null
  const sectionNoteValue = sectionReferenceDraft
  const selectedReferenceNote = selectedReference ? referenceNotes[selectedReference.itemKey] || '' : ''
  const queuedRequests = Object.entries(referenceNotes).filter(([, value]) => value.trim())
  const queuedRequestCount = queuedRequests.length

  useEffect(() => {
    setSectionReferenceDraft(referenceNotes[selected] || '')
  }, [referenceNotes, selected])

  function clearSelectionState() {
    setSelectedReference(null)
    setSelectedTextEdit(null)
    setReferenceDraft('')
    setTextEditDraft('')
    setPopoverRect(null)
  }

  function onSelectSection(next: SectionKey) {
    setSelected(next)
    clearSelectionState()
    setInteractionMode('preview')
  }

  async function saveAll(nextReferenceNotes?: ReferenceNotes) {
    try {
      await save(nextReferenceNotes ? { referenceNotes: nextReferenceNotes } : undefined)
      setStatus('Saved to Supabase. In-page text edits and reference notes are now persisted.')
    } catch {
      setStatus('Could not save to Supabase yet. Local edits remain in this browser until the save succeeds.')
    }
  }

  async function copyAgentBrief() {
    const brief = Object.entries(referenceNotes)
      .filter(([, value]) => value.trim())
      .map(([key, value]) => `## ${key}\n${value.trim()}`)
      .join('\n\n')

    const text = brief || 'No reference notes added yet.'
    try {
      await navigator.clipboard.writeText(text)
      setStatus('Reference brief copied to clipboard.')
    } catch {
      setStatus('Could not copy automatically. Use Export JSON instead.')
    }
  }

  function exportJson() {
    const payload = { content, referenceNotes }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'masculine-heart-site-editor.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setStatus('Exported current copy + reference notes JSON.')
  }

  function updateTextByItemKey(itemKey: string, value: string) {
    if (itemKey.startsWith('landing.')) {
      const field = itemKey.replace('landing.', '')
      if (field.startsWith('overviewCards.')) {
        const [, indexText, key] = field.split('.')
        const index = Number(indexText)
        if (Number.isNaN(index)) return false
        const nextCards = content.landing.overviewCards.map((card, cardIndex) => {
          if (cardIndex !== index) return card
          return { ...card, [key]: value }
        })
        updateLandingField('overviewCards', nextCards)
        return true
      }
      if (field in content.landing) {
        updateLandingField(field as keyof typeof content.landing, value as never)
        return true
      }
      return false
    }

    if (itemKey.startsWith('portal.')) {
      const field = itemKey.replace('portal.', '')
      if (field.startsWith('trackNotes.')) {
        const [, indexText] = field.split('.')
        const index = Number(indexText)
        if (Number.isNaN(index)) return false
        const next = content.portal.trackNotes.map((entry, entryIndex) => (entryIndex === index ? value : entry))
        updatePortalField('trackNotes', next)
        return true
      }
      if (field.startsWith('trackLabels.')) {
        const [, indexText] = field.split('.')
        const index = Number(indexText)
        if (Number.isNaN(index)) return false
        const next = (content.portal.trackLabels || []).map((entry, entryIndex) => (entryIndex === index ? value : entry))
        updatePortalField('trackLabels', next)
        return true
      }
      if (field.startsWith('trackTitles.')) {
        const [, indexText] = field.split('.')
        const index = Number(indexText)
        if (Number.isNaN(index)) return false
        const next = (content.portal.trackTitles || []).map((entry, entryIndex) => (entryIndex === index ? value : entry))
        updatePortalField('trackTitles', next)
        return true
      }
      if (field.startsWith('trackDaysLabels.')) {
        const [, indexText] = field.split('.')
        const index = Number(indexText)
        if (Number.isNaN(index)) return false
        const next = (content.portal.trackDaysLabels || []).map((entry, entryIndex) => (entryIndex === index ? value : entry))
        updatePortalField('trackDaysLabels', next)
        return true
      }
      if (field in content.portal) {
        updatePortalField(field as keyof typeof content.portal, value as never)
        return true
      }
      return false
    }

    if (itemKey.startsWith('locked.')) {
      const field = itemKey.replace('locked.', '')
      if (field in content.locked) {
        updateStatusField('locked', field as keyof typeof content.locked, value)
        return true
      }
      return false
    }

    if (itemKey.startsWith('complete.')) {
      const field = itemKey.replace('complete.', '')
      if (field in content.complete) {
        updateStatusField('complete', field as keyof typeof content.complete, value)
        return true
      }
      return false
    }

    if (itemKey.startsWith('lesson:')) {
      const [lessonPrefix, field, indexText] = itemKey.split('.')
      const slug = lessonPrefix.replace('lesson:', '')
      const lesson = content.lessons.find((entry) => entry.slug === slug)
      if (!lesson) return false

      if (field === 'arc' || field === 'stepLabel' || field === 'title' || field === 'theme' || field === 'rhythmHeading' || field === 'adminUnlockedNote' || field === 'videoLabel' || field === 'videoHeading' || field === 'videoSupport' || field === 'markVideoCompleteLabel' || field === 'videoCompleteSavedLabel' || field === 'completeLessonLabel' || field === 'completeFinalLessonLabel' || field === 'supportingTextHeading' || field === 'integrationHeading' || field === 'integrationBody' || field === 'practiceHeading' || field === 'practice' || field === 'reflectionPromptsHeading' || field === 'promptLabelPrefix' || field === 'journalPromptHeading' || field === 'journalPrompt' || field === 'previousLessonLabel' || field === 'backToPortalLabel' || field === 'nextLessonLabel' || field === 'videoUrl') {
        updateLesson(lesson.id, { [field]: value })
        return true
      }

      if (field === 'supportingPoints') {
        const index = Number(indexText)
        if (Number.isNaN(index)) return false
        const next = lesson.supportingPoints.map((entry, entryIndex) => entryIndex === index ? value : entry)
        updateLesson(lesson.id, { supportingPoints: next })
        return true
      }

      if (field === 'prompts') {
        const index = Number(indexText)
        if (Number.isNaN(index)) return false
        const next = lesson.prompts.map((entry, entryIndex) => entryIndex === index ? value : entry)
        updateLesson(lesson.id, { prompts: next })
        return true
      }

      return false
    }

    return false
  }

  function getTextByItemKey(itemKey: string) {
    if (itemKey.startsWith('landing.')) {
      const field = itemKey.replace('landing.', '')
      if (field.startsWith('overviewCards.')) {
        const [, indexText, key] = field.split('.')
        const card = content.landing.overviewCards[Number(indexText)]
        return card ? String(card[key as 'title' | 'text'] || '') : ''
      }
      const value = content.landing[field as keyof typeof content.landing]
      return typeof value === 'string' ? value : ''
    }

    if (itemKey.startsWith('portal.')) {
      const field = itemKey.replace('portal.', '')
      if (field.startsWith('trackNotes.')) {
        const [, indexText] = field.split('.')
        return content.portal.trackNotes[Number(indexText)] || ''
      }
      if (field.startsWith('trackLabels.')) {
        const [, indexText] = field.split('.')
        return content.portal.trackLabels?.[Number(indexText)] || ''
      }
      if (field.startsWith('trackTitles.')) {
        const [, indexText] = field.split('.')
        return content.portal.trackTitles?.[Number(indexText)] || ''
      }
      if (field.startsWith('trackDaysLabels.')) {
        const [, indexText] = field.split('.')
        return content.portal.trackDaysLabels?.[Number(indexText)] || ''
      }
      const value = content.portal[field as keyof typeof content.portal]
      return typeof value === 'string' ? value : ''
    }

    if (itemKey.startsWith('locked.')) {
      const field = itemKey.replace('locked.', '')
      const value = content.locked[field as keyof typeof content.locked]
      if (field === 'backToPortalLabel' && (!value || typeof value !== 'string')) return 'Back to portal'
      return typeof value === 'string' ? value : ''
    }

    if (itemKey.startsWith('complete.')) {
      const field = itemKey.replace('complete.', '')
      const value = content.complete[field as keyof typeof content.complete]
      if (field === 'backToPortalLabel' && (!value || typeof value !== 'string')) return 'Back to portal'
      return typeof value === 'string' ? value : ''
    }

    if (itemKey.startsWith('lesson:')) {
      const [lessonPrefix, field, indexText] = itemKey.split('.')
      const slug = lessonPrefix.replace('lesson:', '')
      const lesson = content.lessons.find((entry) => entry.slug === slug)
      if (!lesson) return ''
      if (field === 'supportingPoints') return lesson.supportingPoints[Number(indexText)] || ''
      if (field === 'prompts') return lesson.prompts[Number(indexText)] || ''
      const value = lesson[field as keyof typeof lesson]
      return typeof value === 'string' ? value : ''
    }

    return ''
  }

  function buildContentOverridesWithText(itemKey: string, value: string): SiteContentOverrides | null {
    const nextContent = JSON.parse(JSON.stringify(content)) as typeof content

    if (itemKey.startsWith('landing.')) {
      const field = itemKey.replace('landing.', '')
      if (field.startsWith('overviewCards.')) {
        const [, indexText, key] = field.split('.')
        const index = Number(indexText)
        if (Number.isNaN(index) || !nextContent.landing.overviewCards[index]) return null
        nextContent.landing.overviewCards[index] = { ...nextContent.landing.overviewCards[index], [key]: value }
        return nextContent as SiteContentOverrides
      }
      if (!(field in nextContent.landing)) return null
      ;(nextContent.landing as Record<string, unknown>)[field] = value
      return nextContent as SiteContentOverrides
    }

    if (itemKey.startsWith('portal.')) {
      const field = itemKey.replace('portal.', '')
      if (field.startsWith('trackNotes.')) {
        const [, indexText] = field.split('.')
        const index = Number(indexText)
        if (Number.isNaN(index)) return null
        nextContent.portal.trackNotes[index] = value
        return nextContent as SiteContentOverrides
      }
      if (field.startsWith('trackLabels.')) {
        const [, indexText] = field.split('.')
        const index = Number(indexText)
        if (Number.isNaN(index) || !nextContent.portal.trackLabels) return null
        nextContent.portal.trackLabels[index] = value
        return nextContent as SiteContentOverrides
      }
      if (field.startsWith('trackTitles.')) {
        const [, indexText] = field.split('.')
        const index = Number(indexText)
        if (Number.isNaN(index) || !nextContent.portal.trackTitles) return null
        nextContent.portal.trackTitles[index] = value
        return nextContent as SiteContentOverrides
      }
      if (field.startsWith('trackDaysLabels.')) {
        const [, indexText] = field.split('.')
        const index = Number(indexText)
        if (Number.isNaN(index) || !nextContent.portal.trackDaysLabels) return null
        nextContent.portal.trackDaysLabels[index] = value
        return nextContent as SiteContentOverrides
      }
      if (!(field in nextContent.portal)) return null
      ;(nextContent.portal as Record<string, unknown>)[field] = value
      return nextContent as SiteContentOverrides
    }

    if (itemKey.startsWith('locked.')) {
      const field = itemKey.replace('locked.', '')
      if (!(field in nextContent.locked)) return null
      ;(nextContent.locked as Record<string, unknown>)[field] = value
      return nextContent as SiteContentOverrides
    }

    if (itemKey.startsWith('complete.')) {
      const field = itemKey.replace('complete.', '')
      if (!(field in nextContent.complete)) return null
      ;(nextContent.complete as Record<string, unknown>)[field] = value
      return nextContent as SiteContentOverrides
    }

    if (itemKey.startsWith('lesson:')) {
      const [lessonPrefix, field, indexText] = itemKey.split('.')
      const slug = lessonPrefix.replace('lesson:', '')
      const lesson = nextContent.lessons.find((entry) => entry.slug === slug)
      if (!lesson) return null
      if (field === 'supportingPoints') {
        const index = Number(indexText)
        if (Number.isNaN(index)) return null
        lesson.supportingPoints[index] = value
        return nextContent as SiteContentOverrides
      }
      if (field === 'prompts') {
        const index = Number(indexText)
        if (Number.isNaN(index)) return null
        lesson.prompts[index] = value
        return nextContent as SiteContentOverrides
      }
      if (!(field in lesson)) return null
      ;(lesson as Record<string, unknown>)[field] = value
      return nextContent as SiteContentOverrides
    }

    return null
  }

  function selectPreviewTarget(selection: SiteEditorPreviewSelectionWithRect) {
    setPopoverRect(selection.rect)
    if (interactionMode === 'reference') {
      setSelectedTextEdit(null)
      setSelectedReference({ itemKey: selection.itemKey, itemLabel: selection.itemLabel })
      setReferenceDraft(referenceNotes[selection.itemKey] || '')
      return
    }
    if (interactionMode === 'text-edit') {
      setSelectedReference(null)
      setReferenceDraft('')
      setTextEditDraft(getTextByItemKey(selection.itemKey))
      setSelectedTextEdit({ itemKey: selection.itemKey, itemLabel: selection.itemLabel, input: inferInputType(selection.itemKey) })
    }
  }

  async function addReferenceNote() {
    if (!selectedReference) return
    const nextReferenceNotes = {
      ...referenceNotes,
      [selectedReference.itemKey]: referenceDraft,
    }
    setReferenceNotes(nextReferenceNotes)
    try {
      await save({ referenceNotes: nextReferenceNotes })
      setStatus(`Saved request for ${selectedReference.itemLabel} to Supabase.`)
      clearSelectionState()
    } catch {
      setStatus(`Saved request locally for ${selectedReference.itemLabel}, but Supabase save failed. Use Save all to Supabase to retry.`)
    }
  }

  function updateReferenceDraft(value: string) {
    setReferenceDraft(value)
  }

  async function deleteReferenceNote(itemKey: string) {
    const nextReferenceNotes = Object.fromEntries(Object.entries(referenceNotes).filter(([key]) => key !== itemKey))
    setReferenceNotes(nextReferenceNotes)
    try {
      await save({ referenceNotes: nextReferenceNotes })
      setStatus(`Deleted queued request ${itemKey} from Supabase.`)
    } catch {
      setStatus(`Deleted ${itemKey} locally, but Supabase save failed. Use Save all to Supabase to retry.`)
    }
  }

  async function saveSelectedTextAndClose() {
    if (!selectedTextEdit) return
    const nextOverrides = buildContentOverridesWithText(selectedTextEdit.itemKey, textEditDraft)
    if (!nextOverrides) {
      setStatus(`Direct editing is not available for ${selectedTextEdit.itemLabel} yet.`)
      return
    }
    updateTextByItemKey(selectedTextEdit.itemKey, textEditDraft)
    try {
      await save({ overrides: nextOverrides })
      setStatus(`Saved text edit for ${selectedTextEdit.itemLabel} to Supabase.`)
      clearSelectionState()
    } catch {
      setStatus('Text edit is saved locally, but Supabase save failed. Use Save all to Supabase to retry.')
    }
  }

  async function submitSectionReferenceNote() {
    const nextReferenceNotes = { ...referenceNotes }
    if (sectionReferenceDraft.trim()) {
      nextReferenceNotes[selected] = sectionReferenceDraft
    } else {
      delete nextReferenceNotes[selected]
    }
    setReferenceNotes(nextReferenceNotes)
    try {
      await save({ referenceNotes: nextReferenceNotes })
      setStatus(`Submitted request for ${selected} to Supabase.`)
    } catch {
      setStatus(`Request for ${selected} is saved locally, but Supabase save failed. Use Save all to Supabase to retry.`)
    }
  }

  function updateSectionReferenceNote(value: string) {
    setSectionReferenceDraft(value)
  }

  function updateSelectedTextEditValue(value: string) {
    setTextEditDraft(value)
  }

  function getSelectedTextEditValue() {
    return textEditDraft
  }

  const isMobileViewport = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const popoverStyle = popoverRect
    ? isMobileViewport
      ? undefined
      : {
          top: Math.max(popoverRect.top + window.scrollY - 8, 12),
          left: Math.max(popoverRect.left + window.scrollX, 12),
        }
    : undefined

  const previewFrameWidth = previewViewport === 'desktop' ? 1280 : 390
  const previewFrameLabel = previewViewport === 'desktop' ? 'Desktop frame · 1280px' : 'Mobile frame · real page width'

  return (
    <div className={`grid gap-6 ${previewViewport === 'desktop' ? 'xl:grid-cols-[280px_minmax(0,1fr)]' : 'xl:grid-cols-[260px_minmax(390px,430px)_minmax(320px,0.9fr)] 2xl:grid-cols-[300px_minmax(390px,440px)_minmax(420px,0.95fr)]'}`}>
      <aside className="rounded-[24px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-4 sm:rounded-[28px] sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">Editor sections</p>
            <p className="mt-2 text-sm text-[rgba(244,234,220,0.72)]">Signed in as {adminEmail}</p>
            <p className="mt-1 text-xs text-[rgba(244,234,220,0.52)]">{loading ? 'Loading Supabase content…' : updatedAt ? `Last saved ${new Date(updatedAt).toLocaleString()}${updatedBy ? ` · ${updatedBy}` : ''}` : 'No Supabase save yet. Defaults are loaded.'}</p>
          </div>
          <HeartCornerMark />
        </div>
        <div className="grid gap-2 md:max-h-[70vh] md:overflow-y-auto md:pr-1">
          {[
            ['landing', 'Landing'],
            ['portal', 'Portal'],
            ['locked', 'Locked state'],
            ['complete', 'Complete state'],
          ].map(([key, label]) => (
            <button key={key} onClick={() => onSelectSection(key as SectionKey)} className={`rounded-[16px] px-4 py-3 text-left text-sm ${selected === key ? 'bg-[rgba(220,164,83,0.2)] text-[#f4eadc]' : 'bg-[rgba(255,255,255,0.03)] text-[rgba(244,234,220,0.75)]'}`}>
              {label}
            </button>
          ))}
          <div className="mt-4 text-xs uppercase tracking-[0.16em] text-[#efc578]">Lessons</div>
          {content.lessons.map((lesson) => {
            const key = `lesson:${lesson.slug}` as SectionKey
            return (
              <button key={lesson.id} onClick={() => onSelectSection(key)} className={`rounded-[16px] px-4 py-3 text-left text-sm ${selected === key ? 'bg-[rgba(220,164,83,0.2)] text-[#f4eadc]' : 'bg-[rgba(255,255,255,0.03)] text-[rgba(244,234,220,0.75)]'}`}>
                {lesson.stepLabel} · {lesson.title}
              </button>
            )
          })}
        </div>
      </aside>

      <section className="relative rounded-[24px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-0 sm:rounded-[28px] sm:p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-3 pt-3 sm:px-0 sm:pt-0">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">Live-size page preview</p>
            <h2 className="mt-1 text-2xl font-semibold">{selected.startsWith('lesson:') ? activeLesson?.title : selected}</h2>
            <p className="mt-1 text-sm text-[rgba(244,234,220,0.68)]">This preview keeps the actual page width. Reference mode lets you submit object-level change requests; text edit mode lets you click/tap live text blocks and edit them in context.</p>
          </div>
          <div className="grid w-full gap-2 text-sm sm:flex sm:w-auto sm:flex-wrap">
            <button onClick={() => { setPreviewViewport('desktop'); clearSelectionState() }} className={`rounded-full border px-4 py-2 text-center ${previewViewport === 'desktop' ? 'border-[rgba(239,197,120,0.42)] bg-[rgba(239,197,120,0.16)] text-white' : 'border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] text-[rgba(244,234,220,0.78)]'}`}>Desktop view</button>
            <button onClick={() => { setPreviewViewport('mobile'); clearSelectionState() }} className={`rounded-full border px-4 py-2 text-center ${previewViewport === 'mobile' ? 'border-[rgba(239,197,120,0.42)] bg-[rgba(239,197,120,0.16)] text-white' : 'border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] text-[rgba(244,234,220,0.78)]'}`}>Mobile view</button>
            <button onClick={() => { setInteractionMode((current) => current === 'text-edit' ? 'preview' : 'text-edit'); clearSelectionState() }} className={`rounded-full border px-4 py-2 text-center ${toInteractionButtonClass(interactionMode === 'text-edit')}`}>Text edit mode</button>
            <button onClick={() => { setInteractionMode((current) => current === 'reference' ? 'preview' : 'reference'); clearSelectionState() }} className={`rounded-full border px-4 py-2 text-center ${toInteractionButtonClass(interactionMode === 'reference')}`}>Reference mode</button>
            <a href={previewHref} target="_blank" className="rounded-full border border-[rgba(228,183,103,0.18)] px-4 py-2 text-center text-[#f4eadc]">Open full page</a>
          </div>
        </div>

        <div className="mb-4 mx-3 rounded-[18px] border border-[rgba(159,184,255,0.24)] bg-[rgba(159,184,255,0.08)] p-4 text-sm text-[#d8e6ff] sm:mx-0">
          <strong className="text-white">Request queue: {queuedRequestCount}</strong>
          <span className="ml-2 text-[rgba(216,230,255,0.78)]">queued request{queuedRequestCount === 1 ? '' : 's'} saved for agent review. Implemented requests are cleared from this queue.</span>
        </div>

        <div className="overflow-x-auto bg-[#050505]">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs text-[rgba(244,234,220,0.58)]">
            <span>{previewFrameLabel}</span>
            <span>{interactionMode === 'preview' ? 'Preview only' : interactionMode === 'reference' ? 'Click any highlighted block to add a reference note' : 'Click any highlighted text block to edit'}</span>
          </div>
          <div style={{ width: previewFrameWidth, maxWidth: previewViewport === 'mobile' ? '100%' : undefined }} className="max-w-none">
            <SiteEditorPreview
              selected={selected}
              content={content}
              courseTracks={courseTracks}
              adminEmail={adminEmail}
              interactionMode={interactionMode}
              selectedItemKey={selectedReference?.itemKey || selectedTextEdit?.itemKey || null}
              onSelectItem={selectPreviewTarget}
              viewport={previewViewport}
            />
          </div>
        </div>

        {interactionMode === 'reference' && selectedReference && (popoverStyle || isMobileViewport) ? (
          <div className="fixed inset-x-3 bottom-3 z-20 rounded-[18px] border border-[rgba(159,184,255,0.28)] bg-[rgba(9,13,20,0.96)] p-3 shadow-[0_18px_48px_rgba(0,0,0,0.34)] md:absolute md:inset-x-auto md:bottom-auto md:w-[280px]" style={popoverStyle}>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#f3d68d]">{selectedReference.itemKey}</div>
            <div className="mt-1 text-sm font-medium text-white">{selectedReference.itemLabel}</div>
            {selectedReferenceNote ? <div className="mt-3 rounded-[12px] border border-white/8 bg-[rgba(255,255,255,0.03)] px-3 py-2 text-xs text-white/78">Current note: {selectedReferenceNote}</div> : null}
            <label className="mt-3 grid gap-1 text-sm text-white/78">
              <span>Full change request</span>
              <textarea value={referenceDraft} onChange={(event) => updateReferenceDraft(event.target.value)} rows={5} className="min-h-[104px] rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2 text-white outline-none" />
            </label>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={clearSelectionState} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/72">Cancel</button>
              <button type="button" onClick={addReferenceNote} disabled={!referenceDraft.trim() || saving} className="rounded-full border border-[rgba(159,184,255,0.28)] bg-[rgba(159,184,255,0.12)] px-3 py-1 text-xs text-[#d8e6ff] disabled:opacity-50">{saving ? 'Saving…' : 'Save and submit request'}</button>
            </div>
          </div>
        ) : null}

        {interactionMode === 'text-edit' && selectedTextEdit && (popoverStyle || isMobileViewport) ? (
          <div className="fixed inset-x-3 bottom-3 z-20 rounded-[18px] border border-[rgba(159,184,255,0.28)] bg-[rgba(9,13,20,0.96)] p-3 shadow-[0_18px_48px_rgba(0,0,0,0.34)] md:absolute md:inset-x-auto md:bottom-auto md:w-[280px]" style={popoverStyle}>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#d8e6ff]">{selectedTextEdit.itemKey}</div>
            <div className="mt-1 text-sm font-medium text-white">{selectedTextEdit.itemLabel}</div>
            <label className="mt-3 grid gap-1 text-sm text-white/78">
              <span>Edit text</span>
              {selectedTextEdit.input === 'textarea' ? (
                <textarea value={getSelectedTextEditValue()} onChange={(event) => updateSelectedTextEditValue(event.target.value)} rows={6} className="min-h-[118px] rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2 text-white outline-none" />
              ) : (
                <input value={getSelectedTextEditValue()} onChange={(event) => updateSelectedTextEditValue(event.target.value)} className="rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2 text-white outline-none" />
              )}
            </label>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={clearSelectionState} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/72">Cancel</button>
              <button type="button" onClick={saveSelectedTextAndClose} disabled={saving} className="rounded-full border border-[rgba(159,184,255,0.28)] bg-[rgba(159,184,255,0.12)] px-3 py-1 text-xs text-[#d8e6ff] disabled:opacity-50">{saving ? 'Saving…' : 'Save text to Supabase'}</button>
            </div>
          </div>
        ) : null}
      </section>

      <aside className={`rounded-[24px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-4 sm:rounded-[28px] sm:p-5 ${previewViewport === 'desktop' ? 'xl:col-start-2' : ''}`}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">Editor controls</p>
            <p className="mt-2 text-sm text-[rgba(244,234,220,0.72)]">Manual field editing remains available alongside the in-page editor.</p>
          </div>
          <div className="grid w-full gap-2 text-sm sm:flex sm:w-auto sm:flex-wrap">
            {previewViewport === 'desktop' ? <button type="button" onClick={() => setControlsCollapsed((current) => !current)} className="rounded-full border border-[rgba(228,183,103,0.18)] px-4 py-2 text-[#f4eadc]">{controlsCollapsed ? 'Show controls' : 'Collapse controls'}</button> : null}
            <button onClick={() => saveAll()} disabled={saving} className="rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-4 py-2 font-semibold text-[#2d1b10] disabled:opacity-60">{saving ? 'Saving…' : 'Save all to Supabase'}</button>
            <button onClick={copyAgentBrief} className="rounded-full border border-[rgba(228,183,103,0.18)] px-4 py-2 text-[#f4eadc]">Copy agent brief</button>
            <button onClick={exportJson} className="rounded-full border border-[rgba(228,183,103,0.18)] px-4 py-2 text-[#f4eadc]">Export JSON</button>
            <button onClick={() => { if (activeLesson) resetSection('lesson', activeLesson.id); else resetSection(selected as 'landing' | 'portal' | 'locked' | 'complete'); clearSelectionState(); setStatus('Reset the selected section to defaults. Save to apply it.') }} className="rounded-full border border-[rgba(228,183,103,0.18)] px-4 py-2 text-[#f4eadc]">Reset section</button>
            <button onClick={() => { clearAll(); clearSelectionState(); setStatus('Cleared all local editor overrides and notes. Save to push the reset state to Supabase.') }} className="rounded-full border border-[rgba(228,183,103,0.18)] px-4 py-2 text-[#f4eadc]">Clear all</button>
          </div>
        </div>

        <div className={`${previewViewport === 'desktop' && controlsCollapsed ? 'hidden' : 'grid'} gap-6`}>
          {selected === 'landing' ? (
            <>
              <Field label="Hero eyebrow" value={content.landing.heroEyebrow} onChange={(value) => updateLandingField('heroEyebrow', value)} />
              <Field label="Hero title" value={content.landing.heroTitle} onChange={(value) => updateLandingField('heroTitle', value)} multiline />
              <Field label="Hero body" value={content.landing.heroBody} onChange={(value) => updateLandingField('heroBody', value)} multiline />
              <Field label="Hero support" value={content.landing.heroSupport} onChange={(value) => updateLandingField('heroSupport', value)} multiline />
              <Field label="Purchase heading" value={content.landing.purchaseHeading} onChange={(value) => updateLandingField('purchaseHeading', value)} />
            </>
          ) : null}

          {selected === 'portal' ? (
            <>
              <Field label="Portal eyebrow" value={content.portal.eyebrow} onChange={(value) => updatePortalField('eyebrow', value)} />
              <Field label="Portal title" value={content.portal.title} onChange={(value) => updatePortalField('title', value)} />
              <Field label="Quest map body" value={content.portal.mapBody} onChange={(value) => updatePortalField('mapBody', value)} multiline />
              <Field label="Integration body" value={content.portal.integrationBody} onChange={(value) => updatePortalField('integrationBody', value)} multiline />
            </>
          ) : null}

          {selected === 'locked' ? (
            <>
              <Field label="Locked title" value={content.locked.title} onChange={(value) => updateStatusField('locked', 'title', value)} />
              <Field label="Locked body" value={content.locked.body} onChange={(value) => updateStatusField('locked', 'body', value)} multiline />
            </>
          ) : null}

          {selected === 'complete' ? (
            <>
              <Field label="Complete title" value={content.complete.title} onChange={(value) => updateStatusField('complete', 'title', value)} />
              <Field label="Complete body" value={content.complete.body} onChange={(value) => updateStatusField('complete', 'body', value)} multiline />
            </>
          ) : null}

          {activeLesson ? (
            <>
              <Field label="Lesson title" value={activeLesson.title} onChange={(value) => updateLesson(activeLesson.id, { title: value })} />
              <Field label="Theme" value={activeLesson.theme} onChange={(value) => updateLesson(activeLesson.id, { theme: value })} multiline />
              <Field label="Video label" value={activeLesson.videoLabel} onChange={(value) => updateLesson(activeLesson.id, { videoLabel: value })} />
              <Field label="Video heading" value={activeLesson.videoHeading || ''} onChange={(value) => updateLesson(activeLesson.id, { videoHeading: value })} />
              <Field label="Video URL / embed URL" value={activeLesson.videoUrl} onChange={(value) => updateLesson(activeLesson.id, { videoUrl: value })} />
              <Field label="Optional video summary/support (shown only when filled)" value={activeLesson.videoSupport} onChange={(value) => updateLesson(activeLesson.id, { videoSupport: value })} multiline />
              <Field label="Mark video complete button" value={activeLesson.markVideoCompleteLabel || ''} onChange={(value) => updateLesson(activeLesson.id, { markVideoCompleteLabel: value })} />
              <Field label="Video complete saved button" value={activeLesson.videoCompleteSavedLabel || ''} onChange={(value) => updateLesson(activeLesson.id, { videoCompleteSavedLabel: value })} />
              <Field label="Complete lesson button" value={activeLesson.completeLessonLabel || ''} onChange={(value) => updateLesson(activeLesson.id, { completeLessonLabel: value })} />
              <Field label="Complete final lesson button" value={activeLesson.completeFinalLessonLabel || ''} onChange={(value) => updateLesson(activeLesson.id, { completeFinalLessonLabel: value })} />
              <Field label="Supporting text heading" value={activeLesson.supportingTextHeading || ''} onChange={(value) => updateLesson(activeLesson.id, { supportingTextHeading: value })} />
              <Field label="Supporting points (one per line)" value={toLines(activeLesson.supportingPoints)} onChange={(value) => updateLesson(activeLesson.id, { supportingPoints: fromLines(value) })} multiline />
              <Field label="Lesson rhythm heading" value={activeLesson.rhythmHeading || ''} onChange={(value) => updateLesson(activeLesson.id, { rhythmHeading: value })} />
              <Field label="Integration body / lesson rhythm body" value={activeLesson.integrationBody} onChange={(value) => updateLesson(activeLesson.id, { integrationBody: value })} multiline />
              <Field label="Practice heading" value={activeLesson.practiceHeading || ''} onChange={(value) => updateLesson(activeLesson.id, { practiceHeading: value })} />
              <Field label="Practice" value={activeLesson.practice} onChange={(value) => updateLesson(activeLesson.id, { practice: value })} multiline />
              <Field label="Reflection prompts heading" value={activeLesson.reflectionPromptsHeading || ''} onChange={(value) => updateLesson(activeLesson.id, { reflectionPromptsHeading: value })} />
              <Field label="Prompt label prefix" value={activeLesson.promptLabelPrefix || ''} onChange={(value) => updateLesson(activeLesson.id, { promptLabelPrefix: value })} />
              <Field label="Reflection prompts (one per line)" value={toLines(activeLesson.prompts)} onChange={(value) => updateLesson(activeLesson.id, { prompts: fromLines(value) })} multiline />
              <Field label="Journal prompt heading" value={activeLesson.journalPromptHeading || ''} onChange={(value) => updateLesson(activeLesson.id, { journalPromptHeading: value })} />
              <Field label="Journal prompt" value={activeLesson.journalPrompt} onChange={(value) => updateLesson(activeLesson.id, { journalPrompt: value })} multiline />
              <Field label="Previous lesson button" value={activeLesson.previousLessonLabel || ''} onChange={(value) => updateLesson(activeLesson.id, { previousLessonLabel: value })} />
              <Field label="Back to portal button" value={activeLesson.backToPortalLabel || ''} onChange={(value) => updateLesson(activeLesson.id, { backToPortalLabel: value })} />
              <Field label="Next lesson button" value={activeLesson.nextLessonLabel || ''} onChange={(value) => updateLesson(activeLesson.id, { nextLessonLabel: value })} />
            </>
          ) : null}

          <div className="rounded-[22px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">Section reference editor</p>
            <p className="mt-2 text-sm text-[rgba(244,234,220,0.72)]">This remains for broad page-level requests. For object-level requests, use Reference mode in the page view. Nothing is queued until you click Save and submit request.</p>
            <textarea value={sectionNoteValue} onChange={(event) => updateSectionReferenceNote(event.target.value)} rows={8} className="mt-4 min-h-40 w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[#f4eadc] outline-none" placeholder="Example: tighten the lesson intro, move the practice block higher, add a VSL beneath the video, etc." />
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => setSectionReferenceDraft(referenceNotes[selected] || '')} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/72">Cancel</button>
              <button type="button" onClick={submitSectionReferenceNote} disabled={!sectionReferenceDraft.trim() || saving} className="rounded-full border border-[rgba(159,184,255,0.28)] bg-[rgba(159,184,255,0.12)] px-3 py-1 text-xs text-[#d8e6ff] disabled:opacity-50">{saving ? 'Saving…' : 'Save and submit request'}</button>
            </div>
          </div>

          <div className="rounded-[22px] border border-[rgba(159,184,255,0.18)] bg-[rgba(159,184,255,0.06)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#d8e6ff]">Queued requests</p>
                <p className="mt-2 text-sm text-[rgba(244,234,220,0.72)]">{queuedRequestCount} request{queuedRequestCount === 1 ? '' : 's'} currently saved in Supabase for agent review. Each request can be expanded or deleted.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {queuedRequestCount ? queuedRequests.map(([itemKey, note]) => (
                <details key={itemKey} className="rounded-[16px] border border-white/10 bg-[rgba(0,0,0,0.18)] p-3">
                  <summary className="cursor-pointer text-sm font-medium text-white">{itemKey}</summary>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-[rgba(244,234,220,0.78)]">{note}</p>
                  <button type="button" onClick={() => deleteReferenceNote(itemKey)} disabled={saving} className="mt-3 rounded-full border border-[rgba(255,154,120,0.28)] bg-[rgba(255,154,120,0.08)] px-3 py-1 text-xs text-[#ffd2c4] disabled:opacity-50">Delete this queued request</button>
                </details>
              )) : <p className="rounded-[16px] border border-white/10 bg-[rgba(0,0,0,0.14)] p-3 text-sm text-[rgba(244,234,220,0.64)]">No queued requests.</p>}
            </div>
          </div>

          {saveError ? <div className="rounded-[18px] border border-[rgba(183,86,63,0.32)] bg-[rgba(74,24,17,0.35)] p-4 text-sm text-[rgba(255,219,210,0.88)]">Save error: {saveError}</div> : null}
          {status ? <div className="rounded-[18px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[rgba(244,234,220,0.76)]">{status}</div> : null}
        </div>
      </aside>
    </div>
  )
}
