"use client"

import { motion } from "framer-motion"
import Image from "next/image"

import { authorPoints } from "@/config/landing-content"
import { CTA } from "@/components/shared/CTA"
import { fadeUp } from "@/lib/animations"

export function AboutSection() {
  return (
    <section id="about" className="km-section bg-sand/50">
      <div className="km-container km-container-wide grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <motion.div
          {...fadeUp()}
          className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-28"
        >
          <div className="flex items-start gap-3 lg:hidden">
            <div className="flex gap-2 shrink-0">
              <div className="relative w-[108px] h-[135px] rounded-xl overflow-hidden">
                <Image alt="Студия Елены" src="/images/salon1.JPG" fill className="object-cover" sizes="108px" />
              </div>
              <div className="relative w-[108px] h-[135px] rounded-xl overflow-hidden">
                <Image alt="Елена Александрова" src="/images/foto2.png" fill className="object-cover object-center" sizes="108px" />
              </div>
            </div>
            <div className="pt-1">
              <div className="km-eyebrow text-muted-foreground">Автор курса</div>
              <div className="mt-1 font-display text-xl leading-tight">Елена Александрова</div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden">
              <Image alt="Студия Елены" src="/images/salon1.JPG" fill className="object-cover" sizes="(min-width: 1280px) 260px, 25vw" />
            </div>
            <div className="relative ml-auto mt-2 w-[86%] aspect-[4/5] rounded-xl overflow-hidden">
              <Image alt="Елена Александрова" src="/images/foto2.png" fill className="object-cover object-center" sizes="(min-width: 1280px) 260px, 25vw" />
            </div>
            <div className="mt-4">
              <div className="km-eyebrow text-muted-foreground">Автор курса</div>
              <div className="mt-1 font-display text-2xl">Елена Александрова</div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-8 xl:col-span-8">
          <motion.h2 {...fadeUp()} className="km-section-title-sm">
            Уже более <span className="italic">6 лет</span> я и моя команда
            ежедневно восстанавливаем даже самые повреждённые волосы.
          </motion.h2>
          <motion.p {...fadeUp()} className="km-lead mt-6 md:mt-8">
            Моя система восстановления и домашнего ухода работает благодаря:
          </motion.p>
          <ul className="mt-8 divide-y divide-border md:mt-10">
            {authorPoints.map((point, index) => (
              <motion.li
                key={point}
                {...fadeUp(index * 0.05)}
                className="flex items-start gap-4 py-4 md:gap-5 md:py-5"
              >
                <span className="mt-1 font-display text-sm text-accent-foreground/70">0{index + 1}</span>
                <span className="km-copy">{point}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-8 md:mt-12">
            <CTA href="/quiz">Пройти тест</CTA>
          </div>
        </div>
      </div>
    </section>
  )
}
