import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = {
  width: 256,
  height: 256,
}

export const contentType = 'image/png'

export default async function Icon() {
  const imagePath = join(process.cwd(), 'public/branding/mh-heart-arrow-white.png')
  const imageBuffer = await readFile(imagePath)
  const imageBase64 = imageBuffer.toString('base64')
  const imageSrc = `data:image/png;base64,${imageBase64}`

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
        <img src={imageSrc} alt="Masculine Heart symbol" width="172" height="172" style={{ objectFit: 'contain' }} />
      </div>
    ),
    size,
  )
}
