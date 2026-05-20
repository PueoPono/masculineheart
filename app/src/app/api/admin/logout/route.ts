import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/admin-login?logout=1', request.url), 303)
  response.cookies.set('mhq_admin', '', { path: '/', maxAge: 0 })
  return response
}
