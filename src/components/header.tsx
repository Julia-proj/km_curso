"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getCurrentUser } from "@/lib/auth-user"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  // undefined = auth state not resolved yet (avoid flashing the wrong control),
  // null = signed out, string = signed-in display name.
  const [userName, setUserName] = useState<string | null | undefined>(undefined)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push("/")
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    getCurrentUser().then((user) => setUserName(user?.name ?? null))
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-[72px] transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-full flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-lg font-bold tracking-tight text-text hover:text-text-muted transition-colors"
        >
          HAIRLAB
        </button>
        <div className="flex items-center gap-4 md:gap-5">
          {userName === undefined ? null : userName ? (
            <>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="hidden sm:inline">{userName}</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-text-muted hover:text-text transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
