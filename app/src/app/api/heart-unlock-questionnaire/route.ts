import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = (process.env.ADMIN_EMAIL || 'bewildandfree@pm.me').split(',')[0].trim()
const QUESTIONNAIRE_LESSON_ID = 'heart-unlock-questionnaire'

type QuestionnaireAnswers = Record<string, string>

const questionLabels: Record<string, string> = {
  name: 'Name',
  completedSevenDays: 'Did you complete the 7-days, stepping down into the Heart?',
  daysFromStartToFinish: 'How many days did you take from start to finish?',
  learnedAboutSelf: 'What did you learn about yourself during the course?',
  confusingOrSuggestions: 'Was there anything confusing about the course, or any suggestion you would have that could have made it better?',
  nextStep: 'What do you think the next step is for you, in understanding your Heart?',
  emotionsOpened: 'Did you feel your emotions open up in new ways? If so, how?',
  criticalToFeel: "Why do you think it's critical to allow yourself to feel?",
  mostImportantTakeaway: 'What is your most important take away from this mini-course?',
}

function getSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

function normalizeAnswers(value: unknown): QuestionnaireAnswers {
  if (!value || typeof value !== 'object') return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([key, raw]) => [key, typeof raw === 'string' ? raw : String(raw ?? '')])
      .filter(([key]) => Object.prototype.hasOwnProperty.call(questionLabels, key)),
  )
}

function markdownToHtml(markdown: string) {
  return `<p>${markdown.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')}</p>`
}

function answersToMarkdown(answers: QuestionnaireAnswers, userEmail?: string | null) {
  const lines = [
    'Part 1 - Heart Unlock - Questionnaire',
    '',
    userEmail ? `Submitted by: ${userEmail}` : '',
    '',
  ].filter(Boolean)
  for (const [key, label] of Object.entries(questionLabels)) {
    const answer = (answers[key] || '').trim()
    lines.push(`## ${label}`, answer || '(No answer yet)', '')
  }
  return lines.join('\n')
}

async function getUser(request: NextRequest, supabase: SupabaseClient) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''
  if (!token) return { user: null, error: 'missing_token' }
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return { user: null, error: 'invalid_token' }
  return { user: data.user, error: null }
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 })
  const { user, error } = await getUser(request, supabase)
  if (!user) return NextResponse.json({ ok: false, error }, { status: 401 })

  const { data, error: rowError } = await supabase
    .from('lesson_progress')
    .select('journal_text, status, completed_at, updated_at')
    .eq('user_id', user.id)
    .eq('lesson_id', QUESTIONNAIRE_LESSON_ID)
    .maybeSingle()

  if (rowError) return NextResponse.json({ ok: false, error: rowError.message }, { status: 500 })
  let answers: QuestionnaireAnswers = {}
  if (data?.journal_text) {
    try {
      const parsed = JSON.parse(data.journal_text)
      answers = normalizeAnswers(parsed.answers || parsed)
    } catch {
      answers = {}
    }
  }
  return NextResponse.json({ ok: true, answers, submitted: data?.status === 'completed', updatedAt: data?.updated_at || null, completedAt: data?.completed_at || null })
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 })
  const { user, error } = await getUser(request, supabase)
  if (!user) return NextResponse.json({ ok: false, error }, { status: 401 })

  const body = await request.json().catch(() => ({})) as { answers?: unknown; submit?: boolean }
  const answers = normalizeAnswers(body.answers)
  const now = new Date().toISOString()
  const journalText = JSON.stringify({ title: 'Part 1 - Heart Unlock - Questionnaire', answers }, null, 2)

  const { error: saveError } = await supabase.from('lesson_progress').upsert({
    user_id: user.id,
    lesson_id: QUESTIONNAIRE_LESSON_ID,
    status: body.submit ? 'completed' : 'open',
    completed_at: body.submit ? now : null,
    journal_text: journalText,
    unlock_at: now,
  }, { onConflict: 'user_id,lesson_id' })

  if (saveError) return NextResponse.json({ ok: false, error: saveError.message }, { status: 500 })

  let emailQueued = false
  if (body.submit) {
    const bodyMarkdown = answersToMarkdown(answers, user.email)
    const { error: emailError } = await supabase.from('outbound_emails').insert({
      kind: 'heart_unlock_questionnaire',
      to_email: adminEmail,
      to_name: 'Paul Cropper',
      from_email: 'ponopauko@gmail.com',
      from_name: 'Masculine Heart Quest',
      subject: 'Part 1 - Heart Unlock - Questionnaire submitted',
      body_markdown: bodyMarkdown,
      body_html: markdownToHtml(bodyMarkdown),
      body_text: bodyMarkdown,
      status: 'queued',
      scheduled_for: now,
    })
    if (emailError) return NextResponse.json({ ok: false, error: emailError.message }, { status: 500 })
    emailQueued = true
  }

  return NextResponse.json({ ok: true, saved: true, submitted: Boolean(body.submit), emailQueued })
}
