import { Header } from "@/components/header"
import { HeroSection } from "@/components/sections/hero"
import { PainCardsSection } from "@/components/sections/pain-cards"
import { WhyAdviceSection } from "@/components/sections/why-advice"
import { ProductsDontSaveSection } from "@/components/sections/products-dont-save"
import { SystemComparisonSection } from "@/components/sections/system-comparison"
import { OfferSection } from "@/components/sections/offer"
import { ComparisonTableSection } from "@/components/sections/comparison-table"
import { FAQSection } from "@/components/sections/faq"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PainCardsSection />
        <WhyAdviceSection />
        <ProductsDontSaveSection />
        <SystemComparisonSection />
        <OfferSection />
        <ComparisonTableSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
