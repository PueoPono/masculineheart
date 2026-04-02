import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function fillTemplate(template: string, firstName?: string | null) {
  return template.replaceAll('{{first_name|there}}', firstName?.trim() || 'there')
}

export async function POST() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const now = new Date().toISOString()

  const { data: enrollments, error: enrollmentsError } = await supabase
    .from('email_sequence_enrollments')
    .select('id, email, first_name, current_step, next_send_at, sequence_slug')
    .eq('status', 'active')
    .lte('next_send_at', now)

  if (enrollmentsError) {
    return NextResponse.json({ ok: false, error: enrollmentsError.message }, { status: 500 })
  }

  const queued: unknown[] = []
  for (const enrollment of enrollments || []) {
    const nextStepIndex = Number(enrollment.current_step || 0) + 1
    const { data: step, error: stepError } = await supabase
      .from('email_sequence_steps')
      .select('step_index, delay_hours, subject, body_markdown')
      .eq('sequence_slug', enrollment.sequence_slug)
      .eq('step_index', nextStepIndex)
      .single()

    if (stepError || !step) continue

    const bodyMarkdown = fillTemplate(step.body_markdown, enrollment.first_name)
    const bodyText = bodyMarkdown
    const bodyHtml = `<p>${bodyMarkdown.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')}</p>`

    const insertEmail = await supabase.from('outbound_emails').insert({
      kind: 'sequence_step',
      to_email: enrollment.email,
      to_name: enrollment.first_name || null,
      from_email: 'ponopauko@gmail.com',
      from_name: 'Paul Cropper',
      subject: step.subject,
      body_markdown: bodyMarkdown,
      body_html: bodyHtml,
      body_text: bodyText,
      related_sequence_slug: enrollment.sequence_slug,
      related_enrollment_id: enrollment.id,
      status: 'queued',
      scheduled_for: now,
    }).select('id').single()

    if (insertEmail.error || !insertEmail.data) continue

    queued.push(insertEmail.data)

    const upcomingStepIndex = nextStepIndex + 1
    const { data: upcomingStep } = await supabase
      .from('email_sequence_steps')
      .select('delay_hours')
      .eq('sequence_slug', enrollment.sequence_slug)
      .eq('step_index', upcomingStepIndex)
      .single()

    const nextSendAt = upcomingStep
      ? new Date(Date.now() + Number(upcomingStep.delay_hours || 0) * 60 * 60 * 1000).toISOString()
      : null

    await supabase
      .from('email_sequence_enrollments')
      .update({
        current_step: nextStepIndex,
        next_send_at: nextSendAt,
        status: upcomingStep ? 'active' : 'complete',
      })
      .eq('id', enrollment.id)
  }

  return NextResponse.json({ ok: true, queued })
}
