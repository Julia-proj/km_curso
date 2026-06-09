"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only show loader if page takes longer than 100ms to load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF7F4] animate-in fade-in duration-200"
    >
      <div className="flex flex-col items-center gap-10">
        <h1
          className="font-hero-face text-4xl font-medium tracking-tight text-[#1A1A1A] sm:text-5xl animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          HAIRLAB
        </h1>

        <div className="relative h-20 w-20">
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D29B9B] animate-pulse" />
        </div>
      </div>
    </div>
  )
}
