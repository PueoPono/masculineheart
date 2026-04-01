import { ImageResponse } from 'next/og'

export const size = {
  width: 256,
  height: 256,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 30% 25%, rgba(42,74,58,0.95), rgba(14,11,10,1) 68%)',
          borderRadius: 56,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 14,
            borderRadius: 44,
            border: '2px solid rgba(239,197,120,0.28)',
            boxShadow: 'inset 0 0 30px rgba(239,197,120,0.12)',
          }}
        />
        <svg width="180" height="180" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="36" y1="28" x2="188" y2="192" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f4d08f" />
              <stop offset="0.5" stopColor="#d8a458" />
              <stop offset="1" stopColor="#7f6137" />
            </linearGradient>
          </defs>
          <ellipse cx="110" cy="112" rx="84" ry="86" fill="rgba(239, 197, 120, 0.08)" />
          <path d="M110 183c-7-6-14-11-23-18-29-22-47-42-47-71 0-21 15-38 35-38 14 0 27 8 35 20 8-12 21-20 35-20 20 0 35 17 35 38 0 29-18 49-47 71-9 7-16 12-23 18Z" stroke="url(#g)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M62 146c22-7 40-23 49-45 4-11 6-23 6-36" stroke="rgba(244,234,220,0.92)" strokeWidth="4" strokeLinecap="round"/>
          <path d="M155 54 74 155" stroke="rgba(244,234,220,0.92)" strokeWidth="5" strokeLinecap="round"/>
          <path d="m68 149 10 15-19-2 9-13Z" fill="url(#g)"/>
          <path d="m160 59-6-20 20 7-14 13Z" fill="url(#g)"/>
          <path d="M107 73c0-15-8-28-24-28-14 0-24 12-24 27 0 10 3 19 10 28" stroke="rgba(244,234,220,0.92)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M113 73c0-15 8-28 24-28 14 0 24 12 24 27 0 10-3 19-10 28" stroke="rgba(244,234,220,0.92)" strokeWidth="3.5" strokeLinecap="round"/>
        </svg>
      </div>
    ),
    size,
  )
}
