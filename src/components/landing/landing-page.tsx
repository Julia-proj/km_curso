"use client"

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"

import {
  authorPoints,
  faqItems,
  forYouItems,
  landingStats,
  marqueeItems,
  principleCards,
  problemItems,
} from "@/config/landing-content"
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
} from "@/components/landing/icons"

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: "-80px" } as const
const heroImage = "/images/heroo.PNG"

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: { duration: 0.8, ease, delay },
  }
}

function CTA({
  children,
  href,
  variant = "dark",
}: {
  children: React.ReactNode
  href: string
  variant?: "dark" | "light"
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={`km-cta ${
        variant === "dark"
          ? "km-cta--dark"
          : "km-cta--light"
      }`}
    >
      <span>{children}</span>
    </motion.a>
  )
}

function Nav() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = document.getElementById("hero-section")?.offsetHeight ?? window.innerHeight
      setVisible(window.scrollY > heroHeight * 0.85)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease }}
          className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-cream/80 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-2.5 md:px-10">
            <a href="#" className="font-display text-lg text-foreground">
              HAIRLAB
            </a>
            <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
              <a href="#about" className="transition-colors hover:text-foreground">
                Об авторе
              </a>
              <a href="#program" className="transition-colors hover:text-foreground">
                Программа
              </a>
              <a href="#format" className="transition-colors hover:text-foreground">
                Формат
              </a>
              <a href="#faq" className="transition-colors hover:text-foreground">
                FAQ
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <a
                href="/quiz"
                className="rounded-full border border-border/60 bg-sand px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-foreground transition-colors hover:border-accent hover:bg-accent"
              >
                Тест
              </a>
              <a
                href="#format"
                className="rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-opacity hover:opacity-80"
              >
                <span className="hidden sm:inline">Хочу на обучение</span>
                <span className="sm:hidden">Обучение</span>
              </a>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  return (
    <section
      ref={ref}
      id="hero-section"
      className="km-hero relative isolate overflow-hidden"
    >


      {/* Mobile: full hero photo without overlays */}
      <div className="absolute inset-0 -z-10 bg-cream lg:hidden">
        <Image
          alt=""
          className="km-hero-mobile-photo"
          fill
          priority
          quality={90}
          sizes="100vw"
          src={heroImage}
        />
      </div>

      <div className="km-container grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex min-h-[calc(100svh-9.25rem)] flex-col lg:col-span-7 lg:min-h-0 lg:block">
          <div className="-mt-6 md:-mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="km-eyebrow-pill mb-4 md:mb-5"
          >
            <SparklesIcon className="opacity-60" size={12} />
            Авторский курс · 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            className="km-hero-title"
          >
            Салонное
            <br />
            восстановление волос в
            <br />
            <span className="italic text-accent-foreground/90">
              домашних условиях
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="km-lead mt-4 max-w-xl"
          >
            + составы для волос.
          </motion.p>
          </div>

          {/* До/После коллаж — мобильная и десктоп */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.9, ease }}
            className="absolute left-4 top-[52%] flex flex-col gap-1.5 lg:hidden"
          >
            <div className="rounded-md overflow-hidden shadow-[0_4px_16px_-4px_rgba(50,25,15,0.3)]" style={{ width: 68 }}>
              <Image
                src="/images/beforeafter2.jpg"
                alt="До"
                width={200}
                height={200}
                sizes="68px"
                className="w-full h-auto block"
              />
            </div>
            <div className="rounded-md overflow-hidden shadow-[0_4px_16px_-4px_rgba(50,25,15,0.3)]" style={{ width: 68 }}>
              <Image
                src="/images/beforeafter3.jpeg"
                alt="После"
                width={200}
                height={200}
                sizes="68px"
                className="w-full h-auto block"
              />
            </div>
          </motion.div>

          <div className="mt-auto space-y-4 pt-8 md:mt-7 md:space-y-0 md:pt-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:gap-4">
            <CTA href="#format">Хочу на обучение</CTA>
            <a
              href="#about"
              className="hidden items-center gap-2 px-7 py-4 text-sm uppercase tracking-[0.18em] text-primary/70 transition-colors hover:text-primary sm:inline-flex"
            >
              Узнать подробнее
            </a>
          </div>


        </div>
        </div>

        {/* Right image column — desktop only */}
        <motion.div style={{ y }} className="relative hidden lg:block lg:col-span-5">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
            <motion.div className="absolute inset-0" style={{ scale }}>
              <Image
                alt="Восстановленные блонд волосы"
                className="km-hero-desktop-photo"
                fill
                priority
                sizes="38vw"
                src={heroImage}
              />
            </motion.div>

            {/* До · После */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8, ease }}
              className="absolute top-5 left-5 z-10"
            >
              <div
                className="flex gap-2.5 p-0"
                style={{
                  boxShadow: "0 16px 48px -12px rgba(50,25,15,0.5)",
                }}
              >
                <div className="rounded-md overflow-hidden" style={{ width: 78 }}>
                  <Image
                    src="/images/beforeafter2.jpg"
                    alt="До"
                    width={200}
                    height={200}
                    sizes="78px"
                    className="w-full h-auto block"
                  />
                </div>
                <div className="rounded-md overflow-hidden" style={{ width: 78 }}>
                  <Image
                    src="/images/beforeafter3.jpeg"
                    alt="После"
                    width={200}
                    height={200}
                    sizes="78px"
                    className="w-full h-auto block"
                  />
                </div>
              </div>
            </motion.div>

            {/* Метод badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-5 left-5 z-10 max-w-[220px] rounded-2xl border border-border/60 bg-cream/90 p-4 backdrop-blur-sm shadow-[0_30px_80px_-40px_rgba(80,40,30,0.3)]"
            >
              <div className="mb-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Метод
              </div>
              <div className="font-display text-xl leading-tight">
                Не маркетинг. Рабочие составы
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Marquee() {
  const stats = landingStats.map((s) => `${s.value} ${s.label}`)
  return (
    <div className="overflow-hidden border-y border-border bg-sand/40 py-5 md:py-6">
      <div className="marquee km-marquee-text flex gap-10 whitespace-nowrap text-primary/80 md:gap-16">
        {[...stats, ...stats, ...stats, ...stats, ...stats].map(
          (text, index) => (
            <span
              key={`${text}-${index}`}
              className="flex items-center gap-10 md:gap-16"
            >
              <span className="italic">{text}</span>
              <span className="text-accent">✦</span>
            </span>
          ),
        )}
      </div>
    </div>
  )
}

function PainSection() {
  return (
    <section className="km-section">
      <div className="km-container km-container-mid">
        <motion.h2
          {...fadeUp()}
          className="km-section-title"
        >
          Перестань сливать деньги
          <br />
          на дорогие процедуры и уход,
          <br />
          который тебе{" "}
          <span className="italic text-accent-foreground/80">
            не подходит.
          </span>
        </motion.h2>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="km-section bg-sand/50">
      <div className="km-container km-container-wide grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <motion.div
          {...fadeUp()}
          className="lg:col-span-3"
        >
          {/* Мобиль: коллаж слева + имя справа */}
          <div className="flex items-center gap-4 lg:hidden">
            <div className="shrink-0" style={{ width: 180, height: 180 }}>
              <Image alt="Елена Александрова" className="w-full h-full object-contain" width={180} height={180} src="/images/collage.png" />
            </div>
            <div>
              <div className="km-eyebrow text-muted-foreground">Автор курса</div>
              <div className="mt-1 font-display text-xl leading-tight">Елена Александрова</div>
            </div>
          </div>

          {/* Десктоп: коллаж на всю колонку */}
          <div className="hidden lg:block">
            <div className="w-full">
              <Image alt="Елена Александрова" className="w-full h-auto" width={600} height={600} src="/images/collage.png" />
            </div>
            {/* Имя */}
            <div className="mt-4">
              <div className="km-eyebrow text-muted-foreground">Автор курса</div>
              <div className="mt-1 font-display text-2xl">Елена Александрова</div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-9">
          <motion.h2
            {...fadeUp()}
            className="km-section-title-sm"
          >
            Уже более <span className="italic">6 лет</span> я и моя команда
            ежедневно восстанавливаем даже самые повреждённые волосы.
          </motion.h2>
          <motion.p
            {...fadeUp()}
            className="km-lead mt-6 md:mt-8"
          >
            Моя система восстановления и домашнего ухода работает благодаря:
          </motion.p>
          <ul className="mt-8 divide-y divide-border md:mt-10">
            {authorPoints.map((point, index) => (
              <motion.li
                key={point}
                {...fadeUp(index * 0.05)}
                className="flex items-start gap-4 py-4 md:gap-5 md:py-5"
              >
                <span className="mt-1 font-display text-sm text-accent-foreground/70">
                  0{index + 1}
                </span>
                <span className="km-copy">{point}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-8 md:mt-12">
            <CTA href="/quiz">Пройти тест</CTA>
          </div>
        </div>
      </div>
    </section>
  )
}

function ForYou() {
  return (
    <section className="km-section">
      <div className="km-container km-container-wide">
        <motion.div {...fadeUp()} className="mb-10 max-w-2xl md:mb-16">
          <div className="km-eyebrow mb-3 text-muted-foreground md:mb-4">
            Для кого
          </div>
          <h2 className="km-section-title">
            Этот курс <span className="italic">для тебя</span>, если:
          </h2>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2">
          {forYouItems.map((item, index) => (
            <motion.div
              key={item}
              {...fadeUp((index % 2) * 0.1)}
              className="km-card group transition-colors hover:border-accent/60 hover:bg-accent/15"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent">
                  <CheckIcon className="text-primary" size={16} />
                </span>
                <p className="km-copy">{item}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Problems() {
  return (
    <section className="km-section relative">
      {/* Фоновое изображение */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          alt=""
          className="object-cover opacity-40"
          fill
          sizes="100vw"
          src="/images/alchemy-hair-texture.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/70 to-cream" />
      </div>

      <div className="relative">
        {/* Заголовок */}
        <div className="km-container km-container-mid mb-8 md:mb-12">
          <motion.h2 {...fadeUp()} className="km-section-title">
            Какие проблемы
            <br /> ты <span className="italic">закроешь</span> на курсе:
          </motion.h2>
        </div>

        {/* Мобиль: горизонтальная карусель со snap */}
        <div className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pl-5 pb-4">
          {problemItems.map((item, index) => (
            <div
              key={item}
              className="snap-start shrink-0 w-[78vw] rounded-2xl overflow-hidden bg-cream/90 border border-border/60 shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={`/images/${index + 1}.PNG`}
                  alt=""
                  fill
                  sizes="78vw"
                  className="object-cover"
                />
              </div>
              <p className="px-4 py-4 text-sm leading-snug text-foreground/80">{item}</p>
            </div>
          ))}
          <div className="shrink-0 w-4" aria-hidden="true" />
        </div>
        <p className="md:hidden text-center text-[11px] tracking-widest text-muted-foreground/50 mt-3 uppercase">
          листай →
        </p>

        {/* Десктоп: сетка с большими фото */}
        <div className="hidden md:grid km-container km-container-mid grid-cols-3 gap-4 lg:gap-5">
          {problemItems.map((item, index) => {
            const isLast = index === problemItems.length - 1
            const isLastAlone = isLast && problemItems.length % 3 !== 0
            return (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                className={[
                  "rounded-2xl overflow-hidden bg-cream/80 border border-border/60 shadow-sm",
                  isLastAlone ? "col-span-3 max-w-sm mx-auto w-full" : "",
                ].filter(Boolean).join(" ")}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={`/images/${index + 1}.PNG`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <p className="px-5 py-4 text-sm leading-snug text-foreground/80">{item}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Principles() {
  return (
    <section
      id="program"
      className="km-principles-bg km-section rounded-t-[32px] text-primary-foreground md:rounded-t-[40px]"
    >
      <div className="km-container km-container-wide">
        <motion.div {...fadeUp()} className="mb-12 max-w-2xl md:mb-20">
          <div className="km-eyebrow mb-3 text-accent md:mb-4">
            Что важно понимать
          </div>
          <h2 className="km-section-title">
            Три принципа, на которых
            <br />
            построена <span className="italic">вся система</span>.
          </h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {principleCards.map((card, index) => (
            <motion.div
              key={card.number}
              {...fadeUp(index * 0.15)}
              className="km-principle-card rounded-2xl border border-primary-foreground/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 md:p-8"
            >
              <div className="font-display text-4xl text-accent md:text-5xl">
                {card.number}
              </div>
              <h3 className="mt-4 font-display text-xl md:mt-6 md:text-2xl">{card.title}</h3>
              <p className="km-copy mt-4 text-primary-foreground/70 md:mt-5">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Format() {
  return (
    <section
      id="format"
      className="km-section bg-primary text-primary-foreground"
    >
      <div className="km-container km-container-mid text-center">
        <motion.div
          {...fadeUp()}
          className="km-eyebrow mb-5 inline-flex items-center gap-2 text-accent md:mb-6"
        >
          ✦ Формат обучения
        </motion.div>
        <motion.h2
          {...fadeUp()}
          className="km-format-title"
        >
          Доступ к курсу, видео-урокам, гайдам
          <br />
          и методичкам{" "}
          <span className="italic text-accent">навсегда.</span>
        </motion.h2>
      </div>
    </section>
  )
}

function WhatYouGet() {
  return (
    <section className="km-section">
      <div className="km-container km-container-wide">
        <motion.div {...fadeUp()} className="mb-10 max-w-2xl md:mb-16">
          <div className="km-eyebrow mb-3 text-muted-foreground md:mb-4">
            Что внутри
          </div>
          <h2 className="km-section-title">
            Что ты <span className="italic">получишь</span>:
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 items-stretch">

          {/* Course card */}
          <motion.article
            {...fadeUp(0)}
            className="km-card km-card-roomy transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(80,40,30,0.25)]"
          >
            <h3 className="km-card-title">Система восстановления с Еленой</h3>
            <p className="font-display text-2xl font-medium text-accent mt-1 mb-5">39€</p>

            {/* Video lessons block */}
            <div className="mb-5">
              <p className="km-copy font-medium mb-2">Видео-уроки:</p>
              <ul className="space-y-1.5 mb-3">
                {[
                  "как правильно диагностировать состояние волос",
                  "какие типы повреждений бывают",
                  "какие составы действительно работают",
                  "как подобрать правильный домашний уход",
                  "какие ошибки нельзя допускать",
                  "как восстановить даже сильно повреждённый блонд",
                ].map((point) => (
                  <li key={point} className="km-copy flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 shrink-0 text-accent" size={16} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="km-copy text-muted-foreground text-sm">
                Отдельный урок: разбор восстановления натуральных волос, составы и этапы. Пошагово на себе и моделях: пилинг, мытьё, кондиционер, маски, несмываемые, сушка феном.
              </p>
            </div>

            {/* Feature items */}
            <ul className="space-y-3">
              {[
                {
                  title: "AI-диагностика по фото",
                  desc: "Загрузи фото - система покажет степень повреждения.",
                  soon: true,
                },
                {
                  title: "Личный кабинет",
                  desc: "Видишь, где остановилась. Возвращаешься в любой момент.",
                  soon: false,
                },
                {
                  title: "Персональный протокол",
                  desc: "На основе твоих ответов и AI-анализа.",
                  soon: false,
                },
                {
                  title: "Hairlab Guide включён",
                  desc: "PDF-карта ухода (32 стр.) уже входит в курс.",
                  soon: false,
                },
                {
                  title: "Чек-листы и дополнительные материалы",
                  desc: "",
                  soon: false,
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-2.5">
                  <CheckIcon className="mt-0.5 shrink-0 text-accent" size={16} />
                  <div>
                    <span className="km-copy font-medium">
                      {item.title}
                      {item.soon && (
                        <span className="ml-2 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                          SOON
                        </span>
                      )}
                    </span>
                    {item.desc && (
                      <p className="km-copy text-muted-foreground text-sm mt-0.5">{item.desc}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <a
              href="/checkout?product=course"
              className="btn-luxury mt-7 block w-full rounded-full py-3.5 text-center text-xs font-medium uppercase tracking-[0.15em]"
            >
              Получить доступ 39€
            </a>
          </motion.article>

          {/* Guide card */}
          <motion.article
            {...fadeUp(0.1)}
            className="km-card km-card-roomy transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(80,40,30,0.25)]"
          >
            <h3 className="km-card-title">только методичка HAIRLAB: Карта восстановления</h3>
            <p className="font-display text-2xl font-medium text-accent mt-1 mb-5">13€</p>

            <div className="space-y-5">
              {/* Block 1 */}
              <div>
                <p className="km-copy font-medium mb-2">Готовые рабочие средства</p>
                <ul className="space-y-1.5 mb-2">
                  {["шампуни", "маски", "кондиционеры", "термозащита"].map((item) => (
                    <li key={item} className="km-copy flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 shrink-0 text-accent" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="km-copy text-muted-foreground text-sm">
                  Под каждый тип кожи и волос, без привязки к бренду. По таблице ты выбираешь то, что подходит именно тебе.
                </p>
              </div>

              {/* Block 2 */}
              <div>
                <p className="km-copy font-medium mb-2">Гайд по аксессуарам</p>
                <ul className="space-y-1.5 mb-2">
                  {[
                    "Что не повреждает волосы",
                    "какое полотенце выбрать",
                    "материал для сна",
                    "расчёски, резинки, зажимы",
                  ].map((item) => (
                    <li key={item} className="km-copy flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 shrink-0 text-accent" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="km-copy text-muted-foreground text-sm">
                  Маленькие детали, которые годами незаметно ломают волосы.
                </p>
              </div>

              {/* Block 3 */}
              <div>
                <p className="km-copy font-medium mb-2">Протоколы восстановления</p>
                <ul className="space-y-1.5 mb-2">
                  {[
                    "Чёткие схемы",
                    "под разные типы волос",
                    "под разную степень повреждения",
                    "пошаговые сценарии",
                  ].map((item) => (
                    <li key={item} className="km-copy flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 shrink-0 text-accent" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="km-copy text-muted-foreground text-sm">
                  Берёшь свой протокол и просто следуешь шагам.
                </p>
              </div>
            </div>
            <a
              href="/checkout?product=guide"
              className="btn-luxury-sand mt-7 block w-full rounded-full py-3.5 text-center text-xs font-medium uppercase tracking-[0.15em]"
            >
              Приобрести методичку 13€
            </a>
          </motion.article>
        </div>

        {/* Результат block */}
        <motion.div
          {...fadeUp(0.15)}
          className="mt-8 rounded-[var(--radius-xl,1.5rem)] bg-[hsl(var(--foreground))] px-6 py-10 text-[hsl(var(--background))] md:px-12"
        >
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[3px] opacity-50">
            р е з у л ь т а т
          </p>
          <h2 className="font-display mb-4 text-xl font-medium leading-snug text-balance md:text-2xl">
            Гладкие, плотные волосы - это не генетика, а система.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed opacity-80 md:text-base">
            Они всегда выглядят дорого. Без сложной укладки, без идеального цвета, даже в обычном хвосте.
            Плотность, блеск и гладкость создают тот самый ухоженный вид, который не получается собрать
            из случайных масок и советов из интернета. Но такой результат начинается не с дорогого средства.
            Он начинается с понимания: что нужно, в каком порядке и почему.
          </p>
        </motion.div>

      </div>
    </section>
  )
}

const reels = [
  { id: "DMZ0aAzNxnS" },
  { id: "DJuJTRNNhrm" },
  { id: "DIDm-r5t-UT" },
  { id: "DWEygVggtYT" },
  { id: "DTTToGojHWE" },
]

function IgIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function Results() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).instgrm) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).instgrm.Embeds.process()
    }
  }, [])

  return (
    <section className="bg-accent/30 py-14 md:py-28">
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(window as any).instgrm?.Embeds?.process()
        }}
      />

      <div className="km-container km-container-wide">
        <motion.div {...fadeUp()} className="mb-10 md:mb-12">
          <div className="km-eyebrow mb-3 text-muted-foreground md:mb-4">
            Доказательства
          </div>
          <h2 className="km-section-title">
            <span className="font-display italic text-accent-foreground/90">
              5000+
            </span>{" "}
            клиентов студии
            <br />
            восстановили и отрастили
            <br /> свои волосы.
          </h2>
          <p className="km-lead mt-5 max-w-xl md:mt-6">
            Реальные кейсы, фото «до/после», результаты учениц и отзывы из Instagram.
          </p>
        </motion.div>
      </div>

      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:px-10">
        {reels.map(({ id }, index) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.6 }}
            className="shrink-0 snap-start"
          >
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={`https://www.instagram.com/reel/${id}/`}
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: "16px",
                margin: 0,
                maxWidth: "326px",
                minWidth: "0",
                padding: 0,
                width: "82vw",
              }}
            >
              <a
                href={`https://www.instagram.com/reel/${id}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-6 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <IgIcon />
                Открыть в Instagram
              </a>
            </blockquote>
          </motion.div>
        ))}
        <div className="shrink-0 w-5 md:w-10" aria-hidden="true" />
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="km-section">
      <div className="km-container km-container-narrow">
        <motion.h2
          {...fadeUp()}
          className="km-section-title mb-10 md:mb-14"
        >
          Часто задаваемые <span className="italic">вопросы</span>
        </motion.h2>
        <div className="divide-y divide-border border-y border-border">
          {faqItems.map((item, index) => (
            <div key={item.question}>
              <button
                className="group flex w-full items-center justify-between gap-4 py-5 text-left md:gap-6 md:py-7"
                onClick={() => setOpen(open === index ? null : index)}
                type="button"
              >
                <span className="km-faq-question transition-colors group-hover:text-accent-foreground">
                  {item.question}
                </span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent md:size-10">
                  {open === index ? (
                    <MinusIcon size={16} />
                  ) : (
                    <PlusIcon size={16} />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {open === index && (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="km-faq-answer pb-5 pr-0 md:pb-7 md:pr-16">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section
      id="cta"
      className="grain km-section-large relative overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-nude)" }}
      />
      <div className="km-container km-container-mid text-center">
        <motion.h2
          {...fadeUp()}
          className="km-final-title"
        >
          Начни с <span className="italic">бесплатного</span>
          <br /> теста: узнай, что именно
          <br /> нужно твоим волосам.
        </motion.h2>
        <motion.div
          {...fadeUp()}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:mt-12"
        >
          <CTA href="/quiz">Пройти тест бесплатно</CTA>
        </motion.div>
        <p className="mt-6 text-sm text-muted-foreground md:mt-8">
          2 минуты · без регистрации · персональные рекомендации
        </p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border py-10 md:py-12">
      <div className="km-container flex flex-col items-start justify-between gap-6 md:flex-row">
        <div>
          <div className="font-display text-2xl">
            KM<span className="text-accent">.</span>
          </div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Авторская система восстановления волос. Студия и обучение.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Елена Александрова. Все права защищены.
        </div>
      </div>
    </footer>
  )
}

function WelcomePopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Не показывать повторно в той же сессии
    if (sessionStorage.getItem("popup_shown")) return
    const timer = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem("popup_shown", "1")
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          style={{ background: "rgba(20,10,5,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.4, ease }}
            className="relative w-full max-w-[min(24rem,calc(100vw-2rem))] rounded-3xl border border-border bg-cream p-6 shadow-[0_40px_100px_-20px_rgba(50,25,15,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Закрыть"
            >
              ✕
            </button>
            <div className="km-eyebrow mb-3 text-accent-foreground/60">Уже готова?</div>
            <h3 className="font-display text-2xl leading-tight">
              Выбери свой<br />формат обучения
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Для тех, кто уже знает что хочет, сразу к делу.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="#format"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80"
              >
                <span>Полный курс</span>
                <ArrowUpRightIcon size={14} />
              </a>
              <a
                href="#format"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl border border-border px-5 py-4 text-sm font-medium text-foreground transition-colors hover:bg-sand/60"
              >
                <span>Купить методичку</span>
                <ArrowUpRightIcon size={14} />
              </a>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              Сначала посмотрю
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function LandingPage() {
  return (
    <main className="bg-background text-foreground">
      <WelcomePopup />
      <Nav />
      <Hero />
      <Marquee />
      <PainSection />
      <About />
      <ForYou />
      <Problems />
      <Principles />
      <Format />
      <WhatYouGet />
      <Results />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
