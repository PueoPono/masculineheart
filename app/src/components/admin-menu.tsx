'use client'

import { useState } from 'react'
import { useAdminSession } from '@/lib/use-admin-session'

type LinkItem = {
  href: string
  label: string
}

type Props = {
  portalHref?: string
  adminHref?: string
  extraLinks?: LinkItem[]
}

export function AdminMenu({ portalHref = '/portal', adminHref = '/admin', extraLinks = [] }: Props) {
  const [open, setOpen] = useState(false)
  const { isAdmin, loading } = useAdminSession()

  if (loading || !isAdmin) return null

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        type="button"
        aria-label="Admin menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.24)] bg-[rgba(12,10,9,0.88)] text-[#f4eadc] shadow-[0_18px_36px_rgba(0,0,0,0.32)] backdrop-blur transition hover:border-[#dca453]"
      >
        <span className="flex flex-col gap-1">
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>

      {open ? (
        <div className="mt-3 w-72 overflow-hidden rounded-[24px] border border-[rgba(228,183,103,0.2)] bg-[rgba(12,10,9,0.94)] p-3 text-sm shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur">
          <div className="mb-2 px-3 py-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Admin navigation</div>
          <nav className="grid gap-2">
            <a href={portalHref} className="rounded-[16px] px-3 py-3 text-[rgba(244,234,220,0.84)] transition hover:bg-[rgba(255,255,255,0.05)]">Open live course</a>
            <a href={adminHref} className="rounded-[16px] px-3 py-3 text-[rgba(244,234,220,0.84)] transition hover:bg-[rgba(255,255,255,0.05)]">Back to admin editor</a>
            {extraLinks.map((link) => (
              <a key={link.href} href={link.href} className="rounded-[16px] px-3 py-3 text-[rgba(244,234,220,0.84)] transition hover:bg-[rgba(255,255,255,0.05)]">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  )
}
