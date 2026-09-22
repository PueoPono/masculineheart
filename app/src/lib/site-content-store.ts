'use client'

import { useEffect, useMemo, useState } from 'react'
import { defaultSiteContent, type LessonContent, type SiteContent } from '@/lib/site-content'
import {
  SITE_CONTENT_OVERRIDE_KEY,
  SITE_REFERENCE_NOTES_KEY,
  sanitizeReferenceNotes,
  sanitizeSiteContentDocument,
  sanitizeSiteContentOverrides,
  type ReferenceNotes,
  type SiteContentDocument,
  type SiteContentOverrides,
} from '@/lib/site-content-persistence'

export {
  SITE_CONTENT_OVERRIDE_KEY,
  SITE_REFERENCE_NOTES_KEY,
  type ReferenceNotes,
  type SiteContentDocument,
  type SiteContentOverrides,
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeLesson(base: LessonContent, patch?: Partial<LessonContent>): LessonContent {
  if (!patch) return base
  return {
    ...base,
    ...patch,
    supportingPoints: patch.supportingPoints || base.supportingPoints,
    prompts: patch.prompts || base.prompts,
  }
}

export function mergeSiteContent(base: SiteContent, patch?: SiteContentOverrides | null): SiteContent {
  if (!patch) return base

  const patchLessons = Array.isArray(patch.lessons) ? patch.lessons : []

  return {
    landing: {
      ...base.landing,
      ...(isObject(patch.landing) ? patch.landing : {}),
      overviewCards: Array.isArray(patch.landing?.overviewCards) ? patch.landing.overviewCards : base.landing.overviewCards,
    },
    portal: {
      ...base.portal,
      ...(isObject(patch.portal) ? patch.portal : {}),
    },
    locked: {
      ...base.locked,
      ...(isObject(patch.locked) ? patch.locked : {}),
    },
    complete: {
      ...base.complete,
      ...(isObject(patch.complete) ? patch.complete : {}),
    },
    lessons: base.lessons.map((lesson) => mergeLesson(lesson, patchLessons.find((entry) => entry?.id === lesson.id))),
  }
}

export function readSiteContentOverrides(): SiteContentOverrides | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(SITE_CONTENT_OVERRIDE_KEY)
  if (!raw) return null
  try {
    return sanitizeSiteContentOverrides(JSON.parse(raw))
  } catch {
    return null
  }
}

export function writeSiteContentOverrides(overrides: SiteContentOverrides) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SITE_CONTENT_OVERRIDE_KEY, JSON.stringify(overrides))
}

export function clearSiteContentOverrides() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SITE_CONTENT_OVERRIDE_KEY)
}

export function readReferenceNotes(): ReferenceNotes {
  if (typeof window === 'undefined') return {}
  const raw = window.localStorage.getItem(SITE_REFERENCE_NOTES_KEY)
  if (!raw) return {}
  try {
    return sanitizeReferenceNotes(JSON.parse(raw))
  } catch {
    return {}
  }
}

export function writeReferenceNotes(notes: ReferenceNotes) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SITE_REFERENCE_NOTES_KEY, JSON.stringify(notes))
}

async function fetchDocument(url: string) {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`request_failed:${response.status}`)
  }
  const json = await response.json()
  return sanitizeSiteContentDocument(json)
}

function readCachedDocument(): SiteContentDocument {
  return {
    overrides: readSiteContentOverrides() || {},
    referenceNotes: readReferenceNotes(),
  }
}

export function useSiteContent() {
  const [document, setDocument] = useState<SiteContentDocument>(() => readCachedDocument())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const nextDocument = await fetchDocument('/api/site-content')
        if (!active) return
        setDocument(nextDocument)
        writeSiteContentOverrides(nextDocument.overrides)
      } catch {
        if (!active) return
        setDocument(readCachedDocument())
      } finally {
        if (active) setHydrated(true)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const content = useMemo(() => mergeSiteContent(defaultSiteContent, document.overrides), [document.overrides])
  return { content, hydrated, updatedAt: document.updatedAt || null }
}

export function useEditableSiteContent() {
  const [overrides, setOverrides] = useState<SiteContentOverrides>(() => readSiteContentOverrides() || {})
  const [referenceNotes, setReferenceNotes] = useState<ReferenceNotes>(() => readReferenceNotes())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [updatedBy, setUpdatedBy] = useState<string | null>(null)
  const content = useMemo(() => mergeSiteContent(defaultSiteContent, overrides), [overrides])

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const nextDocument = await fetchDocument('/api/admin/site-content')
        if (!active) return
        setOverrides(nextDocument.overrides)
        setReferenceNotes(nextDocument.referenceNotes)
        setUpdatedAt(nextDocument.updatedAt || null)
        setUpdatedBy(nextDocument.updatedBy || null)
        writeSiteContentOverrides(nextDocument.overrides)
        writeReferenceNotes(nextDocument.referenceNotes)
      } catch {
        if (!active) return
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  function updateLandingField<K extends keyof SiteContent['landing']>(key: K, value: SiteContent['landing'][K]) {
    setOverrides((current) => ({
      ...current,
      landing: {
        ...current.landing,
        [key]: value,
      },
    }))
  }

  function updatePortalField<K extends keyof SiteContent['portal']>(key: K, value: SiteContent['portal'][K]) {
    setOverrides((current) => ({
      ...current,
      portal: {
        ...current.portal,
        [key]: value,
      },
    }))
  }

  function updateStatusField(section: 'locked' | 'complete', key: keyof SiteContent['locked'], value: string) {
    setOverrides((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }))
  }

  function updateLesson(lessonId: string, patch: Partial<LessonContent>) {
    setOverrides((current) => {
      const lessons = Array.isArray(current.lessons) ? [...current.lessons] : []
      const index = lessons.findIndex((entry) => entry?.id === lessonId)
      if (index >= 0) {
        lessons[index] = { ...lessons[index], ...patch }
      } else {
        lessons.push({ id: lessonId, ...patch })
      }
      return { ...current, lessons }
    })
  }

  function resetSection(section: 'landing' | 'portal' | 'locked' | 'complete' | 'lesson', lessonId?: string) {
    setOverrides((current) => {
      if (section === 'lesson' && lessonId) {
        return {
          ...current,
          lessons: (current.lessons || []).filter((entry) => entry.id !== lessonId),
        }
      }
      if (section === 'landing') return { ...current, landing: undefined }
      if (section === 'portal') return { ...current, portal: undefined }
      if (section === 'locked') return { ...current, locked: undefined }
      return { ...current, complete: undefined }
    })
  }

  async function save(next?: { overrides?: SiteContentOverrides; referenceNotes?: ReferenceNotes }) {
    const documentOverrides = next?.overrides || overrides
    const documentReferenceNotes = next?.referenceNotes || referenceNotes
    setSaving(true)
    setSaveError(null)
    writeSiteContentOverrides(documentOverrides)
    writeReferenceNotes(documentReferenceNotes)
    try {
      const response = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overrides: documentOverrides, referenceNotes: documentReferenceNotes }),
      })
      const json = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof json?.error === 'string' ? json.error : 'save_failed')
      }
      const nextDocument = sanitizeSiteContentDocument(json)
      setUpdatedAt(nextDocument.updatedAt || new Date().toISOString())
      setUpdatedBy(nextDocument.updatedBy || null)
      writeSiteContentOverrides(documentOverrides)
      writeReferenceNotes(documentReferenceNotes)
      return { ok: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'save_failed'
      setSaveError(message)
      throw error
    } finally {
      setSaving(false)
    }
  }

  function clearAll() {
    setOverrides({})
    setReferenceNotes({})
    clearSiteContentOverrides()
    writeReferenceNotes({})
  }

  return {
    content,
    overrides,
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
  }
}
