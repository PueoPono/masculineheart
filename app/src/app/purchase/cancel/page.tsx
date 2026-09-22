import Link from 'next/link'

export default function PurchaseCancelPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(54,89,69,0.28),transparent_0),linear-gradient(180deg,#060504,#0d0f0b_20%,#14110f_68%,#090807)] px-4 py-16 text-[#f4eadc]">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-[rgba(228,183,103,0.14)] bg-[linear-gradient(180deg,rgba(18,20,17,0.92),rgba(20,15,12,0.82))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#efc578]">Checkout paused</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">You can return when you are ready.</h1>
        <p className="mt-5 text-[rgba(244,234,220,0.78)]">
          No purchase was completed. You can re-open the checkout from the landing page and continue whenever it feels right.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-6 font-bold text-[#2d1b10] shadow-[0_18px_30px_rgba(160,112,46,0.25)]"
          >
            Return to landing page
          </Link>
          <Link
            href="/checkout"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-6 font-bold text-[#f4eadc]"
          >
            Open checkout again
          </Link>
        </div>
      </div>
    </main>
  )
}
