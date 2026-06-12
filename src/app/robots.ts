import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

// Served at /robots.txt. Keeps crawlers out of the private/funnel-internal
// areas and points them at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/auth/', '/checkout/', '/api/', '/result', '/scan/'],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}
