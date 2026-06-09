import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import { LoadingScreen } from '@/components/LoadingScreen'

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '600'],
  variable: '--font-body-face',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
})

const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '600'],
  variable: '--font-hero-face',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Елена Александрова. Салонное восстановление волос дома',
  description:
    'Авторский курс по восстановлению волос в домашних условиях. Подбор составов, протоколы и гайды от практика с 6+ лет опыта.',
  keywords: ['восстановление волос', 'уход за волосами', 'курс по волосам', 'Елена Александрова'],
  authors: [{ name: 'Елена Александрова' }],
  openGraph: {
    title: 'Елена Александрова. Салонное восстановление волос дома',
    description:
      'Авторский курс по восстановлению волос в домашних условиях. Подбор составов, протоколы и гайды от практика с 6+ лет опыта.',
    type: 'website',
    images: ['/images/hero.PNG'],
    locale: 'ru_RU',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F7F2EB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LoadingScreen />
        {children}
      </body>
    </html>
  )
}
