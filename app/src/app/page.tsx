export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0c0908,#17110f_60%,#0d0908)] text-[#f4eadc]">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-[0.16em] text-[#efc578]">The Masculine Heart</div>
          <nav className="flex flex-wrap gap-3 text-sm text-[rgba(244,234,220,0.72)]">
            <a href="/portal" className="hover:text-white">Portal</a>
            <a href="/portal/lesson/day-1" className="hover:text-white">Day 1</a>
            <a href="/portal/complete" className="hover:text-white">Complete</a>
          </nav>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] shadow-[0_28px_80px_rgba(0,0,0,0.42)]">
            <div className="min-h-[560px] bg-[linear-gradient(180deg,rgba(8,6,5,0.28),rgba(8,6,5,0.58)),url('https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-9">
              <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[#efc578]">The Masculine Heart</p>
              <h1 className="mb-5 text-[clamp(2.7rem,6vw,5.2rem)] leading-[0.94] tracking-[-0.045em] text-white">Enter the forest.<br/>Follow the roots.<br/>Find the heart.</h1>
              <p className="mb-4 max-w-3xl text-lg text-[#f4eadc]">Archetypal Masculine Heart Quest is a 21-day guided journey into the heart, story, symbol, masculinity, intention, and lived vitality.</p>
              <p className="max-w-3xl text-[rgba(244,234,220,0.76)]">This prototype is now being converted from a static draft into a real app path on Vercel + Supabase.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/portal" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">Open the portal</a>
                <a href="/portal/lesson/day-1" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-5 font-bold text-[#f4eadc]">View day 1</a>
              </div>
            </div>
          </div>

          <aside className="grid gap-4">
            {[
              ['Prototype path', 'Vercel frontend + Supabase auth, progress, and journals.'],
              ['Unlock rhythm', 'Current prototype timing is set to 16 hours.'],
              ['Next phase', 'Auth, progress save, lesson state, and journaling will be wired next.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(20,15,12,0.82)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
                <strong className="mb-1 block text-lg text-white">{title}</strong>
                <p className="text-[rgba(244,234,220,0.72)]">{text}</p>
              </div>
            ))}
          </aside>
        </section>
      </div>
    </main>
  )
}
