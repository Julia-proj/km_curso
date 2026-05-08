import { landingStats } from "@/config/landing-content"

export function MarqueeSection() {
  const stats = landingStats.map((s) => `${s.value} ${s.label}`)

  return (
    <section className="max-h-[60px] overflow-hidden bg-[#1A1A1A] py-4 md:max-h-none md:py-5">
      <div className="marquee flex gap-12 whitespace-nowrap font-sans text-sm font-medium text-white/60 md:gap-16">
        {[...stats, ...stats, ...stats, ...stats, ...stats].map((text, index) => (
          <span key={`${text}-${index}`} className="flex shrink-0 items-center gap-12 md:gap-16">
            <span>{text}</span>
            <span className="text-[#D29B9B]">·</span>
          </span>
        ))}
      </div>
    </section>
  )
}
