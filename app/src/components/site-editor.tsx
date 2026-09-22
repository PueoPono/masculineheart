'use client'

import { useMemo, useState } from 'react'
import { HeartCornerMark } from '@/components/heart-mark'
import { SiteEditorPreview, type SiteEditorInteractionMode, type SiteEditorPreviewSelectionWithRect } from '@/components/site-editor-preview'
import { courseTracks } from '@/lib/site-content'
import { useEditableSiteContent } from '@/lib/site-content-store'

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
  const sectionNoteValue = referenceNotes[selected] || ''
  const selectedReferenceNote = selectedReference ? referenceNotes[selectedReference.itemKey] || '' : ''

  function clearSelectionState() {
    setSelectedReference(null)
    setSelectedTextEdit(null)
    setReferenceDraft('')
    setPopoverRect(null)
  }

  function onSelectSection(next: SectionKey) {
    setSelected(next)
    clearSelectionState()
    setInteractionMode('preview')
  }

  async function saveAll() {
    try {
      await save()
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
      setSelectedTextEdit({ itemKey: selection.itemKey, itemLabel: selection.itemLabel, input: inferInputType(selection.itemKey) })
    }
  }

  function addReferenceNote() {
    if (!selectedReference) return
    setReferenceNotes((current) => ({
      ...current,
      [selectedReference.itemKey]: referenceDraft,
    }))
    setStatus(`Saved reference note for ${selectedReference.itemLabel}. Click Save to persist it to Supabase.`)
  }

  function updateSelectedTextEditValue(value: string) {
    if (!selectedTextEdit) return
    const ok = updateTextByItemKey(selectedTextEdit.itemKey, value)
    if (!ok) {
      setStatus(`Direct editing is not available for ${selectedTextEdit.itemLabel} yet.`)
    }
  }

  function getSelectedTextEditValue() {
    return selectedTextEdit ? getTextByItemKey(selectedTextEdit.itemKey) : ''
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
  const previewFrameLabel = previewViewport === 'desktop' ? 'Desktop frame · 1280px' : 'Mobile frame · 390px'

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

      <section className="relative rounded-[24px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-3 sm:rounded-[28px] sm:p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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

        <div className="overflow-x-auto bg-[#050505]">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs text-[rgba(244,234,220,0.58)]">
            <span>{previewFrameLabel}</span>
            <span>{interactionMode === 'preview' ? 'Preview only' : interactionMode === 'reference' ? 'Click any highlighted block to add a reference note' : 'Click any highlighted text block to edit'}</span>
          </div>
          <div style={{ width: previewFrameWidth }} className="mx-auto max-w-none">
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
              <span>Reference note</span>
              <textarea value={referenceDraft} onChange={(event) => setReferenceDraft(event.target.value)} rows={5} className="min-h-[104px] rounded-[14px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2 text-white outline-none" />
            </label>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={clearSelectionState} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/72">Done</button>
              <button type="button" onClick={addReferenceNote} disabled={!referenceDraft.trim()} className="rounded-full border border-[rgba(159,184,255,0.28)] bg-[rgba(159,184,255,0.12)] px-3 py-1 text-xs text-[#d8e6ff] disabled:opacity-50">Save note</button>
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
              <button type="button" onClick={clearSelectionState} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/72">Done</button>
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
            <button onClick={saveAll} disabled={saving} className="rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-4 py-2 font-semibold text-[#2d1b10] disabled:opacity-60">{saving ? 'Saving…' : 'Save to Supabase'}</button>
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
              <Field label="Video URL / embed URL" value={activeLesson.videoUrl} onChange={(value) => updateLesson(activeLesson.id, { videoUrl: value })} />
              <Field label="Video support" value={activeLesson.videoSupport} onChange={(value) => updateLesson(activeLesson.id, { videoSupport: value })} multiline />
              <Field label="Supporting points (one per line)" value={toLines(activeLesson.supportingPoints)} onChange={(value) => updateLesson(activeLesson.id, { supportingPoints: fromLines(value) })} multiline />
              <Field label="Integration body" value={activeLesson.integrationBody} onChange={(value) => updateLesson(activeLesson.id, { integrationBody: value })} multiline />
              <Field label="Practice" value={activeLesson.practice} onChange={(value) => updateLesson(activeLesson.id, { practice: value })} multiline />
              <Field label="Reflection prompts (one per line)" value={toLines(activeLesson.prompts)} onChange={(value) => updateLesson(activeLesson.id, { prompts: fromLines(value) })} multiline />
              <Field label="Journal prompt" value={activeLesson.journalPrompt} onChange={(value) => updateLesson(activeLesson.id, { journalPrompt: value })} multiline />
            </>
          ) : null}

          <div className="rounded-[22px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">Section reference editor</p>
            <p className="mt-2 text-sm text-[rgba(244,234,220,0.72)]">This remains for broad page-level notes. For object-level notes, use Reference mode in the page view.</p>
            <textarea value={sectionNoteValue} onChange={(event) => setReferenceNotes((current) => ({ ...current, [selected]: event.target.value }))} rows={8} className="mt-4 min-h-40 w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[#f4eadc] outline-none" placeholder="Example: tighten the lesson intro, move the practice block higher, add a VSL beneath the video, etc." />
          </div>

          {saveError ? <div className="rounded-[18px] border border-[rgba(183,86,63,0.32)] bg-[rgba(74,24,17,0.35)] p-4 text-sm text-[rgba(255,219,210,0.88)]">Save error: {saveError}</div> : null}
          {status ? <div className="rounded-[18px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[rgba(244,234,220,0.76)]">{status}</div> : null}
        </div>
      </aside>
    </div>
  )
}
