'use client'

import Image from 'next/image'
import { PurchaseButton } from '@/components/purchase-button'
import type { LandingPriceInfo } from '@/lib/landing-data'
import { useSiteContent } from '@/lib/site-content-store'

type Props = {
  price: LandingPriceInfo
}

type CalendarDay = {
  day: number
  image: string
  alt: string
}

const calendarDays: CalendarDay[] = Array.from({ length: 21 }, (_, index) => {
  const day = index + 1
  if (day <= 7) {
    return {
      day,
      image: '/generated/mhq-part-1-heart-unlock.png',
      alt: 'Heart Unlock symbolic image',
    }
  }
  if (day <= 14) {
    return {
      day,
      image: '/generated/mhq-part-2-language-heart.png',
      alt: 'Language of the Heart symbolic image',
    }
  }
  return {
    day,
    image: '/generated/mhq-part-3-intentions.png',
    alt: 'Intentions Worth Planting symbolic image',
  }
})

export function HomePage({ price }: Props) {
  const { content } = useSiteContent()
  const landing = content.landing
  const purchaseLabel = price.formatted ? `Start the quest · ${price.formatted}` : 'Start the quest'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(54,76,58,0.18),transparent_30%),linear-gradient(180deg,#070706,#0d100d_38%,#090908)] px-4 py-5 text-[#f4eadc] md:px-6 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),transparent_18%,rgba(239,197,120,0.03)_72%,transparent)]" />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-[28px] border border-[rgba(228,183,103,0.12)] bg-[rgba(10,11,10,0.62)] px-5 py-4 backdrop-blur md:px-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#dcb66f]">{landing.brandEyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[#f2c777] md:text-6xl">{landing.pageTitle}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[rgba(244,234,220,0.68)] md:text-base">{landing.journeyDescription}</p>
        </header>

        <section className="overflow-hidden rounded-[34px] border border-[rgba(228,183,103,0.14)] bg-[rgba(11,11,10,0.72)] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <div className="relative aspect-[4/5] w-full md:aspect-[16/10]">
            <Image
              src="/generated/mhq-hero-journal-quest-gpt-image-2.png"
              alt="A man writing in his journal as the desk and pages transform into a symbolic journey through forest, river, valley, and mountains"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,6,0.08),rgba(7,7,6,0.18)_38%,rgba(7,7,6,0.6))]" />
            <div className="absolute inset-x-0 top-0 flex justify-center px-6 pt-8 md:px-10 md:pt-10">
              <div className="inline-flex flex-col items-start rounded-[18px] bg-[rgba(10,10,10,0.32)] px-4 py-3 backdrop-blur-[2px] md:px-5 md:py-4">
                <p className="text-lg font-medium italic tracking-[0.01em] text-[rgba(244,234,220,0.94)] drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] md:text-3xl md:leading-[1.35]">
                  <span className="block">{landing.quoteLine1}</span>
                  <span className="mt-1 block pl-6 md:pl-10">{landing.quoteLine2}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="purchase" className="rounded-[30px] border border-[rgba(228,183,103,0.12)] bg-[rgba(12,12,11,0.72)] px-5 py-6 md:px-7">
          <p className="max-w-2xl text-sm leading-7 text-[rgba(244,234,220,0.72)]">{landing.purchaseBody}</p>
          <div className="mt-5 max-w-2xl">
            <PurchaseButton
              label={purchaseLabel}
              helperText="Email is collected at checkout for receipt and portal access"
              className="max-w-xl"
              showMeta={false}
            />
          </div>
          <div className="mt-4">
            <a href="/portal" className="text-sm text-[rgba(244,234,220,0.78)] underline decoration-[rgba(239,197,120,0.28)] underline-offset-4 hover:text-white">
              {landing.portalLinkLabel}
            </a>
          </div>
        </section>

        <section className="rounded-[30px] border border-[rgba(228,183,103,0.12)] bg-[rgba(12,12,11,0.68)] px-5 py-5 md:px-7">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#dcb66f]">{landing.journeyEyebrow}</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[rgba(244,234,220,0.72)] md:text-base">
            {landing.journeyBody}
          </p>
        </section>

        <section id="course-preview" className="rounded-[30px] border border-[rgba(228,183,103,0.12)] bg-[rgba(11,11,10,0.72)] px-5 py-6 md:px-7 md:py-7">
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#dcb66f]">{landing.previewEyebrow}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#f4eadc] md:text-3xl">{landing.previewTitle}</h2>
            </div>
            <div className="max-w-3xl space-y-3 text-sm leading-7 text-[rgba(244,234,220,0.66)]">
              <p>{landing.previewIntroLine1}</p>
              <p>{landing.previewIntroLine2}</p>
            </div>
          </div>

          <div className="mt-5 mx-auto max-w-4xl overflow-hidden rounded-[26px] border border-[rgba(228,183,103,0.1)] bg-[rgba(255,255,255,0.02)] p-3 md:p-4">
            <div className="grid grid-cols-7 gap-2 md:gap-2.5">
              {calendarDays.map((entry) => (
                <div key={entry.day} className="rounded-[16px] border border-[rgba(228,183,103,0.08)] bg-[rgba(12,12,11,0.78)] p-1.5">
                  <div className="relative aspect-square overflow-hidden rounded-[12px]">
                    <Image src={entry.image} alt={entry.alt} fill sizes="(max-width: 768px) 12vw, 110px" className="object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.22))]" />
                    <div className="absolute left-1.5 top-1.5 rounded-full bg-[rgba(8,8,8,0.62)] px-1.5 py-0.5 text-[10px] font-medium text-[#f4eadc] backdrop-blur-sm">
                      {entry.day}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
