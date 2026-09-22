'use client'

import { useEffect, useState } from 'react'

export function useAdminSession() {
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const response = await fetch('/api/admin/session', { cache: 'no-store' })
        if (!response.ok) {
          if (active) {
            setAdminEmail(null)
            setLoading(false)
          }
          return
        }

        const data = (await response.json()) as { adminEmail?: string | null }
        if (active) {
          setAdminEmail(data.adminEmail || null)
          setLoading(false)
        }
      } catch {
        if (active) {
          setAdminEmail(null)
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return { adminEmail, isAdmin: !!adminEmail, loading }
}
