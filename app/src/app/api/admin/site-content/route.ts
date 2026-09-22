import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ADMIN_COOKIE, validateSessionCookie } from '@/lib/admin-auth'
import {
  sanitizeReferenceNotes,
  sanitizeSiteContentDocument,
  sanitizeSiteContentOverrides,
} from '@/lib/site-content-persistence'

export const runtime = 'nodejs'

type SiteContentRow = {
  content_overrides: unknown
  reference_notes: unknown
  updated_at: string | null
  updated_by: string | null
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return null
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
}

async function requireAdminEmail() {
  const cookieStore = await cookies()
  return validateSessionCookie(cookieStore.get(ADMIN_COOKIE)?.value)
}

export async function GET() {
  const adminEmail = await requireAdminEmail()
  if (!adminEmail) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ overrides: {}, referenceNotes: {}, updatedAt: null, updatedBy: adminEmail })
  }

  const { data, error } = await supabase
    .from('site_content_documents')
    .select('content_overrides, reference_notes, updated_at, updated_by')
    .eq('id', 'main')
    .maybeSingle<SiteContentRow>()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'site_content_load_failed' }, { status: 500 })
  }

  return NextResponse.json(
    sanitizeSiteContentDocument({
      overrides: data?.content_overrides,
      referenceNotes: data?.reference_notes,
      updatedAt: data?.updated_at || null,
      updatedBy: data?.updated_by || adminEmail,
    }),
  )
}

export async function PUT(request: Request) {
  const adminEmail = await requireAdminEmail()
  if (!adminEmail) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'supabase_not_configured' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const input = typeof body === 'object' && body !== null ? body as Record<string, unknown> : {}
  const overrides = sanitizeSiteContentOverrides(input.overrides)
  const referenceNotes = sanitizeReferenceNotes(input.referenceNotes)
  const updatedAt = new Date().toISOString()

  const { error } = await supabase.from('site_content_documents').upsert(
    {
      id: 'main',
      content_overrides: overrides,
      reference_notes: referenceNotes,
      updated_by: adminEmail,
      updated_at: updatedAt,
    },
    { onConflict: 'id' },
  )

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'site_content_save_failed' }, { status: 500 })
  }

  return NextResponse.json(
    sanitizeSiteContentDocument({
      overrides,
      referenceNotes,
      updatedAt,
      updatedBy: adminEmail,
    }),
  )
}
