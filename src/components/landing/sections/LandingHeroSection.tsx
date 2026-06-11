"use client"

import { motion } from "framer-motion"
import Image from "next/image"

import { getPaymentLink } from "@/config/payments"

const mobileHeroImage = "/images/newhero.PNG"
const desktopHeroImage = "/images/heronew.PNG"

const guideMockupBack = "/images/acces_pdf.PNG"
const guideMockupFront = "/images/guia_pdf.PNG"
const lessonScreen = "/images/hero_screen_lesson.png"

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

/**
 * 3D-mockup двух методичек: одна слегка поверх другой,
 * рядом — превью видео-урока. Два визуала вместо трёх.
 */
function HeroVisuals({
  tone = "light",
  showLabels = true,
}: {
  tone?: "light" | "dark"
  showLabels?: boolean
}) {
  const cardBorder = tone === "dark" ? "border-white/25" : "border-black/5"
  const labelColor = tone === "dark" ? "text-white/80" : "text-[#9C9287]"

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.55 }}
      className="relative flex items-end gap-6"
    >
      {/* 3D mockup методичек */}
      <div className="relative">
        {/* задняя методичка (аксессуары) — выглядывает сверху-справа */}
        <div
          className={`absolute -right-6 -top-7 h-[7.5rem] w-[5.6rem] overflow-hidden rounded-md border ${cardBorder} bg-white shadow-[0_10px_28px_rgba(20,12,8,0.28)] rotate-[7deg]`}
        >
          <img
            alt="Методичка: аксессуары и инструменты"
            className="h-full w-full object-cover object-top"
            src={guideMockupBack}
          />
        </div>
        {/* передняя методичка (домашний уход) — на переднем плане */}
        <div
          className={`relative z-10 h-[7.5rem] w-[5.6rem] overflow-hidden rounded-md border ${cardBorder} bg-white shadow-[0_16px_36px_rgba(20,12,8,0.38)] -rotate-[5deg]`}
        >
          <img
            alt="Методичка по домашнему уходу за волосами"
            className="h-full w-full object-cover object-top"
            src={guideMockupFront}
          />
        </div>
        {showLabels && (
          <span className={`mt-4 block pl-1 font-sans text-[10px] uppercase tracking-[0.18em] ${labelColor}`}>
            2 методички
          </span>
        )}
      </div>

      {/* превью видео-урока */}
      <div className="relative pl-2">
        <div
          className={`relative h-[7.5rem] w-[5.6rem] overflow-hidden rounded-md border ${cardBorder} bg-white shadow-[0_12px_30px_rgba(20,12,8,0.32)] rotate-[2deg]`}
        >
          <img
            alt="Видео-урок из курса HAIRLAB"
            className="h-full w-full object-cover"
            src={lessonScreen}
            style={{ objectPosition: "50% 30%" }}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/85 pl-0.5 text-[#1A1A1A] shadow-md">
              <PlayIcon size={13} />
            </span>
          </span>
        </div>
        {showLabels && (
          <span className={`mt-4 block pl-1 font-sans text-[10px] uppercase tracking-[0.18em] ${labelColor}`}>
            Видео-уроки
          </span>
        )}
      </div>
    </motion.div>
  )
}

const featureChips = [
  { label: "Подбор составов", icon: "list" },
  { label: "Видео-уроки", icon: "play" },
  { label: "2 методички", icon: "book" },
  { label: "Протоколы", icon: "check" },
  { label: "AI-диагностика", icon: "sparkle" },
  { label: "Закрытый Telegram", icon: "send" },
] as const

function ChipIcon({ name, size = 13 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  }
  if (name === "play") {
    return <svg {...common} fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
  }
  if (name === "sparkle") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M12 2.75 14.45 9.55 21.25 12 14.45 14.45 12 21.25 9.55 14.45 2.75 12 9.55 9.55 12 2.75Z" />
      </svg>
    )
  }
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }
  if (name === "book") {
    return <svg {...common} {...stroke}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" /><path d="M18 3v16" /></svg>
  }
  if (name === "list") {
    return <svg {...common} {...stroke}><path d="M8 6h12M8 12h12M8 18h12" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></svg>
  }
  if (name === "check") {
    return <svg {...common} {...stroke}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
  }
  // send / telegram
  return <svg {...common} {...stroke}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
}

function FeatureChips() {
  return (
    <motion.ul
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.26, duration: 0.55 }}
      className="mt-8 flex max-w-[30rem] flex-wrap gap-x-2.5 gap-y-2.5"
    >
      {featureChips.map((chip) => (
        <li
          key={chip.label}
          className="inline-flex items-center gap-2 rounded-full border border-[#E6DFD5] bg-white/70 px-3.5 py-2 font-sans text-[12px] font-medium tracking-[0.01em] text-[#5A5046]"
        >
          <span className="text-[#C4956A]">
            <ChipIcon name={chip.icon} />
          </span>
          {chip.label}
        </li>
      ))}
    </motion.ul>
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
              className="font-serif text-[1.9rem] font-normal leading-[1.02] tracking-[-0.01em] text-white drop-shadow-[0_2px_18px_rgba(20,12,8,0.32)] min-[360px]:text-[2.25rem] min-[390px]:text-[2.85rem]"
            >
              Салонное
              <br />
              <span className="text-[#EAB6B0] italic font-medium">восстановление</span>
              <br />
              волос.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="mt-4 font-sans text-base leading-snug text-white drop-shadow-[0_2px_14px_rgba(20,12,8,0.22)] min-[390px]:text-lg"
            >
              Теперь у тебя дома.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
              className="mt-5 font-sans text-xs font-normal text-white/84 drop-shadow-[0_2px_14px_rgba(20,12,8,0.24)] min-[390px]:mt-7 min-[390px]:text-sm"
            >
              + составы, видео-уроки, гайды, протоколы и AI-диагностика.
              <br />
              База, которую мы передаём ученицам школы
              <br />
              HAIRLAB в Мадриде.
            </motion.p>
          </div>

          <div className="mt-8">
            <HeroVisuals tone="dark" />
          </div>

          <div className="absolute inset-x-5 bottom-5 z-20 flex flex-col gap-2 min-[390px]:inset-x-6 min-[390px]:bottom-6">
            <a
              href="/quiz"
              className="inline-flex min-h-[3.35rem] w-full flex-col items-center justify-center rounded-full bg-[#FAF7F4] border-2 border-[#E0DCD6] px-5 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] shadow-[0_22px_48px_rgba(34,25,21,0.28)] transition-all hover:bg-white hover:border-[#C4956A] min-[390px]:min-h-[3.75rem] min-[390px]:px-6 min-[390px]:text-[13px] min-[390px]:tracking-[0.15em]"
            >
              <span>Пройти бесплатный тест</span>
              <span className="mt-0.5 text-[9px] font-medium normal-case tracking-[0.04em] text-[#C4956A] min-[390px]:text-[10px]">+ урок в подарок</span>
            </a>
            <a
              href={guideLink}
              className="inline-flex min-h-[3.35rem] w-full items-center justify-center rounded-full bg-[#D9A19D] px-5 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_22px_48px_rgba(34,25,21,0.28)] transition-all hover:bg-[#C9918C] min-[390px]:min-h-[3.75rem] min-[390px]:px-6 min-[390px]:text-[13px] min-[390px]:tracking-[0.24em]"
            >
              <span className="flex-1 text-center">Методичка за 12€</span>
              <ArrowRightIcon size={19} />
            </a>
            <p className="pt-1 text-center font-sans text-[10px] tracking-[0.07em] text-white/38 min-[390px]:text-[11px]">
              12€ методичка · 38€ полный курс с AI · доступ навсегда
            </p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP (lg+): editorial magazine split ── */}
      <div className="hidden lg:flex min-h-screen">

        {/* Left: text column on cream background */}
        <div className="flex flex-1 flex-col justify-center bg-[#FAF7F4] px-12 py-12 xl:px-16 xl:py-16 xl:pr-10">
          <div className="max-w-[32rem] xl:max-w-[36rem]">

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
              className="font-serif font-normal leading-[1.08] tracking-[-0.01em] text-[#1A1A1A] text-[clamp(2.75rem,4.2vw,4.75rem)]"
            >
              Салонное
              <br />
              <span className="text-[#D2918C] italic font-medium">восстановление</span>
              <br />
              волос.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="mt-7 font-sans text-base leading-relaxed text-[#1A1A1A] xl:text-lg"
            >
              Теперь у тебя дома.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
              className="mt-5 font-sans text-base leading-relaxed text-[#666] xl:text-lg"
            >
              + составы, видео-уроки, гайды, протоколы и AI-диагностика. База, которую мы передаём ученицам школы HAIRLAB в Мадриде.
            </motion.p>

            <FeatureChips />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.23, duration: 0.55 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <a
                href="/quiz"
                className="inline-flex flex-col items-center rounded-xl bg-[#FAF7F4] border-2 border-[#E0DCD6] px-7 py-3.5 font-sans text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#C4956A] hover:bg-white xl:px-8"
              >
                <span>Пройти бесплатный тест</span>
                <span className="mt-0.5 text-[11px] font-medium text-[#C4956A]">+ урок в подарок</span>
              </a>
              <a
                href={guideLink}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D9A19D] px-7 py-4 font-sans text-sm font-semibold text-white transition-all hover:bg-[#C9918C] xl:px-8"
              >
                Методичка за 12€
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
              className="mt-8 font-sans text-sm tracking-[0.04em] text-[#9C9287]"
            >
              12€ методичка · 38€ полный курс с AI · доступ навсегда
            </motion.p>

          </div>
        </div>

        {/* Right: photo column — smaller, rounded, with breathing room */}
        <div className="relative hidden lg:flex w-[37%] items-center justify-center bg-[#FAF7F4] py-12 pr-10 xl:py-16 xl:pr-14">
          <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] shadow-[0_30px_70px_-30px_rgba(40,28,22,0.45)]">
          <Image
            alt="Елена - основатель HairLab"
            className="object-cover"
            fill
            priority
            quality={85}
            sizes="37vw"
            src={desktopHeroImage}
            style={{ objectPosition: "center" }}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCгоKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC3ABHx//Z"
          />
          </div>

          {/* Floating 3D-mockup методичек + видео-урок, overlapping photo */}
          <div className="absolute -left-12 bottom-12 z-20 rounded-2xl bg-white/85 px-6 py-5 shadow-[0_24px_60px_-24px_rgba(40,28,22,0.5)] backdrop-blur-md xl:-left-16">
            <HeroVisuals tone="light" showLabels={false} />
          </div>
        </div>
      </div>

    </section>
  )
}
