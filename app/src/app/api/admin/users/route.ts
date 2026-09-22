import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, validateSessionCookie } from '@/lib/admin-auth'
import { getRegisteredUserSummaries } from '@/lib/admin-data'

async function requireAdmin() {
  const cookieStore = await cookies()
  return validateSessionCookie(cookieStore.get(ADMIN_COOKIE)?.value)
}

export async function GET() {
  const adminEmail = await requireAdmin()
  if (!adminEmail) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const users = await getRegisteredUserSummaries()
  return NextResponse.json({ users, adminEmail })
}
