"use client"

import { landingStats } from "@/config/landing-content"

export function MarqueeSection() {
  const stats = landingStats.map((s) => `${s.value} ${s.label}`)
  return (
    <div className="overflow-hidden border-y border-border bg-sand/40 py-5 md:py-6">
      <div className="marquee km-marquee-text flex gap-10 whitespace-nowrap text-primary/80 md:gap-16">
        {[...stats, ...stats, ...stats, ...stats, ...stats].map((text, index) => (
          <span key={`${text}-${index}`} className="flex items-center gap-10 md:gap-16">
            <span className="italic">{text}</span>
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
