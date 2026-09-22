export default function ForgotAdminPasswordPage({ searchParams }: { searchParams?: { sent?: string; error?: string } }) {
  const sent = searchParams?.sent
  const error = searchParams?.error

  const errorMessages: Record<string, string> = {
    missing_email: 'Enter the admin email address.',
    email_provider_not_configured: 'Email sending is not configured yet. Add RESEND_API_KEY and ADMIN_EMAIL_FROM in Vercel.',
    email_send_failed: 'The reset email could not be sent. Check the email provider settings.',
    reset_not_configured: 'Password reset is not configured yet. Add ADMIN_RESET_SECRET or ADMIN_SESSION_SECRET.',
  }

  return (
    <main className="min-h-screen px-4 py-16 text-[#f4eadc]">
      <div className="mx-auto max-w-md rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(19,24,20,0.96),rgba(20,15,12,0.88))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Admin password</p>
        <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">Reset access</h1>
        <p className="mb-6 text-[rgba(244,234,220,0.72)]">Enter the admin email address. If it matches the configured admin, a secure password setup link will be emailed.</p>
        <form action="/api/admin/forgot-password" method="post" className="space-y-4">
          <input name="email" autoComplete="email" required type="email" placeholder="bewildandfree@pm.me" className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none" />
          <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">Email setup link</button>
        </form>
        {sent ? <div className="mt-4 rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-[rgba(244,234,220,0.72)]">If that address is an admin, a setup link has been sent.</div> : null}
        {error ? <div className="mt-4 rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-[rgba(244,234,220,0.72)]">{errorMessages[error] || 'Password reset failed.'}</div> : null}
        <a className="mt-6 inline-block text-sm font-semibold text-[#efc578]" href="/admin-login">Back to admin login</a>
      </div>
    </main>
  )
}
