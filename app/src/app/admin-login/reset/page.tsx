import { verifyResetToken } from '@/lib/admin-auth'

export default function ResetAdminPasswordPage({ searchParams }: { searchParams?: { token?: string; error?: string } }) {
  const token = searchParams?.token || ''
  const error = searchParams?.error
  const email = token ? verifyResetToken(token) : null

  const errorMessages: Record<string, string> = {
    invalid_token: 'This setup link is invalid or expired. Request a new one.',
    short_password: 'Use a password with at least 12 characters.',
    password_mismatch: 'The two password fields did not match.',
    storage_not_configured: 'Password storage is not configured yet. Add Supabase service-role settings and run the admin_users migration.',
  }

  return (
    <main className="min-h-screen px-4 py-16 text-[#f4eadc]">
      <div className="mx-auto max-w-md rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(19,24,20,0.96),rgba(20,15,12,0.88))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Admin password</p>
        <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">Set password</h1>
        {email ? (
          <>
            <p className="mb-6 text-[rgba(244,234,220,0.72)]">Create a password for {email}. The admin email is separate from buyer portal magic-link access.</p>
            <form action="/api/admin/reset-password" method="post" className="space-y-4">
              <input type="hidden" name="token" value={token} />
              <input name="password" autoComplete="new-password" required type="password" minLength={12} placeholder="New password" className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none" />
              <input name="confirmPassword" autoComplete="new-password" required type="password" minLength={12} placeholder="Confirm new password" className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none" />
              <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">Set admin password</button>
            </form>
          </>
        ) : (
          <p className="mb-6 text-[rgba(244,234,220,0.72)]">This setup link is invalid or expired. Request a new one.</p>
        )}
        {error ? <div className="mt-4 rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-[rgba(244,234,220,0.72)]">{errorMessages[error] || 'Password setup failed.'}</div> : null}
        <a className="mt-6 inline-block text-sm font-semibold text-[#efc578]" href="/admin-login/forgot">Request another setup link</a>
      </div>
    </main>
  )
}
