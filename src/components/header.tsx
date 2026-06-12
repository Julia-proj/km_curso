"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-[72px] transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-full flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight text-text">
          HAIRLAB
        </span>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-text-muted hover:text-text transition-colors"
        >
          Выйти
        </button>
      </div>
    </header>
  )
}
