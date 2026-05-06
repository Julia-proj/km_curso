'use client'

import { useState } from 'react'
import { faqItems } from '@/config/landing-content'

export function OfferFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      {faqItems.map((faq, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[var(--color-bg-warm)] transition-colors"
          >
            <span className="text-sm font-medium text-[var(--color-text)] leading-snug">
              {faq.question}
            </span>
            <span className="shrink-0 text-[var(--color-text-muted)] text-xl leading-none">
              {openIndex === i ? '−' : '+'}
            </span>
          </button>
          {openIndex === i && (
            <div className="px-6 pb-5">
              <p className="text-sm text-[var(--color-text-soft)] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
