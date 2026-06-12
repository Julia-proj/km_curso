/**
 * Canonical site origin used for OAuth redirects and Stripe success/cancel URLs.
 *
 * The codebase historically used two different env vars for the same thing
 * (NEXT_PUBLIC_SITE_URL for auth, NEXT_PUBLIC_URL for checkout). This resolves
 * either one so a single value in Vercel keeps both flows working. Falls back to
 * localhost in dev. Trailing slash stripped so callers can append paths safely.
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_URL ||
    'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}
