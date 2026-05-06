"use client"

import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-5 pt-20 pb-16 md:pt-24 md:pb-20">
      <div className="max-w-2xl mx-auto text-center">
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
          className="mt-6 md:mt-8 text-text-soft text-base md:text-lg leading-relaxed max-w-xl mx-auto"
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
          className="mt-8 md:mt-10 flex flex-col items-center gap-4"
        >
          <a
            href="#diagnostics"
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
    </section>
  )
}
