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
          className="relative mt-8 md:mt-0 w-full aspect-[4/5] sm:aspect-[3/4] max-w-[360px] md:max-w-md mx-auto"
        >
          {/* Main photo — overflow-hidden only here for rounded corners */}
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-bg-warm">
            <Image
              src="/images/hair-hero.webp"
              alt="красивые здоровые волосы"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Floating Collage 1 — top of the pair */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-[5.5rem] right-3 md:bottom-auto md:top-10 md:right-3 w-14 md:w-20 rounded-xl overflow-hidden shadow-2xl border-2 border-white/80"
          >
            <Image
              src="/images/beforeafter2.jpg"
              alt="результат до и после"
              width={320}
              height={400}
              className="w-full h-auto"
              sizes="(max-width: 768px) 56px, 80px"
            />
          </motion.div>

          {/* Floating Collage 2 — bottom of the pair */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-3 right-3 md:bottom-auto md:top-[7.5rem] md:right-3 w-14 md:w-20 rounded-xl overflow-hidden shadow-2xl border-2 border-white/80"
          >
            <Image
              src="/images/beforeafter3.jpeg"
              alt="результат до и после"
              width={320}
              height={400}
              className="w-full h-auto"
              sizes="(max-width: 768px) 56px, 80px"
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
