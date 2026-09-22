import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { defaultSiteContent } from '@/lib/site-content'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

type ProgressReflectionRow = {
  lesson_id: string
  journal_text: string | null
}

function markdownToHtml(markdown: string) {
  return `<p>${markdown.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')}</p>`
}

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 })
  }

  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''
  if (!token) {
    return NextResponse.json({ ok: false, error: 'missing_token' }, { status: 401 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  const user = userData.user
  if (userError || !user) {
    return NextResponse.json({ ok: false, error: 'invalid_token' }, { status: 401 })
  }
  if (!user.email) {
    return NextResponse.json({ ok: true, emailQueued: false, reason: 'missing_email' })
  }

  const lessonIds = defaultSiteContent.lessons.map((lesson) => lesson.id)
  const { data: rows, error: rowsError } = await supabase
    .from('lesson_progress')
    .select('lesson_id, journal_text')
    .eq('user_id', user.id)
    .in('lesson_id', lessonIds)

  if (rowsError) {
    return NextResponse.json({ ok: false, error: rowsError.message }, { status: 500 })
  }

  const reflectionsByLesson = new Map(
    ((rows || []) as ProgressReflectionRow[])
      .filter((row) => row.journal_text?.trim())
      .map((row) => [row.lesson_id, row.journal_text?.trim() || '']),
  )

  if (!reflectionsByLesson.size) {
    return NextResponse.json({ ok: true, emailQueued: false, reflectionCount: 0 })
  }

  const sections = defaultSiteContent.lessons
    .map((lesson) => {
      const reflection = reflectionsByLesson.get(lesson.id)
      if (!reflection) return null
      return `## ${lesson.stepLabel} · ${lesson.title}\n\n${reflection}`
    })
    .filter(Boolean)

  const bodyMarkdown = [
    'Your Masculine Heart Quest reflections',
    '',
    'Here are the reflection answers you saved throughout the course.',
    '',
    ...sections,
  ].join('\n')

  const now = new Date().toISOString()
  const emailRes = await supabase.from('outbound_emails').insert({
    kind: 'course_reflections',
    to_email: user.email,
    to_name: user.user_metadata?.full_name || null,
    from_email: 'ponopauko@gmail.com',
    from_name: 'Paul Cropper',
    subject: 'Your Masculine Heart Quest reflections',
    body_markdown: bodyMarkdown,
    body_html: markdownToHtml(bodyMarkdown),
    body_text: bodyMarkdown,
    status: 'queued',
    scheduled_for: now,
  })

  if (emailRes.error) {
    return NextResponse.json({ ok: false, error: emailRes.error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, emailQueued: true, reflectionCount: reflectionsByLesson.size })
}
