"use client"

import { motion } from "framer-motion"

import { CheckIcon } from "@/components/landing/icons"
import { courseBlocks, courseFeatures } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

export function WhatYouGetSection() {
  const videoBlock = courseBlocks[0]

  return (
    <section className="km-section">
      <div className="km-container km-container-wide">
        <motion.div {...fadeUp()} className="mb-10 max-w-2xl md:mb-16">
          <div className="km-eyebrow mb-3 text-muted-foreground md:mb-4">Что внутри</div>
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
            <p className="text-2xl font-semibold text-accent mt-1 mb-5 tracking-tight">39€</p>

            <div className="mb-5">
              <p className="km-copy font-medium mb-2">Видео-уроки:</p>
              <ul className="space-y-1.5 mb-3">
                {videoBlock.points.map((point) => (
                  <li key={point} className="km-copy flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 shrink-0 text-accent" size={16} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="km-copy text-muted-foreground text-sm">{videoBlock.extra}</p>
            </div>

            <ul className="space-y-3">
              {courseFeatures.map((item) => (
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
              className="btn-luxury mt-7 block w-full rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em]"
            >
              Получить доступ 39€
            </a>
          </motion.article>

          {/* Guide card */}
          <motion.article
            {...fadeUp(0.1)}
            className="km-card km-card-roomy flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(80,40,30,0.25)]"
          >
            <h3 className="km-card-title">только методичка HAIRLAB: Карта восстановления</h3>
            <p className="text-2xl font-semibold text-accent mt-1 mb-5 tracking-tight">13€</p>

            <div className="space-y-5">
              {courseBlocks.slice(1).map((block) => (
                <div key={block.tag}>
                  <p className="km-copy font-medium mb-2">{block.title}</p>
                  <ul className="space-y-1.5 mb-2">
                    {block.points.map((point) => (
                      <li key={point} className="km-copy flex items-start gap-2.5">
                        <CheckIcon className="mt-0.5 shrink-0 text-accent" size={16} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="km-copy text-muted-foreground text-sm">{block.extra}</p>
                </div>
              ))}
            </div>
            <a
              href="/checkout?product=guide"
              className="btn-luxury-sand mt-7 block w-full rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] md:mt-auto"
            >
              Приобрести методичку 13€
            </a>
          </motion.article>
        </div>

        <motion.div
          {...fadeUp(0.15)}
          className="mt-8 rounded-3xl bg-primary px-6 py-10 text-primary-foreground md:px-12"
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[3px] opacity-50">
            р е з у л ь т а т
          </p>
          <h2 className="mb-4 text-xl font-semibold leading-snug text-balance md:text-2xl tracking-tight">
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
