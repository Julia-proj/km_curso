import type { Metadata, Viewport } from 'next'
import { Inter, Manrope, Fraunces, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import dynamic from 'next/dynamic'

// Lazy load CookieConsent (conditionally rendered, uses framer-motion)
const CookieConsent = dynamic(() => import('@/components/CookieConsent').then(mod => ({ default: mod.CookieConsent })))

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

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK'],
  variable: '--font-fraunces',
  display: 'swap',
  // Only used on /result and /scan — don't preload it on every page (the
  // browser downloads a font lazily, when text actually uses it).
  preload: false,
  fallback: ['Georgia', 'serif'],
})

const playfair = Playfair_Display({
  subsets: ['cyrillic', 'latin'],
  style: ['normal', 'italic'],
  // Only 400 (headlines) and 500 italic (hero accent) are actually used.
  weight: ['400', '500'],
  variable: '--font-serif-face',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
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
  verification: {
    google: 'jbfVj-TLyYt-JO2GPF7ChsL9J3JXIYbOr-QSbnK055c',
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
    <html lang="ru" className={`${inter.variable} ${manrope.variable} ${fraunces.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://vitals.vercel-analytics.com" />
      </head>
      <body>
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  )
}
