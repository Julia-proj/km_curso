import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BackButton } from '@/components/BackButton'
import { WhatYouGetSection } from '@/components/landing/sections/WhatYouGetSection'

export const metadata: Metadata = {
  title: 'Выбери формат - HAIRLAB',
  description: 'Два формата восстановления волос: Full Course (39€) и HAIRLAB Guide (13€).',
}

export default function OfferPage() {
  return (
    <>
      <Header />
      <main className="bg-[#F8F5F1] pt-20 pb-10 md:pt-24">
        <div className="max-w-5xl mx-auto">
          <div className="px-5">
            <BackButton />
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
