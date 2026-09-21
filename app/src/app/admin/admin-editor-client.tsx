'use client'

import { useEffect, useMemo, useState } from 'react'

type EditableField = {
  key: string
  label: string
  kind: 'text' | 'textarea' | 'list'
  textValue: string
  referenceValue?: string
  status?: string
  updatedAt?: string | null
  publishedAt?: string | null
  archive?: { action: string; at: string; note: string }[]
}

type EditablePage = {
  slug: string
  label: string
  path: string
  fields: EditableField[]
}

type ActiveField = {
  page: EditablePage
  field: EditableField
}

function fieldInput(field: EditableField, value: string, onChange: (value: string) => void) {
  const common = 'w-full rounded-[18px] border border-[rgba(228,183,103,0.22)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[#f4eadc] outline-none focus:border-[#dca453]'
  if (field.kind === 'text') {
    return <input value={value} onChange={(event) => onChange(event.target.value)} className={common} />
  }
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`${common} min-h-52 font-sans leading-7`}
      placeholder={field.kind === 'list' ? 'One item per line' : 'Enter replacement text'}
    />
  )
}

export function AdminEditorClient() {
  const [pages, setPages] = useState<EditablePage[]>([])
  const [selectedSlug, setSelectedSlug] = useState('home')
  const [active, setActive] = useState<ActiveField | null>(null)
  const [draftText, setDraftText] = useState('')
  const [draftReference, setDraftReference] = useState('')
  const [tab, setTab] = useState<'text' | 'reference'>('text')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('Loading editor content…')
  const [lastSaved, setLastSaved] = useState('')

  useEffect(() => {
    let activeRequest = true
    async function load() {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/editor-content', { cache: 'no-store' })
        const data = await response.json()
        if (!activeRequest) return
        setPages(data.pages || [])
        setStatus(data.ok ? 'Supabase editor content loaded.' : `Supabase editor table not ready: ${data.error || 'unknown error'}`)
      } catch (error) {
        if (!activeRequest) return
        setStatus(error instanceof Error ? error.message : 'Could not load editor content.')
      } finally {
        if (activeRequest) setLoading(false)
      }
    }
    load()
    return () => {
      activeRequest = false
    }
  }, [])

  const selectedPage = useMemo(() => pages.find((page) => page.slug === selectedSlug) || pages[0] || null, [pages, selectedSlug])
  const origin = typeof window === 'undefined' ? '' : window.location.origin

  function openField(page: EditablePage, field: EditableField, nextTab: 'text' | 'reference' = 'text') {
    setActive({ page, field })
    setDraftText(field.textValue || '')
    setDraftReference(field.referenceValue || '')
    setTab(nextTab)
    setStatus(`Editing ${page.label} · ${field.label}`)
  }

  async function save(action: 'save_draft' | 'publish_requested' | 'archive' = 'save_draft') {
    if (!active) return
    setSaving(true)
    setStatus('Saving to Supabase…')
    try {
      const response = await fetch('/api/admin/editor-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageSlug: active.page.slug,
          fieldKey: active.field.key,
          textValue: draftText,
          referenceValue: draftReference,
          action,
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.error || 'Save failed')
      setPages((current) =>
        current.map((page) =>
          page.slug !== active.page.slug
            ? page
            : {
                ...page,
                fields: page.fields.map((field) =>
                  field.key !== active.field.key
                    ? field
                    : {
                        ...field,
                        textValue: draftText,
                        referenceValue: draftReference,
                        status: data.row?.status || (action === 'publish_requested' ? 'publish_requested' : action === 'archive' ? 'archived' : 'draft'),
                        updatedAt: data.row?.updated_at || new Date().toISOString(),
                        archive: data.row?.action_archive || field.archive || [],
                      },
                ),
              },
        ),
      )
      const label = action === 'publish_requested' ? 'Publish request saved to Supabase.' : action === 'archive' ? 'Archive action saved to Supabase.' : 'Draft/reference saved to Supabase.'
      setLastSaved(new Date().toLocaleString())
      setStatus(label)
      setActive(null)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not save to Supabase.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Actual page view</p>
            <h2 className="text-2xl font-semibold text-[#f4eadc]">Wide preview</h2>
            <p className="mt-1 max-w-3xl text-sm text-[rgba(244,234,220,0.68)]">
              This preview now spans the full admin width. Editor controls sit below so the page is not compressed into a narrow column.
            </p>
          </div>
          <label className="min-w-[260px] text-sm text-[rgba(244,234,220,0.72)]">
            Page
            <select
              value={selectedPage?.slug || selectedSlug}
              onChange={(event) => setSelectedSlug(event.target.value)}
              className="mt-2 w-full rounded-[16px] border border-[rgba(228,183,103,0.2)] bg-[#12110e] px-4 py-3 text-[#f4eadc] outline-none"
            >
              {pages.map((page) => <option key={page.slug} value={page.slug}>{page.label}</option>)}
            </select>
          </label>
        </div>
        <div className="overflow-hidden rounded-[24px] border border-[rgba(228,183,103,0.18)] bg-[#090807] shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
          {selectedPage ? (
            <iframe
              key={selectedPage.path}
              src={`${origin}${selectedPage.path}`}
              className="h-[760px] w-full bg-[#090807]"
              title={`${selectedPage.label} preview`}
            />
          ) : (
            <div className="p-8 text-[rgba(244,234,220,0.72)]">{loading ? 'Loading preview…' : 'No pages found.'}</div>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Editor controls</p>
            <h2 className="text-2xl font-semibold text-[#f4eadc]">Text + Reference fields</h2>
            <p className="mt-1 max-w-4xl text-sm text-[rgba(244,234,220,0.68)]">
              Select any field below to open a popup. Save records the text, reference notes, publish requests, and archive actions in Supabase for agent review.
            </p>
          </div>
          <div className="rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] px-4 py-3 text-sm text-[rgba(244,234,220,0.72)]">
            <strong className="text-[#f4eadc]">Status</strong><br />{status}{lastSaved ? <><br />Last save: {lastSaved}</> : null}
          </div>
        </div>

        {selectedPage ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <a href={selectedPage.path} className="inline-flex min-h-11 items-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 font-bold text-[#f4eadc] no-underline">Open actual page</a>
              <span className="text-sm text-[rgba(244,234,220,0.62)]">{selectedPage.fields.length} editable fields on this page</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {selectedPage.fields.map((field) => (
                <button
                  key={field.key}
                  onClick={() => openField(selectedPage, field, 'text')}
                  className="rounded-[18px] border border-[rgba(228,183,103,0.16)] bg-[rgba(255,255,255,0.03)] p-4 text-left transition hover:border-[#dca453] hover:bg-[rgba(239,197,120,0.06)]"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <strong className="text-[#f4eadc]">{field.label}</strong>
                    <span className="rounded-full border border-[rgba(239,197,120,0.16)] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#efc578]">{field.status || 'draft'}</span>
                  </div>
                  <p className="line-clamp-3 text-sm leading-6 text-[rgba(244,234,220,0.68)]">{field.textValue}</p>
                  {field.referenceValue ? <p className="mt-3 text-xs text-[#efc578]">Reference saved ✓</p> : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {active ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.72)] px-4 py-8">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-[28px] border border-[rgba(228,183,103,0.24)] bg-[linear-gradient(135deg,#151812,#19120f)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.48)]">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">{active.page.label}</p>
                <h3 className="text-3xl font-semibold tracking-[-0.03em] text-[#e6bd74]">{active.field.label}</h3>
              </div>
              <button onClick={() => setActive(null)} className="rounded-full border border-[rgba(228,183,103,0.18)] px-4 py-2 text-[#f4eadc]">Close</button>
            </div>

            <div className="mb-4 flex gap-2">
              <button onClick={() => setTab('text')} className={`rounded-full px-4 py-2 font-bold ${tab === 'text' ? 'bg-[linear-gradient(180deg,#efc578,#dca453)] text-[#2d1b10]' : 'border border-[rgba(228,183,103,0.18)] text-[#f4eadc]'}`}>Text</button>
              <button onClick={() => setTab('reference')} className={`rounded-full px-4 py-2 font-bold ${tab === 'reference' ? 'bg-[linear-gradient(180deg,#efc578,#dca453)] text-[#2d1b10]' : 'border border-[rgba(228,183,103,0.18)] text-[#f4eadc]'}`}>Reference</button>
            </div>

            {tab === 'text' ? (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#f4eadc]">Editable text</label>
                {fieldInput(active.field, draftText, setDraftText)}
                {active.field.kind === 'list' ? <p className="text-sm text-[rgba(244,234,220,0.62)]">Use one prompt/item per line.</p> : null}
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#f4eadc]">Reference notes for agent/action</label>
                <textarea
                  value={draftReference}
                  onChange={(event) => setDraftReference(event.target.value)}
                  className="min-h-64 w-full rounded-[18px] border border-[rgba(228,183,103,0.22)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[#f4eadc] outline-none focus:border-[#dca453]"
                  placeholder="Paste reference copy, direction, screenshots described in words, requested actions, publish/archive notes…"
                />
                <p className="text-sm text-[rgba(244,234,220,0.62)]">References are saved with the field so you can ask the agent to apply, publish, or archive the requested change later.</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => save('save_draft')} disabled={saving} className="inline-flex min-h-12 items-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10] disabled:opacity-70">{saving ? 'Saving…' : 'Save to Supabase'}</button>
              <button onClick={() => save('publish_requested')} disabled={saving} className="inline-flex min-h-12 items-center rounded-full border border-[rgba(228,183,103,0.22)] bg-[rgba(255,255,255,0.04)] px-5 font-bold text-[#f4eadc] disabled:opacity-70">Request publish</button>
              <button onClick={() => save('archive')} disabled={saving} className="inline-flex min-h-12 items-center rounded-full border border-[rgba(228,183,103,0.22)] bg-[rgba(255,255,255,0.04)] px-5 font-bold text-[#f4eadc] disabled:opacity-70">Archive action</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
