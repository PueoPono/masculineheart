import { NextResponse } from 'next/server'
import { createResetToken, isAllowedAdminEmail, siteUrl } from '@/lib/admin-auth'

export const runtime = 'nodejs'

async function sendResetEmail(to: string, resetUrl: string) {
  const resendKey = process.env.RESEND_API_KEY
  const from = process.env.ADMIN_EMAIL_FROM || process.env.RESEND_FROM_EMAIL || 'Masculine Heart Quest <onboarding@resend.dev>'

  if (!resendKey) {
    return { ok: false, error: 'email_provider_not_configured' }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${resendKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: 'Set your Masculine Heart Quest admin password',
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.5;color:#24170f">
          <h1>Set your admin password</h1>
          <p>Use this secure link to set or reset the admin password for Masculine Heart Quest.</p>
          <p><a href="${resetUrl}" style="display:inline-block;background:#dca453;color:#24170f;padding:12px 18px;border-radius:999px;font-weight:700;text-decoration:none">Set admin password</a></p>
          <p>This link expires in 1 hour. If you did not request it, ignore this email.</p>
          <p style="font-size:12px;color:#6f6257">${resetUrl}</p>
        </div>
      `,
      text: `Set your Masculine Heart Quest admin password: ${resetUrl}\n\nThis link expires in 1 hour.`,
    }),
  })

  if (!response.ok) {
    return { ok: false, error: 'email_send_failed' }
  }

  return { ok: true }
}

export async function POST(request: Request) {
  const form = await request.formData()
  const email = String(form.get('email') || '').trim().toLowerCase()

  if (!email) {
    return NextResponse.redirect(new URL('/admin-login/forgot?error=missing_email', request.url), 303)
  }

  if (!isAllowedAdminEmail(email)) {
    return NextResponse.redirect(new URL('/admin-login/forgot?sent=1', request.url), 303)
  }

  try {
    const token = createResetToken(email)
    const baseUrl = siteUrl(request.url)
    const resetUrl = `${baseUrl}/admin-login/reset?token=${encodeURIComponent(token)}`
    const sent = await sendResetEmail(email, resetUrl)

    if (!sent.ok) {
      return NextResponse.redirect(new URL(`/admin-login/forgot?error=${sent.error}`, request.url), 303)
    }

    return NextResponse.redirect(new URL('/admin-login/forgot?sent=1', request.url), 303)
  } catch (error) {
    console.error(error)
    return NextResponse.redirect(new URL('/admin-login/forgot?error=reset_not_configured', request.url), 303)
  }
}
