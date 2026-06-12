"use client"

import { motion } from "framer-motion"
import Image from "next/image"

import { getPaymentLink } from "@/config/payments"
import { HeroAnimatedBackground } from "@/components/HeroAnimatedBackground"

const mobileHeroImage = "/images/newhero.PNG"
const desktopHeroImage = "/images/heronew.PNG"

const guideMockupBack = "/images/acces_pdf.PNG"
const guideMockupFront = "/images/guia_pdf.PNG"
const lessonScreen = "/images/hero_screen_lesson.webp"

// Shared 1x1 blur placeholder for the hero photos (valid base64, single source).
const HERO_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC3ABHx//Z"

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

function PlayIcon({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function GiftIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M12 8C12 8 11 4 8.5 4a2.5 2.5 0 0 0 0 5H12Z" />
      <path d="M12 8C12 8 13 4 15.5 4a2.5 2.5 0 0 1 0 5H12Z" />
    </svg>
  )
}

/**
 * 3D-mockup двух методичек: одна слегка поверх другой,
 * рядом — превью видео-урока. Два визуала вместо трёх.
 */
function HeroVisuals({ tone = "light" }: { tone?: "light" | "dark" }) {
  const cardBorder = tone === "dark" ? "border-white/30" : "border-black/6"
  const cardBg = tone === "dark" ? "bg-white/90" : "bg-white"

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.55 }}
      className="flex items-end gap-4 pt-0 sm:gap-5 min-[390px]:gap-6 md:gap-7"
    >
      {/* Стопка методичек — w/h точно под соотношение 1147:1672 = 0.686 */}
      <div className="relative h-[8.5rem] w-[6rem] shrink-0 sm:h-[9.5rem] sm:w-[6.5rem] min-[390px]:h-[11rem] min-[390px]:w-[7.5rem] md:h-[12rem] md:w-[8rem]">
        {/* задняя */}
        <div
          className={`absolute inset-0 overflow-hidden rounded-[0.75rem] border ${cardBorder} ${cardBg} shadow-[4px_6px_18px_rgba(20,12,8,0.22)]`}
          style={{ transform: "rotate(7deg) translate(11px, -9px)" }}
        >
          <Image
            alt="Методичка: аксессуары и инструменты"
            className="object-cover object-top"
            src={guideMockupBack}
            fill
            sizes="160px"
          />
        </div>
        {/* передняя */}
        <div
          className={`absolute inset-0 overflow-hidden rounded-[0.75rem] border ${cardBorder} ${cardBg} shadow-[0_16px_38px_rgba(20,12,8,0.38)]`}
          style={{ transform: "rotate(-5deg)" }}
        >
          <Image
            alt="Методичка по домашнему уходу за волосами"
            className="object-cover object-top"
            src={guideMockupFront}
            fill
            sizes="160px"
          />
        </div>
      </div>

      {/* Видео — точное соотношение 1181:2046, без кропа */}
      <div
        className={`w-[5.5rem] overflow-hidden rounded-[0.75rem] border ${cardBorder} ${cardBg} shadow-[0_12px_28px_rgba(20,12,8,0.3)] sm:w-[6rem] min-[390px]:w-[7rem] md:w-[8rem]`}
        style={{ transform: "rotate(2deg)" }}
      >
        <div className="relative" style={{ aspectRatio: "1181 / 2046" }}>
          <Image
            alt="Видео-урок из курса HAIRLAB"
            className="object-cover"
            src={lessonScreen}
            fill
            sizes="160px"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/88 pl-0.5 text-[#1A1A1A] shadow-md sm:h-8 sm:w-8 md:h-9 md:w-9">
              <PlayIcon size={12} />
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function HeroProductPreview() {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.32, duration: 0.55 }}
      className="flex items-end gap-5 pt-5 xl:gap-6 xl:pt-6"
    >
      {/* Стопка методичек — w/h точно под соотношение 1147:1672 = 0.686 */}
      <div className="relative h-[12rem] w-[8.25rem] shrink-0 xl:h-[14rem] xl:w-[9.6rem]">
        <div className="absolute -bottom-3 left-1/2 h-5 w-[7rem] -translate-x-1/2 rounded-full bg-[#2A1A14]/14 blur-xl xl:w-[8.5rem]" />
        {/* задняя методичка */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[0.9rem] border border-white/48 bg-[#F7F0EA] shadow-[4px_10px_24px_rgba(28,18,13,0.18)] xl:rounded-[1rem]"
          style={{ transform: "rotate(7deg) translate(13px, -10px)" }}
        >
          <Image
            alt="Методичка: аксессуары и инструменты"
            className="object-cover object-top"
            src={guideMockupBack}
            fill
            sizes="160px"
          />
        </div>
        {/* передняя методичка */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[0.9rem] border border-white/55 bg-[#F7F0EA] shadow-[0_20px_48px_-10px_rgba(23,14,10,0.6)] xl:rounded-[1rem]"
          style={{ transform: "rotate(-4deg)" }}
        >
          <Image
            alt="Методичка по домашнему уходу за волосами"
            className="object-cover object-top"
            src={guideMockupFront}
            fill
            sizes="160px"
          />
        </div>
      </div>

      {/* Видео — точное соотношение 1181:2046, без кропа */}
      <div
        className="w-[7.5rem] overflow-hidden rounded-2xl border border-white/60 bg-[#F9F3EF] p-2 shadow-[0_16px_36px_-16px_rgba(25,15,10,0.52)] ring-1 ring-[#3B2A22]/10 xl:w-[9rem] xl:rounded-[1rem] xl:p-2"
        style={{ transform: "rotate(2deg)" }}
      >
        <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "1181 / 2046" }}>
          <Image
            alt="Видео-урок из курса HAIRLAB"
            className="object-cover"
            src={lessonScreen}
            fill
            sizes="160px"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/92 pl-0.5 text-[#1A1A1A] shadow-md xl:h-9 xl:w-9">
              <PlayIcon size={16} />
            </span>
          </span>
        </div>
      </div>
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
            className="h-full w-full translate-y-4 scale-105 object-cover"
            fill
            fetchPriority="high"
            loading="eager"
            quality={85}
            sizes="100vw"
            src={mobileHeroImage}
            style={{ objectPosition: "55% 45%" }}
            placeholder="blur"
            blurDataURL={HERO_BLUR}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(54,45,39,0.42)_0%,rgba(54,45,39,0.22)_43%,rgba(54,45,39,0.02)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-[linear-gradient(180deg,rgba(55,45,39,0)_0%,rgba(44,35,30,0.54)_44%,rgba(39,31,27,0.9)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[#332923]/55" />
        </div>

        <div className="relative z-10 flex min-h-[100svh] flex-col justify-start px-4 pb-5 pt-6 sm:px-5 sm:pb-6 sm:pt-7 min-[390px]:px-6 min-[390px]:pt-8 md:px-8">
          <div className="w-full max-w-[22rem] pb-2 min-[390px]:max-w-[24rem] min-[390px]:pb-3 md:max-w-[26rem] md:pb-4">
            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.42em] text-[#EBC5BE] min-[390px]:mb-3 md:text-[11px]"
            >
              Авторский курс
            </motion.p>

            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55 }}
              className="font-serif text-[1.6rem] font-normal leading-[1.05] tracking-[-0.01em] text-white drop-shadow-[0_2px_18px_rgba(20,12,8,0.32)] min-[360px]:text-[1.8rem] min-[390px]:text-[2.2rem] md:text-[2.5rem]"
            >
              Салонное
              <br />
              <span className="text-[#EAB6B0] italic font-medium">восстановление</span>
              <br />
              волос.
            </motion.h1>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="mt-2 font-sans text-sm leading-snug text-white drop-shadow-[0_2px_14px_rgba(20,12,8,0.22)] min-[390px]:text-base md:text-lg"
            >
              Теперь у тебя дома.
            </motion.p>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
              className="mt-3 font-sans text-xs font-normal text-white/84 drop-shadow-[0_2px_14px_rgba(20,12,8,0.24)] min-[390px]:mt-4 min-[390px]:text-sm md:text-sm md:max-w-[28rem]"
            >
              База, которую мы передаём ученицам
              <br />
              школы HAIRLAB в Мадриде.
              <span className="mt-1.5 block font-medium text-[#EBC5BE]">+ составы и AI-диагностика</span>
            </motion.p>
          </div>

          <div className="mt-2 min-[390px]:mt-3 md:mt-4">
            <HeroVisuals tone="dark" />
          </div>

          <div className="mt-auto z-20 flex flex-col gap-2 pt-6 min-[390px]:pt-7">
            <a
              href="/quiz"
              className="inline-flex min-h-[3.1rem] w-full items-center justify-center gap-2.5 rounded-full bg-[#FAF7F4] border-2 border-[#E0DCD6] px-4 py-2 shadow-[0_22px_48px_rgba(34,25,21,0.28)] transition-all hover:bg-white hover:border-[#C4956A] sm:min-h-[3.35rem] sm:px-5 min-[390px]:min-h-[3.75rem] min-[390px]:px-6 md:min-h-[4rem] md:px-8"
            >
              <span className="text-[#C4956A]">
                <GiftIcon size={20} />
              </span>
              <span className="flex flex-col text-left">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] min-[390px]:text-[11px] min-[390px]:tracking-[0.15em] md:text-[12px] md:tracking-[0.18em]">
                  Пройти бесплатный тест
                </span>
              </span>
            </a>
            <a
              href={guideLink}
              className="inline-flex min-h-[3.1rem] w-full items-center justify-center rounded-full bg-[#AD5F59] px-4 py-2.5 shadow-[0_22px_48px_rgba(34,25,21,0.28)] transition-all hover:bg-[#9C544E] sm:min-h-[3.35rem] sm:px-5 min-[390px]:min-h-[3.75rem] min-[390px]:px-6 md:min-h-[4rem] md:px-8"
            >
              <span className="inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white min-[390px]:text-[11px] min-[390px]:tracking-[0.24em] md:text-[12px] md:tracking-[0.28em]">
                Методичка за 12€
                <ArrowRightIcon size={16} />
              </span>
            </a>
            <p className="text-center font-sans text-[9px] font-medium tracking-[0.06em] text-white/80 min-[390px]:text-[10px] md:text-[11px]">
              38€ полный курс с AI-диагностикой · доступ навсегда
            </p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP (lg+): editorial magazine split ── */}
      <div className="relative hidden min-h-screen lg:grid lg:grid-cols-[1fr_minmax(380px,42%)] xl:grid-cols-[1fr_minmax(420px,44%)] 2xl:grid-cols-[1fr_minmax(460px,46%)]">
        <HeroAnimatedBackground />

        {/* Left: text column */}
        <div className="relative flex flex-col items-center justify-center bg-transparent px-6 py-5 lg:px-8 xl:px-10 xl:py-6 2xl:px-12 2xl:py-7">
          <div className="w-full max-w-[28rem] lg:max-w-[32rem] xl:max-w-[36rem]">

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex items-center gap-3"
            >
              <span className="block h-px w-8 shrink-0 bg-[#C4956A]" aria-hidden="true" />
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-[#C4956A]">
                Авторский курс
              </p>
            </motion.div>

            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55 }}
              className="font-serif font-normal leading-[1.05] tracking-[-0.015em] text-[#1A1A1A] text-[clamp(2.4rem,3.8vw,3.8rem)] lg:text-[clamp(2.8rem,4vw,4.2rem)]"
            >
              Салонное
              <br />
              <span className="text-[#D2918C] italic font-medium">восстановление</span>
              <br />
              волос.
            </motion.h1>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="mt-5 font-sans text-[1.25rem] font-medium text-[#1A1A1A] lg:text-[1.35rem]"
            >
              Теперь у тебя дома.
            </motion.p>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
              className="mt-4 max-w-[30rem] font-sans text-[1rem] leading-[1.65] text-[#4A4038] lg:text-[1.05rem]"
            >
              База, которую мы передаём ученицам школы HAIRLAB.
              <span className="mt-2 block font-semibold text-[#C4956A]">+ составы и AI-диагностика</span>
            </motion.p>

            <div className="pointer-events-none flex justify-center xl:justify-start xl:pl-3">
              <HeroProductPreview />
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.23, duration: 0.55 }}
              className="mt-6 flex flex-col items-stretch gap-3 xl:flex-row"
            >
              <a
                href="/quiz"
                className="group inline-flex items-center gap-3 rounded-2xl border-2 border-[#E0DCD6] bg-white px-7 py-3 transition-all hover:border-[#C4956A] xl:flex-1"
              >
                <span className="text-[#C4956A] transition-colors group-hover:text-[#B07C6E]">
                  <GiftIcon size={22} />
                </span>
                <span className="flex flex-col text-left">
                  <span className="font-sans text-sm font-semibold text-[#1A1A1A]">
                    Пройти бесплатный тест
                  </span>
                </span>
              </a>
              <a
                href={guideLink}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#AD5F59] px-8 py-3 text-white shadow-[0_14px_30px_-12px_rgba(210,145,140,0.75)] transition-all hover:bg-[#9C544E] xl:flex-1"
              >
                <span className="inline-flex items-center gap-2 font-sans text-sm font-semibold">
                  Методичка за 12€
                  <ArrowRightIcon size={16} />
                </span>
              </a>
            </motion.div>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
              className="mt-6 max-w-[28rem] font-sans text-sm leading-6 tracking-[0.02em] text-[#8F857B] xl:max-w-[34rem]"
            >
              38€ полный курс с AI-диагностикой · доступ навсегда
            </motion.p>

          </div>
        </div>

        {/* Right: photo column */}
        <div className="relative bg-transparent py-6 pr-5 lg:py-8 lg:pr-8 xl:py-10 xl:pr-10 2xl:py-12 2xl:pr-12">
          <figure className="relative h-full w-full overflow-hidden rounded-[1.2rem] shadow-[0_24px_52px_-30px_rgba(40,28,22,0.42)]">
          <Image
            alt="Елена - основатель HairLab"
            className="object-cover"
            fill
            fetchPriority="high"
            loading="eager"
            quality={85}
            sizes="42vw"
            src={desktopHeroImage}
            style={{ objectPosition: "center" }}
            placeholder="blur"
            blurDataURL={HERO_BLUR}
          />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#241712]/75 via-[#241712]/20 to-transparent" />
            <figcaption className="absolute inset-x-6 bottom-5 text-white lg:inset-x-7 lg:bottom-6 xl:inset-x-8 xl:bottom-8">
              <p className="font-serif text-2xl italic leading-none">Елена</p>
              <p className="mt-2 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-white/75">
                Основатель HAIRLAB · Мадрид
              </p>
            </figcaption>
          </figure>

        </div>
      </div>

    </section>
  )
}
