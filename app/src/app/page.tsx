import { HeartMark } from '@/components/heart-mark'

const overviewCards = [
  {
    title: 'Quest atmosphere',
    text: 'Deep forest greens, restrained gold, and grounded shadow give the opening a more premium masculine presence.',
  },
  {
    title: 'Embodied pacing',
    text: 'The threshold opens wide first. The supporting cards wait lower so the title and symbol can lead the experience.',
  },
  {
    title: 'Brand continuity',
    text: 'The hand-drawn heart-with-arrow mark now carries through the landing, portal, lesson, completion, and locked states.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(54,89,69,0.28),transparent_0),linear-gradient(180deg,#060504,#0d0f0b_20%,#14110f_68%,#090807)] text-[#f4eadc]">
      <div className="mx-auto w-[min(1240px,calc(100%-32px))] py-8 md:py-12">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#efc578]">Archetypal Masculine Heart</div>
            <p className="mt-2 text-sm text-[rgba(244,234,220,0.6)]">Premium course prototype · forest-rooted, masculine, restrained</p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm text-[rgba(244,234,220,0.72)]">
            <a href="/portal" className="hover:text-white">Portal</a>
            <a href="/portal/lesson/day-1" className="hover:text-white">Day 1</a>
            <a href="/portal/complete" className="hover:text-white">Complete</a>
          </nav>
        </header>

        <section className="relative overflow-hidden rounded-[34px] border border-[rgba(228,183,103,0.16)] bg-[linear-gradient(135deg,rgba(16,22,18,0.94),rgba(17,13,11,0.86)_42%,rgba(11,9,8,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(92,131,105,0.22),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(239,197,120,0.08),transparent_22%),radial-gradient(circle_at_60%_76%,rgba(58,79,57,0.18),transparent_28%)]" />
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:42px_42px]" />

          <div className="relative grid gap-10 px-6 py-14 md:px-10 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-14 lg:py-24">
            <div className="order-2 lg:order-1">
              <p className="mb-5 text-xs uppercase tracking-[0.2em] text-[#efc578]">Enter the forest deliberately</p>
              <div className="max-w-3xl">
                <h1 className="text-[clamp(3.4rem,7vw,6.8rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-[#e6bd74] drop-shadow-[0_8px_34px_rgba(0,0,0,0.4)]">
                  Masculine<br />Heart Quest
                </h1>
                <p className="mt-6 max-w-2xl text-[1.06rem] leading-8 text-[rgba(244,234,220,0.8)] md:text-[1.15rem]">
                  A 21-day guided descent into heart, symbol, masculinity, intention, and lived vitality — designed with more space, more gravity, and a cleaner threshold into the work.
                </p>
                <p className="mt-4 max-w-2xl text-[rgba(244,234,220,0.62)]">
                  The opening now gives the symbol and title room to breathe before the practical path begins.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <a href="/portal" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-6 font-bold text-[#2d1b10] shadow-[0_18px_30px_rgba(160,112,46,0.25)]">Open the portal</a>
                <a href="/portal/lesson/day-1" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-6 font-bold text-[#f4eadc]">View day 1</a>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="relative flex min-h-[380px] w-full max-w-[460px] items-center justify-center rounded-[32px] border border-[rgba(239,197,120,0.12)] bg-[linear-gradient(180deg,rgba(29,42,33,0.42),rgba(17,12,10,0.2))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_22px_60px_rgba(0,0,0,0.34)] backdrop-blur-sm md:min-h-[450px] md:p-8">
                <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(239,197,120,0.10),transparent_60%)] blur-3xl" />
                <HeartMark className="relative h-[260px] w-[260px] object-contain md:h-[320px] md:w-[320px]" priority glow />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          {overviewCards.map((card) => (
            <div key={card.title} className="rounded-[24px] border border-[rgba(228,183,103,0.14)] bg-[linear-gradient(180deg,rgba(18,20,17,0.92),rgba(20,15,12,0.82))] p-6 shadow-[0_20px_44px_rgba(0,0,0,0.28)]">
              <strong className="mb-2 block text-lg text-white">{card.title}</strong>
              <p className="text-[rgba(244,234,220,0.72)]">{card.text}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
