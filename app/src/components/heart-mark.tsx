import Image from 'next/image'

type HeartMarkProps = {
  className?: string
  framed?: boolean
  corner?: boolean
  priority?: boolean
}

export function HeartMark({ className = 'h-40 w-40', framed = false, corner = false, priority = false }: HeartMarkProps) {
  const image = (
    <Image
      src="/branding/mh-heart-arrow-white.png"
      alt="Masculine Heart symbol"
      width={720}
      height={720}
      priority={priority}
      className={className}
    />
  )

  if (!framed) return image

  return (
    <div
      className={`inline-flex items-center justify-center rounded-[24px] border border-[rgba(239,197,120,0.12)] bg-[linear-gradient(180deg,rgba(22,29,23,0.78),rgba(14,12,10,0.58))] p-3 shadow-[0_14px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm ${corner ? '' : 'md:p-5'}`}
    >
      {image}
    </div>
  )
}

export function HeartCornerMark({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute right-4 top-4 opacity-90 md:right-6 md:top-6 ${className}`}>
      <HeartMark className="h-14 w-14 md:h-16 md:w-16" framed corner />
    </div>
  )
}
