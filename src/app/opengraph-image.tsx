import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Branded link-preview card shown when hairlab.es is shared in chats and posts.
// 1200x630 is the Open Graph standard. Rendered with PT Serif so the Cyrillic
// copy displays correctly (the default next/og font has no Cyrillic glyphs).
export const alt = 'HAIRLAB · салонное восстановление волос дома, бесплатный тест и AI-диагностика по фото'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/PTSerif-Regular.ttf')),
    readFile(join(process.cwd(), 'assets/fonts/PTSerif-Bold.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FBF8F2',
          fontFamily: 'PT Serif',
          position: 'relative',
        }}
      >
        {/* thin inset frame, editorial look */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: '2px solid #E3D8C6',
            borderRadius: 16,
          }}
        />

        {/* top label */}
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: '8px',
            color: '#9C544E',
            textTransform: 'uppercase',
            marginBottom: 28,
          }}
        >
          Студия ухода за волосами
        </div>

        {/* wordmark */}
        <div
          style={{
            display: 'flex',
            fontSize: 150,
            fontWeight: 700,
            letterSpacing: '4px',
            color: '#1C1A17',
            lineHeight: 1,
          }}
        >
          HAIRLAB
        </div>

        {/* divider */}
        <div
          style={{
            display: 'flex',
            width: 120,
            height: 3,
            background: '#A98A5B',
            margin: '34px 0',
          }}
        />

        {/* tagline: promise on top, free-test hook below in the accent tone */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 46,
              color: '#1C1A17',
            }}
          >
            Салонное восстановление волос дома
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#9C544E',
              marginTop: 20,
            }}
          >
            Бесплатный тест и AI-диагностика по фото
          </div>
        </div>

        {/* footer url */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 64,
            fontSize: 26,
            letterSpacing: '4px',
            color: '#9C544E',
          }}
        >
          hairlab.es · Мадрид
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'PT Serif', data: regular, style: 'normal', weight: 400 },
        { name: 'PT Serif', data: bold, style: 'normal', weight: 700 },
      ],
    }
  )
}
