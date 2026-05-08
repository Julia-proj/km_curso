import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display-face',
  display: 'swap',
})

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body-face',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Елена Александрова. Салонное восстановление волос дома',
  description:
    'Авторский курс по восстановлению волос в домашних условиях. Подбор составов, протоколы и гайды от практика с 6+ лет опыта.',
  openGraph: {
    title: 'Елена Александрова. Салонное восстановление волос дома',
    description:
      'Авторский курс по восстановлению волос в домашних условиях. Подбор составов, протоколы и гайды от практика с 6+ лет опыта.',
    type: 'website',
    images: ['/images/hero-clean.jpg'],
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
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
