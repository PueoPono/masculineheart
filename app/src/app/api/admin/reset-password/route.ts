import { NextResponse } from 'next/server'
import { setAdminPassword, verifyResetToken } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const form = await request.formData()
  const token = String(form.get('token') || '')
  const password = String(form.get('password') || '')
  const confirmPassword = String(form.get('confirmPassword') || '')
  const email = verifyResetToken(token)

  if (!email) {
    return NextResponse.redirect(new URL('/admin-login/reset?error=invalid_token', request.url), 303)
  }

  if (password.length < 12) {
    return NextResponse.redirect(new URL(`/admin-login/reset?token=${encodeURIComponent(token)}&error=short_password`, request.url), 303)
  }

  if (password !== confirmPassword) {
    return NextResponse.redirect(new URL(`/admin-login/reset?token=${encodeURIComponent(token)}&error=password_mismatch`, request.url), 303)
  }

  try {
    await setAdminPassword(email, password)
    return NextResponse.redirect(new URL('/admin-login?password_set=1', request.url), 303)
  } catch (error) {
    console.error(error)
    return NextResponse.redirect(new URL(`/admin-login/reset?token=${encodeURIComponent(token)}&error=storage_not_configured`, request.url), 303)
  }
}
