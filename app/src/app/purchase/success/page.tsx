export default function PurchaseSuccessPage() {
  return (
    <main className="min-h-screen px-4 py-16 text-[#f4eadc]">
      <div className="mx-auto max-w-2xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(19,24,20,0.94),rgba(20,15,12,0.84))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Purchase complete</p>
        <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">Welcome to the quest.</h1>
        <p className="mb-6 text-[rgba(244,234,220,0.72)]">Your payment was successful. If the Stripe webhook is configured, your portal enrollment will activate automatically for the email used at checkout.</p>
        <div className="flex flex-wrap gap-3">
          <a href="/auth" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">Send portal magic link</a>
          <a href="/portal" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-5 font-bold text-[#f4eadc]">Open portal</a>
        </div>
      </div>
    </main>
  )
}
