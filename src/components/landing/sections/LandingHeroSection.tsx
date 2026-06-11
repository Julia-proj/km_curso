"use client"

import { motion } from "framer-motion"
import Image from "next/image"

import { getPaymentLink } from "@/config/payments"

const mobileHeroImage = "/images/newhero.PNG"
const desktopHeroImage = "/images/hero.PNG"

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
  const guideLink = getPaymentLink("guide")

  return (
    <section id="hero-section" className="relative flex flex-col overflow-hidden bg-[#FAF7F4]">

      {/* ── MOBILE / TABLET (< lg) ── */}
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden lg:hidden">
        <div className="absolute inset-0">
          <Image
            alt="Елена - основатель HairLab"
            className="h-full w-full translate-x-[-1rem] translate-y-6 scale-[1.08] object-cover"
            fill
            priority
            quality={85}
            sizes="100vw"
            src={mobileHeroImage}
            style={{ objectPosition: "45% 50%" }}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC3ABHx//Z"
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
              Авторский курс
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55 }}
              className="font-hero-face text-[1.35rem] font-normal leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(20,12,8,0.32)] min-[360px]:text-[1.8rem] min-[390px]:text-[2.5rem] min-[390px]:font-medium"
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
              className="mt-2 font-hero-face text-[1rem] italic leading-none text-[#E8B7B1] drop-shadow-[0_2px_14px_rgba(20,12,8,0.22)] min-[360px]:text-[1.4rem] min-[390px]:text-[2rem]"
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
              href="/quiz"
              className="inline-flex min-h-[3.35rem] w-full items-center justify-center rounded-full bg-[#D9A19D] px-5 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_22px_48px_rgba(34,25,21,0.28)] transition-all hover:bg-[#C9918C] min-[390px]:min-h-[3.75rem] min-[390px]:px-6 min-[390px]:text-[13px] min-[390px]:tracking-[0.26em]"
            >
              <span className="flex-1 text-center">Пройти тест</span>
              <SparkleIcon size={19} />
            </a>
            <a
              href={guideLink}
              className="inline-flex min-h-[3.35rem] w-full items-center justify-center rounded-full border border-[#D9A19D]/58 bg-[#2B231F]/34 px-5 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white/94 backdrop-blur-[2px] transition-all hover:border-[#D7A29D] hover:bg-white/8 min-[390px]:min-h-[3.75rem] min-[390px]:px-6 min-[390px]:text-[13px] min-[390px]:tracking-[0.24em]"
            >
              <span className="flex-1 text-center">Методичка за 12€</span>
              <ArrowRightIcon size={19} />
            </a>
            <p className="pt-1 text-center font-sans text-[9px] tracking-[0.07em] text-white/38">
              12€ методичка · 38€ полный курс с AI · доступ навсегда
            </p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP (lg+): editorial magazine split ── */}
      <div className="hidden lg:flex" style={{ minHeight: "100svh" }}>

        {/* Left: text column on cream background */}
        <div className="flex flex-1 flex-col bg-[#FAF7F4]">

          <nav className="flex items-center gap-6 border-b border-[#E5DDD5] px-12 py-5 font-sans text-xs font-medium uppercase tracking-[0.16em] text-[#7A7066] xl:gap-8 xl:px-16">
            <a href="#about" className="transition-colors hover:text-[#1A1A1A] hover:tracking-[0.18em]">Об авторе</a>
            <a href="#program" className="transition-colors hover:text-[#1A1A1A] hover:tracking-[0.18em]">Программа</a>
            <a href="#what-you-get" className="transition-colors hover:text-[#1A1A1A] hover:tracking-[0.18em]">Что внутри</a>
            <a href="#faq" className="transition-colors hover:text-[#1A1A1A] hover:tracking-[0.18em]">FAQ</a>
          </nav>

          {/* Vertically centered content */}
          <div className="flex flex-1 flex-col justify-center px-12 py-12 xl:px-16 xl:py-16">
            <div className="max-w-[30rem] xl:max-w-[34rem]">

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex items-center gap-3"
              >
                <span className="block h-px w-8 shrink-0 bg-[#C4956A]" aria-hidden="true" />
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-[#C4956A]">
                  Авторский курс
                </p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.55 }}
                className="font-hero-face font-medium leading-[1.04] tracking-[-0.02em] text-[#1A1A1A]"
                style={{ fontSize: "clamp(2.75rem, 4.5vw, 5.25rem)" }}
              >
                Салонное
                <br />
                восстановление
                <br />
                волос дома
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.55 }}
                className="mt-5 font-sans text-base leading-relaxed text-[#666] xl:text-lg"
              >
                + составы для волос.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.23, duration: 0.55 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <a
                  href="/quiz"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#1A1A1A] px-7 py-4 font-sans text-sm font-semibold text-white transition-all hover:bg-[#333] xl:px-8"
                >
                  Пройти тест
                  <SparkleIcon size={15} />
                </a>
                <a
                  href={guideLink}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[#E0DCD6] px-7 py-4 font-sans text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#C4956A]/50 hover:bg-[#1A1A1A]/4 xl:px-8"
                >
                  Методичка за 12€
                </a>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.55 }}
                className="mt-3 font-sans text-xs tracking-[0.04em] text-[#9C9287]"
              >
                12€ методичка · 38€ полный курс с AI · доступ навсегда
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.55 }}
                className="mt-10 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[#B0A89F]"
              >
                5000+ клиенток · 6 лет практики · Студия в Мадриде
              </motion.p>

            </div>
          </div>
        </div>

        {/* Right: photo column — extends to screen edge */}
        <div className="relative flex-none overflow-hidden" style={{ width: "44%" }}>
          <Image
            alt="Елена - основатель HairLab"
            className="object-cover"
            fill
            priority
            quality={85}
            sizes="44vw"
            src={desktopHeroImage}
            style={{ objectPosition: "right top" }}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC3ABHx//Z"
          />
        </div>
      </div>

    </section>
  )
}
