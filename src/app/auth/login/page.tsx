import LoginClient from "./LoginClient"

// Segment config must live in a Server Component (exporting it from a
// "use client" file breaks the Next 16 build). force-dynamic keeps the page
// uncached so the login button always renders fresh.
export const dynamic = "force-dynamic"

export default function LoginPage() {
  return <LoginClient />
}
