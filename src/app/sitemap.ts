import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

// Served at /sitemap.xml. Only public marketing pages — everything behind
// auth/payment or requiring quiz state is excluded (see robots.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/quiz`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/offer`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/lesson`, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
