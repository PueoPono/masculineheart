import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

type Json = Record<string, unknown>

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const cronSecret = Deno.env.get('SHARED_EMAIL_CRON_SECRET')
const brevoApiKey = Deno.env.get('BREVO_API_KEY')
const resendApiKey = Deno.env.get('RESEND_API_KEY')
const fromEmail = Deno.env.get('EMAIL_FROM_ADDRESS') || Deno.env.get('RESEND_FROM_EMAIL') || 'ponopauko@gmail.com'
const fromName = Deno.env.get('EMAIL_FROM_NAME') || 'Paul Cropper'
const batchLimit = Number(Deno.env.get('SHARED_EMAIL_BATCH_LIMIT') || '25')

function json(body: Json, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'content-type': 'application/json' } })
}

function fillTemplate(template: string, firstName?: string | null) {
  return template.replaceAll('{{first_name|there}}', firstName?.trim() || 'there')
}

function markdownToHtml(markdown: string) {
  const escaped = markdown
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
  return `<p>${escaped.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')}</p>`
}

function authOk(req: Request) {
  if (!cronSecret) return true
  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const headerSecret = req.headers.get('x-cron-secret')
  return bearer === cronSecret || headerSecret === cronSecret
}

async function sendViaBrevo(email: { to_email: string; to_name?: string | null; subject: string; body_html?: string | null; body_text?: string | null }) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': brevoApiKey!, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: fromEmail, name: fromName },
      to: [{ email: email.to_email, name: email.to_name || undefined }],
      subject: email.subject,
      htmlContent: email.body_html || markdownToHtml(email.body_text || ''),
      textContent: email.body_text || undefined,
    }),
  })
  const text = await response.text()
  return { ok: response.ok, provider: 'brevo', providerMessageId: response.ok ? safeProviderId(text, 'messageId') : null, error: response.ok ? null : text.slice(0, 1000) }
}

async function sendViaResend(email: { to_email: string; to_name?: string | null; subject: string; body_html?: string | null; body_text?: string | null }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${resendApiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: email.to_email,
      subject: email.subject,
      html: email.body_html || markdownToHtml(email.body_text || ''),
      text: email.body_text || undefined,
    }),
  })
  const text = await response.text()
  return { ok: response.ok, provider: 'resend', providerMessageId: response.ok ? safeProviderId(text, 'id') : null, error: response.ok ? null : text.slice(0, 1000) }
}

function safeProviderId(text: string, key: string) {
  try {
    const data = JSON.parse(text)
    return typeof data[key] === 'string' ? data[key] : null
  } catch {
    return null
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (!authOk(req)) return json({ ok: false, error: 'unauthorized' }, 401)
  if (!supabaseUrl || !serviceRoleKey) return json({ ok: false, error: 'supabase_not_configured' }, 500)

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const now = new Date().toISOString()
  let queuedCount = 0
  let sentCount = 0
  let failedCount = 0

  const { data: enrollments, error: enrollmentsError } = await supabase
    .from('email_sequence_enrollments')
    .select('id, email, first_name, current_step, next_send_at, sequence_slug')
    .eq('status', 'active')
    .lte('next_send_at', now)
    .order('next_send_at', { ascending: true })
    .limit(batchLimit)

  if (enrollmentsError) return json({ ok: false, phase: 'load_enrollments', error: enrollmentsError.message }, 500)

  for (const enrollment of enrollments || []) {
    const nextStepIndex = Number(enrollment.current_step || 0) + 1
    const { data: step } = await supabase
      .from('email_sequence_steps')
      .select('step_index, delay_hours, subject, body_markdown')
      .eq('sequence_slug', enrollment.sequence_slug)
      .eq('step_index', nextStepIndex)
      .maybeSingle()

    if (!step) {
      await supabase.from('email_sequence_enrollments').update({ status: 'complete', next_send_at: null }).eq('id', enrollment.id)
      continue
    }

    const bodyMarkdown = fillTemplate(step.body_markdown, enrollment.first_name)
    const insertEmail = await supabase.from('outbound_emails').insert({
      kind: 'sequence_step',
      to_email: enrollment.email,
      to_name: enrollment.first_name || null,
      from_email: fromEmail,
      from_name: fromName,
      subject: step.subject,
      body_markdown: bodyMarkdown,
      body_html: markdownToHtml(bodyMarkdown),
      body_text: bodyMarkdown,
      related_sequence_slug: enrollment.sequence_slug,
      related_enrollment_id: enrollment.id,
      status: 'queued',
      scheduled_for: now,
    }).select('id').single()

    if (insertEmail.error || !insertEmail.data) continue
    queuedCount += 1

    const upcomingStepIndex = nextStepIndex + 1
    const { data: upcomingStep } = await supabase
      .from('email_sequence_steps')
      .select('delay_hours')
      .eq('sequence_slug', enrollment.sequence_slug)
      .eq('step_index', upcomingStepIndex)
      .maybeSingle()

    const nextSendAt = upcomingStep
      ? new Date(Date.now() + Number(upcomingStep.delay_hours || 0) * 60 * 60 * 1000).toISOString()
      : null

    await supabase.from('email_sequence_enrollments').update({
      current_step: nextStepIndex,
      next_send_at: nextSendAt,
      status: upcomingStep ? 'active' : 'complete',
    }).eq('id', enrollment.id)
  }

  const { data: outbound, error: outboundError } = await supabase
    .from('outbound_emails')
    .select('id, to_email, to_name, subject, body_html, body_text, attempt_count')
    .eq('status', 'queued')
    .lte('scheduled_for', now)
    .order('scheduled_for', { ascending: true })
    .limit(batchLimit)

  if (outboundError) return json({ ok: false, phase: 'load_outbound', error: outboundError.message }, 500)

  if (!brevoApiKey && !resendApiKey) {
    return json({ ok: true, provider: 'none', queued: queuedCount, sent: 0, failed: 0, note: 'No BREVO_API_KEY or RESEND_API_KEY configured; queued emails were left unsent.' })
  }

  for (const email of outbound || []) {
    await supabase.from('outbound_emails').update({ status: 'sending', attempt_count: Number(email.attempt_count || 0) + 1, last_attempt_at: new Date().toISOString() }).eq('id', email.id)
    const result = brevoApiKey ? await sendViaBrevo(email) : await sendViaResend(email)
    if (result.ok) {
      sentCount += 1
      await supabase.from('outbound_emails').update({ status: 'sent', sent_at: new Date().toISOString(), provider: result.provider, provider_message_id: result.providerMessageId, error_text: null }).eq('id', email.id)
    } else {
      failedCount += 1
      await supabase.from('outbound_emails').update({ status: 'failed', provider: result.provider, error_text: result.error }).eq('id', email.id)
    }
  }

  return json({ ok: true, provider: brevoApiKey ? 'brevo' : 'resend', queued: queuedCount, sent: sentCount, failed: failedCount })
})
