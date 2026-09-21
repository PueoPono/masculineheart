import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function configuredAdminEmails() {
  const values = [process.env.ADMIN_EMAIL, process.env.ADMIN_USERNAME, ...(process.env.ADMIN_EMAILS || '').split(',')]
  const emails: string[] = []
  for (const value of values) {
    if (value) emails.push(value.trim().toLowerCase())
  }
  return emails.filter(Boolean)
}

function signSession(username: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
  return createHash('sha256').update(`${username}:${secret}`).digest('hex')
}

function serviceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) throw new Error('Supabase service environment is not configured.')
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
}

export async function POST(request: Request) {
  const adminEmails = configuredAdminEmails()
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
  if (!adminEmails.length || !secret) {
    return NextResponse.json({ ok: false, error: 'Admin login is not configured.' }, { status: 503 })
  }

  const authorization = request.headers.get('authorization') || ''
  const token = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7).trim() : ''
  if (!token) return NextResponse.json({ ok: false, error: 'Missing Supabase session.' }, { status: 401 })

  try {
    const supabase = serviceClient()
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data.user?.email) {
      return NextResponse.json({ ok: false, error: 'Invalid Supabase session.' }, { status: 401 })
    }

    const email = data.user.email.trim().toLowerCase()
    if (!adminEmails.includes(email)) {
      return NextResponse.json({ ok: false, error: 'This account is not an admin.' }, { status: 403 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set('mhq_admin', `${email}.${signSession(email)}`, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    })
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create admin session.'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
