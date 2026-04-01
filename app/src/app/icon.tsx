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
          background: 'radial-gradient(circle at 30% 22%, rgba(57,92,72,0.98), rgba(17,15,13,1) 70%)',
          borderRadius: 56,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 10,
            borderRadius: 46,
            border: '1px solid rgba(239,197,120,0.34)',
            boxShadow: 'inset 0 0 36px rgba(239,197,120,0.10), 0 0 0 2px rgba(0,0,0,0.16)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 156,
            height: 156,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(239,197,120,0.16), rgba(239,197,120,0.03) 55%, transparent 74%)',
            filter: 'blur(10px)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 182,
            height: 182,
            borderRadius: 40,
            background: 'linear-gradient(180deg, rgba(26,34,29,0.82), rgba(10,10,9,0.12))',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <img src={imageSrc} alt="Masculine Heart symbol" width="144" height="144" style={{ objectFit: 'contain' }} />
        </div>
      </div>
    ),
    size,
  )
}
