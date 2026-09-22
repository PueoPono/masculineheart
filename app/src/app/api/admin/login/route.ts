import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, signSession, verifyAdminLogin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const form = await request.formData()
  const username = String(form.get('username') || '').trim().toLowerCase()
  const password = String(form.get('password') || '')

  if (!(await verifyAdminLogin(username, password))) {
    return NextResponse.redirect(new URL('/admin-login?error=invalid', request.url), 303)
  }

  const response = NextResponse.redirect(new URL('/admin', request.url), 303)
  response.cookies.set(ADMIN_COOKIE, `${username}.${signSession(username)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  })
  return response
}
