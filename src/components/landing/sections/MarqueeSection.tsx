import { landingStats } from "@/config/landing-content"

export function MarqueeSection() {
  const stats = landingStats.map((s) => `${s.value} ${s.label}`)

  return (
    <section className="overflow-hidden bg-[#1A1A1A] py-6">
      <div className="marquee flex gap-8 whitespace-nowrap font-sans text-base font-medium text-white/60 md:gap-12 md:text-base">
        {[...stats, ...stats, ...stats, ...stats, ...stats].map((text, index) => (
          <span key={`${text}-${index}`} className="flex shrink-0 items-center gap-8 md:gap-12">
            <span>{text}</span>
            <span className="text-[#D29B9B]">·</span>
          </span>
        ))}
      </div>
    </section>
  )
}
