import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { BackButton } from '@/components/BackButton'

export const metadata: Metadata = {
  title: 'Бесплатный урок - HAIRLAB',
  description: 'Как разобраться, что происходит с твоими волосами. Урок от Елены - мастера по восстановлению волос.',
}

export default function LessonPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F1] pt-20 pb-16 px-5 md:pt-24">
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute top-0 right-0">
            <Link
              href="/offer"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Выбрать свой формат →
            </Link>
          </div>
          <BackButton />
          {/* Overline */}
          <p className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-text-muted)] mb-4 text-center">
            Бесплатный урок от Елены
          </p>

          {/* Headline */}
          <h1 className="text-2xl md:text-4xl font-semibold text-[var(--color-text)] text-center mb-8 text-balance leading-snug tracking-tight">
            Как разобраться, что происходит с твоими волосами
          </h1>

          {/* YouTube embed — responsive 16:9 */}
          <div
            className="w-full rounded-[var(--radius-xl)] overflow-hidden bg-[var(--color-bg-warm)]"
            style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}
          >
            <iframe
              src="https://www.youtube.com/embed/0OYmg4DoXPk?rel=0&vq=hd1080"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="Бесплатный урок — HAIRLAB"
            />
          </div>

          {/* Description under video */}
          <p className="text-[var(--color-text-soft)] text-sm md:text-base leading-relaxed mt-6 mb-3">
            Елена - мастер по восстановлению волос в Мадриде. 6 лет практики, 5000+ клиенток.
            В этом уроке она показывает, как самой определить степень повреждения и какие ошибки
            в домашнем уходе чаще всего мешают результату.
          </p>

          <p className="text-[var(--color-text-soft)] text-sm leading-relaxed mb-10">
            Это вводная часть. Дальше - два формата на выбор: пройти восстановление шаг за шагом
            или начать с PDF-карты ухода.
          </p>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/offer"
              className="inline-block rounded-none bg-[var(--color-accent)] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-lg hover:shadow-[var(--color-accent)]/30 hover:scale-105"
            >
              Выбрать свой формат
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
