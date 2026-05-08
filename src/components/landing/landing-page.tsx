import { WelcomePopup } from "@/components/WelcomePopup"
import { AboutSection } from "@/components/landing/sections/AboutSection"
import { FAQSection } from "@/components/landing/sections/FAQSection"
import { FinalCTASection } from "@/components/landing/sections/FinalCTASection"
import { FooterSection } from "@/components/landing/sections/FooterSection"
import { ForYouSection } from "@/components/landing/sections/ForYouSection"
import { FormatSection } from "@/components/landing/sections/FormatSection"
import { LandingHeroSection } from "@/components/landing/sections/LandingHeroSection"
import { MarqueeSection } from "@/components/landing/sections/MarqueeSection"
import { NavSection } from "@/components/landing/sections/NavSection"
import { PainSection } from "@/components/landing/sections/PainSection"
import { PrinciplesSection } from "@/components/landing/sections/PrinciplesSection"
import { ProblemsSection } from "@/components/landing/sections/ProblemsSection"
import { ResultsSection } from "@/components/landing/sections/ResultsSection"
import { WhatYouGetSection } from "@/components/landing/sections/WhatYouGetSection"

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
      <WhatYouGetSection />
      <ResultsSection />
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
    </main>
  )
}
