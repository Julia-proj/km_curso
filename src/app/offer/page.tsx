"use client"

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PrePaymentNav } from '@/components/Navigation'
import { WhatYouGetSection } from '@/components/landing/sections/WhatYouGetSection'

export default function OfferPage() {
  return (
    <>
      <Header />
      <main className="bg-[#F8F5F1] pt-20 pb-10 md:pt-24">
        <div className="max-w-5xl mx-auto">
          <div className="px-5">
            <PrePaymentNav showBack={true} />
          </div>
          <WhatYouGetSection
            sectionId={undefined}
            showResultBlock
            title="Выбери формат обучения"
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
