import Link from 'next/link'

type PurchaseSuccessPageProps = {
  searchParams?: {
    session_id?: string
  }
}

export default function PurchaseSuccessPage({ searchParams }: PurchaseSuccessPageProps) {
  const sessionId = searchParams?.session_id

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(54,89,69,0.28),transparent_0),linear-gradient(180deg,#060504,#0d0f0b_20%,#14110f_68%,#090807)] px-4 py-16 text-[#f4eadc]">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-[rgba(228,183,103,0.14)] bg-[linear-gradient(180deg,rgba(18,20,17,0.92),rgba(20,15,12,0.82))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#efc578]">Purchase received</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">Welcome into the quest.</h1>
        <p className="mt-5 text-[rgba(244,234,220,0.78)]">
          Stripe has returned to the site after checkout. If portal access is not visible immediately, give the enrollment webhook a moment and then open the portal again.
        </p>
        {sessionId ? (
          <p className="mt-4 break-all rounded-[18px] border border-[rgba(239,197,120,0.12)] bg-[rgba(11,9,8,0.42)] p-4 text-sm text-[rgba(244,234,220,0.72)]">
            Stripe session: <span className="text-white">{sessionId}</span>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/portal"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-6 font-bold text-[#2d1b10] shadow-[0_18px_30px_rgba(160,112,46,0.25)]"
          >
            Open the portal
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-6 font-bold text-[#f4eadc]"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  )
}
