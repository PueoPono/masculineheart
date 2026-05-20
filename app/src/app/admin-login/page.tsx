export default function AdminLoginPage({ searchParams }: { searchParams?: { error?: string; logout?: string } }) {
  const error = searchParams?.error
  const logout = searchParams?.logout
  return (
    <main className="min-h-screen px-4 py-16 text-[#f4eadc]">
      <div className="mx-auto max-w-md rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(19,24,20,0.96),rgba(20,15,12,0.88))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Distinct admin access</p>
        <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">Admin login</h1>
        <p className="mb-6 text-[rgba(244,234,220,0.72)]">Username and password access for the course admin area. This is separate from the buyer magic-link portal.</p>
        <form action="/api/admin/login" method="post" className="space-y-4">
          <input name="username" autoComplete="username" required placeholder="Username" className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none" />
          <input name="password" autoComplete="current-password" required type="password" placeholder="Password" className="w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[#f4eadc] outline-none" />
          <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">Enter admin</button>
        </form>
        {error ? <div className="mt-4 rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-[rgba(244,234,220,0.72)]">Admin login failed or is not configured.</div> : null}
        {logout ? <div className="mt-4 rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-[rgba(244,234,220,0.72)]">Signed out.</div> : null}
      </div>
    </main>
  )
}
