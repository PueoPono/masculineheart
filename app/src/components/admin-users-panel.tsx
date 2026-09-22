'use client'

import { useEffect, useMemo, useState } from 'react'
import type { RegisteredUserSummary } from '@/lib/admin-data'

type Props = {
  initialUsers: RegisteredUserSummary[]
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString()
}

export function AdminUsersPanel({ initialUsers }: Props) {
  const [users, setUsers] = useState<RegisteredUserSummary[]>(initialUsers)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  async function refresh() {
    setLoading(true)
    setStatus('')
    try {
      const response = await fetch('/api/admin/users', { cache: 'no-store' })
      if (!response.ok) {
        setStatus('Could not refresh registered users right now.')
        return
      }
      const data = (await response.json()) as { users?: RegisteredUserSummary[] }
      setUsers(data.users || [])
    } catch {
      setStatus('Could not refresh registered users right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setUsers(initialUsers)
  }, [initialUsers])

  const enrolledCount = useMemo(() => users.filter((user) => user.enrolled).length, [users])
  const averageCompletion = useMemo(() => {
    if (!users.length) return 0
    return Math.round(users.reduce((sum, user) => sum + user.percentComplete, 0) / users.length)
  }, [users])

  return (
    <section className="rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">Registered users</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-[#f4eadc]">Course access + completion</h2>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 text-sm font-semibold text-[#f4eadc] disabled:opacity-70"
        >
          {loading ? 'Refreshing…' : 'Refresh users'}
        </button>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] border border-[rgba(228,183,103,0.16)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="text-xs uppercase tracking-[0.14em] text-[#efc578]">Registered</div>
          <div className="mt-2 text-3xl font-semibold text-[#f4eadc]">{users.length}</div>
        </div>
        <div className="rounded-[22px] border border-[rgba(228,183,103,0.16)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="text-xs uppercase tracking-[0.14em] text-[#efc578]">Enrolled</div>
          <div className="mt-2 text-3xl font-semibold text-[#f4eadc]">{enrolledCount}</div>
        </div>
        <div className="rounded-[22px] border border-[rgba(228,183,103,0.16)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="text-xs uppercase tracking-[0.14em] text-[#efc578]">Average completion</div>
          <div className="mt-2 text-3xl font-semibold text-[#f4eadc]">{averageCompletion}%</div>
        </div>
      </div>

      {status ? <div className="mb-4 rounded-[18px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-[rgba(244,234,220,0.74)]">{status}</div> : null}

      <div className="hidden overflow-x-auto rounded-[22px] border border-[rgba(228,183,103,0.14)] md:block">
        <table className="min-w-full divide-y divide-[rgba(228,183,103,0.12)] text-left text-sm text-[rgba(244,234,220,0.82)]">
          <thead className="bg-[rgba(255,255,255,0.03)] text-xs uppercase tracking-[0.14em] text-[#efc578]">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Enrolled</th>
              <th className="px-4 py-3">Time zone</th>
              <th className="px-4 py-3">Completion</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Last progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(228,183,103,0.08)]">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.fullName || '—'}</td>
                <td className="px-4 py-3">{user.enrolled ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">{user.timeZone ? `${user.timeZone}${user.timeZoneConfirmed ? ' ✓' : ''}` : '—'}</td>
                <td className="px-4 py-3">{user.completedLessons} / {user.totalLessons} ({user.percentComplete}%)</td>
                <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3">{formatDate(user.lastProgressAt)}</td>
              </tr>
            ))}
            {!users.length ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[rgba(244,234,220,0.64)]">No registered users found yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {users.map((user) => (
          <article key={user.id} className="rounded-[22px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4">
            <div className="break-all text-sm font-semibold text-[#f4eadc]">{user.email}</div>
            <div className="mt-3 grid gap-2 text-sm text-[rgba(244,234,220,0.76)]">
              <div><span className="text-[#efc578]">Name:</span> {user.fullName || '—'}</div>
              <div><span className="text-[#efc578]">Enrolled:</span> {user.enrolled ? 'Yes' : 'No'}</div>
              <div><span className="text-[#efc578]">Time zone:</span> {user.timeZone ? `${user.timeZone}${user.timeZoneConfirmed ? ' ✓' : ''}` : '—'}</div>
              <div><span className="text-[#efc578]">Completion:</span> {user.completedLessons} / {user.totalLessons} ({user.percentComplete}%)</div>
              <div><span className="text-[#efc578]">Joined:</span> {formatDate(user.createdAt)}</div>
              <div><span className="text-[#efc578]">Last progress:</span> {formatDate(user.lastProgressAt)}</div>
            </div>
          </article>
        ))}
        {!users.length ? (
          <div className="rounded-[22px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] px-4 py-8 text-center text-[rgba(244,234,220,0.64)]">No registered users found yet.</div>
        ) : null}
      </div>
    </section>
  )
}
