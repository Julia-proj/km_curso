import dynamic from "next/dynamic"
import { WelcomePopup } from "@/components/WelcomePopup"
import { LandingHeroSection } from "@/components/landing/sections/LandingHeroSection"
import { NavSection } from "@/components/landing/sections/NavSection"
import { MarqueeSection } from "@/components/landing/sections/MarqueeSection"

// Lazy load below-the-fold sections
const AboutSection = dynamic(() => import("@/components/landing/sections/AboutSection").then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="h-screen" />
})
const FAQSection = dynamic(() => import("@/components/landing/sections/FAQSection").then(mod => ({ default: mod.FAQSection })))
const FinalCTASection = dynamic(() => import("@/components/landing/sections/FinalCTASection").then(mod => ({ default: mod.FinalCTASection })))
const FooterSection = dynamic(() => import("@/components/landing/sections/FooterSection").then(mod => ({ default: mod.FooterSection })))
const ForYouSection = dynamic(() => import("@/components/landing/sections/ForYouSection").then(mod => ({ default: mod.ForYouSection })))
const FormatSection = dynamic(() => import("@/components/landing/sections/FormatSection").then(mod => ({ default: mod.FormatSection })))
const PainSection = dynamic(() => import("@/components/landing/sections/PainSection").then(mod => ({ default: mod.PainSection })))
const PrinciplesSection = dynamic(() => import("@/components/landing/sections/PrinciplesSection").then(mod => ({ default: mod.PrinciplesSection })))
const ProblemsSection = dynamic(() => import("@/components/landing/sections/ProblemsSection").then(mod => ({ default: mod.ProblemsSection })))
const ResultsSection = dynamic(() => import("@/components/landing/sections/ResultsSection").then(mod => ({ default: mod.ResultsSection })))
const WhatYouGetSection = dynamic(() => import("@/components/landing/sections/WhatYouGetSection").then(mod => ({ default: mod.WhatYouGetSection })))

export function LandingPage() {
  return (
    <main className="overflow-x-hidden bg-[#F3E7E5] text-foreground">
      <WelcomePopup />
      <NavSection />
      <LandingHeroSection />
      <MarqueeSection />
      <PainSection />
      <AboutSection />
      <ForYouSection />
      <ProblemsSection />
      <PrinciplesSection />
      <FormatSection />
      <WhatYouGetSection showResultBlock />
      <ResultsSection />
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
    </main>
  )
}
