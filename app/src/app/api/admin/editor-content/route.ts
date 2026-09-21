import { createHash } from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAdminEditorDefaults } from '@/lib/admin-editor-content'

export const dynamic = 'force-dynamic'

const TABLE = 'admin_editor_fields'

function configuredAdminUsername() {
  return (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || (process.env.ADMIN_EMAILS || '').split(',').map((email) => email.trim()).filter(Boolean)[0] || '').trim().toLowerCase()
}

function expectedSession(username: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
  return createHash('sha256').update(`${username}:${secret}`).digest('hex')
}

async function requireAdmin() {
  const username = configuredAdminUsername()
  const cookieStore = await cookies()
  const session = cookieStore.get('mhq_admin')?.value || ''
  const [sessionUser, signature] = session.split('.')
  if (!username || !signature || sessionUser !== username || signature !== expectedSession(username)) return false
  return true
}

function serviceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) throw new Error('Supabase service environment is not configured.')
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
}

function mergeSaved(defaults: ReturnType<typeof getAdminEditorDefaults>, rows: Record<string, unknown>[] = []) {
  const byKey = new Map<string, Record<string, unknown>>()
  rows.forEach((row) => byKey.set(`${row.page_slug}:${row.field_key}`, row))
  return defaults.map((page) => ({
    ...page,
    fields: page.fields.map((field) => {
      const saved = byKey.get(`${page.slug}:${field.key}`)
      return {
        ...field,
        textValue: typeof saved?.text_value === 'string' ? saved.text_value : field.textValue,
        referenceValue: typeof saved?.reference_value === 'string' ? saved.reference_value : field.referenceValue || '',
        status: typeof saved?.status === 'string' ? saved.status : 'draft',
        updatedAt: typeof saved?.updated_at === 'string' ? saved.updated_at : null,
        publishedAt: typeof saved?.published_at === 'string' ? saved.published_at : null,
        archive: Array.isArray(saved?.action_archive) ? saved.action_archive : [],
      }
    }),
  }))
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const defaults = getAdminEditorDefaults()
  try {
    const supabase = serviceClient()
    const { data, error } = await supabase.from(TABLE).select('*').eq('project', 'masculine-heart-quest')
    if (error) throw error
    return NextResponse.json({ ok: true, storage: 'supabase', publishMode: 'queued_review', pages: mergeSaved(defaults, data || []) })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ ok: false, storage: 'supabase', error: message, publishMode: 'queued_review', pages: defaults }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null)
  const pageSlug = String(body?.pageSlug || '')
  const fieldKey = String(body?.fieldKey || '')
  const textValue = String(body?.textValue || '')
  const referenceValue = String(body?.referenceValue || '')
  const action = String(body?.action || 'save_draft')
  const defaults = getAdminEditorDefaults()
  const page = defaults.find((candidate) => candidate.slug === pageSlug)
  const field = page?.fields.find((candidate) => candidate.key === fieldKey)
  if (!page || !field) return NextResponse.json({ ok: false, error: 'Unknown editable field.' }, { status: 400 })

  try {
    const supabase = serviceClient()
    const archiveEntry = {
      action,
      at: new Date().toISOString(),
      note: action === 'publish_requested' ? 'Publish requested from admin editor.' : action === 'archive' ? 'Archived from admin editor.' : 'Saved draft/reference from admin editor.',
    }
    const payload = {
      project: 'masculine-heart-quest',
      page_slug: pageSlug,
      page_label: page.label,
      page_path: page.path,
      field_key: fieldKey,
      field_label: field.label,
      field_kind: field.kind,
      text_value: textValue,
      reference_value: referenceValue,
      status: action === 'archive' ? 'archived' : action === 'publish_requested' ? 'publish_requested' : 'draft',
      action_archive: [archiveEntry],
      updated_at: new Date().toISOString(),
    }
    const { data: existing } = await supabase
      .from(TABLE)
      .select('action_archive')
      .eq('project', 'masculine-heart-quest')
      .eq('page_slug', pageSlug)
      .eq('field_key', fieldKey)
      .maybeSingle()
    if (Array.isArray(existing?.action_archive)) payload.action_archive = [...existing.action_archive, archiveEntry]
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(payload, { onConflict: 'project,page_slug,field_key' })
      .select('*')
      .single()
    if (error) throw error
    return NextResponse.json({ ok: true, storage: 'supabase', publishMode: 'queued_review', row: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ ok: false, storage: 'supabase', error: message }, { status: 500 })
  }
}
