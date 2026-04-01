import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = {
  width: 256,
  height: 256,
}

export const contentType = 'image/png'

export default async function Icon() {
  const imagePath = join(process.cwd(), 'public/branding/mh-heart-arrow-gold.png')
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
          background: 'transparent',
        }}
      >
        <img src={imageSrc} alt="Masculine Heart symbol" width="228" height="228" style={{ objectFit: 'contain' }} />
      </div>
    ),
    size,
  )
}
