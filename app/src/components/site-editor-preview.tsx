'use client'

import Image from 'next/image'
import { HeartCornerMark } from '@/components/heart-mark'
import type { CourseTrack, LessonContent, SiteContent } from '@/lib/site-content'

export type SiteEditorInteractionMode = 'preview' | 'reference' | 'text-edit'

type SelectedSection = 'landing' | 'portal' | 'locked' | 'complete' | `lesson:${string}`

const partOneBoxBackground =
  "linear-gradient(135deg,rgba(7,12,20,0.72),rgba(12,10,9,0.6) 42%,rgba(12,10,9,0.86)),url('/images/part-one-heart-locks-fence.jpg')"

const partOneLessonBackground =
  "linear-gradient(135deg,rgba(7,12,20,0.7),rgba(12,10,9,0.56) 45%,rgba(12,10,9,0.9)),url('/images/part-one-heart-locks-fence.jpg')"

const partOneBackgroundStyle = {
  backgroundImage: partOneBoxBackground,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

const partOneLessonBackgroundStyle = {
  backgroundImage: partOneLessonBackground,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

export type SiteEditorPreviewSelection = {
  itemKey: string
  itemLabel: string
}

export type SiteEditorPreviewSelectionWithRect = SiteEditorPreviewSelection & {
  rect: {
    top: number
    left: number
    width: number
    height: number
  }
}

type PreviewTargetProps = {
  target: SiteEditorPreviewSelection
  interactionMode: SiteEditorInteractionMode
  selectedItemKey?: string | null
  onSelectItem?: (selection: SiteEditorPreviewSelectionWithRect) => void
  children: React.ReactNode
  className?: string
  fit?: 'block' | 'inline'
}

function toTargetClass(active: boolean, mode: SiteEditorInteractionMode) {
  if (mode === 'preview') return ''
  return `rounded-[12px] transition ${active ? 'ring-2 ring-[#efc578] bg-[rgba(239,197,120,0.08)]' : 'hover:ring-1 hover:ring-[rgba(239,197,120,0.45)] hover:bg-[rgba(239,197,120,0.05)] cursor-pointer'}`
}

function PreviewTarget({ target, interactionMode, selectedItemKey, onSelectItem, children, className = '', fit = 'block' }: PreviewTargetProps) {
  const active = selectedItemKey === target.itemKey
  if (interactionMode === 'preview') return <div className={className}>{children}</div>
  const fitClass = fit === 'inline' ? 'inline-flex text-left align-middle' : 'w-full text-left'

  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        onSelectItem?.({
          ...target,
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
        })
      }}
      className={`${fitClass} ${toTargetClass(active, interactionMode)} ${className}`}
    >
      {children}
    </button>
  )
}

function shellKey(section: string, field: string) {
  return `${section}.${field}`
}

const calendarDays = Array.from({ length: 21 }, (_, index) => {
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

type PreviewBaseProps = {
  content: SiteContent
  interactionMode: SiteEditorInteractionMode
  selectedItemKey?: string | null
  onSelectItem?: (selection: SiteEditorPreviewSelectionWithRect) => void
  adminEmail?: string
}

function LandingPreview({ content, interactionMode, selectedItemKey, onSelectItem }: PreviewBaseProps) {
  const landing = content.landing

  return (
    <main className="relative min-h-[1200px] overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(54,76,58,0.18),transparent_30%),linear-gradient(180deg,#070706,#0d100d_38%,#090908)] px-4 py-5 text-[#f4eadc] md:px-6 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),transparent_18%,rgba(239,197,120,0.03)_72%,transparent)]" />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-[28px] border border-[rgba(228,183,103,0.12)] bg-[rgba(10,11,10,0.62)] px-5 py-4 backdrop-blur md:px-6">
          <PreviewTarget target={{ itemKey: shellKey('landing', 'brandEyebrow'), itemLabel: 'Landing brand eyebrow' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#dcb66f]">{landing.brandEyebrow}</p>
          </PreviewTarget>
          <PreviewTarget target={{ itemKey: shellKey('landing', 'pageTitle'), itemLabel: 'Landing page title' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-3">
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#f2c777] md:text-6xl">{landing.pageTitle}</h1>
          </PreviewTarget>
          <PreviewTarget target={{ itemKey: shellKey('landing', 'journeyDescription'), itemLabel: 'Landing journey description' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-3">
            <p className="max-w-3xl text-sm leading-7 text-[rgba(244,234,220,0.68)] md:text-base">{landing.journeyDescription}</p>
          </PreviewTarget>
        </header>

        <section className="overflow-hidden rounded-[34px] border border-[rgba(228,183,103,0.14)] bg-[rgba(11,11,10,0.72)] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <div className="relative aspect-[4/5] w-full md:aspect-[16/10]">
            <PreviewTarget target={{ itemKey: shellKey('landing', 'heroImage'), itemLabel: 'Landing hero image' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="absolute inset-0">
              <Image
                src="/generated/mhq-hero-journal-quest-gpt-image-2.png"
                alt="A man writing in his journal as the desk and pages transform into a symbolic journey through forest, river, valley, and mountains"
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover object-center"
              />
            </PreviewTarget>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,6,0.08),rgba(7,7,6,0.18)_38%,rgba(7,7,6,0.6))]" />
            <div className="absolute inset-x-0 top-0 flex justify-center px-6 pt-8 md:px-10 md:pt-10">
              <div className="inline-flex flex-col items-start rounded-[18px] bg-[rgba(10,10,10,0.32)] px-4 py-3 backdrop-blur-[2px] md:px-5 md:py-4">
                <PreviewTarget target={{ itemKey: shellKey('landing', 'quoteLine1'), itemLabel: 'Landing quote line 1' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                  <p className="text-lg font-medium italic tracking-[0.01em] text-[rgba(244,234,220,0.94)] drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] md:text-3xl md:leading-[1.35]">{landing.quoteLine1}</p>
                </PreviewTarget>
                <PreviewTarget target={{ itemKey: shellKey('landing', 'quoteLine2'), itemLabel: 'Landing quote line 2' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-1 pl-6 md:pl-10">
                  <p className="text-lg font-medium italic tracking-[0.01em] text-[rgba(244,234,220,0.94)] drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] md:text-3xl md:leading-[1.35]">{landing.quoteLine2}</p>
                </PreviewTarget>
              </div>
            </div>
          </div>
        </section>

        <section id="purchase" className="rounded-[30px] border border-[rgba(228,183,103,0.12)] bg-[rgba(12,12,11,0.72)] px-5 py-6 md:px-7">
          <PreviewTarget target={{ itemKey: shellKey('landing', 'purchaseBody'), itemLabel: 'Landing purchase body' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
            <p className="max-w-2xl text-sm leading-7 text-[rgba(244,234,220,0.72)]">{landing.purchaseBody}</p>
          </PreviewTarget>
          <div className="mt-5 max-w-2xl">
            <PreviewTarget target={{ itemKey: shellKey('landing', 'primaryCta'), itemLabel: 'Landing purchase button label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
              <div className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">{landing.primaryCta}</div>
            </PreviewTarget>
            <PreviewTarget target={{ itemKey: shellKey('landing', 'heroSupport'), itemLabel: 'Landing purchase helper text' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-3 max-w-xl">
              <p className="text-xs text-[rgba(244,234,220,0.6)]">{landing.heroSupport}</p>
            </PreviewTarget>
          </div>
          <PreviewTarget target={{ itemKey: shellKey('landing', 'portalLinkLabel'), itemLabel: 'Landing portal link label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-4">
            <p className="text-sm text-[rgba(244,234,220,0.78)] underline decoration-[rgba(239,197,120,0.28)] underline-offset-4">{landing.portalLinkLabel}</p>
          </PreviewTarget>
        </section>

        <section className="rounded-[30px] border border-[rgba(228,183,103,0.12)] bg-[rgba(12,12,11,0.68)] px-5 py-5 md:px-7">
          <PreviewTarget target={{ itemKey: shellKey('landing', 'journeyEyebrow'), itemLabel: 'Landing journey eyebrow' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#dcb66f]">{landing.journeyEyebrow}</p>
          </PreviewTarget>
          <PreviewTarget target={{ itemKey: shellKey('landing', 'journeyBody'), itemLabel: 'Landing journey body' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-3">
            <p className="max-w-3xl text-sm leading-7 text-[rgba(244,234,220,0.72)] md:text-base">{landing.journeyBody}</p>
          </PreviewTarget>
        </section>

        <section id="course-preview" className="rounded-[30px] border border-[rgba(228,183,103,0.12)] bg-[rgba(11,11,10,0.72)] px-5 py-6 md:px-7 md:py-7">
          <div className="flex flex-col gap-2">
            <div>
              <PreviewTarget target={{ itemKey: shellKey('landing', 'previewEyebrow'), itemLabel: 'Landing preview eyebrow' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#dcb66f]">{landing.previewEyebrow}</p>
              </PreviewTarget>
              <PreviewTarget target={{ itemKey: shellKey('landing', 'previewTitle'), itemLabel: 'Landing preview title' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-2">
                <h2 className="text-2xl font-semibold tracking-[-0.05em] text-[#f4eadc] md:text-3xl">{landing.previewTitle}</h2>
              </PreviewTarget>
            </div>
            <div className="max-w-3xl space-y-3 text-sm leading-7 text-[rgba(244,234,220,0.66)]">
              <PreviewTarget target={{ itemKey: shellKey('landing', 'previewIntroLine1'), itemLabel: 'Landing preview intro line 1' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                <p>{landing.previewIntroLine1}</p>
              </PreviewTarget>
              <PreviewTarget target={{ itemKey: shellKey('landing', 'previewIntroLine2'), itemLabel: 'Landing preview intro line 2' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                <p>{landing.previewIntroLine2}</p>
              </PreviewTarget>
            </div>
          </div>

          <div className="mt-5 mx-auto max-w-4xl overflow-hidden rounded-[26px] border border-[rgba(228,183,103,0.1)] bg-[rgba(255,255,255,0.02)] p-3 md:p-4">
            <div className="grid grid-cols-7 gap-2 md:gap-2.5">
              {calendarDays.map((entry) => (
                <div key={entry.day} className="rounded-[16px] border border-[rgba(228,183,103,0.08)] bg-[rgba(12,12,11,0.78)] p-1.5">
                  <div className="relative aspect-square overflow-hidden rounded-[12px]">
                    <PreviewTarget target={{ itemKey: shellKey('landing', `calendarImages.${entry.day}`), itemLabel: `Calendar day ${entry.day} image` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="absolute inset-0">
                      <Image src={entry.image} alt={entry.alt} fill sizes="(max-width: 768px) 12vw, 110px" className="object-cover" />
                    </PreviewTarget>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.22))]" />
                    <div className="absolute left-1.5 top-1.5 rounded-full bg-[rgba(8,8,8,0.62)] px-1.5 py-0.5 text-[10px] font-medium text-[#f4eadc] backdrop-blur-sm">{entry.day}</div>
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

function PortalPreview({ content, interactionMode, selectedItemKey, onSelectItem, courseTracks, adminEmail }: PreviewBaseProps & { courseTracks: CourseTrack[] }) {
  const portal = content.portal
  const lessons = content.lessons
  const nextAvailable = lessons[0]

  return (
    <main className="min-h-[1200px] rounded-[30px] bg-[linear-gradient(180deg,#090909,#10130f)] px-4 py-10 text-[#f4eadc]">
      <div className="mx-auto w-full max-w-7xl">
        <section className="relative overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.34)] md:p-8">
          <HeartCornerMark />
          <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-start">
            <div>
              <PreviewTarget target={{ itemKey: shellKey('portal', 'eyebrow'), itemLabel: 'Portal eyebrow' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">{portal.eyebrow}</p>
              </PreviewTarget>
              <PreviewTarget target={{ itemKey: shellKey('portal', 'title'), itemLabel: 'Portal title' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[#e6bd74]">{portal.title}</h1>
              </PreviewTarget>
              <PreviewTarget target={{ itemKey: shellKey('portal', 'signedInLabel'), itemLabel: 'Portal signed-in email' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-2">
                <p className="text-[rgba(244,234,220,0.72)]">{adminEmail || 'dummy-admin@masculineheart.local'}</p>
              </PreviewTarget>
              <PreviewTarget target={{ itemKey: shellKey('portal', 'mapBody'), itemLabel: 'Portal intro body' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-5 max-w-2xl">
                <p className="text-[rgba(244,234,220,0.78)]">{portal.mapBody}</p>
              </PreviewTarget>
              <PreviewTarget target={{ itemKey: shellKey('portal', 'adminUnlockedNote'), itemLabel: 'Portal admin unlocked note' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-3">
                <p className="text-sm text-[#efc578]">{portal.adminUnlockedNote}</p>
              </PreviewTarget>
            </div>
            <div className="grid gap-3">
              <div className="rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-sm text-[rgba(244,234,220,0.78)]">
                <PreviewTarget target={{ itemKey: shellKey('portal', 'progressHeading'), itemLabel: 'Portal progress heading' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                  <strong className="text-[#f4eadc]">{portal.progressHeading}</strong>
                </PreviewTarget>
                <div className="mt-2 text-3xl font-semibold text-[#e6bd74]">0 / {lessons.length}</div>
                <PreviewTarget target={{ itemKey: shellKey('portal', 'completedLessonsLabel'), itemLabel: 'Portal completed lessons label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-1">
                  <div>{portal.completedLessonsLabel}</div>
                </PreviewTarget>
              </div>
              <div className="rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-4 text-sm text-[rgba(244,234,220,0.78)]">
                <PreviewTarget target={{ itemKey: shellKey('portal', 'dripHeading'), itemLabel: 'Portal drip heading' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                  <strong className="text-[#f4eadc]">{portal.dripHeading}</strong>
                </PreviewTarget>
                <PreviewTarget target={{ itemKey: shellKey('portal', 'dripBody'), itemLabel: 'Portal drip body' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-2">
                  <div>{portal.dripBody}</div>
                </PreviewTarget>
                <PreviewTarget target={{ itemKey: shellKey('portal', 'dripSupport'), itemLabel: 'Portal drip support' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-1">
                  <div>{portal.dripSupport}</div>
                </PreviewTarget>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(180deg,rgba(32,44,35,0.52),rgba(20,15,12,0.78))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
              <PreviewTarget target={{ itemKey: shellKey('portal', 'nextAvailableEyebrow'), itemLabel: 'Next available eyebrow' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                <div className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{portal.nextAvailableEyebrow}</div>
              </PreviewTarget>
              <div className="mt-1 text-2xl font-semibold">{nextAvailable.stepLabel} · {nextAvailable.title}</div>
              <PreviewTarget target={{ itemKey: `lesson:${nextAvailable.slug}.theme`, itemLabel: `${nextAvailable.title} theme` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-2">
                <div className="text-[rgba(244,234,220,0.72)]">{nextAvailable.theme}</div>
              </PreviewTarget>
              <PreviewTarget target={{ itemKey: shellKey('portal', 'nextAvailableCta'), itemLabel: 'Portal next available button label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-4 inline-flex">
                <div className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">{portal.nextAvailableCta}</div>
              </PreviewTarget>
            </div>

            <div className="rounded-[22px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
              <PreviewTarget target={{ itemKey: shellKey('portal', 'integrationHeading'), itemLabel: 'Integration heading' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                <div className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{portal.integrationHeading}</div>
              </PreviewTarget>
              <PreviewTarget target={{ itemKey: shellKey('portal', 'integrationAdminBypass'), itemLabel: 'Portal admin bypass note' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-2">
                <div className="text-[rgba(244,234,220,0.72)]">{portal.integrationAdminBypass}</div>
              </PreviewTarget>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {courseTracks.map((track, index) => (
              <div
                key={track.id}
                className="relative overflow-hidden rounded-[22px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[rgba(244,234,220,0.76)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                style={track.id === 'course-1' ? partOneBackgroundStyle : undefined}
              >
                <div className="relative z-[1]">
                  <PreviewTarget target={{ itemKey: shellKey('portal', `trackLabels.${index}`), itemLabel: `${track.title} label` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                    <div className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{portal.trackLabels?.[index] || track.label}</div>
                  </PreviewTarget>
                  <PreviewTarget target={{ itemKey: shellKey('portal', `trackTitles.${index}`), itemLabel: `${track.title} title` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-2">
                    <div className="text-xl font-semibold text-[#f4eadc]">{portal.trackTitles?.[index] || track.title}</div>
                  </PreviewTarget>
                  <PreviewTarget target={{ itemKey: shellKey('portal', `trackDaysLabels.${index}`), itemLabel: `${track.title} days label` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-1">
                    <div className="text-[rgba(244,234,220,0.6)]">{portal.trackDaysLabels?.[index] || track.daysLabel}</div>
                  </PreviewTarget>
                  <PreviewTarget target={{ itemKey: shellKey('portal', `trackNotes.${index}`), itemLabel: `${track.title} note` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-3">
                    <p>{portal.trackNotes[index] || track.editorNote}</p>
                  </PreviewTarget>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <PreviewTarget target={{ itemKey: shellKey('portal', 'mapHeading'), itemLabel: 'Portal map heading' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                <h2 className="text-3xl font-semibold tracking-[-0.03em]">{portal.mapHeading}</h2>
              </PreviewTarget>
              <PreviewTarget target={{ itemKey: shellKey('portal', 'mapBody'), itemLabel: 'Portal map body' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                <p className="text-[rgba(244,234,220,0.72)]">{portal.mapBody}</p>
              </PreviewTarget>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {courseTracks.map((track) => (
              <div
                key={track.id}
                className="relative overflow-hidden rounded-[24px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-4"
              >
                <PreviewTarget target={{ itemKey: shellKey('portal', `trackLabels.${courseTracks.findIndex((entry) => entry.id === track.id)}`), itemLabel: `${track.title} map label` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                  <div className="mb-1 text-xs uppercase tracking-[0.16em] text-[#efc578]">{portal.trackLabels?.[courseTracks.findIndex((entry) => entry.id === track.id)] || track.label}</div>
                </PreviewTarget>
                <PreviewTarget target={{ itemKey: shellKey('portal', `trackTitles.${courseTracks.findIndex((entry) => entry.id === track.id)}`), itemLabel: `${track.title} map title` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mb-4">
                  <div className="text-lg font-semibold text-[#f4eadc]">{portal.trackTitles?.[courseTracks.findIndex((entry) => entry.id === track.id)] || track.title}</div>
                </PreviewTarget>
                <div className="grid gap-3">
                  {track.lessonIds
                    .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
                    .filter((lesson): lesson is LessonContent => !!lesson)
                    .map((lesson) => (
                      <div
                        key={lesson.id}
                        className="group relative overflow-hidden rounded-[18px] border border-[#dca453] bg-[rgba(51,82,63,0.28)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                        style={track.id === 'course-1' ? partOneLessonBackgroundStyle : undefined}
                      >
                        <div className="block rounded-[12px]">
                          <PreviewTarget target={{ itemKey: `lesson:${lesson.slug}.stepLabel`, itemLabel: `${lesson.title} step label` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                            <small className="mb-1 block text-[#efc578]">{lesson.stepLabel}</small>
                          </PreviewTarget>
                          <PreviewTarget target={{ itemKey: `lesson:${lesson.slug}.title`, itemLabel: `${lesson.title} title` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                            <strong className="block text-lg">{lesson.title}</strong>
                          </PreviewTarget>
                          <PreviewTarget target={{ itemKey: `lesson:${lesson.slug}.theme`, itemLabel: `${lesson.title} theme` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-1">
                            <div className="text-sm text-[rgba(244,234,220,0.72)]">{lesson.theme}</div>
                          </PreviewTarget>
                          <PreviewTarget target={{ itemKey: shellKey('portal', 'trackStatusLabel'), itemLabel: 'Portal track status label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-3">
                            <div className="text-xs uppercase tracking-[0.14em] text-[rgba(244,234,220,0.6)]">{portal.trackStatusLabel}</div>
                          </PreviewTarget>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function StatusPreview({ content, interactionMode, selectedItemKey, onSelectItem, section }: PreviewBaseProps & { section: 'locked' | 'complete' }) {
  const page = content[section]
  const isComplete = section === 'complete'
  const backToPortalLabel = page.backToPortalLabel || 'Back to portal'

  return (
    <main className="min-h-[880px] rounded-[30px] bg-[linear-gradient(180deg,#090909,#10130f)] px-4 py-12 text-[#f4eadc]">
      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
        <HeartCornerMark />
        {isComplete ? <div className="mx-auto mb-5 grid h-22 w-22 place-items-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] text-3xl font-extrabold text-[#2d1b10]">✓</div> : null}
        <PreviewTarget target={{ itemKey: shellKey(section, 'eyebrow'), itemLabel: `${section} eyebrow` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">{page.eyebrow}</p>
        </PreviewTarget>
        <PreviewTarget target={{ itemKey: shellKey(section, 'title'), itemLabel: `${section} title` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
          <h1 className={`mb-3 font-semibold tracking-[-0.04em] text-[#e6bd74] ${isComplete ? 'text-5xl' : 'text-4xl'}`}>{page.title}</h1>
        </PreviewTarget>
        <PreviewTarget target={{ itemKey: shellKey(section, 'body'), itemLabel: `${section} body` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
          <p className={`mx-auto max-w-2xl text-[rgba(244,234,220,0.72)] ${isComplete ? 'mb-6' : ''}`}>{page.body}</p>
        </PreviewTarget>
        {isComplete ? (
          <div className="mx-auto mb-6 grid max-w-3xl grid-cols-7 gap-2 md:grid-cols-21">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className={`h-2.5 rounded-full border ${i < 2 ? 'border-transparent bg-[linear-gradient(180deg,#efc578,#dca453)]' : 'border-[rgba(239,197,120,0.08)] bg-[rgba(255,255,255,0.08)]'}`} />
            ))}
          </div>
        ) : null}
        <div className="mx-auto mt-6 max-w-xl rounded-[20px] border border-[rgba(239,197,120,0.12)] bg-[rgba(31,23,18,0.56)] p-5">
          <PreviewTarget target={{ itemKey: shellKey(section, 'cardHeading'), itemLabel: `${section} card heading` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
            <strong className="mb-1 block text-lg">{page.cardHeading}</strong>
          </PreviewTarget>
          <PreviewTarget target={{ itemKey: shellKey(section, 'cardBody'), itemLabel: `${section} card body` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
            <div className="text-[rgba(244,234,220,0.72)]">{page.cardBody}</div>
          </PreviewTarget>
        </div>
        <PreviewTarget target={{ itemKey: shellKey(section, 'backToPortalLabel'), itemLabel: `${section} back to portal label` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-6 inline-flex">
          <div className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-4 text-[#f4eadc]">{backToPortalLabel}</div>
        </PreviewTarget>
      </div>
    </main>
  )
}

function LessonPreview({ lesson, interactionMode, selectedItemKey, onSelectItem, viewport = 'desktop' }: { lesson: LessonContent; interactionMode: SiteEditorInteractionMode; selectedItemKey?: string | null; onSelectItem?: (selection: SiteEditorPreviewSelectionWithRect) => void; viewport?: 'desktop' | 'mobile' }) {
  const prefix = `lesson:${lesson.slug}`
  const isMobile = viewport === 'mobile'
  const shellClass = isMobile ? 'min-h-[1500px] bg-[linear-gradient(180deg,#090909,#10130f)] px-3 py-6 text-[#f4eadc]' : 'min-h-[1500px] bg-[linear-gradient(180deg,#090909,#10130f)] px-4 py-10 text-[#f4eadc]'
  const titleClass = isMobile ? 'text-3xl font-semibold tracking-[-0.04em] text-[#e6bd74]' : 'text-5xl font-semibold tracking-[-0.04em] text-[#e6bd74]'
  const firstGridClass = 'mt-6 grid gap-6'
  const actionClass = isMobile ? 'mt-6 grid gap-3' : 'mt-6 flex flex-wrap gap-3'

  return (
    <main className={shellClass}>
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[30px] border border-[rgba(228,183,103,0.18)] bg-[linear-gradient(135deg,rgba(18,27,21,0.96),rgba(20,15,12,0.84)_45%,rgba(12,10,9,0.98))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.34)] md:p-8">
          <HeartCornerMark />
          <PreviewTarget target={{ itemKey: `${prefix}.arc`, itemLabel: 'Lesson arc' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#efc578]">{lesson.arc}</p>
          </PreviewTarget>
          <div className="flex flex-wrap items-baseline gap-2">
            <PreviewTarget target={{ itemKey: `${prefix}.stepLabel`, itemLabel: 'Lesson step label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
              <span className={titleClass}>{lesson.stepLabel}</span>
            </PreviewTarget>
            <span className={titleClass}>·</span>
            <PreviewTarget target={{ itemKey: `${prefix}.title`, itemLabel: 'Lesson title' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
              <h1 className={titleClass}>{lesson.title}</h1>
            </PreviewTarget>
          </div>
          <PreviewTarget target={{ itemKey: `${prefix}.theme`, itemLabel: 'Lesson theme' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-4 max-w-3xl">
            <p className="text-lg leading-8 text-[rgba(244,234,220,0.8)]">{lesson.theme}</p>
          </PreviewTarget>
        </section>

        <section className={firstGridClass}>
          <div className="rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
            <div className="mb-5 rounded-[22px] border border-[rgba(228,183,103,0.14)] bg-[rgba(255,255,255,0.03)] p-5">
              <PreviewTarget target={{ itemKey: `${prefix}.supportingTextHeading`, itemLabel: 'Supporting text heading' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{lesson.supportingTextHeading || 'Todays Steps'}</p>
              </PreviewTarget>
              <ul className="mt-4 space-y-3 text-[rgba(244,234,220,0.74)]">
                {lesson.supportingPoints.map((point, index) => (
                  <li key={`${lesson.id}-support-${index}`} className="rounded-[18px] border border-[rgba(228,183,103,0.12)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
                    <PreviewTarget target={{ itemKey: `${prefix}.supportingPoints.${index}`, itemLabel: `Supporting point ${index + 1}` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                      <span>{point}</span>
                    </PreviewTarget>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <PreviewTarget target={{ itemKey: `${prefix}.videoLabel`, itemLabel: 'Video label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{lesson.videoLabel}</p>
                </PreviewTarget>
                <PreviewTarget target={{ itemKey: `${prefix}.videoHeading`, itemLabel: 'Lesson video heading' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-1">
                  <h2 className="text-2xl font-semibold">{lesson.videoHeading || 'Lesson video'}</h2>
                </PreviewTarget>
              </div>
            </div>
            <div className="overflow-hidden rounded-[22px] border border-[rgba(239,197,120,0.14)] bg-[linear-gradient(180deg,rgba(33,43,34,0.8),rgba(20,15,12,0.92))]">
              <PreviewTarget target={{ itemKey: `${prefix}.videoUrl`, itemLabel: 'Lesson video embed' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="aspect-video">
                {lesson.videoUrl ? <iframe src={lesson.videoUrl} title={lesson.title} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /> : <div className="grid h-full place-items-center px-6 text-center text-[rgba(244,234,220,0.7)]">Video placeholder</div>}
              </PreviewTarget>
            </div>
            {lesson.videoSupport ? (
              <PreviewTarget target={{ itemKey: `${prefix}.videoSupport`, itemLabel: 'Video support' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-4">
                <p className="text-[rgba(244,234,220,0.74)]">{lesson.videoSupport}</p>
              </PreviewTarget>
            ) : null}
            <div className={actionClass}>
              <PreviewTarget target={{ itemKey: `${prefix}.markVideoCompleteLabel`, itemLabel: 'Mark video complete label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} fit="inline">
                <div className={`${isMobile ? 'w-full' : ''} inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f6d78e,#e0a948)] px-5 text-center font-extrabold text-[#160d07] shadow-[0_10px_28px_rgba(0,0,0,0.34)] ring-1 ring-[rgba(255,255,255,0.18)]`}>{lesson.markVideoCompleteLabel || 'Mark video complete'}</div>
              </PreviewTarget>
              <PreviewTarget target={{ itemKey: `${prefix}.completeLessonLabel`, itemLabel: 'Complete lesson label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} fit="inline">
                <div className={`${isMobile ? 'w-full' : ''} inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-5 text-center font-semibold text-[#f4eadc]`}>{lesson.completeLessonLabel || 'Complete lesson'}</div>
              </PreviewTarget>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6">
          <div className="rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
            <PreviewTarget target={{ itemKey: `${prefix}.reflectionPromptsHeading`, itemLabel: 'Reflection prompts heading' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
              <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{lesson.reflectionPromptsHeading || 'Heart Fitness Exercise'}</p>
            </PreviewTarget>
            <div className="mt-4 rounded-[18px] border border-[rgba(228,183,103,0.12)] bg-[rgba(255,255,255,0.03)] p-5 text-[rgba(244,234,220,0.8)]">
              {lesson.practice ? (
                <PreviewTarget target={{ itemKey: `${prefix}.practice`, itemLabel: 'Practice' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                  <p>{lesson.practice}</p>
                </PreviewTarget>
              ) : null}
              <p className={lesson.practice ? 'mt-3' : ''}>Open your note book and write what comes to mind. Or type here directly. Your typed reflections will be saved as you go and emailed to you after you complete the full course.</p>
              {lesson.journalPrompt ? (
                <PreviewTarget target={{ itemKey: `${prefix}.journalPrompt`, itemLabel: 'Journal prompt' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-3">
                  <p>{lesson.journalPrompt}</p>
                </PreviewTarget>
              ) : null}
              {lesson.prompts.length ? (
                <div className="mt-4">
                  <PreviewTarget target={{ itemKey: `${prefix}.promptLabelPrefix`, itemLabel: 'Prompt label prefix' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#efc578]">{lesson.promptLabelPrefix || 'Reflection'}</p>
                  </PreviewTarget>
                  <ul className="mt-3 space-y-3">
                    {lesson.prompts.map((prompt, index) => (
                      <li key={`${lesson.id}-prompt-${index}`}>
                        <PreviewTarget target={{ itemKey: `${prefix}.prompts.${index}`, itemLabel: `Prompt ${index + 1}` }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
                          <span>{prompt}</span>
                        </PreviewTarget>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <div className="mt-5 min-h-40 w-full rounded-[18px] border border-[rgba(228,183,103,0.18)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[rgba(244,234,220,0.46)]">Type your reflection here...</div>
            <div className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#efc578,#dca453)] px-5 font-bold text-[#2d1b10]">Save reflection</div>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-[rgba(228,183,103,0.18)] bg-[rgba(18,18,16,0.74)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
          <PreviewTarget target={{ itemKey: `${prefix}.rhythmHeading`, itemLabel: 'Lesson rhythm heading' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
            <p className="text-xs uppercase tracking-[0.16em] text-[#efc578]">{lesson.rhythmHeading || 'Lesson rhythm'}</p>
          </PreviewTarget>
          <PreviewTarget target={{ itemKey: `${prefix}.integrationBody`, itemLabel: 'Lesson rhythm body' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-3">
            <p className="text-[rgba(244,234,220,0.74)]">{lesson.integrationBody}</p>
          </PreviewTarget>
          <PreviewTarget target={{ itemKey: `${prefix}.adminUnlockedNote`, itemLabel: 'Lesson admin unlocked note' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} className="mt-3">
            <p className="text-sm text-[#efc578]">{lesson.adminUnlockedNote || 'Admin unlocked view active on lesson pages.'}</p>
          </PreviewTarget>
          <div className={isMobile ? 'mt-6 grid gap-3 text-sm' : 'mt-6 flex flex-wrap gap-3 text-sm'}>
            <PreviewTarget target={{ itemKey: `${prefix}.previousLessonLabel`, itemLabel: 'Previous lesson label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
              <div className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-4 text-[#f4eadc]">{lesson.previousLessonLabel || 'Previous lesson'}</div>
            </PreviewTarget>
            <PreviewTarget target={{ itemKey: `${prefix}.backToPortalLabel`, itemLabel: 'Back to portal label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
              <div className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-4 text-[#f4eadc]">{lesson.backToPortalLabel || 'Back to portal'}</div>
            </PreviewTarget>
            <PreviewTarget target={{ itemKey: `${prefix}.nextLessonLabel`, itemLabel: 'Next lesson label' }} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem}>
              <div className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(228,183,103,0.18)] px-4 text-[#f4eadc]">{lesson.nextLessonLabel || 'Next lesson'}</div>
            </PreviewTarget>
          </div>
        </section>
      </div>
    </main>
  )
}

export function SiteEditorPreview({ selected, content, courseTracks, interactionMode = 'preview', selectedItemKey = null, onSelectItem, adminEmail, viewport = 'desktop' }: { selected: SelectedSection; content: SiteContent; courseTracks: CourseTrack[]; interactionMode?: SiteEditorInteractionMode; selectedItemKey?: string | null; onSelectItem?: (selection: SiteEditorPreviewSelectionWithRect) => void; adminEmail?: string; viewport?: 'desktop' | 'mobile' }) {
  void viewport
  if (selected === 'landing') return <LandingPreview content={content} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} adminEmail={adminEmail} />
  if (selected === 'portal') return <PortalPreview content={content} courseTracks={courseTracks} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} adminEmail={adminEmail} />
  if (selected === 'locked') return <StatusPreview content={content} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} section="locked" adminEmail={adminEmail} />
  if (selected === 'complete') return <StatusPreview content={content} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} section="complete" adminEmail={adminEmail} />
  const slug = selected.replace('lesson:', '')
  const lesson = content.lessons.find((entry) => entry.slug === slug) || content.lessons[0]
  return <LessonPreview lesson={lesson} interactionMode={interactionMode} selectedItemKey={selectedItemKey} onSelectItem={onSelectItem} viewport={viewport} />
}
