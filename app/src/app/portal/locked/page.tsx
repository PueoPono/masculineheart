export default function LockedPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0c0908,#17110f_60%,#0d0908)] px-4 py-12 text-[#f4eadc]">
      <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Quest Rhythm</p>
        <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em]">The next lesson is still ripening.</h1>
        <p className="mx-auto max-w-2xl text-[rgba(244,234,220,0.72)]">Good work. The pacing is intentional. Let today settle before the next gate opens.</p>
        <div className="mx-auto mt-6 max-w-xl rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5">
          <strong className="mb-1 block text-lg">Next unlock: 16 hours</strong>
          <div className="text-[rgba(244,234,220,0.72)]">Tomorrow at 8:00 AM</div>
        </div>
      </div>
    </main>
  )
}
