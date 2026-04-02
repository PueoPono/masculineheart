import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const firstName = String(body.first_name || '').trim()

    if (!email) {
      return NextResponse.json({ ok: false, error: 'missing_email' }, { status: 400 })
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const leadInsert = await supabase
      .from('lead_submissions')
      .upsert(
        {
          email,
          first_name: firstName || null,
          source_page: 'resources/meditation',
          lead_magnet_slug: 'guided-meditation',
          tags: ['website', 'meditation', 'lead-magnet'],
          status: 'new',
        },
        { onConflict: 'email,lead_magnet_slug' },
      )
      .select('id')
      .single()

    if (leadInsert.error || !leadInsert.data) {
      return NextResponse.json({ ok: false, error: 'lead_insert_failed', detail: leadInsert.error?.message }, { status: 500 })
    }

    const enrollment = await supabase
      .from('email_sequence_enrollments')
      .upsert(
        {
          email,
          first_name: firstName || null,
          lead_submission_id: leadInsert.data.id,
          sequence_slug: 'guided-meditation-nurture',
          current_step: 0,
          status: 'active',
          next_send_at: new Date().toISOString(),
        },
        { onConflict: 'email,sequence_slug' },
      )

    if (enrollment.error) {
      return NextResponse.json({ ok: false, error: 'sequence_enrollment_failed', detail: enrollment.error.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      redirect: 'https://pueopono.github.io/paul-homepage/meditation-thank-you.html',
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: 'unexpected_error' }, { status: 500 })
  }
}
