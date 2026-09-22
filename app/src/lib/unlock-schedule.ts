export const UNLOCK_DELAY_HOURS = Number(process.env.NEXT_PUBLIC_UNLOCK_DELAY_HOURS || 20)

export type UnlockProfilePreference = {
  time_zone?: string | null
  time_zone_confirmed?: boolean | null
}

type ZonedParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

function getFormatter(timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
}

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = getFormatter(timeZone)
  const values = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)]),
  )

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  }
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = getZonedParts(date, timeZone)
  const utcFromParts = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
  return utcFromParts - date.getTime()
}

function getUtcForZonedDateTime(parts: ZonedParts, timeZone: string) {
  let guess = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)

  for (let index = 0; index < 4; index += 1) {
    const offset = getTimeZoneOffsetMs(new Date(guess), timeZone)
    const nextGuess = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) - offset
    if (Math.abs(nextGuess - guess) < 1_000) return nextGuess
    guess = nextGuess
  }

  return guess
}

function getNextDay(parts: Pick<ZonedParts, 'year' | 'month' | 'day'>) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
  date.setUTCDate(date.getUTCDate() + 1)
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

export function normalizeTimeZone(value: unknown) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

export function isValidTimeZone(value: unknown) {
  const timeZone = normalizeTimeZone(value)
  if (!timeZone) return false

  try {
    getFormatter(timeZone).format(new Date())
    return true
  } catch {
    return false
  }
}

export function getDetectedTimeZone() {
  try {
    const value = Intl.DateTimeFormat().resolvedOptions().timeZone
    return normalizeTimeZone(value)
  } catch {
    return null
  }
}

export function unlockAtFromNow(hours = UNLOCK_DELAY_HOURS, now = new Date()) {
  return new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString()
}

export function getNextMidnightUnlockAt(timeZone: string, now = new Date()) {
  if (!isValidTimeZone(timeZone)) return null

  const currentParts = getZonedParts(now, timeZone)
  const nextDay = getNextDay(currentParts)
  let unlockMs = getUtcForZonedDateTime({ ...nextDay, hour: 0, minute: 0, second: 0 }, timeZone)

  if (unlockMs <= now.getTime()) {
    const fallbackDay = getNextDay(nextDay)
    unlockMs = getUtcForZonedDateTime({ ...fallbackDay, hour: 0, minute: 0, second: 0 }, timeZone)
  }

  return new Date(unlockMs).toISOString()
}

export function getUnlockAtForProfile(profile: UnlockProfilePreference | null | undefined, now = new Date()) {
  const timeZone = normalizeTimeZone(profile?.time_zone)
  if (profile?.time_zone_confirmed && timeZone) {
    const midnightUnlock = getNextMidnightUnlockAt(timeZone, now)
    if (midnightUnlock) return midnightUnlock
  }

  return unlockAtFromNow(UNLOCK_DELAY_HOURS, now)
}

export function getDripCadenceDescription() {
  return `Midnight in the buyer's confirmed time zone, otherwise ${UNLOCK_DELAY_HOURS} hours after video completion.`
}

export function getVideoCompleteStatus(nextLessonTitle: string, profile: UnlockProfilePreference | null | undefined) {
  const timeZone = normalizeTimeZone(profile?.time_zone)
  if (profile?.time_zone_confirmed && timeZone && isValidTimeZone(timeZone)) {
    return `Video complete. ${nextLessonTitle} unlocks at your next midnight.`
  }

  return `Video complete. ${nextLessonTitle} unlocks in ${UNLOCK_DELAY_HOURS} hours.`
}
