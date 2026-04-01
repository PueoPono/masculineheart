type HeartMarkProps = {
  className?: string
  accentClassName?: string
  muted?: boolean
}

export function HeartMark({ className = 'h-40 w-40', accentClassName = 'text-[#efc578]', muted = false }: HeartMarkProps) {
  const stroke = muted ? 'rgba(236, 225, 208, 0.78)' : 'currentColor'
  const fill = muted ? 'rgba(239, 197, 120, 0.12)' : 'rgba(239, 197, 120, 0.08)'

  return (
    <svg
      viewBox="0 0 220 220"
      aria-hidden="true"
      className={`${className} ${accentClassName}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="heartGlow" x1="36" y1="28" x2="188" y2="192" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4d08f" />
          <stop offset="0.5" stopColor="#d8a458" />
          <stop offset="1" stopColor="#7f6137" />
        </linearGradient>
        <filter id="softGlow" x="0" y="0" width="220" height="220" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="110" cy="112" rx="84" ry="86" fill={fill} />

      <path
        d="M110 183c-7-6-14-11-23-18-29-22-47-42-47-71 0-21 15-38 35-38 14 0 27 8 35 20 8-12 21-20 35-20 20 0 35 17 35 38 0 29-18 49-47 71-9 7-16 12-23 18Z"
        stroke="url(#heartGlow)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#softGlow)"
      />

      <path
        d="M62 146c22-7 40-23 49-45 4-11 6-23 6-36"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M155 54 74 155"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="m68 149 10 15-19-2 9-13Z" fill="url(#heartGlow)" />
      <path d="m160 59-6-20 20 7-14 13Z" fill="url(#heartGlow)" />
      <path
        d="M107 73c0-15-8-28-24-28-14 0-24 12-24 27 0 10 3 19 10 28"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M113 73c0-15 8-28 24-28 14 0 24 12 24 27 0 10-3 19-10 28"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function HeartCornerMark({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute right-4 top-4 opacity-90 md:right-6 md:top-6 ${className}`}>
      <div className="rounded-[22px] border border-[rgba(239,197,120,0.12)] bg-[linear-gradient(180deg,rgba(22,29,23,0.78),rgba(14,12,10,0.58))] p-2.5 shadow-[0_14px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm">
        <HeartMark className="h-14 w-14 md:h-16 md:w-16" />
      </div>
    </div>
  )
}
