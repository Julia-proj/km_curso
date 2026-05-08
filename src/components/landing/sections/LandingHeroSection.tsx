"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

import { SparklesIcon } from "@/components/landing/icons"
import { CTA } from "@/components/shared/CTA"

const heroImage = "/images/hero.PNG"

const heroProofPhotos = [
  {
    alt: "До и после восстановления светлых волос",
    filter: "saturate(1.04) contrast(1.02)",
    objectPosition: "50% 50%",
    src: "/images/beforeafter11.png",
    variant: "light",
  },
  {
    alt: "До и после восстановления темных волос",
    filter: "saturate(1.12) contrast(1.06) brightness(1.04)",
    objectPosition: "50% 50%",
    src: "/images/beforeandafter33.png",
    variant: "dark",
  },
  {
    alt: "Профессиональные составы для восстановления волос",
    filter: "saturate(1.05) contrast(1.03) brightness(1.03)",
    objectPosition: "50% 52%",
    src: "/images/prodx.JPEG",
    variant: "products",
  },
] as const

function ProofCard({
  photo,
  className,
  style,
}: {
  photo: (typeof heroProofPhotos)[number]
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm ${className}`}
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid rgba(255,255,255,0.8)",
        ...style,
      }}
    >
      <Image
        alt={photo.alt}
        className="object-cover"
        fill
        quality={95}
        sizes="120px"
        src={photo.src}
        style={{
          objectPosition: photo.objectPosition,
          filter: photo.filter,
        }}
      />
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
      <div className="absolute inset-0 -z-10 bg-cream lg:hidden">
        <Image
          alt=""
          className="object-cover object-center"
          fill
          priority
          quality={90}
          sizes="100vw"
          src={heroImage}
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/60 to-transparent" />
      </div>

      <div className="km-container">
        <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Text Content */}
          <div className="relative z-10 flex min-h-[calc(100svh-8rem)] flex-col lg:col-span-5 lg:min-h-0 lg:py-8">
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-foreground/50 md:mb-5 md:text-xs"
              >
                <SparklesIcon className="opacity-50" size={12} />
                Авторский курс · 2026
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-[family-name:var(--font-hero-face)] text-[1.85rem] font-bold leading-[1.08] tracking-tight text-foreground sm:text-[2.25rem] md:text-[2.75rem] lg:text-[2.5rem] xl:text-[2.85rem]"
              >
                <span className="block">Салонное</span>
                <span className="block">восстановление</span>
                <span className="block">волос</span>
                <span className="mt-1 block font-[family-name:var(--font-display-face)] text-[1.1rem] font-normal italic text-accent-foreground/85 sm:text-[1.35rem] md:mt-2 md:text-[1.65rem] lg:text-[1.5rem] xl:text-[1.75rem]">
                  в домашних условиях
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground md:mt-5 md:text-base lg:text-[0.95rem] xl:text-base"
              >
                + составы для волос.
              </motion.p>

              {/* Mobile proof cards */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 lg:hidden"
              >
                <div className="flex items-center gap-2">
                  <ProofCard
                    photo={heroProofPhotos[0]}
                    className="h-[4.5rem] w-[4.5rem] -rotate-3"
                  />
                  <ProofCard
                    photo={heroProofPhotos[1]}
                    className="h-[4.5rem] w-[4.5rem] rotate-2"
                  />
                  <ProofCard
                    photo={heroProofPhotos[2]}
                    className="h-[4.5rem] w-[6.5rem] -rotate-1"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-auto pt-8 md:mt-10 lg:mt-12"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <CTA href="#format">Хочу на обучение</CTA>
                <a
                  href="#about"
                  className="hidden items-center justify-center gap-2 px-6 py-3 text-[0.75rem] font-medium uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground sm:inline-flex"
                >
                  Узнать подробнее
                </a>
              </div>
            </motion.div>
          </div>

          {/* Desktop Hero Image with Cards */}
          <motion.div
            style={{ y }}
            className="relative hidden lg:col-span-7 lg:block"
          >
            <div className="relative">
              {/* Main hero image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl xl:aspect-[3/4]">
                <Image
                  alt="Елена Александрова"
                  src={heroImage}
                  fill
                  sizes="(min-width: 1280px) 45vw, 40vw"
                  className="object-cover object-center"
                  priority
                  quality={95}
                />
                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>

              {/* Desktop proof cards - positioned elegantly */}
              <div className="absolute -left-8 top-[15%] z-20 xl:-left-12">
                <motion.div
                  initial={{ opacity: 0, x: -20, rotate: -8 }}
                  animate={{ opacity: 1, x: 0, rotate: -4 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <ProofCard
                    photo={heroProofPhotos[0]}
                    className="h-[5.5rem] w-[5.5rem] xl:h-[6.5rem] xl:w-[6.5rem]"
                    style={{
                      transform: "rotate(-4deg)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </motion.div>
              </div>

              <div className="absolute -left-4 top-[38%] z-20 xl:-left-6">
                <motion.div
                  initial={{ opacity: 0, x: -20, rotate: 8 }}
                  animate={{ opacity: 1, x: 0, rotate: 3 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <ProofCard
                    photo={heroProofPhotos[1]}
                    className="h-[5.5rem] w-[5.5rem] xl:h-[6.5rem] xl:w-[6.5rem]"
                    style={{
                      transform: "rotate(3deg)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </motion.div>
              </div>

              <div className="absolute -bottom-4 left-[10%] z-20 xl:-bottom-6">
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: 4 }}
                  animate={{ opacity: 1, y: 0, rotate: -2 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <ProofCard
                    photo={heroProofPhotos[2]}
                    className="h-[4.5rem] w-[7rem] xl:h-[5.5rem] xl:w-[8.5rem]"
                    style={{
                      transform: "rotate(-2deg)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
