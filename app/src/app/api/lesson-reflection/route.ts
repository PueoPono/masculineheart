import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 })
  }

  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''
  if (!token) {
    return NextResponse.json({ ok: false, error: 'missing_token' }, { status: 401 })
  }

  const body = await request.json().catch(() => null) as { lessonId?: string; reflection?: string } | null
  const lessonId = body?.lessonId?.trim()
  const reflection = body?.reflection || ''
  if (!lessonId) {
    return NextResponse.json({ ok: false, error: 'missing_lesson_id' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  const user = userData.user
  if (userError || !user) {
    return NextResponse.json({ ok: false, error: 'invalid_token' }, { status: 401 })
  }

  const now = new Date().toISOString()
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('status, completed_at, unlock_at')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  const progressRes = await supabase.from('lesson_progress').upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      status: existing?.status || 'started',
      completed_at: existing?.completed_at || null,
      unlock_at: existing?.unlock_at || null,
      journal_text: reflection,
      updated_at: now,
    },
    { onConflict: 'user_id,lesson_id' },
  )
  if (progressRes.error) {
    return NextResponse.json({ ok: false, error: progressRes.error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, saved: true })
}
