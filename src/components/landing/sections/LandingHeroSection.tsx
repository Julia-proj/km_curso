"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const mobileHeroImage = "/images/newhero.PNG"
const desktopHeroImage = "/images/hero.PNG"

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

const mobilePreviewCards = [
  {
    alt: "Результат восстановления светлых волос",
    objectPosition: "50% 50%",
    src: "/images/beforeafter11.png",
  },
  {
    alt: "Результат восстановления темных волос",
    objectPosition: "50% 50%",
    src: "/images/beforeandafter33.png",
  },
  {
    alt: "Проверенные составы для ухода за волосами",
    objectPosition: "50% 50%",
    src: "/images/prodx.JPEG",
  },
] as const

const mobileFeatures = [
  {
    icon: "play",
    label: "Пошаговые\nвидео-уроки",
  },
  {
    icon: "bottle",
    label: "Проверенные\nсоставы",
  },
  {
    icon: "certificate",
    label: "Подробная\nметодичка",
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

function SparkleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2.75 14.45 9.55 21.25 12 14.45 14.45 12 21.25 9.55 14.45 2.75 12 9.55 9.55 12 2.75Z" />
      <path d="M19 3.5 19.85 5.65 22 6.5 19.85 7.35 19 9.5 18.15 7.35 16 6.5 18.15 5.65 19 3.5Z" />
    </svg>
  )
}

function FeatureIcon({ type }: { type: (typeof mobileFeatures)[number]["icon"] }) {
  if (type === "play") {
    return (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="4.25" y="6.25" width="15.5" height="11.5" rx="2.4" stroke="currentColor" strokeWidth="1.45" />
        <path d="M10.35 9.65v4.7l4.15-2.35-4.15-2.35Z" fill="currentColor" />
      </svg>
    )
  }

  if (type === "bottle") {
    return (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M10.2 3.75h3.6v3.1l1.35 1.45v10.45h-6.3V8.3l1.35-1.45v-3.1Z" stroke="currentColor" strokeWidth="1.45" />
        <path d="M10.05 11.15h3.9" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
        <path d="M10.05 14h3.9" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" opacity="0.65" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="4.5" width="14" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.45" />
      <path d="M8.2 8.3h7.6M8.2 11.1h5.6" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <circle cx="16" cy="15.4" r="2.55" stroke="currentColor" strokeWidth="1.35" />
      <path d="m14.9 15.35.75.75 1.45-1.55" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MobilePreviewStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.55 }}
      className="relative flex justify-start gap-3"
    >
      {mobilePreviewCards.map((card) => (
        <div
          key={card.src}
          className="relative h-14 w-12 overflow-hidden rounded-[15px] border border-[#E5C8BF]/42 bg-white/10 shadow-[0_14px_30px_rgba(25,18,15,0.24)] backdrop-blur-sm sm:h-16 sm:w-14"
        >
          <Image
            alt={card.alt}
            className="object-cover"
            fill
            loading="lazy"
            quality={95}
            sizes="76px"
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
        <div className="relative flex min-h-[100svh] flex-col overflow-hidden lg:hidden">
        <div className="absolute inset-0">
          <Image
            alt="Елена - основатель HairLab"
            className="h-full w-full translate-x-[-1rem] translate-y-6 scale-[1.08] object-cover"
            fill
            priority
            quality={92}
            sizes="100vw"
            src={mobileHeroImage}
            style={{ objectPosition: "45% 50%" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(54,45,39,0.42)_0%,rgba(54,45,39,0.22)_43%,rgba(54,45,39,0.02)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-[linear-gradient(180deg,rgba(55,45,39,0)_0%,rgba(44,35,30,0.54)_44%,rgba(39,31,27,0.9)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[#332923]/55" />
        </div>

        <div className="relative z-10 flex min-h-[100svh] flex-col justify-start px-5 pb-4 pt-9 min-[390px]:px-6 min-[390px]:pb-5 min-[390px]:pt-10">
          <div className="w-full max-w-[23rem] pb-4 min-[390px]:pb-5">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.42em] text-[#EBC5BE] min-[390px]:mb-6"
            >
              Профессиональный уход
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55 }}
              className="font-display text-[1.35rem] font-normal leading-[1.08] text-white drop-shadow-[0_2px_18px_rgba(20,12,8,0.32)] min-[360px]:text-[1.8rem] min-[360px]:font-medium min-[390px]:text-[2.5rem]"
            >
              Салонное
              <br />
              восстановление
              <br />
              волос
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="mt-2 font-display text-[1rem] italic leading-none text-[#E8B7B1] drop-shadow-[0_2px_14px_rgba(20,12,8,0.22)] min-[360px]:text-[1.4rem] min-[390px]:text-[2rem]"
            >
              в домашних
              <br />
              условиях
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
              className="mt-5 font-sans text-sm font-normal text-white/84 drop-shadow-[0_2px_14px_rgba(20,12,8,0.24)] min-[390px]:mt-7 min-[390px]:text-base min-[390px]:font-medium"
            >
              + составы для волос.
            </motion.p>
          </div>

          <MobilePreviewStrip />

          <div className="absolute inset-x-5 bottom-5 z-20 flex flex-col gap-2 min-[390px]:inset-x-6 min-[390px]:bottom-6">
            <a
              href="#what-you-get"
              className="inline-flex min-h-[3.35rem] w-full items-center justify-center rounded-full bg-[#D9A19D] px-5 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_22px_48px_rgba(34,25,21,0.28)] transition-all hover:bg-[#C9918C] min-[390px]:min-h-[3.75rem] min-[390px]:px-6 min-[390px]:text-[13px] min-[390px]:tracking-[0.26em]"
            >
              <span className="flex-1 text-center">Хочу на обучение</span>
              <ArrowRightIcon size={21} />
            </a>
            <a
              href="/quiz"
              className="inline-flex min-h-[3.35rem] w-full items-center justify-center rounded-full border border-[#D9A19D]/58 bg-[#2B231F]/34 px-5 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white/94 backdrop-blur-[2px] transition-all hover:border-[#D7A29D] hover:bg-white/8 min-[390px]:min-h-[3.75rem] min-[390px]:px-6 min-[390px]:text-[13px] min-[390px]:tracking-[0.24em]"
            >
              <span className="flex-1 text-center">Пройти тест</span>
              <SparkleIcon size={19} />
            </a>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="flex flex-col justify-center pt-8" style={{ minHeight: '85vh' }}>
          <div className="mx-auto w-full max-w-6xl px-6">
            <nav className="mb-8 flex items-center justify-center gap-6 border-b border-[#E5DDD5] pb-4 font-sans text-xs font-medium uppercase tracking-[0.16em] text-[#7A7066] xl:gap-8 xl:text-xs">
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
                    className="flex gap-3 pt-2 lg:gap-4 xl:gap-3"
                  >
                    <a
                      href="#what-you-get"
                      className="inline-flex items-center gap-2.5 bg-[#1A1A1A] px-6 py-3.5 font-sans text-sm font-semibold text-white transition-all hover:bg-[#333] hover:shadow-xl rounded-xl lg:px-7 lg:py-4 xl:gap-3 xl:px-8 xl:py-4"
                    >
                      Хочу на обучение
                      <ArrowRightIcon />
                    </a>
                    <a
                      href="/quiz"
                      className="inline-flex items-center gap-2 border-2 border-[#E0DCD6] px-6 py-3.5 font-sans text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded-xl lg:px-7 lg:py-4 xl:px-8 xl:py-4"
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
                    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl border-2 border-[#E1D9D1] bg-white shadow-2xl xl:h-[600px]">
                      <Image
                        alt="Елена - основатель HairLab"
                        className="object-cover object-bottom"
                        fill
                        priority
                        quality={92}
                        sizes="(min-width: 1280px) 448px, 48vw"
                        src={desktopHeroImage}
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
