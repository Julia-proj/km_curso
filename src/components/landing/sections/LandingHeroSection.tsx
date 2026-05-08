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
          className="relative h-[170px] w-32 overflow-hidden rounded-2xl border-2 border-white/40 shadow-2xl backdrop-blur-md"
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
      className="grid grid-cols-2 gap-4 pt-8"
    >
      {beforeAfterCards.map((card) => (
        <div key={card.src} className="group relative h-[220px] overflow-hidden rounded-2xl border-2 border-[#E1D9D1] bg-white shadow-xl">
          <Image
            alt={card.alt}
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-between pb-8 pt-16">
          <MobileBeforeAfterStrip />

          <div className="px-5">
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.55 }}
              >
                <span className="inline-block bg-[#D29B9B]/90 px-4 py-1.5 font-sans text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm rounded-full">
                  Авторский курс · 2026
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.55 }}
                className="max-w-[21.5rem] font-display text-[2.5rem] leading-[1.05] text-white font-medium"
              >
                Салонное восстановление волос дома
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55 }}
                className="font-sans text-[15px] leading-relaxed text-white/80 font-medium"
              >
                + составы для волос.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.27, duration: 0.55 }}
                className="flex flex-col gap-3"
              >
                <a
                  href="#what-you-get"
                  className="inline-flex w-full items-center justify-center gap-2.5 bg-[#1A1A1A] px-6 py-4 font-sans text-sm font-semibold text-white transition-all hover:bg-[#333] hover:shadow-xl rounded-xl"
                >
                  Хочу на обучение
                  <ArrowRightIcon size={15} />
                </a>
                <a
                  href="/quiz"
                  className="inline-flex w-full items-center justify-center gap-2 border-2 border-[#E0DCD6] px-6 py-4 font-sans text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded-xl"
                >
                  ПРОЙТИ ТЕСТ
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="flex flex-col justify-end" style={{ minHeight: '85vh' }}>
          <div className="mx-auto w-full max-w-6xl px-6 pb-8">
            <nav className="mb-6 flex items-center justify-center gap-8 border-b border-[#E5DDD5] pb-4 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-[#7A7066]">
              <a href="#about" className="transition-colors hover:text-[#1A1A1A] hover:tracking-[0.18em]">Об авторе</a>
              <a href="#program" className="transition-colors hover:text-[#1A1A1A] hover:tracking-[0.18em]">Программа</a>
              <a href="#what-you-get" className="transition-colors hover:text-[#1A1A1A] hover:tracking-[0.18em]">Что внутри</a>
              <a href="#faq" className="transition-colors hover:text-[#1A1A1A] hover:tracking-[0.18em]">FAQ</a>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
              <div className="max-w-xl">
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                  >
                    <span className="inline-block bg-[#D29B9B]/90 px-4 py-2 font-sans text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm rounded-full">
                      Авторский курс · 2026
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.55 }}
                    className="font-display text-5xl leading-[1.08] tracking-tight text-[#1A1A1A] xl:text-6xl font-medium"
                  >
                    Салонное восстановление волос дома
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16, duration: 0.55 }}
                    className="font-sans text-lg leading-relaxed text-[#666] font-medium"
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
                      className="inline-flex items-center gap-3 bg-[#1A1A1A] px-8 py-4 font-sans text-sm font-semibold text-white transition-all hover:bg-[#333] hover:shadow-xl rounded-xl"
                    >
                      Хочу на обучение
                      <ArrowRightIcon />
                    </a>
                    <a
                      href="/quiz"
                      className="inline-flex items-center gap-2 border-2 border-[#E0DCD6] px-8 py-4 font-sans text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded-xl"
                    >
                      ПРОЙТИ ТЕСТ
                    </a>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.55 }}
                  className="mt-10 flex gap-4"
                >
                  {beforeAfterCards.map((card) => (
                    <div
                      key={card.src}
                      className="relative h-44 w-48 overflow-hidden rounded-2xl border-2 border-[#E1D9D1] shadow-xl"
                    >
                      <Image
                        alt={card.alt}
                        className="object-cover object-center"
                        fill
                        quality={95}
                        sizes="192px"
                        src={card.src}
                        style={{ objectPosition: card.objectPosition }}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>

              <div className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.55 }}
                  className="relative w-full max-w-[28rem]"
                >
                  <div className="relative">
                    <div className="absolute inset-0 -z-10 translate-x-8 translate-y-8 rounded-2xl bg-[#E8DDD6] blur-md" />
                    <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-2xl bg-[#E8DDD6]" />
                    <div className="relative h-[600px] w-full overflow-hidden rounded-2xl border-2 border-[#E1D9D1] bg-white shadow-2xl">
                      <Image
                        alt="Елена - основатель HairLab"
                        className="object-cover object-bottom"
                        fill
                        preload
                        quality={92}
                        sizes="(min-width: 1280px) 448px, 48vw"
                        src={heroImage}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
