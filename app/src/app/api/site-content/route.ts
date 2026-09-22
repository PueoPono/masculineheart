import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sanitizeSiteContentDocument } from '@/lib/site-content-persistence'

export const runtime = 'nodejs'

type SiteContentRow = {
  content_overrides: unknown
  updated_at: string | null
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return null
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
}

export async function GET() {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({
      overrides: {},
      referenceNotes: {},
      updatedAt: null,
    })
  }

  const { data, error } = await supabase
    .from('site_content_documents')
    .select('content_overrides, updated_at')
    .eq('id', 'main')
    .maybeSingle<SiteContentRow>()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'site_content_load_failed' }, { status: 500 })
  }

  return NextResponse.json(
    sanitizeSiteContentDocument({
      overrides: data?.content_overrides,
      referenceNotes: {},
      updatedAt: data?.updated_at || null,
    }),
  )
}
