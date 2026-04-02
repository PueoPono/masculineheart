import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    ok: false,
    status: 'scaffold_only',
    message: 'Email sending provider not configured yet. Next step: connect Resend/MailerLite/ConvertKit and send the queued meditation sequence steps.',
  })
}
