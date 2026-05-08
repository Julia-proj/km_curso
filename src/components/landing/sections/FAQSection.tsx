"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

import { MinusIcon, PlusIcon } from "@/components/landing/icons"
import { faqItems } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-[#FAF7F4] px-6 py-20 md:py-24">
      <div className="mx-auto max-w-2xl">
        <motion.div {...fadeUp()} className="mb-10 text-center md:mb-12">
          <p className="mb-4 font-sans text-sm font-medium text-[#D29B9B]">Вопросы</p>
          <h2 className="font-display text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
            Часто спрашивают
          </h2>
        </motion.div>

        <motion.div {...fadeUp(0.08)} className="space-y-2">
          {faqItems.map((item, index) => (
            <div key={item.question} className="rounded-lg border border-[#E6DED7] bg-white px-5 shadow-sm">
              <button
                className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                onClick={() => setOpen(open === index ? null : index)}
                type="button"
              >
                <span className="font-sans text-sm font-medium text-[#1A1A1A] transition-colors group-hover:text-[#A66F6F]">
                  {item.question}
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F5F0EB] text-[#1A1A1A]">
                  {open === index ? <MinusIcon size={15} /> : <PlusIcon size={15} />}
                </span>
              </button>

              <AnimatePresence>
                {open === index && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="pb-5 pr-10 font-sans text-sm leading-relaxed text-[#666]">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
