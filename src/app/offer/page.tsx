import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { OfferFAQ } from '@/components/offer/OfferFAQ'
import { isCourseActive } from '@/config/feature-flags'

export const metadata: Metadata = {
  title: 'Выбери формат — HAIRLAB',
  description: 'Два формата восстановления волос: Full Course (39€) и KM Guide (13€).',
}

const comparisonFeatures = [
  { name: 'PDF-карта ухода (32 стр.)', guide: true, course: true },
  { name: 'Протоколы и чеклисты', guide: true, course: true },
  { name: 'Карточки проверенных средств', guide: true, course: true },
  { name: '5 видеоуроков от Елены', guide: false, course: true },
  { name: 'AI-диагностика по фото', guide: false, course: true },
  { name: 'Личный кабинет с прогрессом', guide: false, course: true },
  { name: 'Персональный протокол', guide: false, course: true },
]

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 4.5L6.75 12.75L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 9H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function OfferPage() {
  const courseActive = isCourseActive()

  return (
    <>
      <Header />
      <main className="bg-[var(--color-bg)] pt-20 md:pt-24 pb-24 px-5">
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <div className="text-center mb-16">
            <p className="text-[11px] font-medium tracking-[3px] uppercase text-[var(--color-text-muted)] mb-4">
              HAIRLAB
            </p>
            <h1 className="font-display text-2xl md:text-4xl font-medium text-[var(--color-text)] mb-4 text-balance">
              Два формата. Одна система.
            </h1>
            <p className="text-[var(--color-text-soft)] text-sm md:text-base max-w-xl mx-auto">
              Ты уже прошла диагностику и посмотрела урок. Теперь выбери, как хочешь двигаться дальше.
            </p>
          </div>

          {/* Emotional block 1 — результат */}
          <div className="bg-[var(--color-bg-dark)] text-[var(--color-text-on-dark)] rounded-[var(--radius-xl)] px-6 md:px-12 py-10 mb-6">
            <p className="text-[11px] font-medium tracking-[3px] uppercase text-[var(--color-text-muted)] mb-3">
              р е з у л ь т а т
            </p>
            <h2 className="font-display text-xl md:text-2xl font-medium mb-4 text-balance leading-snug">
              Гладкие, плотные волосы — это не генетика. Это система.
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-[var(--color-text-on-dark)] opacity-80 max-w-xl">
              Они всегда выглядят дорого. Без сложной укладки, без идеального цвета, даже в обычном хвосте.
              Плотность, блеск и гладкость создают тот самый ухоженный вид, который не получается собрать
              из случайных масок и советов из интернета. Но такой результат начинается не с дорогого средства.
              Он начинается с понимания: что нужно, в каком порядке и почему.
            </p>
          </div>

          {/* Emotional block 2 — доступность */}
          <div className="bg-[var(--color-bg-warm)] border border-[var(--color-border)] rounded-[var(--radius-xl)] px-6 md:px-12 py-10 mb-16">
            <p className="text-[11px] font-medium tracking-[3px] uppercase text-[var(--color-text-muted)] mb-3">
              д о с т у п н о с т ь
            </p>
            <h2 className="font-display text-xl md:text-2xl font-medium text-[var(--color-text)] mb-4 text-balance leading-snug">
              Салонное восстановление работает. Но не у всех есть на него 200€ в месяц.
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-[var(--color-text-soft)] max-w-xl">
              Профессиональные процедуры дают результат, если делать их регулярно. Но ходить каждые 3–4 недели —
              это и деньги, и время. Не у всех рядом мастер, которому доверяешь. HAIRLAB создан для тех, кто
              хочет ухаживать за волосами дома осознанно. Понимать, что происходит. Не покупать лишнее.
              Собрать протокол и поддерживать качество волос между визитами в салон или вместо них.
            </p>
          </div>

          {/* Product cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 items-start">

            {/* Full Course — visually larger */}
            <div className="relative bg-[var(--color-surface)] border-2 border-[var(--color-accent)] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-lg)]">
              <span className="absolute -top-3 left-6 bg-[var(--color-accent)] text-white text-[11px] font-medium px-3 py-1 rounded-full">
                Полный формат
              </span>
              <h3 className="font-display text-xl font-medium text-[var(--color-text)] mt-2 mb-1">
                Система восстановления с Еленой
              </h3>
              <p className="font-display text-3xl font-medium text-[var(--color-accent)] mb-4">39€</p>
              <p className="text-sm text-[var(--color-text-soft)] mb-6 leading-relaxed">
                Для тех, кому нужен не просто гайд, а пошаговый маршрут. С видео, AI-анализом и персональным протоколом.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { title: '5 видеоуроков от Елены', desc: 'Пошаговое обучение на реальных примерах. 10–15 минут каждый.' },
                  { title: 'AI-диагностика по фото', desc: 'Загрузи фото — система покажет степень повреждения.' },
                  { title: 'Личный кабинет', desc: 'Видишь, где остановилась. Возвращаешься в любой момент.' },
                  { title: 'Персональный протокол', desc: 'На основе твоих ответов и AI-анализа.' },
                  { title: 'KM Guide включён', desc: 'PDF-карта ухода (32 стр.) уже входит в курс.' },
                  { title: 'Чек-листы и дополнительные материалы', desc: '' },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="text-[var(--color-accent)] mt-0.5 shrink-0">
                      <CheckIcon />
                    </span>
                    <div>
                      <span className="text-sm font-medium text-[var(--color-text)]">{item.title}</span>
                      {item.desc && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{item.desc}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                Одна покупка — полный доступ. Без подписок, без доплат.
              </p>
              <Link
                href="/checkout?product=course"
                className="block text-center bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium px-6 py-4 rounded-[var(--radius-full)] transition-colors text-sm"
              >
                {courseActive ? 'Получить полный доступ — 39€' : 'Оформить предзаказ — 39€'}
              </Link>
            </div>

            {/* KM Guide — compact */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-7">
              <span className="inline-block bg-[var(--color-bg-warm)] text-[var(--color-text-soft)] text-[11px] font-medium px-3 py-1 rounded-full mb-4">
                Лёгкий старт
              </span>
              <h3 className="font-display text-lg font-medium text-[var(--color-text)] mb-1">
                KM Guide: Карта восстановления
              </h3>
              <p className="font-display text-2xl font-medium text-[var(--color-text)] mb-3">13€</p>
              <p className="text-sm text-[var(--color-text-soft)] mb-5 leading-relaxed">
                Для тех, кто хочет сначала разобраться самостоятельно: понять свои волосы, найти ошибки и собрать базовый протокол.
              </p>
              <ul className="space-y-2 mb-7">
                {[
                  '32 страницы от мастера с 6-летним опытом',
                  'Диагностика и шкала повреждения 1–5',
                  'Готовые протоколы для натуральных, окрашенных и осветлённых',
                  'Карточки проверенных средств',
                  'Чеклисты и календарь ухода на 14 дней',
                  'Бланк персонального протокола',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-[var(--color-text-soft)]">
                    <span className="text-[var(--color-text-muted)] mt-0.5 shrink-0">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/checkout?product=guide"
                className="block text-center bg-[var(--color-bg-dark)] hover:opacity-90 text-[var(--color-text-on-dark)] font-medium px-6 py-4 rounded-[var(--radius-full)] transition-opacity text-sm"
              >
                Начать с KM Guide — 13€
              </Link>
            </div>
          </div>

          {/* Hint */}
          <div className="bg-[var(--color-accent-soft)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-4 mb-20 text-center max-w-2xl mx-auto">
            <p className="text-sm text-[var(--color-text-soft)] leading-relaxed">
              Не уверена, какой формат выбрать? Начни с KM Guide. Он даст базу и покажет, подходит ли тебе подход Елены.
              Если потом решишь перейти на полный курс, стоимость гайда учтётся.
            </p>
          </div>

          {/* Comparison table */}
          <div className="mb-20">
            <p className="text-[11px] font-medium tracking-[3px] uppercase text-[var(--color-text-muted)] text-center mb-3">
              с р а в н е н и е
            </p>
            <h2 className="font-display text-xl md:text-2xl font-medium text-[var(--color-text)] text-center mb-8">
              Что входит в каждый формат
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-soft)] w-1/2"></th>
                    <th className="text-center py-3 px-4 font-medium text-[var(--color-text)] whitespace-nowrap">
                      KM Guide <span className="text-[var(--color-text-soft)]">13€</span>
                    </th>
                    <th className="text-center py-3 pl-4 font-medium text-[var(--color-accent)] whitespace-nowrap">
                      Full Course <span className="font-normal">39€</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature) => (
                    <tr key={feature.name} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="py-3 pr-4 text-[var(--color-text-soft)]">{feature.name}</td>
                      <td className="text-center py-3 px-4">
                        {feature.guide ? (
                          <span className="text-[var(--color-success)]"><CheckIcon /></span>
                        ) : (
                          <span className="text-[var(--color-text-muted)]"><DashIcon /></span>
                        )}
                      </td>
                      <td className="text-center py-3 pl-4">
                        {feature.course ? (
                          <span className="text-[var(--color-accent)]"><CheckIcon /></span>
                        ) : (
                          <span className="text-[var(--color-text-muted)]"><DashIcon /></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <p className="text-[11px] font-medium tracking-[3px] uppercase text-[var(--color-text-muted)] text-center mb-3">
              в о п р о с ы
            </p>
            <h2 className="font-display text-xl md:text-2xl font-medium text-[var(--color-text)] text-center mb-8">
              Частые вопросы
            </h2>
            <OfferFAQ />
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
