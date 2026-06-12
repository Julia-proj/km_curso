import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  // Refresh Supabase auth cookies and guard /dashboard (redirects to
  // /auth/login when there is no session). Returns a pass-through response with
  // refreshed cookies, or a redirect. In dev-bypass it's a plain pass-through.
  const response = await updateSession(request)

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
