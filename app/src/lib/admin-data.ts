import { createClient } from '@supabase/supabase-js'
import { courseLessons } from '@/lib/course-content'

type AdminProfileRow = {
  id: string
  email: string
  enrolled: boolean
  full_name: string | null
  created_at: string | null
  time_zone: string | null
  time_zone_confirmed: boolean
}

type AdminProgressRow = {
  user_id: string
  status: string
  updated_at: string | null
}

export type RegisteredUserSummary = {
  id: string
  email: string
  fullName: string | null
  enrolled: boolean
  createdAt: string | null
  timeZone: string | null
  timeZoneConfirmed: boolean
  completedLessons: number
  totalLessons: number
  percentComplete: number
  lastProgressAt: string | null
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return null
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
}

export async function getRegisteredUserSummaries(): Promise<RegisteredUserSummary[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return []

  const [{ data: profiles, error: profilesError }, { data: progressRows, error: progressError }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id,email,enrolled,full_name,created_at,time_zone,time_zone_confirmed')
      .order('created_at', { ascending: false })
      .returns<AdminProfileRow[]>(),
    supabase
      .from('lesson_progress')
      .select('user_id,status,updated_at')
      .returns<AdminProgressRow[]>(),
  ])

  if (profilesError) {
    console.error(profilesError)
    return []
  }

  if (progressError) {
    console.error(progressError)
    return []
  }

  const totalLessons = courseLessons.length || 1
  const progressByUser = new Map<string, { completed: number; lastProgressAt: string | null }>()

  for (const row of progressRows || []) {
    const current = progressByUser.get(row.user_id) || { completed: 0, lastProgressAt: null }
    if (row.status === 'complete') current.completed += 1
    if (!current.lastProgressAt || (row.updated_at && row.updated_at > current.lastProgressAt)) {
      current.lastProgressAt = row.updated_at
    }
    progressByUser.set(row.user_id, current)
  }

  return (profiles || []).map((profile) => {
    const summary = progressByUser.get(profile.id) || { completed: 0, lastProgressAt: null }
    const percentComplete = Math.round((summary.completed / totalLessons) * 100)
    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      enrolled: profile.enrolled,
      createdAt: profile.created_at,
      timeZone: profile.time_zone,
      timeZoneConfirmed: profile.time_zone_confirmed,
      completedLessons: summary.completed,
      totalLessons,
      percentComplete,
      lastProgressAt: summary.lastProgressAt,
    }
  })
}
