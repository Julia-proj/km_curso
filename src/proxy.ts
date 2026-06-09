import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  // Cache static assets aggressively
  const url = request.nextUrl
  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico|css|js|woff|woff2|ttf)$/i)
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
