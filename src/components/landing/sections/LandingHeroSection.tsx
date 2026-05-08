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
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])

  return (
    <section ref={ref} id="hero-section" className="km-hero relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-cream lg:hidden">
        <Image
          alt=""
          className="km-hero-mobile-photo"
          fill
          preload
          quality={90}
          sizes="100vw"
          src={heroImage}
        />
      </div>

      <div className="km-container grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
        <div className="flex min-h-[calc(100svh-9.25rem)] flex-col lg:col-span-6 lg:min-h-0 lg:block">
          <div className="-mt-6 md:-mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="km-eyebrow-pill mb-4 md:mb-5 lg:text-muted-foreground"
            >
              <SparklesIcon className="opacity-60" size={12} />
              Авторский курс · 2026
            </motion.div>

            <h1 className="km-hero-title">
              <span className="km-hero-title-line">Салонное</span>
              <span className="km-hero-title-line">восстановление</span>
              <span className="km-hero-title-line">волос</span>
              <span className="km-hero-title-line km-hero-title-line--nowrap italic text-accent-foreground/90 lg:text-[2.3rem] lg:whitespace-nowrap lg:leading-[1.3] lg:mt-2">
                в домашних условиях
              </span>
            </h1>

            <p className="km-lead mt-5 lg:mt-7 max-w-xl">
              + составы для волос.
            </p>

            <div className="km-hero-proof-mobile-wrap lg:hidden">
              <HeroProofCollage
                className="km-hero-proof-collage--mobile grid"
                sizes="(max-width: 1023px) 180px, 112px"
              />
            </div>
          </div>

          <div className="mt-auto space-y-4 pt-8 md:mt-8 lg:mt-12 md:space-y-0 md:pt-0">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center md:gap-5">
              <div className="flex w-full flex-col items-center gap-2 sm:w-auto">
                <CTA href="#format">Хочу на обучение</CTA>
                <a
                  href="/quiz"
                  className="ml-8 text-sm font-medium text-primary/75 underline decoration-primary/35 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary sm:ml-14"
                >
                  начать с теста
                </a>
              </div>
              <a
                href="#about"
                className="hidden items-center gap-2 px-7 py-4 text-sm uppercase tracking-[0.18em] text-primary/70 transition-colors hover:text-primary sm:inline-flex"
              >
                Узнать подробнее
              </a>
            </div>
          </div>
        </div>

        <motion.div
          style={{ y }}
          className="relative hidden lg:block lg:col-span-6 lg:self-stretch"
        >
          <div className="relative h-full min-h-[580px] xl:min-h-[660px]">
            <div className="relative h-full overflow-hidden rounded-2xl">
              <Image
                alt="Елена Александрова"
                src="/images/hero.PNG"
                fill
                sizes="40vw"
                className="object-cover object-center drop-shadow-2xl"
                preload
              />
            </div>
            <HeroProofCollage
              className="km-hero-proof-collage--desktop hidden lg:grid"
              sizes="(min-width: 1280px) 180px, (min-width: 1024px) 15vw, 180px"
              style={{
                position: "absolute",
                top: "30%",
                left: "5.5%",
                width: "min(18.4rem, 24vw)",
                zIndex: 10,
                pointerEvents: "none",
                transform: "translateY(-50%)",
                filter: "drop-shadow(0 14px 30px oklch(0.24 0.03 35 / 0.34))",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
