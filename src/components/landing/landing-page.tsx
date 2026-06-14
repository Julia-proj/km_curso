import dynamic from "next/dynamic"
import { LandingHeroSection } from "@/components/landing/sections/LandingHeroSection"
import { NavSection } from "@/components/landing/sections/NavSection"
import { MarqueeSection } from "@/components/landing/sections/MarqueeSection"

// Lazy load WelcomePopup (appears after 1.5s delay)
const WelcomePopup = dynamic(() => import("@/components/WelcomePopup").then(mod => ({ default: mod.WelcomePopup })))

// Lazy load below-the-fold sections
const AboutSection = dynamic(() => import("@/components/landing/sections/AboutSection").then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="h-screen min-h-[600px] animate-pulse bg-[#F3E7E5]" />
})
const FAQSection = dynamic(() => import("@/components/landing/sections/FAQSection").then(mod => ({ default: mod.FAQSection })), {
  loading: () => <div className="h-[500px] animate-pulse bg-[#F3E7E5]" />
})
const FinalCTASection = dynamic(() => import("@/components/landing/sections/FinalCTASection").then(mod => ({ default: mod.FinalCTASection })), {
  loading: () => <div className="h-[400px] animate-pulse bg-[#F3E7E5]" />
})
const FooterSection = dynamic(() => import("@/components/landing/sections/FooterSection").then(mod => ({ default: mod.FooterSection })), {
  loading: () => <div className="h-[300px] animate-pulse bg-[#F3E7E5]" />
})
const ForYouSection = dynamic(() => import("@/components/landing/sections/ForYouSection").then(mod => ({ default: mod.ForYouSection })), {
  loading: () => <div className="h-[600px] animate-pulse bg-[#F3E7E5]" />
})
const FormatSection = dynamic(() => import("@/components/landing/sections/FormatSection").then(mod => ({ default: mod.FormatSection })), {
  loading: () => <div className="h-[500px] animate-pulse bg-[#F3E7E5]" />
})
const PainSection = dynamic(() => import("@/components/landing/sections/PainSection").then(mod => ({ default: mod.PainSection })), {
  loading: () => <div className="h-[400px] animate-pulse bg-[#F3E7E5]" />
})
const PrinciplesSection = dynamic(() => import("@/components/landing/sections/PrinciplesSection").then(mod => ({ default: mod.PrinciplesSection })), {
  loading: () => <div className="h-[500px] animate-pulse bg-[#F3E7E5]" />
})
const ProblemsSection = dynamic(() => import("@/components/landing/sections/ProblemsSection").then(mod => ({ default: mod.ProblemsSection })), {
  loading: () => <div className="h-[600px] animate-pulse bg-[#F3E7E5]" />
})
const ResultsSection = dynamic(() => import("@/components/landing/sections/ResultsSection").then(mod => ({ default: mod.ResultsSection })), {
  loading: () => <div className="h-[700px] animate-pulse bg-[#F3E7E5]" />
})
const WhatYouGetSection = dynamic(() => import("@/components/landing/sections/WhatYouGetSection").then(mod => ({ default: mod.WhatYouGetSection })), {
  loading: () => <div className="h-[800px] animate-pulse bg-[#F3E7E5]" />
})

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
