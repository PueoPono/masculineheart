import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, validateSessionCookie } from '@/lib/admin-auth'

export async function GET() {
  const cookieStore = await cookies()
  const adminEmail = validateSessionCookie(cookieStore.get(ADMIN_COOKIE)?.value)
  return NextResponse.json({ adminEmail: adminEmail || null })
}
