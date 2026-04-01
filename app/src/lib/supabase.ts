import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const UNLOCK_DELAY_HOURS = Number(process.env.NEXT_PUBLIC_UNLOCK_DELAY_HOURS || 16)


export function unlockAtFromNow(hours = UNLOCK_DELAY_HOURS) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}
