import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

type ProfileRow = {
  email: string
  full_name: string | null
}

type ResolveResult = {
  ok: boolean
  email?: string
  fullName?: string | null
  error?: string
  status?: number
}

function isEmailLike(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return null
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

function getSupabasePublic() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) return null
  return createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

async function resolveByName(identifier: string, normalized: string): Promise<ResolveResult> {
  const supabaseAdmin = getSupabaseAdmin()

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name')
      .ilike('full_name', identifier)
      .returns<ProfileRow[]>()

    if (error) {
      return { ok: false, error: 'We could not look up that login name yet. Please try your email or a magic link.', status: 500 }
    }

    const exactMatches = (data || []).filter((row) => (row.full_name || '').trim().toLowerCase() === normalized)
    const uniqueEmails = Array.from(new Set(exactMatches.map((row) => row.email.trim().toLowerCase())))

    if (exactMatches.length === 0) {
      return { ok: false, error: 'We could not find that name. Try your email or use a magic link.', status: 404 }
    }

    if (uniqueEmails.length > 1) {
      return { ok: false, error: 'More than one account matches that name. Please use your email or a magic link.', status: 409 }
    }

    return { ok: true, email: uniqueEmails[0], fullName: exactMatches[0]?.full_name || null }
  }

  const supabasePublic = getSupabasePublic()
  if (!supabasePublic) {
    return { ok: false, error: 'Name lookup is not configured here yet. Please use your email or a magic link.', status: 503 }
  }

  const { data, error } = await supabasePublic.rpc('resolve_login_profile', { login_name: identifier })

  if (error) {
    return { ok: false, error: 'We could not look up that login name yet. Please try your email or a magic link.', status: 500 }
  }

  const rows = ((data as ProfileRow[] | null) || []).filter((row) => row?.email)
  if (rows.length === 0) {
    return { ok: false, error: 'We could not find that name. Try your email or use a magic link.', status: 404 }
  }

  const uniqueEmails = Array.from(new Set(rows.map((row) => row.email.trim().toLowerCase())))
  if (uniqueEmails.length > 1) {
    return { ok: false, error: 'More than one account matches that name. Please use your email or a magic link.', status: 409 }
  }

  return { ok: true, email: uniqueEmails[0], fullName: rows[0]?.full_name || null }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const identifier = String(body?.identifier || '').trim()
    const normalized = identifier.toLowerCase()

    if (!normalized) {
      return NextResponse.json({ ok: false, error: 'Enter your email or full name.' }, { status: 400 })
    }

    if (isEmailLike(normalized)) {
      return NextResponse.json({ ok: true, email: normalized, fullName: null })
    }

    const result = await resolveByName(identifier, normalized)
    if (!result.ok || !result.email) {
      return NextResponse.json({ ok: false, error: result.error }, { status: result.status || 500 })
    }

    return NextResponse.json({ ok: true, email: result.email, fullName: result.fullName || null })
  } catch {
    return NextResponse.json({ ok: false, error: 'Unable to resolve that login right now.' }, { status: 500 })
  }
}
