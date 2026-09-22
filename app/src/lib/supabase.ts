import { createClient } from '@supabase/supabase-js'
import { UNLOCK_DELAY_HOURS, unlockAtFromNow } from '@/lib/unlock-schedule'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'build-time-placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export { UNLOCK_DELAY_HOURS, unlockAtFromNow }
