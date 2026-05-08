"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const heroImage = "/images/hero.PNG"

const beforeAfterCards = [
  {
    alt: "До и после восстановления светлых волос",
    objectPosition: "50% 50%",
    src: "/images/beforeafter11.png",
  },
  {
    alt: "До и после восстановления темных волос",
    objectPosition: "50% 50%",
    src: "/images/beforeandafter33.png",
  },
] as const

function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function MobileBeforeAfterStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="relative flex justify-center gap-3 px-5"
    >
      {beforeAfterCards.map((card) => (
        <div
          key={card.src}
          className="relative h-[170px] w-32 overflow-hidden border border-white/25 shadow-lg"
        >
          <Image
            alt={card.alt}
            className="object-cover object-top"
            fill
            quality={95}
            sizes="128px"
            src={card.src}
            style={{ objectPosition: card.objectPosition }}
          />
        </div>
      ))}

    </motion.div>
  )
}

function DesktopBeforeAfterGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.55 }}
      className="grid grid-cols-2 gap-4 pb-16 pt-12"
    >
      {beforeAfterCards.map((card) => (
        <div key={card.src} className="group relative h-[340px] overflow-hidden">
          <Image
            alt={card.alt}
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            fill
            quality={95}
            sizes="(min-width: 1024px) 536px, 100vw"
            src={card.src}
            style={{ objectPosition: card.objectPosition }}
          />
        </div>
      ))}
    </motion.div>
  )
}

export function LandingHeroSection() {
  return (
    <section id="hero-section" className="relative flex flex-col overflow-hidden bg-[#FAF7F4]">
      <div className="relative flex min-h-[100svh] flex-col lg:hidden">
        <div className="absolute inset-0">
          <Image
            alt="Елена - основатель HairLab"
            className="object-cover"
            fill
            preload
            quality={92}
            sizes="100vw"
            src={heroImage}
            style={{ objectPosition: "center 60%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-between pb-8 pt-20">
          <MobileBeforeAfterStrip />

          <div className="px-5">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.55 }}
              >
                <span className="inline-block border border-white/55 bg-[#D29B9B]/55 px-3 py-1 font-sans text-[10px] font-medium text-white shadow-sm backdrop-blur-sm">
                  Авторский курс · 2026
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.55 }}
                className="max-w-[21.5rem] font-display text-[2.35rem] leading-[1.1] text-white"
              >
                Салонное восстановление волос дома
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55 }}
                className="font-sans text-sm leading-relaxed text-white/65"
              >
                + составы для волос.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.27, duration: 0.55 }}
                className="flex flex-col gap-2.5 pt-1"
              >
                <a
                  href="#what-you-get"
                  className="inline-flex w-full items-center justify-center gap-2.5 bg-white px-6 py-3.5 font-sans text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-white/90"
                >
                  Хочу на обучение
                  <ArrowRightIcon size={15} />
                </a>
                <a
                  href="/quiz"
                  className="inline-flex w-full items-center justify-center gap-2 border border-white/30 px-6 py-3.5 font-sans text-sm text-white transition-colors hover:border-white/60"
                >
                  ПРОЙТИ ТЕСТ
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden flex-col lg:flex">
        <div className="mx-auto w-full max-w-6xl px-6 pt-10">
          <div className="flex items-start justify-between gap-8 pt-8">
            <div className="max-w-lg flex-1 pt-16">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                >
                  <span className="inline-block border border-white/70 bg-[#D29B9B]/70 px-3 py-1.5 font-sans text-[10px] font-medium text-white shadow-sm backdrop-blur-sm">
                    Авторский курс · 2026
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.55 }}
                  className="font-display text-5xl leading-[1.1] tracking-tight text-[#1A1A1A] lg:text-6xl"
                >
                  Салонное восстановление волос дома
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.55 }}
                  className="font-sans text-lg leading-relaxed text-[#666]"
                >
                  + составы для волос.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.23, duration: 0.55 }}
                  className="flex gap-3 pt-2"
                >
                  <a
                    href="#what-you-get"
                    className="inline-flex items-center gap-3 bg-[#1A1A1A] px-8 py-4 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#333]"
                  >
                    Хочу на обучение
                    <ArrowRightIcon />
                  </a>
                  <a
                    href="/quiz"
                    className="inline-flex items-center gap-2 border border-[#E0DCD6] px-8 py-4 font-sans text-sm font-semibold text-[#1A1A1A] transition-colors hover:border-[#1A1A1A]"
                  >
                    ПРОЙТИ ТЕСТ
                  </a>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.55 }}
              className="relative w-72 flex-shrink-0 xl:w-80"
            >
              <div className="relative">
                <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 bg-[#E8DDD6]" />
                <div className="relative h-[520px] w-full overflow-hidden">
                  <Image
                    alt="Елена - основатель HairLab"
                    className="object-cover object-top"
                    fill
                    preload
                    quality={92}
                    sizes="(min-width: 1280px) 320px, 288px"
                    src={heroImage}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <DesktopBeforeAfterGrid />
        </div>
      </div>
    </section>
  )
}
