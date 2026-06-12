/**
 * Admin allowlist: emails that get full access (course + methodichka) without
 * paying. Used to grant yourself / your team access in production.
 *
 * Set the env var in Vercel (server-side, NOT public):
 *   ADMIN_EMAILS=you@gmail.com,teammate@gmail.com
 *
 * When an allowlisted user signs in with Google, the auth callback marks their
 * profile as paid, so every normal access check then sees them as a buyer.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.trim().toLowerCase())
}
