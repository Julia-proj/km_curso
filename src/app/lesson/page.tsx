import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Бесплатный урок — HAIRLAB',
  description: 'Как разобраться, что происходит с твоими волосами. Урок от Елены — мастера по восстановлению волос.',
}

export default function LessonPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] pt-20 md:pt-24 pb-16 px-5">
        <div className="max-w-2xl mx-auto">
          {/* Overline */}
          <p className="text-[11px] font-medium tracking-[3px] uppercase text-[var(--color-text-muted)] mb-4 text-center">
            Бесплатный урок от Елены
          </p>

          {/* Headline */}
          <h1 className="font-display text-2xl md:text-4xl font-medium text-[var(--color-text)] text-center mb-8 text-balance leading-snug">
            Как разобраться, что происходит с твоими волосами
          </h1>

          {/* Video placeholder — fixed 16/9 aspect ratio, CLS = 0 */}
          <div
            className="w-full rounded-[var(--radius-xl)] overflow-hidden bg-[var(--color-bg-warm)] border border-[var(--color-border)]"
            style={{ aspectRatio: '16 / 9' }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5.5L17 11L8 16.5V5.5Z" fill="white" />
                </svg>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">Видео появится здесь</p>
            </div>
          </div>

          {/* Description under video */}
          <p className="text-[var(--color-text-soft)] text-sm md:text-base leading-relaxed mt-6 mb-3">
            Елена — мастер по восстановлению волос в Мадриде. 6 лет практики, 5000+ клиенток.
            В этом уроке она показывает, как самой определить степень повреждения и какие ошибки
            в домашнем уходе чаще всего мешают результату.
          </p>

          <p className="text-[var(--color-text-soft)] text-sm leading-relaxed mb-10">
            Это вводная часть. Дальше — два формата на выбор: пройти восстановление шаг за шагом
            или начать с PDF-карты ухода.
          </p>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/offer"
              className="inline-block bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium px-8 py-4 rounded-[var(--radius-full)] transition-colors text-sm"
            >
              Выбрать свой формат
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
