import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// iOS home-screen / Safari pinned-tab icon. PNG is required (apple-icon does
// not accept SVG), so we render the HL monogram with next/og.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const ptSerifBold = await readFile(
    join(process.cwd(), 'assets/fonts/PTSerif-Bold.ttf')
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#9C544E',
          color: '#FBF8F2',
          fontFamily: 'PT Serif',
          fontSize: 96,
          letterSpacing: '-2px',
        }}
      >
        HL
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'PT Serif', data: ptSerifBold, style: 'normal', weight: 700 }],
    }
  )
}
