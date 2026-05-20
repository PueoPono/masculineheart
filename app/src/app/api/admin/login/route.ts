import { createHash, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

function signSession(username: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
  return createHash('sha256').update(`${username}:${secret}`).digest('hex')
}

export async function POST(request: Request) {
  const configuredUsername = process.env.ADMIN_USERNAME
  const configuredPassword = process.env.ADMIN_PASSWORD
  const configuredSecret = process.env.ADMIN_SESSION_SECRET || configuredPassword

  if (!configuredUsername || !configuredPassword || !configuredSecret) {
    return NextResponse.redirect(new URL('/admin-login?error=not_configured', request.url), 303)
  }

  const form = await request.formData()
  const username = String(form.get('username') || '')
  const password = String(form.get('password') || '')

  if (!safeEqual(username, configuredUsername) || !safeEqual(password, configuredPassword)) {
    return NextResponse.redirect(new URL('/admin-login?error=invalid', request.url), 303)
  }

  const response = NextResponse.redirect(new URL('/admin', request.url), 303)
  response.cookies.set('mhq_admin', `${username}.${signSession(username)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  })
  return response
}
