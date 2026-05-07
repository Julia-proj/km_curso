"use client"

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef, useState } from "react"

import {
  authorPoints,
  courseBlocks,
  faqItems,
  forYouItems,
  landingStats,
  marqueeItems,
  principleCards,
  problemItems,
} from "@/config/landing-content"
import {
  ArrowUpRightIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
} from "@/components/landing/icons"

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, margin: "-80px" } as const

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
      whileTap={{ scale: 0.98 }}
      className={`group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-medium uppercase tracking-[0.18em] transition-colors ${
        variant === "dark"
          ? "bg-primary text-primary-foreground hover:bg-cocoa"
          : "border border-primary/15 bg-cream text-primary hover:bg-accent"
      }`}
    >
      <span>{children}</span>
      <span className="grid size-7 place-items-center rounded-full bg-accent text-primary transition-transform group-hover:rotate-45">
        <ArrowUpRightIcon size={14} />
      </span>
    </motion.a>
  )
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-5 py-5 md:px-10">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-border/60 bg-cream/70 px-5 py-3 backdrop-blur-xl md:px-6">
        <a href="#" className="font-display text-lg text-foreground">
          KM<span className="text-accent">.</span>
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
        <a
          href="#cta"
          className="hidden text-sm uppercase tracking-[0.15em] text-foreground md:inline"
        >
          Записаться →
        </a>
      </div>
    </header>
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
      className="grain relative min-h-screen overflow-hidden px-5 pb-20 pt-32 md:px-10"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-soft)" }}
      />
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            <SparklesIcon className="text-accent-foreground" size={12} />
            Авторский курс · 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            className="text-balance font-display text-[2.6rem] leading-[1] md:text-[4.4rem] xl:text-[6rem]"
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
            className="mt-8 max-w-xl text-lg text-muted-foreground"
          >
            + составы для волос.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <CTA href="#cta">Хочу на обучение</CTA>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-7 py-4 text-sm uppercase tracking-[0.18em] text-primary/70 transition-colors hover:text-primary"
            >
              Узнать подробнее
            </a>
          </motion.div>

          <div className="mt-16 grid max-w-lg grid-cols-3 gap-6">
            {landingStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="font-display text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div style={{ y }} className="relative lg:col-span-5">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
            <motion.div className="absolute inset-0" style={{ scale }}>
              <Image
                alt="Восстановленные блонд волосы"
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 100vw"
                src="/images/hero.png"
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
                className="flex gap-2.5 rounded-2xl p-2.5"
                style={{
                  background: "rgba(250,246,240,0.88)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 16px 48px -12px rgba(50,25,15,0.5)",
                }}
              >
                <div className="relative rounded-xl overflow-hidden" style={{ width: 78, height: 108 }}>
                  <Image
                    src="/images/beforeafter2.jpg"
                    alt="До"
                    fill
                    sizes="78px"
                    className="object-contain"
                  />
                </div>
                <div className="relative rounded-xl overflow-hidden" style={{ width: 78, height: 108 }}>
                  <Image
                    src="/images/beforeafter3.jpeg"
                    alt="После"
                    fill
                    sizes="78px"
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Метод — скрыт на мобиле, виден только на десктопе */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -bottom-6 -left-12 hidden max-w-[220px] rounded-2xl border border-border bg-cream p-5 shadow-[0_30px_80px_-40px_rgba(80,40,30,0.3)] md:block"
          >
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Метод
            </div>
            <div className="font-display text-xl leading-tight">
              Не маркетинг. Рабочие составы
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Marquee() {
  return (
    <div className="overflow-hidden border-y border-border bg-sand/40 py-6">
      <div className="marquee flex gap-16 whitespace-nowrap font-display text-3xl text-primary/80 md:text-5xl">
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map(
          (text, index) => (
            <span
              key={`${text}-${index}`}
              className="flex items-center gap-16"
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
    <section className="px-5 py-28 md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <motion.h2
          {...fadeUp()}
          className="text-balance text-[2rem] md:text-[3rem] xl:text-[4rem]"
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
    <section id="about" className="bg-sand/50 px-5 py-28 md:px-10">
      <div className="mx-auto grid max-w-[1300px] items-start gap-10 lg:grid-cols-12">
        <motion.div
          {...fadeUp()}
          className="lg:col-span-3"
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl max-w-[220px]">
            <Image
              alt="Елена Александрова"
              className="object-cover object-top"
              fill
              sizes="220px"
              src="/images/foto2.png"
            />
          </div>
          <div className="mt-4">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Автор курса
            </div>
            <div className="mt-1 font-display text-xl">
              Елена Александрова
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-9">
          <motion.h2
            {...fadeUp()}
            className="text-balance text-[1.8rem] md:text-[2.5rem] xl:text-[3rem]"
          >
            Уже более <span className="italic">6 лет</span> я и моя команда
            ежедневно восстанавливаем даже самые повреждённые волосы.
          </motion.h2>
          <motion.p
            {...fadeUp()}
            className="mt-8 text-lg text-muted-foreground"
          >
            Моя система восстановления и домашнего ухода работает благодаря:
          </motion.p>
          <ul className="mt-10 divide-y divide-border">
            {authorPoints.map((point, index) => (
              <motion.li
                key={point}
                {...fadeUp(index * 0.05)}
                className="flex items-start gap-5 py-5"
              >
                <span className="mt-1 font-display text-sm text-accent-foreground/70">
                  0{index + 1}
                </span>
                <span className="text-lg">{point}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-12">
            <CTA href="/quiz">Пройти тест</CTA>
          </div>
        </div>
      </div>
    </section>
  )
}

function ForYou() {
  return (
    <section className="px-5 py-28 md:px-10">
      <div className="mx-auto max-w-[1300px]">
        <motion.div {...fadeUp()} className="mb-16 max-w-2xl">
          <div className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Для кого
          </div>
          <h2 className="text-balance text-[2rem] md:text-[3rem] xl:text-[4rem]">
            Этот курс <span className="italic">для тебя</span>, если:
          </h2>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2">
          {forYouItems.map((item, index) => (
            <motion.div
              key={item}
              {...fadeUp((index % 2) * 0.1)}
              className="group rounded-2xl border border-border bg-card p-7 transition-colors hover:border-accent/60 hover:bg-accent/15"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent">
                  <CheckIcon className="text-primary" size={16} />
                </span>
                <p className="text-base leading-relaxed">{item}</p>
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
    <section className="relative overflow-hidden px-5 py-28 md:px-10">
      <Image
        alt=""
        className="object-cover opacity-40"
        fill
        sizes="100vw"
        src="/images/alchemy-hair-texture.jpg"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/70 to-cream" />
      <div className="relative mx-auto max-w-[1100px]">
        <motion.h2
          {...fadeUp()}
          className="text-balance mb-16 text-[2rem] md:text-[3rem] xl:text-[4rem]"
        >
          Какие проблемы
          <br /> ты <span className="italic">закроешь</span> на курсе:
        </motion.h2>
        <div className="flex flex-wrap gap-3">
          {problemItems.map((item, index) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="cursor-default rounded-full border border-border bg-cream px-6 py-3 text-base transition-colors hover:border-accent hover:bg-accent md:text-lg"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Principles() {
  return (
    <section
      id="program"
      className="rounded-t-[40px] bg-primary px-5 py-28 text-primary-foreground md:px-10"
    >
      <div className="mx-auto max-w-[1300px]">
        <motion.div {...fadeUp()} className="mb-20 max-w-2xl">
          <div className="mb-4 text-xs uppercase tracking-[0.25em] text-accent">
            Что важно понимать
          </div>
          <h2 className="text-balance text-[2rem] md:text-[3rem] xl:text-[4rem]">
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
              className="rounded-2xl border border-primary-foreground/10 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60"
            >
              <div className="font-display text-5xl text-accent">
                {card.number}
              </div>
              <h3 className="mt-6 font-display text-2xl">{card.title}</h3>
              <p className="mt-5 leading-relaxed text-primary-foreground/70">
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
      className="bg-primary px-5 py-28 text-primary-foreground md:px-10"
    >
      <div className="mx-auto max-w-[1100px] text-center">
        <motion.div
          {...fadeUp()}
          className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent"
        >
          ✦ Формат обучения
        </motion.div>
        <motion.h2
          {...fadeUp()}
          className="text-balance text-[2.2rem] md:text-[3.75rem] xl:text-[5rem]"
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
    <section className="px-5 py-28 md:px-10">
      <div className="mx-auto max-w-[1300px]">
        <motion.div {...fadeUp()} className="mb-16 max-w-2xl">
          <div className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Что внутри
          </div>
          <h2 className="text-balance text-[2rem] md:text-[3rem] xl:text-[4rem]">
            Что ты <span className="italic">получишь</span>:
          </h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2">
          {courseBlocks.map((block, index) => (
            <motion.article
              key={block.tag}
              {...fadeUp((index % 2) * 0.1)}
              className="rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(80,40,30,0.25)] md:p-10"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-accent-foreground/70">
                {block.tag}
              </div>
              <h3 className="mt-3 font-display text-3xl">{block.title}</h3>
              <ul className="mt-6 space-y-2">
                {block.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-base">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                {block.extra}
              </p>
            </motion.article>
          ))}
        </div>
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
  return (
    <section className="bg-accent/30 py-28">
      <div className="mx-auto max-w-[1300px] px-5 md:px-10">
        <motion.div {...fadeUp()} className="mb-12">
          <div className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Доказательства
          </div>
          <h2 className="text-balance text-[2rem] md:text-[3rem] xl:text-[4rem]">
            <span className="font-display italic text-accent-foreground/90">
              5000+
            </span>{" "}
            клиентов студии
            <br />
            восстановили и отрастили
            <br /> свои волосы.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Реальные результаты. Смотри видео прямо здесь или переходи в Instagram.
          </p>
        </motion.div>
      </div>

      {/*
        Горизонтальный скролл карточек.
        Каждая карточка — iframe с явными пиксельными размерами.
        Instagram адаптирует плеер под размер iframe без искажений.
        Последний пустой div даёт правый отступ при скролле до конца.
      */}
      <div className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory px-5 md:px-10">
        {reels.map(({ id }, index) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.6 }}
            className="shrink-0 snap-start flex flex-col gap-3 pb-4"
          >
            <div
              className="rounded-2xl border border-border/40 overflow-hidden bg-sand"
              style={{ width: 300, height: 534 }}
            >
              <iframe
                src={`https://www.instagram.com/reel/${id}/embed/`}
                width={300}
                height={534}
                style={{ border: "none", display: "block" }}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                loading="lazy"
                title={`Отзыв клиента ${index + 1}`}
              />
            </div>
            <a
              href={`https://www.instagram.com/reel/${id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              <IgIcon />
              Открыть в Instagram
            </a>
          </motion.div>
        ))}
        {/* правый отступ после последней карточки */}
        <div className="shrink-0 w-5 md:w-10" aria-hidden="true" />
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="px-5 py-28 md:px-10">
      <div className="mx-auto max-w-[1000px]">
        <motion.h2
          {...fadeUp()}
          className="text-balance mb-14 text-[2rem] md:text-[3rem] xl:text-[4rem]"
        >
          Часто задаваемые <span className="italic">вопросы</span>
        </motion.h2>
        <div className="divide-y divide-border border-y border-border">
          {faqItems.map((item, index) => (
            <div key={item.question}>
              <button
                className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                onClick={() => setOpen(open === index ? null : index)}
                type="button"
              >
                <span className="font-display text-xl transition-colors group-hover:text-accent-foreground md:text-2xl">
                  {item.question}
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent">
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
                    <p className="pb-7 pr-0 text-lg text-muted-foreground md:pr-16">
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
      className="grain relative overflow-hidden px-5 py-32 md:px-10"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-nude)" }}
      />
      <div className="mx-auto max-w-[1100px] text-center">
        <motion.h2
          {...fadeUp()}
          className="text-balance font-display text-[2.5rem] leading-[0.95] md:text-[5rem] xl:text-[7rem]"
        >
          Начни с <span className="italic">бесплатного</span>
          <br /> теста: узнай, что именно
          <br /> нужно твоим волосам.
        </motion.h2>
        <motion.div
          {...fadeUp()}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <CTA href="/quiz">Пройти тест бесплатно</CTA>
        </motion.div>
        <p className="mt-8 text-sm text-muted-foreground">
          2 минуты · без регистрации · персональные рекомендации
        </p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border px-5 py-14 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 md:flex-row">
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

export function LandingPage() {
  return (
    <main className="bg-background text-foreground">
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
