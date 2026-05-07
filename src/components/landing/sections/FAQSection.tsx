"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

import { MinusIcon, PlusIcon } from "@/components/landing/icons"
import { faqItems } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="km-section">
      <div className="km-container km-container-narrow">
        <motion.h2 {...fadeUp()} className="km-section-title mb-10 md:mb-14">
          Часто задаваемые <span className="italic">вопросы</span>
        </motion.h2>
        <div className="divide-y divide-border border-y border-border">
          {faqItems.map((item, index) => (
            <div key={item.question}>
              <button
                className="group flex w-full items-center justify-between gap-4 py-5 text-left md:gap-6 md:py-7"
                onClick={() => setOpen(open === index ? null : index)}
                type="button"
              >
                <span className="km-faq-question transition-colors group-hover:text-accent-foreground">
                  {item.question}
                </span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent md:size-10">
                  {open === index ? <MinusIcon size={16} /> : <PlusIcon size={16} />}
                </span>
              </button>
              <AnimatePresence>
                {open === index && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="km-faq-answer pb-5 pr-0 md:pb-7 md:pr-16">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
