"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

import { SparklesIcon } from "@/components/landing/icons"
import { CTA } from "@/components/shared/CTA"
import { landingStats } from "@/config/landing-content"

const heroImage = "/images/hero.PNG"

const heroProofPhotos = [
  {
    alt: "До и после восстановления светлых волос",
    aspectRatio: "1 / 1",
    filter: "saturate(1.04) contrast(1.02)",
    objectPosition: "50% 50%",
    src: "/images/beforeafter11.png",
    variant: "light",
  },
  {
    alt: "До и после восстановления темных волос",
    aspectRatio: "1 / 1",
    filter: "saturate(1.12) contrast(1.06) brightness(1.04)",
    objectPosition: "50% 50%",
    src: "/images/beforeandafter33.png",
    variant: "dark",
  },
  {
    alt: "Профессиональные составы для восстановления волос",
    aspectRatio: "16 / 10",
    filter: "saturate(1.05) contrast(1.03) brightness(1.03)",
    objectPosition: "50% 52%",
    src: "/images/prodx.JPEG",
    variant: "products",
  },
] as const

function HeroProofCollage({
  className,
  sizes,
  style,
}: {
  className: string
  sizes: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`km-hero-proof-collage ${className}`}
      style={style}
    >
      {heroProofPhotos.map((photo) => (
        <div
          key={photo.src}
          className={`km-hero-proof-frame km-hero-proof-frame--${photo.variant}`}
          style={{ aspectRatio: photo.aspectRatio }}
        >
          <Image
            alt={photo.alt}
            className="object-cover"
            fill
            quality={95}
            sizes={sizes}
            src={photo.src}
            style={{
              objectPosition: photo.objectPosition,
              filter: photo.filter,
              transform: "scale(1.01)",
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function LandingHeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <section ref={ref} id="hero-section" className="km-hero relative isolate overflow-hidden">
      {/* Mobile background */}
      <div className="absolute inset-0 -z-10 lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/80 to-cream" />
        <Image
          alt=""
          className="km-hero-mobile-photo opacity-30"
          fill
          preload
          quality={80}
          sizes="100vw"
          src={heroImage}
        />
      </div>

      {/* Desktop background */}
      <div className="absolute inset-0 -z-10 hidden lg:block">
        <div className="absolute inset-0 bg-cream" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, oklch(0.84 0.045 22) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.86 0.035 25) 0%, transparent 40%)`,
          }}
        />
      </div>

      <div className="km-container">
        {/* Top: eyebrow + title */}
        <div className="pt-2 md:pt-6 lg:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="km-eyebrow-pill mb-5 md:mb-6 lg:text-muted-foreground"
          >
            <SparklesIcon className="opacity-60" size={12} />
            Авторский курс · 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="km-hero-title max-w-3xl"
          >
            <span className="km-hero-title-line">Салонное</span>{" "}
            <span className="km-hero-title-line">восстановление</span>{" "}
            <span className="km-hero-title-line">волос</span>{" "}
            <span className="km-hero-title-line km-hero-title-line--nowrap text-accent-foreground/90">
              в домашних условиях
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="km-lead mt-5 max-w-md lg:mt-6"
          >
            + составы для волос.
          </motion.p>
        </div>

        {/* Cards grid: photo + proof + stats */}
        <div className="mt-8 grid gap-5 md:mt-10 lg:mt-12 lg:grid-cols-12 lg:gap-6">
          {/* Main photo card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="lg:col-span-5"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-lg lg:rounded-3xl">
              <div className="relative aspect-[3/4] lg:aspect-[4/5]">
                <Image
                  alt="Елена Александрова"
                  src={heroImage}
                  fill
                  sizes="(max-width: 1023px) 90vw, 40vw"
                  className="object-cover object-center"
                  preload
                />
              </div>
              {/* Overlay gradient at bottom of photo */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </motion.div>

          {/* Right column: proof collage + stats card */}
          <div className="lg:col-span-7 flex flex-col gap-5 lg:gap-6">
            {/* Proof collage card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="rounded-2xl border border-border/40 bg-card p-5 shadow-md lg:rounded-3xl lg:p-7"
            >
              <div className="km-eyebrow mb-4 text-muted-foreground lg:mb-5">
                Результаты
              </div>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {heroProofPhotos.slice(0, 2).map((photo) => (
                  <div
                    key={photo.src}
                    className="relative overflow-hidden rounded-xl border border-border/30 lg:rounded-2xl"
                    style={{ aspectRatio: photo.aspectRatio }}
                  >
                    <Image
                      alt={photo.alt}
                      className="object-cover"
                      fill
                      quality={92}
                      sizes="(max-width: 1023px) 40vw, 18vw"
                      src={photo.src}
                      style={{
                        objectPosition: photo.objectPosition,
                        filter: photo.filter,
                      }}
                    />
                  </div>
                ))}
                {/* Products photo spanning full width */}
                <div
                  className="col-span-2 relative overflow-hidden rounded-xl border border-border/30 lg:rounded-2xl"
                  style={{ aspectRatio: "16 / 8" }}
                >
                  <Image
                    alt={heroProofPhotos[2].alt}
                    className="object-cover"
                    fill
                    quality={92}
                    sizes="(max-width: 1023px) 85vw, 36vw"
                    src={heroProofPhotos[2].src}
                    style={{
                      objectPosition: heroProofPhotos[2].objectPosition,
                      filter: heroProofPhotos[2].filter,
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Stats card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="rounded-2xl border border-border/40 bg-card p-5 shadow-md lg:rounded-3xl lg:p-7"
            >
              <div className="km-eyebrow mb-4 text-muted-foreground lg:mb-5">
                В цифрах
              </div>
              <div className="grid grid-cols-3 gap-4 lg:gap-8">
                {landingStats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="km-stat-value text-accent-foreground">{stat.value}</div>
                    <div className="mt-1 text-xs leading-snug text-muted-foreground lg:text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5"
            >
              <CTA href="#format">Хочу на обучение</CTA>
              <a
                href="#about"
                className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-primary/60 transition-colors hover:text-primary"
              >
                Узнать подробнее
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
