export default function PurchaseCancelPage() {
  return (
    <main className="min-h-screen px-4 py-16 text-[#f4eadc]">
      <div className="mx-auto max-w-2xl rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(19,24,20,0.94),rgba(20,15,12,0.84))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">Checkout cancelled</p>
        <h1 className="mb-3 text-4xl font-semibold tracking-[-0.04em] text-[#e6bd74]">No problem.</h1>
        <p className="text-[rgba(244,234,220,0.72)]">Checkout was cancelled before payment completion. You can return to the landing page and begin again when ready.</p>
      </div>
    </main>
  )
}
