"use client"

import { motion } from "framer-motion"
import Image from "next/image"

import { authorPoints } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

export function AboutSection() {
  return (
    <section id="about" className="bg-white px-5 py-12 sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-2 md:gap-16">
        <motion.div {...fadeUp()} className="order-2 md:order-1">
          <p className="mb-4 font-sans text-sm font-medium text-[#D29B9B] sm:text-sm">Об Елене</p>
          <h2 className="mb-6 font-hero-face text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
            Система, основанная на практике
          </h2>
          <p className="mb-8 font-sans leading-relaxed text-[#666]">
            Уже более 6 лет я и моя команда ежедневно восстанавливаем даже самые повреждённые волосы. Система HairLab построена на:
          </p>

          <ul className="divide-y divide-[#F0EBE5]">
            {authorPoints.map((point, index) => (
              <motion.li
                key={point}
                {...fadeUp(index * 0.04)}
                className="flex items-start gap-3 py-3.5 font-sans text-sm leading-relaxed text-[#444] sm:text-base"
              >
                <span className="shrink-0 font-hero-face text-2xl leading-none text-[#D29B9B]/70 select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="order-1 md:order-2">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-[1.08fr_0.92fr] md:gap-5">
            <div className="relative overflow-hidden rounded-lg border border-[#E6DED7] bg-[#F8F5F1] shadow-sm md:shadow-md">
              <div className="hidden md:block absolute inset-0 translate-x-3 translate-y-3 bg-[#E8E1DA] -z-10" />
              <div className="relative aspect-[3/4] sm:aspect-[2/3] md:h-[20rem] md:aspect-auto">
                <Image
                  alt="Елена HairLab"
                  className="object-contain object-center p-1.5 md:p-2"
                  fill
                  loading="lazy"
                  quality={92}
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 280px, 45vw"
                  src="/images/foto3.png"
                />
              </div>
            </div>

            <div className="relative mt-3 overflow-hidden rounded-lg border border-[#E6DED7] bg-[#F8F5F1] shadow-sm md:mt-10 md:h-[18rem]">
              <div className="relative aspect-[3/4] sm:aspect-[2/3] md:h-full md:aspect-auto">
                <Image
                  alt="Студия HairLab"
                  className="object-contain object-center p-1.5 md:p-2"
                  fill
                  loading="lazy"
                  quality={92}
                  sizes="(min-width: 1024px) 290px, (min-width: 768px) 250px, 45vw"
                  src="/images/salon1.JPG"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
