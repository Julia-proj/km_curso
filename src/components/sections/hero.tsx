"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center px-5 pt-20 pb-16 md:pt-24 md:pb-20">
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-12 md:gap-16 items-center">

        {/* Text */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-5xl lg:text-6xl font-medium text-text leading-tight text-balance"
          >
            Твои волосы не плохие.
            <br />
            <span className="text-text-soft">
              Им нужна система, а не ещё одна баночка.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 md:mt-8 text-text-soft text-base md:text-lg leading-relaxed"
          >
            Ты перепробовала маски, масла, кератин и советы из TikTok. Разберёмся,
            что подходит именно твоим волосам и почему до этого ничего не
            держалось.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-muted text-sm"
          >
            Ответь на 4 вопроса. Получишь первую картину: что сейчас происходит с
            твоими волосами и на что обратить внимание в уходе.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <a
              href="/quiz"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-medium text-sm rounded-full hover:bg-accent-hover transition-colors duration-200"
            >
              Пройти диагностику
            </a>
            <a
              href="#offer"
              className="text-text-muted text-sm underline underline-offset-4 hover:text-text-soft transition-colors"
            >
              Хочу сразу посмотреть варианты
            </a>
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-bg-warm hidden md:block"
        >
          <Image
            src="/images/hair-hero.webp"
            alt="Здоровые ухоженные волосы"
            width={600}
            height={750}
            priority
            className="object-cover w-full h-full"
          />
          {/* Placeholder badge - remove when real photo is added */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-text-soft text-xs tracking-widest uppercase">
              фото Елены
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
