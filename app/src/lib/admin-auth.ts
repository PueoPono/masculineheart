import { createHash, createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto'
import { createClient } from '@supabase/supabase-js'

export const DEFAULT_ADMIN_EMAIL = 'bewildandfree@pm.me'
export const ADMIN_COOKIE = 'mhq_admin'
const RESET_MAX_AGE_SECONDS = 60 * 60
const PBKDF2_ITERATIONS = 210_000
const PBKDF2_KEYLEN = 32
const PBKDF2_DIGEST = 'sha256'

type AdminRecord = {
  email: string
  password_hash: string | null
  password_salt: string | null
  is_active: boolean
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function normalizedAdminEmail() {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase()
}

export function allowedAdminEmails() {
  const configured = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || ''
  return Array.from(
    new Set(
      [DEFAULT_ADMIN_EMAIL, ...configured.split(',')]
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),
  )
}

export function isAllowedAdminEmail(email: string) {
  return allowedAdminEmails().includes(email.trim().toLowerCase())
}

export function adminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_RESET_SECRET || process.env.ADMIN_PASSWORD || ''
}

export function signSession(email: string) {
  const secret = adminSessionSecret()
  return createHash('sha256').update(`${email.trim().toLowerCase()}:${secret}`).digest('hex')
}

export function validateSessionCookie(value: string | undefined) {
  if (!value) return null

  const separatorIndex = value.lastIndexOf('.')
  if (separatorIndex <= 0 || separatorIndex === value.length - 1) return null

  const rawEmail = value.slice(0, separatorIndex)
  const signature = value.slice(separatorIndex + 1)

  let email = rawEmail
  try {
    email = decodeURIComponent(rawEmail)
  } catch {
    email = rawEmail
  }

  if (!isAllowedAdminEmail(email)) return null
  return safeEqual(signature, signSession(email)) ? email : null
}

function supabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return null
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST).toString('hex')
  return { salt, hash }
}

function verifyPassword(password: string, salt: string, expectedHash: string) {
  const hash = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST).toString('hex')
  return safeEqual(hash, expectedHash)
}

export async function verifyAdminLogin(username: string, password: string) {
  const email = username.trim().toLowerCase()
  if (!isAllowedAdminEmail(email)) return false

  const supabase = supabaseAdmin()
  if (supabase) {
    const { data } = await supabase
      .from('admin_users')
      .select('email,password_hash,password_salt,is_active')
      .eq('email', email)
      .maybeSingle<AdminRecord>()

    if (data?.is_active && data.password_hash && data.password_salt) {
      return verifyPassword(password, data.password_salt, data.password_hash)
    }
  }

  const configuredUsername = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase()
  const configuredPassword = process.env.ADMIN_PASSWORD || ''
  if (!configuredPassword) return false
  return safeEqual(email, configuredUsername) && safeEqual(password, configuredPassword)
}

export async function setAdminPassword(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  if (!isAllowedAdminEmail(normalizedEmail)) throw new Error('admin_email_not_allowed')

  const supabase = supabaseAdmin()
  if (!supabase) throw new Error('supabase_not_configured')

  const { salt, hash } = hashPassword(password)
  const { error } = await supabase.from('admin_users').upsert(
    {
      email: normalizedEmail,
      password_hash: hash,
      password_salt: salt,
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'email' },
  )
  if (error) throw error
}

function resetSecret() {
  return process.env.ADMIN_RESET_SECRET || adminSessionSecret()
}

export function createResetToken(email: string) {
  const secret = resetSecret()
  if (!secret) throw new Error('admin_reset_secret_not_configured')
  const payload = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + RESET_MAX_AGE_SECONDS,
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', secret).update(encodedPayload).digest('base64url')
  return `${encodedPayload}.${signature}`
}

export function verifyResetToken(token: string) {
  const secret = resetSecret()
  if (!secret) return null
  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return null
  const expectedSignature = createHmac('sha256', secret).update(encodedPayload).digest('base64url')
  if (!safeEqual(signature, expectedSignature)) return null

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as { email?: string; exp?: number }
    if (!payload.email || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
    return isAllowedAdminEmail(payload.email) ? payload.email.trim().toLowerCase() : null
  } catch {
    return null
  }
}

export function siteUrl(requestUrl?: string) {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` || requestUrl && new URL(requestUrl).origin || '').replace(/\/$/, '')
}
